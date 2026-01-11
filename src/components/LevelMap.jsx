/**
 * LevelMap - Duolingo-style learning path
 * Shows progression through levels with locked/unlocked states
 */

import React from 'react';
import { Lock, Star, Check, Play } from 'lucide-react';
import './LevelMap.css';

const LevelMap = ({ section, levelsData, currentLevel, totalLevels, onLevelSelect }) => {
  const renderLevelNode = (level) => {
    const levelData = levelsData[level] || {};
    const isUnlocked = level <= currentLevel;
    const isCompleted = levelData.completed;
    const isCurrent = level === currentLevel;
    const stars = levelData.stars || 0;

    // Alternate left and right for visual path
    const position = level % 2 === 0 ? 'right' : 'left';

    return (
      <div key={level} className={`level-node-container ${position}`}>
        <div
          className={`level-node ${isUnlocked ? 'unlocked' : 'locked'} ${
            isCurrent ? 'current' : ''
          } ${isCompleted ? 'completed' : ''}`}
          onClick={() => isUnlocked && onLevelSelect(level)}
          style={{
            borderColor: isUnlocked ? section.color : '#ccc',
            backgroundColor: isCompleted ? section.color : isUnlocked ? '#fff' : '#f5f5f5'
          }}
        >
          {!isUnlocked && (
            <Lock className="level-icon" size={24} color="#999" />
          )}
          {isUnlocked && !isCompleted && (
            <Play className="level-icon" size={24} color={section.color} fill={section.color} />
          )}
          {isCompleted && (
            <Check className="level-icon" size={24} color="#fff" />
          )}
          <div className="level-number" style={{ color: isCompleted ? '#fff' : section.color }}>
            {level}
          </div>
          {isCompleted && (
            <div className="level-stars">
              {[1, 2, 3].map((starNum) => (
                <Star
                  key={starNum}
                  size={12}
                  fill={starNum <= stars ? '#FFD700' : 'none'}
                  color={starNum <= stars ? '#FFD700' : '#fff'}
                />
              ))}
            </div>
          )}
        </div>
        {isCurrent && <div className="level-pulse" style={{ borderColor: section.color }}></div>}
      </div>
    );
  };

  return (
    <div className="level-map">
      <div className="level-map-path">
        {Array.from({ length: totalLevels }, (_, i) => i + 1).map((level) => (
          <React.Fragment key={level}>
            {renderLevelNode(level)}
            {level < totalLevels && <div className="level-connector"></div>}
          </React.Fragment>
        ))}
        <div className="level-finish">
          <div className="finish-flag">🏆</div>
          <div className="finish-text">Félicitations!</div>
        </div>
      </div>
    </div>
  );
};

export default LevelMap;
