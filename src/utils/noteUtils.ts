import type { Clef, Note, NoteName } from '../types/musical';

const NOTE_NAMES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 * Diatonic step mapping where C4 = 0
 */
export function getDiatonicStep(note: Note): number {
  const nameIndex = NOTE_NAMES.indexOf(note.name);
  return (note.octave - 4) * 7 + nameIndex;
}

export function fromDiatonicStep(step: number): Note {
  const octave = Math.floor(step / 7) + 4;
  const nameIndex = ((step % 7) + 7) % 7;
  return {
    name: NOTE_NAMES[nameIndex],
    octave,
  };
}

export function getStemDirection(note: Note, clef: Clef): 'up' | 'down' {
  const step = getDiatonicStep(note);
  const middleLineStep = clef === 'treble' ? 6 : -6;
  return step >= middleLineStep ? 'down' : 'up';
}

export function getRandomNote(clef: Clef, maxLedgerLines: number, onlyLedgerLines: boolean = false): Note {
  let minStep: number;
  let maxStep: number;

  if (clef === 'treble') {
    // Bottom line is E4 (step 2)
    // Top line is F5 (step 10)
    minStep = 2 - (maxLedgerLines * 2);
    maxStep = 10 + (maxLedgerLines * 2);
  } else {
    // Bottom line is G2 (step -10)
    // Top line is A3 (step -2)
    minStep = -10 - (maxLedgerLines * 2);
    maxStep = -2 + (maxLedgerLines * 2);
  }

  let possibleSteps: number[] = [];
  for (let i = minStep; i <= maxStep; i++) {
    if (onlyLedgerLines) {
      if (clef === 'treble') {
        if (i < 2 || i > 10) possibleSteps.push(i);
      } else {
        if (i < -10 || i > -2) possibleSteps.push(i);
      }
    } else {
      possibleSteps.push(i);
    }
  }

  // Fallback if no steps match (shouldn't happen with reasonable maxLedgerLines)
  if (possibleSteps.length === 0) {
    possibleSteps = [minStep, maxStep];
  }

  const randomStep = possibleSteps[Math.floor(Math.random() * possibleSteps.length)];
  return fromDiatonicStep(randomStep);
}

export function noteToString(note: Note): string {
  return `${note.name}${note.accidental || ''}${note.octave}`;
}
