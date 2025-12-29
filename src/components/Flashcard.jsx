import React, { useMemo } from 'react';
import { parseWord } from '../utils/textParser';
import './Flashcard.css';

const Flashcard = ({ word, animate, isUpperCase }) => {

    const parts = useMemo(() => parseWord(word), [word]);

    return (
        <div className={`flashcard ${animate ? 'pop' : ''}`}>
            <div className={`word ${isUpperCase ? 'uppercase' : ''}`}>
                {parts.map((part) => (
                    <span key={part.id} className={part.isSpecial ? 'diphthong' : ''}>
                        {part.text}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Flashcard;
