import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number;
  visible: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, visible }) => {
  if (!visible) return <div className={styles.container} />;

  return (
    <div className={styles.container}>
      <div 
        className={styles.bar} 
        style={{ width: `${progress * 100}%` }} 
      />
    </div>
  );
};
