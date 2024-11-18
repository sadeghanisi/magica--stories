import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeContext as ThemeContextType } from '../types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const fontSizeMap = {
  small: '16px',
  medium: '18px',
  large: '20px',
};

const fontFamilyMap = {
  'comic-sans': '"Comic Sans MS", "Comic Sans", cursive',
  'opendyslexic': '"OpenDyslexic", "Comic Sans MS", cursive',
  'lexend': '"Lexend", sans-serif',
  'atkinson': '"Atkinson Hyperlegible", sans-serif',
  'andika': '"Andika", sans-serif',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeContextType['theme']>('light');
  const [fontFamily, setFontFamily] = useState<ThemeContextType['fontFamily']>('comic-sans');
  const [fontSize, setFontSize] = useState<ThemeContextType['fontSize']>('medium');

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply font size
    document.documentElement.style.setProperty('--base-font-size', fontSizeMap[fontSize]);
    
    // Apply font family
    document.documentElement.style.setProperty('--font-family-selected', fontFamilyMap[fontFamily]);
  }, [theme, fontFamily, fontSize]);

  return (
    <ThemeContext.Provider value={{
      theme,
      fontFamily,
      fontSize,
      setTheme,
      setFontFamily,
      setFontSize,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}