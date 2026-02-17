import { useCallback, useRef, useEffect, useState } from 'react';
import { useTimer } from './useTimer';

export function useGameTimer(
  timeLimitEnabled: boolean,
  timeLimitSeconds: number,
  isPaused: boolean,
  onTimeout: () => void
) {
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const resetTimerRef = useRef<() => void>(() => {});

  const handleTimeout = useCallback(() => {
    onTimeout();
    setIsTimeExpired(true);
    resetTimerRef.current();
  }, [onTimeout]);

  const {
    progress,
    isRunning,
    timeLeft,
    reset: resetTimer,
  } = useTimer(timeLimitEnabled && !isPaused, timeLimitSeconds, handleTimeout);

  useEffect(() => {
    resetTimerRef.current = resetTimer;
  }, [resetTimer]);

  const resetGameTimer = useCallback(() => {
    setIsTimeExpired(false);
    resetTimer();
  }, [resetTimer]);

  return {
    isTimeExpired,
    setIsTimeExpired,
    progress,
    isRunning,
    timeLeft,
    resetTimer: resetGameTimer,
  };
}
