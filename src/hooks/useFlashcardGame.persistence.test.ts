import { renderHook, act } from '@testing-library/react';
import { useFlashcardGame } from './useFlashcardGame';
import type { GameSettings } from '../types/musical';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const initialSettings: GameSettings = {
  clef: 'treble',
  maxLedgerLines: 1,
  onlyLedgerLines: false,
  timeLimitEnabled: false,
  timeLimitSeconds: 10,
};

describe('useFlashcardGame persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should save state to localStorage when changes occur (debounced)', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useFlashcardGame(initialSettings));

    act(() => {
      result.current.startGame();
    });

    // Advance to trigger initial save after startGame
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const savedState = JSON.parse(localStorage.getItem('ledger-game-v1') || '{}');
    expect(savedState).toHaveProperty('score');

    act(() => {
      result.current.markCorrect();
    });

    // Verify it's not saved immediately (should still have the state from startGame)
    const immediateState = JSON.parse(localStorage.getItem('ledger-game-v1') || '{}');
    expect(immediateState.score.correct).toBe(0);

    // Advance to trigger debounced save after markCorrect
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const updatedState = JSON.parse(localStorage.getItem('ledger-game-v1') || '{}');
    expect(updatedState.score.correct).toBe(1);
    vi.useRealTimers();
  });

  it('should flush save to localStorage on visibilitychange hidden', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useFlashcardGame(initialSettings));

    act(() => {
      result.current.startGame();
      vi.advanceTimersByTime(1000); // Initial save
    });

    act(() => {
      result.current.markCorrect();
    });

    // Verify it's not saved immediately (debounce)
    const stateBeforeFlush = JSON.parse(localStorage.getItem('ledger-game-v1') || '{}');
    expect(stateBeforeFlush.score.correct).toBe(0);

    act(() => {
      // Mock visibilityState
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
      window.dispatchEvent(new Event('visibilitychange'));
    });

    const stateAfterFlush = JSON.parse(localStorage.getItem('ledger-game-v1') || '{}');
    expect(stateAfterFlush.score.correct).toBe(1);
    vi.useRealTimers();
  });

  it('should restore state from localStorage on initialization', () => {
    const mockState = {
      score: { correct: 5, total: 10 },
      noteSelection: {
        note: { name: 'C', octave: 4, diatonicStep: 0 },
        clef: 'treble',
        isAnswerRevealed: true,
      },
      review: {
        incorrectNotes: [{ note: { name: 'D', octave: 4, diatonicStep: 1 }, clef: 'treble' }],
        reviewQueue: [],
        isReviewMode: false,
      },
    };

    localStorage.setItem('ledger-game-v1', JSON.stringify(mockState));

    const { result } = renderHook(() => useFlashcardGame(initialSettings));

    expect(result.current.score).toEqual({ correct: 5, total: 10 });
    expect(result.current.currentNote).toEqual({ name: 'C', octave: 4, diatonicStep: 0 });
    expect(result.current.isAnswerRevealed).toBe(true);
    expect(result.current.canReview).toBe(true);
  });

  it('should handle review mode persistence', () => {
    const mockState = {
      score: { correct: 0, total: 0 },
      noteSelection: {
        note: { name: 'E', octave: 4, diatonicStep: 2 },
        clef: 'treble',
        isAnswerRevealed: false,
      },
      review: {
        incorrectNotes: [],
        reviewQueue: [{ note: { name: 'C', octave: 4, diatonicStep: 0 }, clef: 'treble' }],
        isReviewMode: true,
      },
    };

    localStorage.setItem('ledger-game-v1', JSON.stringify(mockState));

    const { result } = renderHook(() => useFlashcardGame(initialSettings));

    expect(result.current.isReviewMode).toBe(true);
    expect(result.current.reviewQueueSize).toBe(1);
    // Note selection hook initializes with provided note
    expect(result.current.currentNote.name).toBe('E');
  });

  it('should start in paused state when persisted state exists', () => {
    const mockState = {
      score: { correct: 0, total: 0 },
      noteSelection: {
        note: { name: 'E', octave: 4, diatonicStep: 2 },
        clef: 'treble',
        isAnswerRevealed: false,
      },
      review: {
        incorrectNotes: [],
        reviewQueue: [],
        isReviewMode: false,
      },
    };

    localStorage.setItem('ledger-game-v1', JSON.stringify(mockState));

    const { result } = renderHook(() => useFlashcardGame(initialSettings));
    expect(result.current.isPaused).toBe(true);
    expect(result.current.isSettingsOpen).toBe(false);

    act(() => {
      result.current.resumeGame();
    });
    expect(result.current.isPaused).toBe(false);
  });
});
