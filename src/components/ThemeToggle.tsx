
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getThemeIcon = () => {
    if (theme === 'system') {
      return <Monitor className="h-[1.2rem] w-[1.2rem] text-primary transition-all duration-300" />;
    }
    return theme === 'dark' ? (
      <Sun className="h-[1.2rem] w-[1.2rem] text-primary transition-all duration-300" />
    ) : (
      <Moon className="h-[1.2rem] w-[1.2rem] text-primary transition-all duration-300" />
    );
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark theme';
      case 'dark':
        return 'Switch to system theme';
      case 'system':
        return 'Switch to light theme';
      default:
        return 'Toggle theme';
    }
  };

  const cycleTheme = () => {
    switch (theme) {
      case 'light':
        setTheme('dark');
        break;
      case 'dark':
        setTheme('system');
        break;
      case 'system':
        setTheme('light');
        break;
      default:
        setTheme('light');
    }
  };

  const getRotation = () => {
    switch (theme) {
      case 'dark':
        return 180;
      case 'system':
        return 360;
      default:
        return 0;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="w-10 h-10 rounded-full bg-secondary/50 backdrop-blur-sm transition-all hover:bg-secondary"
      aria-label={getThemeLabel()}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: getRotation() }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="relative w-6 h-6"
      >
        {getThemeIcon()}
      </motion.div>
    </Button>
  );
};

export default ThemeToggle;
