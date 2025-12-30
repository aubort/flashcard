import React, { useMemo } from 'react';
import { parseWord } from '../utils/textParser';
import './Flashcard.css';

const Flashcard = ({ word, children, animate, isUpperCase, color = '#4CAF50' }) => {

    const parts = useMemo(() => word ? parseWord(word) : [], [word]);

    return (
        <div
            className={`flashcard ${animate ? 'pop' : ''}`}
            style={{ borderColor: color }}
        >
            <div className={`word ${isUpperCase ? 'uppercase' : ''}`}>
                {word ? (
                    parts.map((part) => (
                        <span key={part.id} className={part.isSpecial ? 'diphthong' : ''}>
                            {part.text}
                        </span>
                    ))
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default Flashcard;
