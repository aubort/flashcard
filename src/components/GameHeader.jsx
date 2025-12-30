import React from 'react';
import LevelIndicator from './LevelIndicator';
import ProgressBar from './ProgressBar';
import { Star } from 'lucide-react';
import './GameHeader.css';

const GameHeader = ({
    level,
    totalLevels,
    currentStep,
    totalSteps,
    score,
    progressColor = '#4CAF50',
    title = ''
}) => {
    return (
        <header className="game-header">
            <div className="header-top">
                <div className="header-left">
                    <LevelIndicator level={level} totalLevels={totalLevels} />
                    {title && <span className="game-title">{title}</span>}
                </div>

                <div className="header-right">
                    <div className="score-badge">
                        <Star className="star-icon" fill="#FFD700" color="#FFD700" size={24} />
                        <span>{score}</span>
                    </div>
                </div>
            </div>

            <div className="header-bottom">
                <ProgressBar current={currentStep} total={totalSteps} color={progressColor} />
                <span className="step-info">{currentStep} / {totalSteps}</span>
            </div>
        </header>
    );
};

export default GameHeader;
