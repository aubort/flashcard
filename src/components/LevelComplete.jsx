import React from 'react';
import { Star } from 'lucide-react';
import './LevelComplete.css';

const LevelComplete = ({
  level,
  onNext,
  onReturnToMap,
  isLastLevel = false,
  title = "Niveau Terminé !",
  stars = 3,
  score = null,
  totalPossible = null
}) => {
    const getEncouragementMessage = () => {
      if (stars === 3) return "Parfait ! 🎉";
      if (stars === 2) return "Très bien ! 👍";
      return "Bon travail ! 💪";
    };

    return (
        <div className="level-complete-screen">
            <h1>{title}</h1>

            {/* Star Rating */}
            <div className="stars-display">
              {[1, 2, 3].map((starNum) => (
                <Star
                  key={starNum}
                  size={80}
                  fill={starNum <= stars ? "#FFD700" : "none"}
                  color={starNum <= stars ? "#FFD700" : "#ddd"}
                  className={starNum <= stars ? "star-earned" : "star-unearned"}
                  style={{ animationDelay: `${starNum * 0.2}s` }}
                />
              ))}
            </div>

            <p className="encouragement-message">{getEncouragementMessage()}</p>

            {score !== null && totalPossible !== null && (
              <p className="score-display">Score: {score} / {totalPossible}</p>
            )}

            <div className="level-complete-actions">
              <button className="btn-secondary" onClick={onReturnToMap}>
                Voir la carte
              </button>
              <button className="btn-warning pulse btn-large" onClick={onNext}>
                {isLastLevel ? "Recommencer" : `Niveau ${level + 1}`}
              </button>
            </div>
        </div>
    );
};

export default LevelComplete;
