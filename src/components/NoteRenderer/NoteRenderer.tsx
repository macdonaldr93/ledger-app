import React, { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Formatter, Voice } from 'vexflow';
import type { Note, Clef } from '../../types/musical';
import { getStemDirection } from '../../utils/noteUtils';
import styles from './NoteRenderer.module.css';

interface NoteRendererProps {
  note: Note;
  clef: Clef;
}

export const NoteRenderer: React.FC<NoteRendererProps> = ({ note, clef }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous rendering
    containerRef.current.innerHTML = '';

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    
    // Size the renderer
    const width = 450;
    const height = 300;
    renderer.resize(width, height);
    
    const context = renderer.getContext();
    // Scaling to make it even larger
    context.scale(1.5, 1.5);
    
    // Create a stave at position (10, 40)
    // Adjust stave position for scaling
    const stave = new Stave(20, 40, 250);
    stave.addClef(clef);
    stave.setContext(context).draw();

    // Create the note
    const keys = [`${note.name}/${note.octave}`];
    const stemDirection = getStemDirection(note, clef) === 'up' ? 1 : -1;
    
    const staveNote = new StaveNote({
      clef: clef,
      keys: keys,
      duration: 'q',
      stemDirection: stemDirection,
    });

    if (note.accidental) {
      staveNote.addModifier(new (Renderer.Backends.SVG as any).Accidental(note.accidental));
    }

    // Create a voice in 4/4 and add the note
    const voice = new Voice({ numBeats: 1, beatValue: 4 });
    voice.addTickables([staveNote]);

    // Format and justify the notes to 200 pixels.
    new Formatter().joinVoices([voice]).format([voice], 200);

    // Render voice
    voice.draw(context, stave);

  }, [note, clef]);

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.renderer}></div>
    </div>
  );
};
