import React from 'react';
import './LevelIndicator.css';

const LevelIndicator = ({ level, totalLevels }) => {
    return (
        <div className="level-indicator">
            <span>Niveau {level} / {totalLevels}</span>
        </div>
    );
};

export default LevelIndicator;
