
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
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

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 rounded-full bg-secondary/50 backdrop-blur-sm transition-all hover:bg-secondary"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="relative w-6 h-6"
      >
        {theme === 'dark' ? (
          <Sun className="absolute inset-0 h-[1.2rem] w-[1.2rem] text-primary transition-all duration-300" />
        ) : (
          <Moon className="absolute inset-0 h-[1.2rem] w-[1.2rem] text-primary transition-all duration-300" />
        )}
      </motion.div>
    </Button>
  );
};

export default ThemeToggle;
