/**
 * LevelMap - Minimalist grid of level circles
 * Clean, simple level selection
 */

import React from 'react';
import './LevelMap.css';

const LevelMap = ({ section, levelsData, currentLevel, totalLevels, onLevelSelect }) => {
  const renderLevel = (level) => {
    const levelData = levelsData[level] || {};
    const isUnlocked = level <= currentLevel;
    const isCompleted = levelData.completed;
    const isCurrent = level === currentLevel;
    const stars = levelData.stars || 0;

    let btnClass = 'level-btn ';
    if (!isUnlocked) btnClass += 'locked';
    else if (isCompleted) btnClass += 'completed';
    else if (isCurrent) btnClass += 'current';

    return (
      <div key={level} className="level-item">
        <button
          className={btnClass}
          onClick={() => isUnlocked && onLevelSelect(level)}
          disabled={!isUnlocked}
        >
          {!isUnlocked ? '🔒' : level}
        </button>

        {isCompleted && (
          <div className="level-stars">
            {[1, 2, 3].map((starNum) => (
              <span key={starNum}>{starNum <= stars ? '⭐' : '☆'}</span>
            ))}
          </div>
        )}

        {isCurrent && !isCompleted && (
          <div className="level-label">Actuel</div>
        )}

        {!isUnlocked && (
          <div className="level-label">Niveau {level}</div>
        )}
      </div>
    );
  };

  return (
    <div className="level-grid">
      {Array.from({ length: totalLevels }, (_, i) => i + 1).map((level) =>
        renderLevel(level)
      )}
    </div>
  );
};

export default LevelMap;
