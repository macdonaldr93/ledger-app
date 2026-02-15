import { useEffect } from 'react';

interface KeyboardBindingsProps {
  isEnabled: boolean;
  isAnswerRevealed: boolean;
  isTimeExpired: boolean;
  onTap: () => void;
  onCorrect: () => void;
  onIncorrect: () => void;
  onTimeoutContinue: () => void;
  onReset: () => void;
}

export function useKeyboardBindings({
  isEnabled,
  isAnswerRevealed,
  isTimeExpired,
  onTap,
  onCorrect,
  onIncorrect,
  onTimeoutContinue,
  onReset,
}: KeyboardBindingsProps) {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      // restart = escape
      if (key === 'Escape') {
        onReset();
        return;
      }

      // If we are in time expired state, any relevant key should continue
      if (isTimeExpired) {
        const continueKeys = ['d', 'D', 'ArrowRight', ' ', 'Enter'];
        if (continueKeys.includes(key)) {
          onTimeoutContinue();
        }
        return;
      }

      if (!isAnswerRevealed) {
        // Tap to reveal = wasd, any arrow key, spacebar or enter
        const revealKeys = [
          'w',
          'W',
          'a',
          'A',
          's',
          'S',
          'd',
          'D',
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          ' ',
          'Enter',
        ];
        if (revealKeys.includes(key)) {
          onTap();
        }
      } else {
        // Correct = d or right arrow
        // Incorrect = a or left arrow
        if (key === 'd' || key === 'D' || key === 'ArrowRight') {
          onCorrect();
        } else if (key === 'a' || key === 'A' || key === 'ArrowLeft') {
          onIncorrect();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isEnabled,
    isAnswerRevealed,
    isTimeExpired,
    onTap,
    onCorrect,
    onIncorrect,
    onTimeoutContinue,
    onReset,
  ]);
}
