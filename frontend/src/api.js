const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export async function generateFlashcards(topic) {
  const resp = await fetch(`${BACKEND}/generate-flashcards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic })
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Server error: ${resp.status} ${txt}`);
  }

  const body = await resp.json();
  return body.flashcards;
}

