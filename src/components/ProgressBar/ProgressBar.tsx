import React from 'react';
import clsx from 'clsx';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number;
  isRunning: boolean;
  timeLeft: number;
  visible: boolean;
}

export function ProgressBar({ progress, isRunning, timeLeft, visible }: ProgressBarProps) {
  const style: React.CSSProperties = isRunning
    ? {
        transform: 'scaleX(0)',
        transition: `transform ${timeLeft}s linear`,
      }
    : {
        transform: `scaleX(${progress})`,
        transition: 'none',
      };

  return (
    <div className={clsx(styles.container, visible && styles.active)}>
      <div className={styles.bar} style={style} />
    </div>
  );
}
