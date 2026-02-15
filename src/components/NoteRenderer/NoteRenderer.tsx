import type { Note, Clef } from '../../types/musical';
import { useVexFlowRenderer, type VexFlowOptions } from '../../hooks/useVexFlowRenderer';
import styles from './NoteRenderer.module.css';

interface NoteRendererProps extends VexFlowOptions {
  note: Note;
  clef: Clef;
  onClick?: () => void;
}

export function NoteRenderer({ note, clef, onClick, ...options }: NoteRendererProps) {
  const { containerRef } = useVexFlowRenderer(note, clef, options);

  return (
    <button
      className={styles.container}
      onClick={onClick}
      aria-label="Music notation area. Click to reveal answer."
    >
      <div ref={containerRef} className={styles.renderer} aria-hidden="true"></div>
    </button>
  );
}
