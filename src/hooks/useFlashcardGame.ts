import { useState, useCallback } from 'react';
import type { Clef, Note, GameSettings } from '../types/musical';
import { getRandomNote } from '../utils/noteUtils';

export function useFlashcardGame(initialSettings: GameSettings) {
  const [settings, setSettings] = useState<GameSettings>(initialSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  
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

  const markCorrect = useCallback(() => {
    setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    nextNote();
  }, [nextNote]);

  const markIncorrect = useCallback(() => {
    setScore(prev => ({ ...prev, total: prev.total + 1 }));
    nextNote();
  }, [nextNote]);

  const startGame = useCallback(() => {
    setIsSettingsOpen(false);
    setScore({ correct: 0, total: 0 });
    nextNote();
  }, [nextNote]);

  const resetGame = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    ...gameState,
    settings,
    score,
    isSettingsOpen,
    nextNote,
    revealAnswer,
    markCorrect,
    markIncorrect,
    startGame,
    resetGame,
    updateSettings,
  };
}
