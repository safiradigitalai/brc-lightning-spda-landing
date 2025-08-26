'use client';

import { useTheme } from '@/hooks/use-theme';
import { Button } from './button';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border-primary/30 hover:bg-primary/10 transition-all duration-300 cursor-pointer"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-primary" />
      ) : (
        <Sun className="h-4 w-4 text-primary" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}