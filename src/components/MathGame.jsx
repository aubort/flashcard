import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Star } from 'lucide-react';
import { generateProblem } from '../utils/mathGenerator';
import confetti from 'canvas-confetti';
import './MathGame.css';

const PROBLEMS_PER_LEVEL = 10;
const MAX_MATH_LEVEL = 4;

const MathGame = ({ onCorrect }) => {
    const [level, setLevel] = useState(1);
    const [problemIndex, setProblemIndex] = useState(0);
    const [problem, setProblem] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [isAnimate, setIsAnimate] = useState(false);
    const [isLevelComplete, setIsLevelComplete] = useState(false);
    const [askedQuestionIds, setAskedQuestionIds] = useState([]);

    const loadNewProblem = (currentLevel = level, currentExcluded = askedQuestionIds) => {
        const newProblem = generateProblem(currentLevel, currentExcluded);
        setProblem(newProblem);
        setSelectedOption(null);
        setIsCorrect(null);
        setIsAnimate(true);
        setTimeout(() => setIsAnimate(false), 500);
    };

    useEffect(() => {
        loadNewProblem();
    }, []);

    const handleOptionSelect = (option) => {
        if (isCorrect === true) return;
        setSelectedOption(option);
        setIsCorrect(null);
    };

    const handleValidate = () => {
        if (selectedOption === null) return;

        const correct = selectedOption === problem.answer;
        setIsCorrect(correct);

        if (correct) {
            onCorrect && onCorrect();
        }
    };

    const nextProblem = () => {
        if (problemIndex >= PROBLEMS_PER_LEVEL - 1) {
            handleLevelComplete();
        } else {
            const nextIndex = problemIndex + 1;
            const newExcluded = [...askedQuestionIds, problem.id];
            setProblemIndex(nextIndex);
            setAskedQuestionIds(newExcluded);
            loadNewProblem(level, newExcluded);
        }
    };

    const handleLevelComplete = () => {
        setIsLevelComplete(true);
        triggerConfetti();
    };

    const nextLevel = () => {
        if (level < MAX_MATH_LEVEL) {
            const newLevel = level + 1;
            setLevel(newLevel);
            setProblemIndex(0);
            setAskedQuestionIds([]);
            setIsLevelComplete(false);
            loadNewProblem(newLevel, []);
        } else {
            alert("Félicitations ! Tu es un champion des maths !");
            setLevel(1);
            setProblemIndex(0);
            setAskedQuestionIds([]);
            setIsLevelComplete(false);
            loadNewProblem(1, []);
        }
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const progress = ((problemIndex + 1) / PROBLEMS_PER_LEVEL) * 100;

    if (isLevelComplete) {
        return (
            <div className="math-level-complete">
                <h1>Niveau {level} Terminé !</h1>
                <div className="stars-gained">
                    <Star size={64} fill="#FFD700" color="#FFD700" className="floating-star" />
                    <p>Bravo ! +10 Étoiles !</p>
                </div>
                <button className="btn-next-level-math" onClick={nextLevel}>
                    {level < MAX_MATH_LEVEL ? `Commencer le Niveau ${level + 1}` : "Recommencer"}
                </button>
            </div>
        );
    }

    if (!problem) return <div className="loading">Chargement...</div>;

    return (
        <div className="math-game">
            <div className="math-header">
                <span className="math-level-badge">Niveau {level}</span>
                <div className="math-progress-container">
                    <div className="math-progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="math-step-info">{problemIndex + 1} / {PROBLEMS_PER_LEVEL}</span>
            </div>

            <div className={`math-card ${isAnimate ? 'pop' : ''}`}>
                <div className="math-question">{problem.question}</div>
            </div>

            <div className="options-grid">
                {problem.options.map((option) => (
                    <button
                        key={option}
                        className={`option-btn ${selectedOption === option ? 'selected' : ''} ${isCorrect === true && option === problem.answer ? 'correct' : ''} ${isCorrect === false && selectedOption === option ? 'wrong' : ''}`}
                        onClick={() => handleOptionSelect(option)}
                        disabled={isCorrect === true}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <div className="math-controls">
                {isCorrect !== true ? (
                    <button
                        className={`btn-validate ${selectedOption === null ? 'disabled' : ''}`}
                        onClick={handleValidate}
                        disabled={selectedOption === null}
                    >
                        <Check size={28} />
                        <span>Vérifier</span>
                    </button>
                ) : (
                    <button className="btn-next" onClick={nextProblem}>
                        <span>{problemIndex === PROBLEMS_PER_LEVEL - 1 ? "Terminer le Niveau" : "Suivant"}</span>
                        <ArrowRight size={28} />
                    </button>
                )}
            </div>

            {isCorrect === false && (
                <div className="feedback-error">
                    Essaye encore !
                </div>
            )}
        </div>
    );
};

export default MathGame;
