import { useCallback, useState } from 'react';
import type { GameSettings } from '../types/musical';
import { useScore } from './useScore';
import { useSettings } from './useSettings';
import { useNoteSelection } from './useNoteSelection';
import { useTimer } from './useTimer';

export function useFlashcardGame(initialSettings: GameSettings) {
  const { settings, isSettingsOpen, updateSettings, openSettings, closeSettings } = useSettings(initialSettings);
  const { score, incrementCorrect, incrementTotal, resetScore } = useScore();
  const { currentNote, currentClef, isAnswerRevealed, nextNote, revealAnswer } = useNoteSelection(settings);
  const [isTimeExpired, setIsTimeExpired] = useState(false);

  const handleTimeout = useCallback(() => {
    revealAnswer();
    setIsTimeExpired(true);
  }, [revealAnswer]);

  const { progress, reset: resetTimer } = useTimer(
    settings.timeLimitEnabled && !isAnswerRevealed && !isSettingsOpen,
    settings.timeLimitSeconds,
    handleTimeout
  );

  const handleNextNote = useCallback(() => {
    nextNote();
    setIsTimeExpired(false);
    resetTimer();
  }, [nextNote, resetTimer]);

  const markCorrect = useCallback(() => {
    incrementCorrect();
    handleNextNote();
  }, [incrementCorrect, handleNextNote]);

  const markIncorrect = useCallback(() => {
    incrementTotal();
    handleNextNote();
  }, [incrementTotal, handleNextNote]);

  const handleTimeoutContinue = useCallback(() => {
    incrementTotal();
    handleNextNote();
  }, [incrementTotal, handleNextNote]);

  const startGame = useCallback(() => {
    closeSettings();
    resetScore();
    handleNextNote();
  }, [closeSettings, resetScore, handleNextNote]);

  const resetGame = useCallback(() => {
    openSettings();
  }, [openSettings]);

  return {
    currentNote,
    currentClef,
    isAnswerRevealed,
    isTimeExpired,
    timerProgress: progress,
    settings,
    score,
    isSettingsOpen,
    nextNote: handleNextNote,
    revealAnswer,
    markCorrect,
    markIncorrect,
    handleTimeoutContinue,
    startGame,
    resetGame,
    updateSettings,
  };
}
