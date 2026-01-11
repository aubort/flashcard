import React, { useState, useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { generateProblem } from '../utils/mathGenerator';
import Flashcard from './Flashcard';
import './MathGame.css';

const PROBLEMS_PER_LEVEL = 10;

const MathGame = ({
  level = 1,
  onCorrect,
  onStatusChange,
  onLevelComplete,
  sectionColor = '#6c5ce7'
}) => {
    const [problemIndex, setProblemIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [problem, setProblem] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [isAnimate, setIsAnimate] = useState(false);
    const [askedQuestionIds, setAskedQuestionIds] = useState([]);

    const loadNewProblem = (currentLevel = level, currentExcluded = askedQuestionIds) => {
        const newProblem = generateProblem(currentLevel, currentExcluded);
        setProblem(newProblem);
        setSelectedOption(null);
        setIsCorrect(null);
        setIsAnimate(true);
        setTimeout(() => setIsAnimate(false), 500);
    };

    // Reset when level changes
    useEffect(() => {
        setProblemIndex(0);
        setScore(0);
        setAskedQuestionIds([]);
        loadNewProblem(level, []);
    }, [level]);

    // Initial load
    useEffect(() => {
        loadNewProblem();
    }, []);

    // Update status
    useEffect(() => {
        onStatusChange && onStatusChange({
            level: level,
            totalLevels: 4,
            currentStep: problemIndex + 1,
            totalSteps: PROBLEMS_PER_LEVEL,
            score: score
        });
    }, [level, problemIndex, score]);

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
            setScore(s => s + 1);
            onCorrect && onCorrect();
        }
    };

    const nextProblem = () => {
        if (problemIndex >= PROBLEMS_PER_LEVEL - 1) {
            // Level complete - notify parent
            const finalScore = isCorrect ? score : score; // score already updated
            onLevelComplete && onLevelComplete(finalScore, PROBLEMS_PER_LEVEL);
        } else {
            const nextIndex = problemIndex + 1;
            const newExcluded = [...askedQuestionIds, problem.id];
            setProblemIndex(nextIndex);
            setAskedQuestionIds(newExcluded);
            loadNewProblem(level, newExcluded);
        }
    };

    if (!problem) return <div className="loading">Chargement...</div>;

    return (
        <div className="math-game">
            <Flashcard animate={isAnimate} color={sectionColor}>
                {problem.question}
            </Flashcard>

            <div className="options-grid">
                {problem.options.map((option) => (
                    <button
                        key={option}
                        className={`option-btn ${selectedOption === option ? 'selected' : ''} ${isCorrect === true && option === problem.answer ? 'correct' : ''} ${isCorrect === false && selectedOption === option ? 'wrong' : ''}`}
                        onClick={() => handleOptionSelect(option)}
                        disabled={isCorrect === true}
                        style={{
                            borderColor: selectedOption === option ? sectionColor : '#ddd'
                        }}
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
                        style={{
                          backgroundColor: sectionColor,
                          opacity: selectedOption === null ? 0.5 : 1
                        }}
                    >
                        <Check size={28} />
                        <span>Vérifier</span>
                    </button>
                ) : (
                    <button
                      className="btn-accent pulse"
                      onClick={nextProblem}
                      style={{ backgroundColor: sectionColor }}
                    >
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
