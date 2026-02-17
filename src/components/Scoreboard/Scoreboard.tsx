import { RotateCcw, ListX, Pause } from 'lucide-react';
import clsx from 'clsx';
import styles from './Scoreboard.module.css';

interface ScoreboardProps {
  score: { correct: number; total: number };
  onRestart: () => void;
  canReview: boolean;
  isReviewMode: boolean;
  onReview: () => void;
  onPause: () => void;
}

export function Scoreboard({
  score,
  onRestart,
  canReview,
  isReviewMode,
  onReview,
  onPause,
}: ScoreboardProps) {
  return (
    <div className={styles.header}>
      <div className={styles.score}>
        {score.correct} / {score.total}
      </div>
      <div className={styles.actions}>
        <button
          className={clsx(styles.actionButton, isReviewMode && styles.active)}
          onClick={onReview}
          disabled={!canReview}
          aria-label="Review missed notes"
        >
          <ListX size={24} />
        </button>
        <button className={styles.actionButton} onClick={onPause} aria-label="Pause game">
          <Pause size={24} />
        </button>
        <button className={styles.actionButton} onClick={onRestart} aria-label="Restart game">
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
}
