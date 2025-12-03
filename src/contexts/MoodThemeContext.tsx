import React, { createContext, useContext, useState, useEffect } from 'react';

type MoodType = 'happy' | 'excited' | 'calm' | 'sad' | 'angry' | 'neutral' | 'energetic' | 'romantic' | 'melancholic' | null;

interface MoodThemeContextType {
  currentMood: MoodType;
  setCurrentMood: (mood: MoodType) => void;
  getMoodStyles: () => string;
}

const MOOD_STYLES: Record<string, { bg: string; accent: string }> = {
  happy: {
    bg: 'from-yellow-500/20 via-orange-500/10 to-amber-500/20',
    accent: 'text-yellow-600 dark:text-yellow-400',
  },
  excited: {
    bg: 'from-pink-500/20 via-rose-500/10 to-red-500/20',
    accent: 'text-pink-600 dark:text-pink-400',
  },
  calm: {
    bg: 'from-blue-500/20 via-cyan-500/10 to-teal-500/20',
    accent: 'text-blue-600 dark:text-blue-400',
  },
  sad: {
    bg: 'from-indigo-500/20 via-blue-500/10 to-slate-500/20',
    accent: 'text-indigo-600 dark:text-indigo-400',
  },
  angry: {
    bg: 'from-red-500/20 via-orange-500/10 to-rose-500/20',
    accent: 'text-red-600 dark:text-red-400',
  },
  neutral: {
    bg: 'from-gray-500/20 via-slate-500/10 to-zinc-500/20',
    accent: 'text-gray-600 dark:text-gray-400',
  },
  energetic: {
    bg: 'from-orange-500/20 via-yellow-500/10 to-red-500/20',
    accent: 'text-orange-600 dark:text-orange-400',
  },
  romantic: {
    bg: 'from-pink-500/20 via-rose-500/10 to-purple-500/20',
    accent: 'text-pink-600 dark:text-pink-400',
  },
  melancholic: {
    bg: 'from-purple-500/20 via-violet-500/10 to-indigo-500/20',
    accent: 'text-purple-600 dark:text-purple-400',
  },
};

const DEFAULT_BG = 'from-primary/10 via-background to-secondary/10';

const MoodThemeContext = createContext<MoodThemeContextType | undefined>(undefined);

export const MoodThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMood, setCurrentMood] = useState<MoodType>(null);

  const getMoodStyles = () => {
    if (!currentMood || !MOOD_STYLES[currentMood]) {
      return DEFAULT_BG;
    }
    return MOOD_STYLES[currentMood].bg;
  };

  // Apply mood-based CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    
    if (currentMood && MOOD_STYLES[currentMood]) {
      root.setAttribute('data-mood', currentMood);
    } else {
      root.removeAttribute('data-mood');
    }
  }, [currentMood]);

  return (
    <MoodThemeContext.Provider value={{ currentMood, setCurrentMood, getMoodStyles }}>
      {children}
    </MoodThemeContext.Provider>
  );
};

export const useMoodTheme = () => {
  const context = useContext(MoodThemeContext);
  if (!context) {
    throw new Error('useMoodTheme must be used within MoodThemeProvider');
  }
  return context;
};

export { MOOD_STYLES };
