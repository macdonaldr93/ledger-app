import React from 'react';
import styles from './InteractionArea.module.css';

interface InteractionAreaProps {
  children: React.ReactNode;
  isAnswerRevealed: boolean;
  answer: string;
  onTap: () => void;
}

export const InteractionArea: React.FC<InteractionAreaProps> = ({ 
  children, 
  isAnswerRevealed, 
  answer, 
  onTap 
}) => {
  return (
    <div className={styles.wrapper} onClick={onTap}>
      <div className={styles.displayArea}>
        {children}
      </div>
      <div className={styles.feedbackArea}>
        {isAnswerRevealed ? (
          <div className={styles.answer}>{answer}</div>
        ) : (
          <div className={styles.prompt}>Tap to reveal</div>
        )}
      </div>
    </div>
  );
};
