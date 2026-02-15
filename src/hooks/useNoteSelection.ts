import { useState, useCallback } from 'react';
import type { Clef, Note, GameSettings } from '../types/musical';
import { getRandomNote } from '../utils/noteUtils';

export function useNoteSelection(settings: GameSettings, height?: number) {
  const generateNote = useCallback(
    (currentSettings: GameSettings): { note: Note; clef: Clef } => {
      const clef: Clef =
        currentSettings.clef === 'both'
          ? Math.random() > 0.5
            ? 'treble'
            : 'bass'
          : currentSettings.clef;

      const maxLedgerLines =
        height && height <= 380
          ? Math.min(currentSettings.maxLedgerLines, 3)
          : currentSettings.maxLedgerLines;

      return {
        note: getRandomNote(clef, maxLedgerLines, currentSettings.onlyLedgerLines),
        clef,
      };
    },
    [height]
  );

  const [gameState, setGameState] = useState(() => generateNote(settings));
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const nextNote = useCallback(() => {
    setGameState(generateNote(settings));
    setIsAnswerRevealed(false);
  }, [generateNote, settings]);

  const setNote = useCallback((note: Note, clef: Clef) => {
    setGameState({ note, clef });
    setIsAnswerRevealed(false);
  }, []);

  const revealAnswer = useCallback(() => {
    setIsAnswerRevealed(true);
  }, []);

  return {
    currentNote: gameState.note,
    currentClef: gameState.clef,
    isAnswerRevealed,
    nextNote,
    setNote,
    revealAnswer,
  };
}
