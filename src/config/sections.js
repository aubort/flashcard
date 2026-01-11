/**
 * Section Configuration - Extensible architecture for adding new learning sections
 * Makes it easy to add new subjects (Spanish, English, Geography, etc.)
 */

export const SECTIONS = {
  french: {
    id: 'french',
    title: 'Français',
    subtitle: 'Les 100 mots les plus courants',
    description: 'Apprends les mots français de base',
    icon: '📚',
    color: '#4CAF50',
    darkColor: '#388E3C',
    totalLevels: 10,
    wordsPerLevel: 10,
    type: 'flashcard',
    enabled: true
  },
  math: {
    id: 'math',
    title: 'Mathématiques',
    subtitle: 'Addition et soustraction',
    description: 'Pratique les calculs mentaux',
    icon: '🔢',
    color: '#6c5ce7',
    darkColor: '#5f4dd1',
    totalLevels: 4,
    problemsPerLevel: 10,
    type: 'quiz',
    enabled: true
  },
  // Template for future sections - easy to add!
  // english: {
  //   id: 'english',
  //   title: 'English',
  //   subtitle: '100 most common words',
  //   description: 'Learn basic English vocabulary',
  //   icon: '🇬🇧',
  //   color: '#FF6B6B',
  //   darkColor: '#E84545',
  //   totalLevels: 10,
  //   wordsPerLevel: 10,
  //   type: 'flashcard',
  //   enabled: false // Set to true when ready
  // },
  // spanish: {
  //   id: 'spanish',
  //   title: 'Español',
  //   subtitle: '100 palabras más comunes',
  //   description: 'Aprende vocabulario básico español',
  //   icon: '🇪🇸',
  //   color: '#FFB74D',
  //   darkColor: '#FFA726',
  //   totalLevels: 10,
  //   wordsPerLevel: 10,
  //   type: 'flashcard',
  //   enabled: false
  // }
};

// Get all enabled sections
export const getEnabledSections = () => {
  return Object.values(SECTIONS).filter(section => section.enabled);
};

// Get section by ID
export const getSection = (id) => {
  return SECTIONS[id];
};

// Helper to calculate total available stars in a section
export const getSectionMaxStars = (sectionId) => {
  const section = SECTIONS[sectionId];
  return section ? section.totalLevels * 3 : 0;
};

export default SECTIONS;
