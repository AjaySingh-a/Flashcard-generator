import React, { useState } from "react";

export default function Flashcard({ card, index }) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!card) return null;

  const difficultyClass = `difficulty-${card.difficulty}`;

  return (
    <div className="flashcard-wrapper">
      <div 
        className={`flashcard ${difficultyClass} ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="card-front">
          <div className="card-header">
            <div className="card-number">#{index}</div>
            <div className={`difficulty-badge ${difficultyClass}`}>
              {card.difficulty.toUpperCase()}
            </div>
          </div>
          <div className="card-body">
            <div className="question-icon">❓</div>
            <div className="question-text">{card.question}</div>
            <div className="flip-hint">Click to see answer</div>
          </div>
        </div>
        <div className="card-back">
          <div className="card-header">
            <div className="card-number">#{index}</div>
            <div className={`difficulty-badge ${difficultyClass}`}>
              {card.difficulty.toUpperCase()}
            </div>
          </div>
          <div className="card-body">
            <div className="answer-icon">💡</div>
            <div className="answer-text">{card.answer}</div>
            <div className="flip-hint">Click to see question</div>
          </div>
        </div>
      </div>
    </div>
  );
}

