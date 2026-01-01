
import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Star, Check, Volume2, ArrowRight, Home, Settings, ALargeSmall, Languages, Calculator } from 'lucide-react';
import Flashcard from './components/Flashcard';
import LevelIndicator from './components/LevelIndicator';
import MathGame from './components/MathGame';
import GameHeader from './components/GameHeader';
import LevelComplete from './components/LevelComplete';

import { words } from './data/words';


import { speakWord, getFrenchVoices, setVoice } from './utils/speech';
import { themes, applyTheme, getThemeKeys } from './utils/themes';
import './App.css';

const WORDS_PER_LEVEL = 10;
const TOTAL_LEVELS = Math.ceil(words.length / WORDS_PER_LEVEL);
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
  const [level, setLevel] = useState(1);
  // Calculate/Shuffle level words when level changes
  const levelWords = useMemo(() => {
    const start = (level - 1) * WORDS_PER_LEVEL;
    const end = start + WORDS_PER_LEVEL;
    const slice = words.slice(start, end);
    return shuffle(slice);
  }, [level]);

  // Reset state when level changes
  useEffect(() => {
    setWordIndex(0);
    setIsValidated(false);
    setIsLevelComplete(false);
  }, [level]);

  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isValidated, setIsValidated] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isInteractable, setIsInteractable] = useState(false);
  const currentWord = levelWords[wordIndex];

  // Interaction delay effect
  useEffect(() => {
    setIsInteractable(false);
    const timer = setTimeout(() => {
      setIsInteractable(true);
    }, DELAY_VALIDATE_LISTEN_WORD);
    return () => clearTimeout(timer);
  }, [currentWord]);

  // Voice Settings
  const [availableVoices, setAvailableVoices] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isUpperCase, setIsUpperCase] = useState(true);
  const [appMode, setAppMode] = useState('french'); // 'french' or 'math'
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [mathStatus, setMathStatus] = useState({
    level: 1,
    totalLevels: 4,
    currentStep: 1,
    totalSteps: 10
  });


  // Apply theme on mount and when changed
  useEffect(() => {
    applyTheme(selectedTheme);
  }, [selectedTheme]);

  // Initialize voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = getFrenchVoices();
      setAvailableVoices(voices);

      // Auto-select a good voice if available
      const preferred = voices.find(v =>
        v.name.includes("Google") || v.name.includes("Siri") || v.name.includes("Audrey") || v.name.includes("Thomas")
      );
      if (preferred) setVoice(preferred);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const handleVoiceChange = (e) => {
    const voiceName = e.target.value;
    const voice = availableVoices.find(v => v.name === voiceName);
    if (voice) {
      setVoice(voice);
      speakWord("Bonjour"); // Test the voice
    }
  };

  const handleThemeChange = (e) => {
    setSelectedTheme(e.target.value);
  };



  const handleValidate = () => {
    speakWord(currentWord);
    setIsValidated(true);
  };

  const nextWord = () => {
    // If it was the last word of the level
    if (wordIndex >= levelWords.length - 1) {
      handleLevelComplete();
    } else {
      setScore(s => s + 1);
      setWordIndex(prev => prev + 1);
      setIsValidated(false);
    }
  };

  const handleLevelComplete = () => {
    setScore(s => s + 1); // Point for the last word
    setIsLevelComplete(true);
    triggerConfetti();
  };

  const nextLevel = () => {
    if (level < TOTAL_LEVELS) {
      setLevel(l => l + 1);
    } else {
      // Game Over / Restart
      alert("Félicitations ! Tu as terminé tous les mots !");
      setLevel(1);
      setScore(0);
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const progress = ((wordIndex + 1) / WORDS_PER_LEVEL) * 100;

  if (!currentWord) return <div className="loading">Chargement...</div>;

  if (isLevelComplete) {
    return (
      <div className="app-container">
        <LevelComplete
          level={level}
          onNext={nextLevel}
          isLastLevel={level === TOTAL_LEVELS}
          title={`Niveau ${level} Terminé !`}
        />
      </div>
    );
  }



  return (
    <div className="app-container">
      <nav className="top-nav">
        <div className="mode-switcher">
          <button
            className={`btn-mode ${appMode === 'french' ? 'active' : ''}`}
            onClick={() => setAppMode('french')}
          >
            <Languages size={20} />
            <span>Français</span>
          </button>
          <button
            className={`btn-mode ${appMode === 'math' ? 'active' : ''}`}
            onClick={() => setAppMode('math')}
          >
            <Calculator size={20} />
            <span>Maths</span>
          </button>
        </div>
      </nav>

      {appMode === 'french' ? (

        <GameHeader
          level={level}
          totalLevels={TOTAL_LEVELS}
          currentStep={wordIndex + 1}
          totalSteps={WORDS_PER_LEVEL}
          score={score}
          progressColor="#4CAF50"
          title="Français"
        />
      ) : (
        <GameHeader
          level={mathStatus.level}
          totalLevels={mathStatus.totalLevels}
          currentStep={mathStatus.currentStep}
          totalSteps={mathStatus.totalSteps}
          score={score}
          progressColor="#6c5ce7"
          title="Maths"
        />
      )}


      <main className="game-area">
        {appMode === 'french' ? (
          <>
            <Flashcard word={currentWord} animate={!isValidated} isUpperCase={isUpperCase} color="#4CAF50" />

            <div className="controls">
              {!isValidated ? (
                <button
                  className={`btn-primary ${!isInteractable ? 'disabled' : ''}`}
                  onClick={handleValidate}
                  disabled={!isInteractable}
                  style={{ opacity: isInteractable ? 1 : 0.5, cursor: isInteractable ? 'pointer' : 'not-allowed' }}
                >
                  <Check size={28} />
                  <span>Vérifier & Écouter</span>
                </button>
              ) : (
                <div className="validated-controls">
                  <button className="btn-secondary btn-round" onClick={() => speakWord(currentWord)}>
                    <Volume2 size={24} />
                  </button>
                  <button className="btn-accent pulse" onClick={nextWord}>
                    <span>{wordIndex === levelWords.length - 1 ? "Terminer le Niveau" : "Mot Suivant"}</span>
                    <ArrowRight size={28} />
                  </button>
                </div>
              )}
            </div>

          </>
        ) : (
          <MathGame
            onCorrect={() => setScore(s => s + 1)}
            onStatusChange={setMathStatus}
          />
        )}

      </main>

      <footer className="footer">
        <div className="footer-info">
          <p>Mot {wordIndex + 1} sur {WORDS_PER_LEVEL} — Niveau {level}</p>
        </div>
        <div className="voice-selector">
          <button className="btn-settings" onClick={() => setShowSettings(!showSettings)} title="Changer la voix">
            <Settings size={18} />
          </button>
          {showSettings && (
            <div className="settings-panel">
              <div className="theme-selector">
                <label htmlFor="theme-select" className="theme-label">Thème:</label>
                <select
                  id="theme-select"
                  onChange={handleThemeChange}
                  value={selectedTheme}
                  className="theme-select-dropdown"
                >
                  {getThemeKeys().map(key => (
                    <option key={key} value={key}>
                      {themes[key].emoji} {themes[key].name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className={`btn-toggle-case ${isUpperCase ? 'active' : ''}`}
                onClick={() => setIsUpperCase(!isUpperCase)}
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
    </div>
  );
}

export default App;

