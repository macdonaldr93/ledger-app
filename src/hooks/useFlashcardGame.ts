import { useState, useCallback } from 'react';
import type { Clef, Note, GameSettings } from '../types/musical';
import { getRandomNote } from '../utils/noteUtils';

export function useFlashcardGame(initialSettings: GameSettings) {
  const [settings, setSettings] = useState<GameSettings>(initialSettings);
  
  const generateNote = useCallback((currentSettings: GameSettings): { note: Note, clef: Clef } => {
    const clef: Clef = currentSettings.clef === 'both' 
      ? (Math.random() > 0.5 ? 'treble' : 'bass') 
      : currentSettings.clef;
    
    return {
      note: getRandomNote(clef, currentSettings.maxLedgerLines, currentSettings.onlyLedgerLines),
      clef
    };
  }, []);

  const [gameState, setGameState] = useState(() => {
    const { note, clef } = generateNote(initialSettings);
    return {
      currentNote: note,
      currentClef: clef,
      isAnswerRevealed: false,
    };
  });

  const nextNote = useCallback(() => {
    setGameState(() => {
      const { note, clef } = generateNote(settings);
      return {
        currentNote: note,
        currentClef: clef,
        isAnswerRevealed: false,
      };
    });
  }, [generateNote, settings]);

  const revealAnswer = useCallback(() => {
    setGameState(prev => ({ ...prev, isAnswerRevealed: true }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      // If clef or difficulty changed, might want to generate a new note immediately
      // but usually we wait for the next note.
      return updated;
    });
  }, []);

  return {
    ...gameState,
    settings,
    nextNote,
    revealAnswer,
    updateSettings,
  };
}
