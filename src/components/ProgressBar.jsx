import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ current, total, color = '#4CAF50' }) => {
    const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar"
                style={{
                    width: `${percentage}%`,
                    backgroundColor: color
                }}
            ></div>
        </div>
    );
};

export default ProgressBar;
