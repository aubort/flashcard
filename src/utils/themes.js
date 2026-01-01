// Theme configurations for the flashcard app
// Each theme includes colors, emojis, and styling for a fun, kid-friendly experience

export const themes = {
  default: {
    name: 'Classique',
    emoji: '🎨',
    colors: {
      primary: '#4ECDC4',      // Cyan
      secondary: '#FF6B6B',    // Coral red
      success: '#4CAF50',      // Green
      warning: '#FFD700',      // Gold
      background: '#f0f8ff',   // Alice blue
      cardBorder: '#4CAF50',   // Green
      progressBar: '#4CAF50',  // Green
      mathColor: '#6c5ce7',    // Purple
    }
  },

  peppa: {
    name: 'Peppa Pig',
    emoji: '🐷',
    colors: {
      primary: '#FF69B4',      // Hot pink (Peppa's color)
      secondary: '#87CEEB',    // Sky blue
      success: '#90EE90',      // Light green
      warning: '#FFD700',      // Gold
      background: '#FFF0F5',   // Lavender blush
      cardBorder: '#FF69B4',   // Hot pink
      progressBar: '#FF69B4',  // Hot pink
      mathColor: '#FF1493',    // Deep pink
    }
  },

  pawPatrol: {
    name: 'Pat Patrouille',
    emoji: '🐕',
    colors: {
      primary: '#1E90FF',      // Dodger blue (Chase)
      secondary: '#FF4500',    // Orange red (Marshall)
      success: '#32CD32',      // Lime green
      warning: '#FFD700',      // Gold (Rubble)
      background: '#E6F3FF',   // Light blue
      cardBorder: '#1E90FF',   // Dodger blue
      progressBar: '#1E90FF',  // Dodger blue
      mathColor: '#9370DB',    // Medium purple
    }
  },

  starWars: {
    name: 'Star Wars',
    emoji: '⭐',
    colors: {
      primary: '#FFE81F',      // Star Wars yellow
      secondary: '#FF0000',    // Red (Sith)
      success: '#00FF00',      // Green (Yoda/lightsaber)
      warning: '#FFA500',      // Orange
      background: '#1a1a2e',   // Dark space
      cardBorder: '#FFE81F',   // Star Wars yellow
      progressBar: '#00FF00',  // Green
      mathColor: '#4169E1',    // Royal blue
      darkMode: true,          // Special flag for dark background
      textColor: '#FFE81F',    // Yellow text
    }
  },

  dinosaur: {
    name: 'Dinosaures',
    emoji: '🦕',
    colors: {
      primary: '#228B22',      // Forest green
      secondary: '#FF8C00',    // Dark orange
      success: '#7CFC00',      // Lawn green
      warning: '#FFD700',      // Gold
      background: '#F0E68C',   // Khaki (prehistoric feel)
      cardBorder: '#228B22',   // Forest green
      progressBar: '#228B22',  // Forest green
      mathColor: '#8B4513',    // Saddle brown
    }
  },

  unicorn: {
    name: 'Licorne',
    emoji: '🦄',
    colors: {
      primary: '#FF69B4',      // Hot pink
      secondary: '#9370DB',    // Medium purple
      success: '#00CED1',      // Dark turquoise
      warning: '#FFD700',      // Gold
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', // Rainbow gradient
      cardBorder: '#FF69B4',   // Hot pink
      progressBar: '#9370DB',  // Medium purple
      mathColor: '#DA70D6',    // Orchid
      gradient: true,          // Special flag for gradient background
    }
  },
};

// Get theme by key
export const getTheme = (themeKey) => {
  return themes[themeKey] || themes.default;
};

// Get all theme keys
export const getThemeKeys = () => {
  return Object.keys(themes);
};

// Apply theme to document root
export const applyTheme = (themeKey) => {
  const theme = getTheme(themeKey);
  const root = document.documentElement;

  // Apply color variables
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-success', theme.colors.success);
  root.style.setProperty('--color-warning', theme.colors.warning);
  root.style.setProperty('--color-card-border', theme.colors.cardBorder);
  root.style.setProperty('--color-progress-bar', theme.colors.progressBar);
  root.style.setProperty('--color-math', theme.colors.mathColor);

  // Handle special backgrounds
  if (theme.gradient) {
    root.style.setProperty('--color-background', 'transparent');
    document.body.style.background = theme.colors.background;
  } else {
    root.style.setProperty('--color-background', theme.colors.background);
    document.body.style.background = theme.colors.background;
  }

  // Handle dark mode
  if (theme.darkMode) {
    root.style.setProperty('--text-color', theme.colors.textColor || '#FFE81F');
    root.style.setProperty('--card-background', '#2a2a3e');
  } else {
    root.style.setProperty('--text-color', '#213547');
    root.style.setProperty('--card-background', '#ffffff');
  }
};
