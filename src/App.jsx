/**
 * App.jsx - Main application with redesigned UX
 * Features:
 * - Dashboard home screen (Duolingo-inspired)
 * - Persistent progress tracking with localStorage
 * - Extensible section architecture
 * - Level-based progression with star ratings
 * - Streak tracking for daily engagement
 */

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Star, Check, Volume2, ArrowRight, Settings, ALargeSmall } from 'lucide-react';

// Components
import Dashboard from './components/Dashboard';
import SectionView from './components/SectionView';
import LevelMap from './components/LevelMap';
import Flashcard from './components/Flashcard';
import GameHeader from './components/GameHeader';
import LevelComplete from './components/LevelComplete';
import MathGame from './components/MathGame';

// Config & Data
import { getEnabledSections, getSection } from './config/sections';
import progressManager from './utils/progressManager';
import { words } from './data/words';
import { speakWord, getFrenchVoices, setVoice } from './utils/speech';

import './App.css';

const WORDS_PER_LEVEL = 10;
const DELAY_VALIDATE_LISTEN_WORD = 1500;

// Fisher-Yates shuffle
function shuffle(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function App() {
  // App state
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'section', 'playing'
  const [currentSection, setCurrentSection] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [progressData, setProgressData] = useState(progressManager.getAllData());

  // Game state
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [isValidated, setIsValidated] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isInteractable, setIsInteractable] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);

  // Settings
  const [availableVoices, setAvailableVoices] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isUpperCase, setIsUpperCase] = useState(
    progressManager.getSettings().isUpperCase ?? true
  );

  // Math game state
  const [mathStatus, setMathStatus] = useState({
    level: 1,
    totalLevels: 4,
    currentStep: 1,
    totalSteps: 10,
    score: 0
  });

  // Load level words (French section)
  const levelWords = useMemo(() => {
    if (currentSection?.id !== 'french') return [];
    const start = (currentLevel - 1) * WORDS_PER_LEVEL;
    const end = start + WORDS_PER_LEVEL;
    const slice = words.slice(start, end);
    return shuffle(slice);
  }, [currentSection, currentLevel]);

  const currentWord = levelWords[wordIndex];

  // Initialize voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = getFrenchVoices();
      setAvailableVoices(voices);
      const preferred = voices.find(v =>
        v.name.includes("Google") || v.name.includes("Siri") ||
        v.name.includes("Audrey") || v.name.includes("Thomas")
      );
      if (preferred) setVoice(preferred);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // Interaction delay for French game
  useEffect(() => {
    if (currentSection?.id === 'french' && currentView === 'playing') {
      setIsInteractable(false);
      const timer = setTimeout(() => {
        setIsInteractable(true);
      }, DELAY_VALIDATE_LISTEN_WORD);
      return () => clearTimeout(timer);
    }
  }, [currentWord, currentSection, currentView]);

  // Navigation handlers
  const handleSectionSelect = (sectionId) => {
    const section = getSection(sectionId);
    setCurrentSection(section);
    setCurrentView('section');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentSection(null);
    setCurrentLevel(1);
    resetGameState();
  };

  const handleBackToSection = () => {
    setCurrentView('section');
    resetGameState();
  };

  const handleLevelStart = (level) => {
    setCurrentLevel(level);
    setCurrentView('playing');
    resetGameState();
  };

  const resetGameState = () => {
    setWordIndex(0);
    setScore(0);
    setMistakes([]);
    setIsValidated(false);
    setIsLevelComplete(false);
    setIsInteractable(false);
  };

  // French game handlers
  const handleValidate = () => {
    speakWord(currentWord);
    setIsValidated(true);
  };

  const nextWord = () => {
    if (wordIndex >= levelWords.length - 1) {
      handleFrenchLevelComplete();
    } else {
      setScore(s => s + 1);
      setWordIndex(prev => prev + 1);
      setIsValidated(false);
    }
  };

  const handleFrenchLevelComplete = () => {
    const finalScore = score + 1; // Include last word
    const totalPossible = levelWords.length;

    // Calculate stars and save progress
    const stars = progressManager.completeLevel(
      currentSection.id,
      currentLevel,
      finalScore,
      totalPossible,
      mistakes
    );

    setEarnedStars(stars);
    setScore(finalScore);
    setIsLevelComplete(true);
    setProgressData(progressManager.getAllData());
    triggerConfetti();
  };

  // Math game handlers
  const handleMathLevelComplete = (finalScore, totalPossible) => {
    const stars = progressManager.completeLevel(
      'math',
      mathStatus.level,
      finalScore,
      totalPossible,
      []
    );

    setEarnedStars(stars);
    setIsLevelComplete(true);
    setProgressData(progressManager.getAllData());
    triggerConfetti();
  };

  const handleNextLevel = () => {
    const sectionData = progressData.sections[currentSection.id];
    const nextLevel = currentLevel + 1;

    if (nextLevel <= currentSection.totalLevels) {
      setCurrentLevel(nextLevel);
      setCurrentView('playing');
      resetGameState();
    } else {
      // All levels completed
      setCurrentView('section');
      resetGameState();
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);
  };

  const handleVoiceChange = (e) => {
    const voiceName = e.target.value;
    const voice = availableVoices.find(v => v.name === voiceName);
    if (voice) {
      setVoice(voice);
      speakWord("Bonjour");
    }
  };

  const handleCaseToggle = () => {
    const newCase = !isUpperCase;
    setIsUpperCase(newCase);
    progressManager.updateSettings({ isUpperCase: newCase });
  };

  // Render based on current view
  if (currentView === 'dashboard') {
    return (
      <div className="app-container">
        <Dashboard
          sections={getEnabledSections()}
          progressData={progressData}
          streak={progressData.streak}
          onSectionSelect={handleSectionSelect}
        />
      </div>
    );
  }

  // Level complete screen
  if (isLevelComplete) {
    const isLastLevel = currentLevel === currentSection.totalLevels;
    return (
      <div className="app-container">
        <LevelComplete
          level={currentLevel}
          stars={earnedStars}
          score={score}
          totalPossible={currentSection.id === 'french' ? levelWords.length : mathStatus.totalSteps}
          onNext={handleNextLevel}
          onReturnToMap={handleBackToSection}
          isLastLevel={isLastLevel}
          title={`Niveau ${currentLevel} Terminé !`}
        />
      </div>
    );
  }

  // Section view (level map or playing)
  if (currentView === 'section') {
    return (
      <div className="app-container">
        <SectionView
          section={currentSection}
          progressData={progressData}
          onBack={handleBackToDashboard}
          onLevelStart={handleLevelStart}
          showMap={true}
        />
      </div>
    );
  }

  // Playing view
  if (currentView === 'playing') {
    const sectionProgress = progressData.sections[currentSection.id];

    return (
      <div className="app-container">
        {/* Header */}
        <div className="section-view-header" style={{ backgroundColor: currentSection.color }}>
          <button className="back-button-simple" onClick={handleBackToSection}>
            ← Carte
          </button>
          <GameHeader
            level={currentLevel}
            totalLevels={currentSection.totalLevels}
            currentStep={currentSection.id === 'french' ? wordIndex + 1 : mathStatus.currentStep}
            totalSteps={currentSection.id === 'french' ? WORDS_PER_LEVEL : mathStatus.totalSteps}
            score={currentSection.id === 'french' ? score : mathStatus.score}
            progressColor={currentSection.color}
            title={currentSection.title}
          />
        </div>

        {/* Game Area */}
        <main className="game-area">
          {currentSection.id === 'french' ? (
            <>
              <Flashcard
                word={currentWord}
                animate={!isValidated}
                isUpperCase={isUpperCase}
                color={currentSection.color}
              />

              <div className="controls">
                {!isValidated ? (
                  <button
                    className={`btn-primary ${!isInteractable ? 'disabled' : ''}`}
                    onClick={handleValidate}
                    disabled={!isInteractable}
                    style={{
                      backgroundColor: currentSection.color,
                      opacity: isInteractable ? 1 : 0.5,
                      cursor: isInteractable ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <Check size={28} />
                    <span>Vérifier & Écouter</span>
                  </button>
                ) : (
                  <div className="validated-controls">
                    <button
                      className="btn-secondary btn-round"
                      onClick={() => speakWord(currentWord)}
                    >
                      <Volume2 size={24} />
                    </button>
                    <button
                      className="btn-accent pulse"
                      onClick={nextWord}
                      style={{ backgroundColor: currentSection.color }}
                    >
                      <span>
                        {wordIndex === levelWords.length - 1
                          ? "Terminer le Niveau"
                          : "Mot Suivant"}
                      </span>
                      <ArrowRight size={28} />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : currentSection.id === 'math' ? (
            <MathGame
              level={currentLevel}
              onCorrect={() => {
                setScore(s => s + 1);
                setMathStatus(prev => ({ ...prev, score: prev.score + 1 }));
              }}
              onStatusChange={setMathStatus}
              onLevelComplete={handleMathLevelComplete}
              sectionColor={currentSection.color}
            />
          ) : null}
        </main>

        {/* Footer with settings */}
        {currentSection.id === 'french' && (
          <footer className="footer">
            <div className="footer-info">
              <p>
                Mot {wordIndex + 1} sur {WORDS_PER_LEVEL} — Niveau {currentLevel}
              </p>
            </div>
            <div className="voice-selector">
              <button
                className="btn-settings"
                onClick={() => setShowSettings(!showSettings)}
                title="Paramètres"
              >
                <Settings size={18} />
              </button>
              {showSettings && (
                <div className="settings-panel">
                  <button
                    className={`btn-toggle-case ${isUpperCase ? 'active' : ''}`}
                    onClick={handleCaseToggle}
                    title="Majuscules / Minuscules"
                  >
                    <ALargeSmall size={18} />
                    <span>{isUpperCase ? "ABC" : "abc"}</span>
                  </button>

                  <select onChange={handleVoiceChange} className="voice-select-dropdown">
                    <option value="">-- Choisir une voix --</option>
                    {availableVoices.map(v => (
                      <option key={v.name} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </footer>
        )}
      </div>
    );
  }

  return <div className="loading">Chargement...</div>;
}

export default App;
