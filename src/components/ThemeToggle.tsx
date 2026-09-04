import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../store/theme';
import { Button } from './ui/button';

export default function ThemeToggle({ size = 'sm' }: { size?: 'sm' | 'xs' }) {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`${size === 'xs' ? 'h-7 w-7' : 'h-8 w-8'} text-muted-foreground hover:text-foreground transition-colors`}
    >
      {theme === 'dark' ? (
        <Sun size={size === 'xs' ? 13 : 15} />
      ) : (
        <Moon size={size === 'xs' ? 13 : 15} />
      )}
    </Button>
  );
}
