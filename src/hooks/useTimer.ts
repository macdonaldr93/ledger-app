import { useState, useEffect, useCallback, useRef } from 'react';

export function useTimer(enabled: boolean, durationSeconds: number, onTimeout: () => void) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const reset = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    startTimeRef.current = null;
    setTimeLeft(durationSeconds);
    setIsRunning(false);
  }, [durationSeconds]);

  useEffect(() => {
    if (enabled && timeLeft > 0) {
      setIsRunning(true);
      startTimeRef.current = performance.now();
      
      timeoutRef.current = window.setTimeout(() => {
        setTimeLeft(0);
        setIsRunning(false);
        onTimeoutRef.current();
      }, timeLeft * 1000);
    } else {
      if (isRunning && startTimeRef.current !== null) {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        setTimeLeft((prev) => Math.max(0, prev - elapsed));
      }
      setIsRunning(false);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled]);

  const progress = timeLeft / durationSeconds;

  return {
    timeLeft,
    progress,
    isRunning,
    durationSeconds,
    reset,
  };
}
