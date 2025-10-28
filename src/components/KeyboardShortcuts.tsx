import { useEffect } from 'react';
import { HabitType } from '../types';

interface KeyboardShortcutsProps {
  onOpenHabitModal: (type: HabitType) => void;
  onNavigate?: (view: string) => void;
}

export function KeyboardShortcuts({ onOpenHabitModal, onNavigate }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Cmd/Ctrl + shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'h':
            e.preventDefault();
            onOpenHabitModal('hydration');
            break;
          case 'b':
            e.preventDefault();
            onOpenHabitModal('break');
            break;
          case 'm':
            e.preventDefault();
            onOpenHabitModal('mood');
            break;
          case '1':
            e.preventDefault();
            onNavigate?.('dashboard');
            break;
          case '2':
            e.preventDefault();
            onNavigate?.('analytics');
            break;
          case '3':
            e.preventDefault();
            onNavigate?.('achievements');
            break;
        }
      }

      // Escape to close modals (handled by individual modals)
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onOpenHabitModal, onNavigate]);

  return null;
}
