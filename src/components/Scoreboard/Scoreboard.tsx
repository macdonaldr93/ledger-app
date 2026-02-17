import { RotateCcw, ListX } from 'lucide-react';
import clsx from 'clsx';
import styles from './Scoreboard.module.css';

interface ScoreboardProps {
  score: { correct: number; total: number };
  onReset: () => void;
  canReview: boolean;
  isReviewMode: boolean;
  onReview: () => void;
  reviewCount: number;
}

export function Scoreboard({
  score,
  onReset,
  canReview,
  isReviewMode,
  onReview,
  reviewCount,
}: ScoreboardProps) {
  return (
    <div className={styles.header}>
      <div className={styles.score}>
        {score.correct} / {score.total}
      </div>
      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={onReset} aria-label="Reset game">
          <RotateCcw size={24} />
        </button>
        <button
          className={clsx(styles.actionButton, isReviewMode && styles.active)}
          onClick={onReview}
          disabled={!canReview}
          aria-label="Review missed notes"
        >
          <ListX size={24} />
          {reviewCount > 0 && <span className={styles.badge}>{reviewCount}</span>}
        </button>
      </div>
    </div>
  );
}
