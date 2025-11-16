import React, { useState } from "react";
import Flashcard from "./components/Flashcard";
import { generateFlashcards } from "./api";

export default function App() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    setFlashcards([]);
    setIdx(0);

    try {
      const cards = await generateFlashcards(topic.trim());
      if (!Array.isArray(cards)) throw new Error("Invalid response from server");
      setFlashcards(cards);
      setIdx(0);
    } catch (err) {
      setError(err.message || "Failed to generate flashcards");
    } finally {
      setLoading(false);
    }
  }

  const currentCard = flashcards[idx];
  const easyCount = flashcards.filter(c => c.difficulty === "easy").length;
  const mediumCount = flashcards.filter(c => c.difficulty === "medium").length;
  const hardCount = flashcards.filter(c => c.difficulty === "hard").length;

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="title">🎓 Flashcard Generator</h1>
        <p className="subtitle">Enter any topic and get 15 flashcards instantly!</p>
      </div>

      <div className="container">
        <form onSubmit={onSubmit} className="topic-form">
          <div className="input-wrapper">
            <input 
              type="text"
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              placeholder="Enter a topic (e.g., Photosynthesis, JavaScript, History...)" 
              className="topic-input"
              disabled={loading}
            />
            <button type="submit" disabled={loading} className="generate-btn">
              {loading ? "Generating..." : "✨ Generate"}
            </button>
          </div>
        </form>

        {error && <div className="error-message">❌ {error}</div>}
        
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Creating your flashcards...</p>
          </div>
        )}

        {!loading && flashcards.length > 0 && (
          <div className="flashcard-view">
            <div className="stats-bar">
              <span className="stat">📚 Card {idx + 1} of {flashcards.length}</span>
              <span className="stat">🟢 Easy: {easyCount}</span>
              <span className="stat">🟡 Medium: {mediumCount}</span>
              <span className="stat">🔴 Hard: {hardCount}</span>
            </div>

            <Flashcard card={currentCard} index={idx + 1} />

            <div className="navigation-controls">
              <button 
                onClick={() => setIdx(i => Math.max(0, i - 1))} 
                disabled={idx === 0}
                className="nav-btn prev-btn"
              >
                ← Previous
              </button>
              <div className="progress-dots">
                {flashcards.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`dot ${i === idx ? 'active' : ''} ${flashcards[i].difficulty}`}
                    title={`Card ${i + 1} - ${flashcards[i].difficulty}`}
                  />
                ))}
              </div>
              <button 
                onClick={() => setIdx(i => Math.min(flashcards.length - 1, i + 1))} 
                disabled={idx === flashcards.length - 1}
                className="nav-btn next-btn"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

