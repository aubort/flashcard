import React from 'react';
import { Star } from 'lucide-react';
import './LevelComplete.css';

const LevelComplete = ({ level, onNext, isLastLevel = false, title = "Niveau Terminé !" }) => {
    return (
        <div className="level-complete-screen">
            <h1>{title}</h1>
            <div className="stars-gained">
                <Star size={80} fill="#FFD700" color="#FFD700" className="floating-star" />
                <p>Bravo ! +10 Étoiles !</p>
            </div>
            <button className="btn-warning pulse btn-large" onClick={onNext}>
                {isLastLevel ? "Recommencer" : `Commencer le Niveau ${level + 1}`}
            </button>
        </div>
    );
};

export default LevelComplete;
