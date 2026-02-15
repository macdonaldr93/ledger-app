import React from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import styles from './InteractionArea.module.css';

interface InteractionAreaProps {
  children: React.ReactNode;
  isAnswerRevealed: boolean;
  isTimeExpired?: boolean;
  answer: string;
  onTap: () => void;
  onCorrect: () => void;
  onIncorrect: () => void;
  onTimeoutContinue?: () => void;
}

export const InteractionArea: React.FC<InteractionAreaProps> = ({ 
  children, 
  isAnswerRevealed, 
  isTimeExpired,
  answer, 
  onTap,
  onCorrect,
  onIncorrect,
  onTimeoutContinue
}) => {
  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div className={styles.wrapper} onClick={onTap}>
      <div className={styles.displayArea}>
        {children}
      </div>
      <div className={styles.feedbackArea}>
        {isAnswerRevealed ? (
          <div className={styles.feedbackControls}>
            {isTimeExpired ? (
              <>
                <div style={{ width: 48 }} /> {/* Spacer */}
                <div className={styles.answer}>{answer}</div>
                <button 
                  className={`${styles.feedbackButton} ${styles.right}`} 
                  onClick={(e) => handleAction(e, onTimeoutContinue || (() => {}))}
                  aria-label="Continue"
                >
                  <ArrowRight size={32} />
                </button>
              </>
            ) : (
              <>
                <button 
                  className={`${styles.feedbackButton} ${styles.wrong}`} 
                  onClick={(e) => handleAction(e, onIncorrect)}
                  aria-label="Incorrect"
                >
                  <X size={32} />
                </button>
                <div className={styles.answer}>{answer}</div>
                <button 
                  className={`${styles.feedbackButton} ${styles.right}`} 
                  onClick={(e) => handleAction(e, onCorrect)}
                  aria-label="Correct"
                >
                  <Check size={32} />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={styles.prompt}>Tap to reveal</div>
        )}
      </div>
    </div>
  );
};
