
import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Star, Check, Volume2, ArrowRight, Home, Settings } from 'lucide-react';
import Flashcard from './components/Flashcard';
import LevelIndicator from './components/LevelIndicator';
import { words } from './data/words';
import { speakWord, getFrenchVoices, setVoice } from './utils/speech';
import './App.css';

const WORDS_PER_LEVEL = 10;
const TOTAL_LEVELS = Math.ceil(words.length / WORDS_PER_LEVEL);

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
  const [levelWords, setLevelWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isValidated, setIsValidated] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  // Voice Settings
  const [availableVoices, setAvailableVoices] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

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

  // Initialize level words
  useEffect(() => {
    const start = (level - 1) * WORDS_PER_LEVEL;
    const end = start + WORDS_PER_LEVEL;
    const slice = words.slice(start, end);
    setLevelWords(shuffle(slice));
    setWordIndex(0);
    setIsValidated(false);
    setIsLevelComplete(false);
  }, [level]);

  const currentWord = levelWords[wordIndex];

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
      <div className="app-container level-complete-screen">
        <h1>Niveau {level} Terminé !</h1>
        <div className="stars-gained">
          <Star size={64} fill="#FFD700" color="#FFD700" className="floating-star" />
          <p>+10 Étoiles !</p>
        </div>
        <button className="btn-next-level" onClick={nextLevel}>
          Commencer le Niveau {level + 1}
        </button>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="header">
        <LevelIndicator level={level} totalLevels={TOTAL_LEVELS} />
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="score">
          <Star className="star-icon" fill="#FFD700" color="#FFD700" />
          <span>{score}</span>
        </div>
      </header>

      <main className="game-area">
        <h1>French Flashcards</h1>

        <Flashcard word={currentWord} animate={!isValidated} />

        <div className="controls">
          {!isValidated ? (
            <button className="btn-validate" onClick={handleValidate}>
              <Check size={28} />
              <span>Vérifier & Écouter</span>
            </button>
          ) : (
            <div className="validated-controls">
              <button className="btn-secondary" onClick={() => speakWord(currentWord)}>
                <Volume2 size={24} />
              </button>
              <button className="btn-next" onClick={nextWord}>
                <span>{wordIndex === levelWords.length - 1 ? "Terminer le Niveau" : "Mot Suivant"}</span>
                <ArrowRight size={28} />
              </button>
            </div>
          )}
        </div>
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
            <select onChange={handleVoiceChange} className="voice-select-dropdown">
              <option value="">-- Choisir une voix --</option>
              {availableVoices.map(v => (
                <option key={v.name} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;

