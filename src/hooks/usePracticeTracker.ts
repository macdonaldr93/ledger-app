import { useEffect, useRef } from 'react';
import { useLocalStorage, useInterval } from 'react-use';
import { format, startOfWeek, isAfter, parseISO, isSameDay } from 'date-fns';

const STORAGE_KEY = 'ledger-practice-data';

export function usePracticeTracker(isActive: boolean) {
  const [practiceData, setPracticeData] = useLocalStorage<Record<string, number>>(STORAGE_KEY, {});
  const sessionStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      if (sessionStartTimeRef.current === null) {
        sessionStartTimeRef.current = Date.now();
      }
    } else {
      if (sessionStartTimeRef.current !== null) {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - sessionStartTimeRef.current) / 1000);
        const today = format(new Date(), 'yyyy-MM-dd');

        if (elapsedSeconds > 0) {
          setPracticeData((prev = {}) => ({
            ...prev,
            [today]: (prev[today] || 0) + elapsedSeconds,
          }));
        }
        sessionStartTimeRef.current = null;
      }
    }
  }, [isActive, setPracticeData]);

  useInterval(
    () => {
      if (isActive && sessionStartTimeRef.current !== null) {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - sessionStartTimeRef.current) / 1000);
        const today = format(new Date(), 'yyyy-MM-dd');

        if (elapsedSeconds > 0) {
          setPracticeData((prev = {}) => ({
            ...prev,
            [today]: (prev[today] || 0) + elapsedSeconds,
          }));
          sessionStartTimeRef.current = now;
        }
      }
    },
    isActive ? 10000 : null
  );

  const totalSeconds = Object.values(practiceData || {}).reduce((a, b) => a + b, 0);

  const startOfThisWeek = startOfWeek(new Date());

  const thisWeekSeconds = Object.entries(practiceData || {}).reduce((acc, [dateStr, seconds]) => {
    try {
      const date = parseISO(dateStr);
      if (isAfter(date, startOfThisWeek) || isSameDay(date, startOfThisWeek)) {
        return acc + seconds;
      }
    } catch (e) {
      console.error('Error parsing date in practice data', e);
    }
    return acc;
  }, 0);

  return {
    totalSeconds,
    thisWeekSeconds,
  };
}
