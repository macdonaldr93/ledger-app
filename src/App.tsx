import { RotateCcw } from 'lucide-react';
import { useFlashcardGame } from './hooks/useFlashcardGame';
import { NoteRenderer } from './components/NoteRenderer/NoteRenderer';
import { InteractionArea } from './components/InteractionArea/InteractionArea';
import { Settings } from './components/Settings/Settings';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import styles from './App.module.css';

function App() {
  const {
    currentNote,
    currentClef,
    isAnswerRevealed,
    isTimeExpired,
    timerProgress,
    settings,
    score,
    isSettingsOpen,
    revealAnswer,
    markCorrect,
    markIncorrect,
    handleTimeoutContinue,
    startGame,
    resetGame,
    updateSettings
  } = useFlashcardGame({
    clef: 'treble',
    maxLedgerLines: 1,
    onlyLedgerLines: false,
    timeLimitEnabled: false,
    timeLimitSeconds: 10,
  });

  const handleTap = () => {
    if (!isAnswerRevealed) {
      revealAnswer();
    }
  };

  return (
    <div className={styles.app}>
      <ProgressBar 
        progress={timerProgress} 
        visible={settings.timeLimitEnabled && !isSettingsOpen && !isAnswerRevealed} 
      />
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.score}>
            {score.correct} / {score.total}
          </div>
          <button className={styles.restartButton} onClick={resetGame} aria-label="Settings">
            <RotateCcw size={24} />
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <InteractionArea
          isAnswerRevealed={isAnswerRevealed}
          isTimeExpired={isTimeExpired}
          answer={currentNote.name}
          onTap={handleTap}
          onCorrect={markCorrect}
          onIncorrect={markIncorrect}
          onTimeoutContinue={handleTimeoutContinue}
        >
          <NoteRenderer note={currentNote} clef={currentClef} />
        </InteractionArea>
      </main>

      <Settings 
        settings={settings} 
        onUpdate={updateSettings} 
        onStart={startGame}
        isOpen={isSettingsOpen}
      />
    </div>
  );
}

export default App;
