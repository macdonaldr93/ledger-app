import { useState, useEffect, useCallback, useRef } from 'react';

export function useTimer(enabled: boolean, durationSeconds: number, onTimeout: () => void) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const reset = useCallback(() => {
    setTimeLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (timeLeft <= 0) {
      onTimeoutRef.current();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 0.1));
    }, 100);

    return () => clearInterval(timer);
  }, [enabled, timeLeft]);

  const progress = enabled ? (timeLeft / durationSeconds) : 1;

  return {
    timeLeft,
    progress,
    reset,
  };
}
