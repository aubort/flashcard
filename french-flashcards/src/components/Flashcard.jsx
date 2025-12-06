import React from 'react';
import './Flashcard.css';

const Flashcard = ({ word, animate }) => {
    return (
        <div className={`flashcard ${animate ? 'pop' : ''}`}>
            <span className="word">{word}</span>
        </div>
    );
};

export default Flashcard;
