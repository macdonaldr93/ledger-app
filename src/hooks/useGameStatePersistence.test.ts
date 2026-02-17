import { renderHook, act } from '@testing-library/react';
import {
  useGameStatePersistence,
  GAME_STATE_KEY,
  type PersistedGameState,
} from './useGameStatePersistence';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useGameStatePersistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should load initial state from localStorage', () => {
    const mockState: PersistedGameState = {
      score: { correct: 5, total: 10 },
      noteSelection: {
        note: { name: 'C', octave: 4, diatonicStep: 0 },
        clef: 'treble',
        isAnswerRevealed: false,
      },
      review: {
        incorrectNotes: [],
        reviewQueue: [],
        isReviewMode: false,
      },
    };
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(mockState));

    const { result } = renderHook(() => useGameStatePersistence());
    expect(result.current.initialPersistedState).toEqual(mockState);
  });

  it('should save state with debounce', () => {
    const { result } = renderHook(() => useGameStatePersistence());
    const newState: PersistedGameState = {
      score: { correct: 1, total: 1 },
      noteSelection: {
        note: { name: 'D', octave: 4, diatonicStep: 1 },
        clef: 'treble',
        isAnswerRevealed: true,
      },
      review: {
        incorrectNotes: [],
        reviewQueue: [],
        isReviewMode: false,
      },
    };

    act(() => {
      result.current.saveState(newState);
    });

    // Should not be saved immediately
    expect(localStorage.getItem(GAME_STATE_KEY)).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(JSON.parse(localStorage.getItem(GAME_STATE_KEY)!)).toEqual(newState);
  });
});
