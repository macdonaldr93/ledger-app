import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import type { Note, Clef } from '../types/musical';

export const GAME_STATE_KEY = 'ledger-game-v1';

export interface PersistedGameState {
  score: { correct: number; total: number };
  noteSelection: {
    note: Note;
    clef: Clef;
    isAnswerRevealed: boolean;
  };
  review: {
    incorrectNotes: { note: Note; clef: Clef }[];
    reviewQueue: { note: Note; clef: Clef }[];
    isReviewMode: boolean;
  };
}

export function useGameStatePersistence() {
  const [initialPersistedState] = useState<PersistedGameState | null>(() => {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse saved game state', err);
      }
    }
    return null;
  });

  const debouncedSave = useMemo(
    () =>
      debounce(
        (state: PersistedGameState) => {
          localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
        },
        1000,
        { maxWait: 5000, trailing: true }
      ),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return {
    initialPersistedState,
    saveState: debouncedSave,
    flushSave: debouncedSave.flush,
  };
}
