const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const { generateLocalFlashcards } = require("../utils/localGenerator");

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || "2", 10);

if (!OPENAI_KEY) {
  console.warn("Warning: OPENAI_API_KEY is not set. Will use local fallback generator.");
}

// helper to try parse JSON from text (handles if assistant wraps text)
function tryParseJSON(text) {
  // try direct parse
  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch (e) {
    // try to extract JSON block
    const match = text.match(/(\[.*\])/s);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (e2) {
        return null;
      }
    }
    return null;
  }
}

async function callOpenAI(prompt) {
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: "You are a helpful assistant that creates diverse, unique educational flashcards. Always output valid JSON only." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2000
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${txt}`);
  }

  const data = await res.json();
  const output = data.choices?.[0]?.message?.content;
  return output;
}

router.post("/", async (req, res) => {
  const topic = (req.body.topic || "").toString().trim();
  if (!topic) return res.status(400).json({ error: "Topic is required" });

  // prompt instructing the model to return EXACTLY 15 flashcards with distribution
  const prompt = `
Create an array of exactly 15 unique and different flashcards about "${topic}".

IMPORTANT REQUIREMENTS:
- Each question must be UNIQUE and DIFFERENT from all others
- Questions should cover different aspects, concepts, and perspectives of the topic
- No repetitive or similar questions
- Each object must have keys: "question" (string), "answer" (string), "difficulty" (one of "easy","medium","hard")
- Distribution: exactly 5 easy, 5 medium, 5 hard
- Easy questions: basic definitions, simple concepts, fundamental facts
- Medium questions: processes, mechanisms, relationships, applications
- Hard questions: advanced concepts, complex interactions, theoretical aspects, analysis

Topic: "${topic}"

Return ONLY a valid JSON array with no extra text. Example format:
[
  {"question":"What is the basic definition of ${topic}?","answer":"${topic} is...","difficulty":"easy"},
  {"question":"How does ${topic} work?","answer":"${topic} works by...","difficulty":"medium"},
  ...
]
`;

  // if no OPENAI key, return local fallback immediately
  if (!OPENAI_KEY) {
    const local = generateLocalFlashcards(topic);
    return res.json({ flashcards: local });
  }

  let attempt = 0;
  let text = null;
  while (attempt <= MAX_RETRIES) {
    try {
      text = await callOpenAI(prompt);
      // try parse
      const parsed = tryParseJSON(text);
      if (Array.isArray(parsed) && parsed.length === 15) {
        // validate each object
        const ok = parsed.every(item => {
          return item && typeof item.question === "string" &&
                 typeof item.answer === "string" &&
                 ["easy","medium","hard"].includes(item.difficulty);
        });
        if (ok) {
          // normalize difficulties to lowercase, enforce types and order optional
          return res.json({ flashcards: parsed });
        }
      }
      // otherwise treat as malformed and retry
      attempt++;
    } catch (err) {
      // log and try again
      console.error("OpenAI call error:", err.message || err);
      attempt++;
    }
  }

  // If we reached here, OpenAI failed to produce acceptable result. Use local fallback but mark a warning
  const fallback = generateLocalFlashcards(topic);
  return res.status(200).json({
    flashcards: fallback,
    warning: "Used local fallback because LLM output was malformed or unavailable."
  });
});

module.exports = router;

