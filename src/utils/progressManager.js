/**
 * Progress Manager - Handles persistent storage of user progress
 * Based on pedagogical research showing importance of tracking and spaced repetition
 */

const STORAGE_KEY = 'flashcard_progress';

// Initialize default progress structure
const createDefaultProgress = () => ({
  version: '2.0',
  lastVisit: new Date().toISOString(),
  streak: {
    current: 0,
    longest: 0,
    lastPracticeDate: null
  },
  sections: {
    french: {
      totalLevels: 10,
      completedLevels: [],
      currentLevel: 1,
      totalStars: 0,
      levelsData: {} // { levelId: { stars: 3, completed: true, lastPlayed: date, mistakes: [] } }
    },
    math: {
      totalLevels: 4,
      completedLevels: [],
      currentLevel: 1,
      totalStars: 0,
      levelsData: {}
    }
  },
  achievements: [],
  settings: {
    isUpperCase: true,
    selectedVoice: null
  }
});

class ProgressManager {
  constructor() {
    this.data = this.loadProgress();
  }

  loadProgress() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with default structure to handle version updates
        return { ...createDefaultProgress(), ...parsed };
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
    return createDefaultProgress();
  }

  saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  // Streak management (key for daily engagement - Duolingo pattern)
  updateStreak() {
    const today = new Date().toDateString();
    const lastPractice = this.data.streak.lastPracticeDate;

    if (!lastPractice) {
      // First time
      this.data.streak.current = 1;
      this.data.streak.longest = 1;
      this.data.streak.lastPracticeDate = today;
    } else {
      const lastDate = new Date(lastPractice);
      const diffTime = new Date(today) - new Date(lastDate.toDateString());
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 0) {
        // Same day, don't increment
        return;
      } else if (diffDays === 1) {
        // Consecutive day
        this.data.streak.current += 1;
        this.data.streak.longest = Math.max(this.data.streak.current, this.data.streak.longest);
      } else {
        // Streak broken
        this.data.streak.current = 1;
      }
      this.data.streak.lastPracticeDate = today;
    }

    this.saveProgress();
  }

  getStreak() {
    return this.data.streak;
  }

  // Level completion with star rating (gamification element)
  completeLevel(section, level, score, totalPossible, mistakes = []) {
    const percentage = (score / totalPossible) * 100;
    let stars = 1;
    if (percentage >= 90) stars = 3;
    else if (percentage >= 70) stars = 2;

    const sectionData = this.data.sections[section];
    if (!sectionData) return;

    // Update level data
    sectionData.levelsData[level] = {
      completed: true,
      stars,
      score,
      totalPossible,
      lastPlayed: new Date().toISOString(),
      mistakes: mistakes.slice(0, 5) // Store up to 5 mistakes for review
    };

    // Add to completed levels if not already there
    if (!sectionData.completedLevels.includes(level)) {
      sectionData.completedLevels.push(level);
    }

    // Update total stars
    sectionData.totalStars = Object.values(sectionData.levelsData)
      .reduce((sum, data) => sum + (data.stars || 0), 0);

    // Unlock next level
    if (level === sectionData.currentLevel && level < sectionData.totalLevels) {
      sectionData.currentLevel = level + 1;
    }

    this.updateStreak();
    this.saveProgress();

    // Check for achievements
    this.checkAchievements(section);

    return stars;
  }

  // Get level data
  getLevelData(section, level) {
    const sectionData = this.data.sections[section];
    if (!sectionData) return null;
    return sectionData.levelsData[level] || null;
  }

  // Check if level is unlocked (progressive disclosure - pedagogical principle)
  isLevelUnlocked(section, level) {
    const sectionData = this.data.sections[section];
    if (!sectionData) return false;
    return level <= sectionData.currentLevel;
  }

  // Get items for spaced repetition review
  getReviewItems(section) {
    const sectionData = this.data.sections[section];
    if (!sectionData) return [];

    const reviewItems = [];
    Object.entries(sectionData.levelsData).forEach(([level, data]) => {
      if (data.mistakes && data.mistakes.length > 0) {
        reviewItems.push({
          level: parseInt(level),
          mistakes: data.mistakes,
          lastPlayed: data.lastPlayed
        });
      }
    });

    return reviewItems;
  }

  // Get section progress summary
  getSectionProgress(section) {
    const sectionData = this.data.sections[section];
    if (!sectionData) return null;

    return {
      currentLevel: sectionData.currentLevel,
      totalLevels: sectionData.totalLevels,
      completedLevels: sectionData.completedLevels.length,
      totalStars: sectionData.totalStars,
      maxStars: sectionData.totalLevels * 3,
      percentage: (sectionData.completedLevels.length / sectionData.totalLevels) * 100
    };
  }

  // Achievement system
  checkAchievements(section) {
    const achievements = [];
    const sectionData = this.data.sections[section];

    // First level achievement
    if (sectionData.completedLevels.length === 1 &&
        !this.data.achievements.includes(`${section}_first_level`)) {
      achievements.push({
        id: `${section}_first_level`,
        title: 'Premier Pas',
        description: 'Complète ton premier niveau!'
      });
    }

    // All 3 stars in a level
    const allThreeStars = Object.values(sectionData.levelsData).some(data => data.stars === 3);
    if (allThreeStars && !this.data.achievements.includes(`${section}_perfect`)) {
      achievements.push({
        id: `${section}_perfect`,
        title: 'Parfait!',
        description: 'Obtiens 3 étoiles dans un niveau!'
      });
    }

    // Complete all levels
    if (sectionData.completedLevels.length === sectionData.totalLevels &&
        !this.data.achievements.includes(`${section}_complete`)) {
      achievements.push({
        id: `${section}_complete`,
        title: 'Expert',
        description: `Complète tous les niveaux de ${section}!`
      });
    }

    // 7 day streak
    if (this.data.streak.current >= 7 && !this.data.achievements.includes('streak_7')) {
      achievements.push({
        id: 'streak_7',
        title: 'Série de 7',
        description: 'Pratique pendant 7 jours consécutifs!'
      });
    }

    // Save new achievements
    achievements.forEach(achievement => {
      if (!this.data.achievements.includes(achievement.id)) {
        this.data.achievements.push(achievement.id);
      }
    });

    if (achievements.length > 0) {
      this.saveProgress();
    }

    return achievements;
  }

  // Settings management
  updateSettings(settings) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.saveProgress();
  }

  getSettings() {
    return this.data.settings;
  }

  // Reset progress (for testing or user request)
  resetProgress(section = null) {
    if (section) {
      // Reset specific section
      const defaults = createDefaultProgress();
      this.data.sections[section] = defaults.sections[section];
    } else {
      // Reset everything
      this.data = createDefaultProgress();
    }
    this.saveProgress();
  }

  // Get all data (for dashboard)
  getAllData() {
    return this.data;
  }
}

// Export singleton instance
export const progressManager = new ProgressManager();
export default progressManager;
