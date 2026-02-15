import { renderHook } from '@testing-library/react';
import { useKeyboardBindings } from './useKeyboardBindings';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('useKeyboardBindings', () => {
  const defaultProps = {
    isEnabled: true,
    isAnswerRevealed: false,
    isTimeExpired: false,
    onTap: vi.fn(),
    onCorrect: vi.fn(),
    onIncorrect: vi.fn(),
    onTimeoutContinue: vi.fn(),
    onReset: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fireKeyDown = (key: string) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  };

  it('calls onReset when Escape is pressed', () => {
    renderHook(() => useKeyboardBindings(defaultProps));
    fireKeyDown('Escape');
    expect(defaultProps.onReset).toHaveBeenCalled();
  });

  describe('when answer is NOT revealed', () => {
    it('calls onTap when reveal keys are pressed', () => {
      renderHook(() => useKeyboardBindings({ ...defaultProps, isAnswerRevealed: false }));

      const revealKeys = [
        'w',
        'a',
        's',
        'd',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        ' ',
        'Enter',
      ];

      revealKeys.forEach((key, index) => {
        fireKeyDown(key);
        expect(defaultProps.onTap).toHaveBeenCalledTimes(index + 1);
      });
    });

    it('does not call onCorrect or onIncorrect', () => {
      renderHook(() => useKeyboardBindings({ ...defaultProps, isAnswerRevealed: false }));
      fireKeyDown('d');
      expect(defaultProps.onCorrect).not.toHaveBeenCalled();
      fireKeyDown('a');
      expect(defaultProps.onIncorrect).not.toHaveBeenCalled();
    });
  });

  describe('when answer IS revealed', () => {
    it('calls onCorrect when d or ArrowRight is pressed', () => {
      renderHook(() => useKeyboardBindings({ ...defaultProps, isAnswerRevealed: true }));
      fireKeyDown('d');
      expect(defaultProps.onCorrect).toHaveBeenCalledTimes(1);
      fireKeyDown('ArrowRight');
      expect(defaultProps.onCorrect).toHaveBeenCalledTimes(2);
    });

    it('calls onIncorrect when a or ArrowLeft is pressed', () => {
      renderHook(() => useKeyboardBindings({ ...defaultProps, isAnswerRevealed: true }));
      fireKeyDown('a');
      expect(defaultProps.onIncorrect).toHaveBeenCalledTimes(1);
      fireKeyDown('ArrowLeft');
      expect(defaultProps.onIncorrect).toHaveBeenCalledTimes(2);
    });

    it('does not call onTap', () => {
      renderHook(() => useKeyboardBindings({ ...defaultProps, isAnswerRevealed: true }));
      fireKeyDown('w');
      expect(defaultProps.onTap).not.toHaveBeenCalled();
    });
  });

  describe('when time IS expired', () => {
    it('calls onTimeoutContinue when relevant keys are pressed', () => {
      renderHook(() =>
        useKeyboardBindings({ ...defaultProps, isAnswerRevealed: true, isTimeExpired: true })
      );
      fireKeyDown('d');
      expect(defaultProps.onTimeoutContinue).toHaveBeenCalledTimes(1);
      fireKeyDown('ArrowRight');
      expect(defaultProps.onTimeoutContinue).toHaveBeenCalledTimes(2);
      fireKeyDown(' ');
      expect(defaultProps.onTimeoutContinue).toHaveBeenCalledTimes(3);
      fireKeyDown('Enter');
      expect(defaultProps.onTimeoutContinue).toHaveBeenCalledTimes(4);
    });

    it('does not call onCorrect or onIncorrect', () => {
      renderHook(() =>
        useKeyboardBindings({ ...defaultProps, isAnswerRevealed: true, isTimeExpired: true })
      );
      fireKeyDown('d');
      expect(defaultProps.onCorrect).not.toHaveBeenCalled();
      fireKeyDown('a');
      expect(defaultProps.onIncorrect).not.toHaveBeenCalled();
    });
  });

  it('does nothing when isEnabled is false', () => {
    renderHook(() => useKeyboardBindings({ ...defaultProps, isEnabled: false }));
    fireKeyDown('Enter');
    fireKeyDown('Escape');
    expect(defaultProps.onTap).not.toHaveBeenCalled();
    expect(defaultProps.onReset).not.toHaveBeenCalled();
  });
});
