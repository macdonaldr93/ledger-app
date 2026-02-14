import { useFlashcardGame } from './hooks/useFlashcardGame';
import { NoteRenderer } from './components/NoteRenderer/NoteRenderer';
import { InteractionArea } from './components/InteractionArea/InteractionArea';
import { Settings } from './components/Settings/Settings';
import styles from './App.module.css';

function App() {
  const {
    currentNote,
    currentClef,
    isAnswerRevealed,
    settings,
    nextNote,
    revealAnswer,
    updateSettings
  } = useFlashcardGame({
    clef: 'treble',
    maxLedgerLines: 1,
    onlyLedgerLines: false,
  });

  const handleTap = () => {
    if (isAnswerRevealed) {
      nextNote();
    } else {
      revealAnswer();
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Sight Reader</h1>
      </header>

      <main className={styles.main}>
        <InteractionArea
          isAnswerRevealed={isAnswerRevealed}
          answer={currentNote.name}
          onTap={handleTap}
        >
          <NoteRenderer note={currentNote} clef={currentClef} />
        </InteractionArea>
      </main>

      <footer className={styles.footer}>
        <Settings settings={settings} onUpdate={updateSettings} />
      </footer>
    </div>
  );
}

export default App;
