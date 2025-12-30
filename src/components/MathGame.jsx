import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Star } from 'lucide-react';
import { generateProblem } from '../utils/mathGenerator';
import confetti from 'canvas-confetti';
import Flashcard from './Flashcard';
import ProgressBar from './ProgressBar';
import LevelComplete from './LevelComplete';
import './MathGame.css';



const PROBLEMS_PER_LEVEL = 10;
const MAX_MATH_LEVEL = 4;

const MathGame = ({ onCorrect, onStatusChange }) => {
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

    useEffect(() => {
        onStatusChange && onStatusChange({
            level: level,
            totalLevels: MAX_MATH_LEVEL,
            currentStep: problemIndex + 1,
            totalSteps: PROBLEMS_PER_LEVEL
        });
    }, [level, problemIndex]);


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
            <LevelComplete
                level={level}
                onNext={nextLevel}
                isLastLevel={level === MAX_MATH_LEVEL}
                title={`Maths - Niveau ${level} Terminé !`}
            />
        );
    }


    if (!problem) return <div className="loading">Chargement...</div>;

    return (
        <div className="math-game">
            <Flashcard animate={isAnimate} color="#6c5ce7">
                {problem.question}
            </Flashcard>



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
                        className={`btn-primary ${selectedOption === null ? 'disabled' : ''}`}
                        onClick={handleValidate}
                        disabled={selectedOption === null}
                        style={{ opacity: selectedOption === null ? 0.5 : 1 }}
                    >
                        <Check size={28} />
                        <span>Vérifier</span>
                    </button>
                ) : (
                    <button className="btn-accent pulse" onClick={nextProblem}>
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
