// fallback local generator in case OpenAI output is malformed or API unavailable
function generateLocalFlashcards(topic) {
  const difficulties = ["easy","medium","hard"];
  const cards = [];
  
  // Different question templates for variety
  const questionTemplates = {
    easy: [
      (t) => `What is ${t}?`,
      (t) => `Define ${t} in simple terms.`,
      (t) => `What does ${t} mean?`,
      (t) => `Can you explain what ${t} is?`,
      (t) => `What is the basic definition of ${t}?`
    ],
    medium: [
      (t) => `How does ${t} work?`,
      (t) => `What are the main characteristics of ${t}?`,
      (t) => `Explain the process of ${t}.`,
      (t) => `What are the key components of ${t}?`,
      (t) => `Describe the mechanism behind ${t}.`
    ],
    hard: [
      (t) => `What are the advanced principles of ${t}?`,
      (t) => `Explain the complex interactions involved in ${t}.`,
      (t) => `What are the theoretical foundations of ${t}?`,
      (t) => `Analyze the deeper implications of ${t}.`,
      (t) => `What are the advanced applications and limitations of ${t}?`
    ]
  };

  const answerTemplates = {
    easy: [
      (t) => `${t} is a fundamental concept that represents...`,
      (t) => `In simple terms, ${t} can be defined as...`,
      (t) => `${t} refers to...`,
      (t) => `The basic explanation of ${t} is...`,
      (t) => `${t} is essentially...`
    ],
    medium: [
      (t) => `${t} works through a process involving...`,
      (t) => `The main characteristics of ${t} include...`,
      (t) => `The process of ${t} involves several steps:...`,
      (t) => `Key components of ${t} are...`,
      (t) => `The mechanism behind ${t} operates by...`
    ],
    hard: [
      (t) => `Advanced principles of ${t} involve complex interactions such as...`,
      (t) => `The complex interactions in ${t} include...`,
      (t) => `Theoretical foundations of ${t} are based on...`,
      (t) => `Deeper implications of ${t} suggest that...`,
      (t) => `Advanced applications of ${t} include..., while limitations involve...`
    ]
  };

  for (let d = 0; d < 3; d++) {
    const diff = difficulties[d];
    const templates = questionTemplates[diff];
    const answerTemps = answerTemplates[diff];
    
    for (let i = 0; i < 5; i++) {
      cards.push({
        question: templates[i](topic),
        answer: answerTemps[i](topic),
        difficulty: diff
      });
    }
  }
  
  return cards;
}

module.exports = { generateLocalFlashcards };

