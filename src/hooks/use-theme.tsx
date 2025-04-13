
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => {
      // Check local storage first
      const storedTheme = localStorage.getItem(storageKey) as Theme;
      if (storedTheme) return storedTheme;
      
      // If no stored theme, check system preference
      if (typeof window !== 'undefined') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark ? 'dark' : defaultTheme;
      }
      
      return defaultTheme;
    }
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class with transition
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    root.classList.add(theme);
    
    // Update local storage
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => setTheme(theme),
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
