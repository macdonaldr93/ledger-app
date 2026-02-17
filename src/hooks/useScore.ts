import { useState, useCallback } from 'react';

export function useScore(initialScore = { correct: 0, total: 0 }) {
  const [score, setScore] = useState(initialScore);

  const incrementCorrect = useCallback(() => {
    setScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
  }, []);

  const incrementTotal = useCallback(() => {
    setScore((prev) => ({ ...prev, total: prev.total + 1 }));
  }, []);

  const resetScore = useCallback(() => {
    setScore({ correct: 0, total: 0 });
  }, []);

  return {
    score,
    incrementCorrect,
    incrementTotal,
    resetScore,
  };
}
