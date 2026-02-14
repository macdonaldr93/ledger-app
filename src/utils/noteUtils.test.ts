import { describe, it, expect } from 'vitest';
import { getDiatonicStep, fromDiatonicStep, getRandomNote, getStemDirection } from './noteUtils';

describe('noteUtils', () => {
  it('should correctly calculate diatonic step', () => {
    expect(getDiatonicStep({ name: 'C', octave: 4 })).toBe(0);
    expect(getDiatonicStep({ name: 'D', octave: 4 })).toBe(1);
    expect(getDiatonicStep({ name: 'C', octave: 5 })).toBe(7);
    expect(getDiatonicStep({ name: 'B', octave: 3 })).toBe(-1);
  });

  it('should correctly convert step to note', () => {
    expect(fromDiatonicStep(0)).toEqual({ name: 'C', octave: 4 });
    expect(fromDiatonicStep(1)).toEqual({ name: 'D', octave: 4 });
    expect(fromDiatonicStep(7)).toEqual({ name: 'C', octave: 5 });
    expect(fromDiatonicStep(-1)).toEqual({ name: 'B', octave: 3 });
  });

  it('should generate notes within range for treble clef', () => {
    const maxLedgerLines = 1;
    // Treble range with 1 ledger line: C4 (0) to A5 (12)
    for (let i = 0; i < 100; i++) {
      const note = getRandomNote('treble', maxLedgerLines);
      const step = getDiatonicStep(note);
      expect(step).toBeGreaterThanOrEqual(0);
      expect(step).toBeLessThanOrEqual(12);
    }
  });

  it('should generate notes within range for bass clef', () => {
    const maxLedgerLines = 1;
    // Bass range with 1 ledger line: E2 (-12) to C4 (0)
    for (let i = 0; i < 100; i++) {
      const note = getRandomNote('bass', maxLedgerLines);
      const step = getDiatonicStep(note);
      expect(step).toBeGreaterThanOrEqual(-12);
      expect(step).toBeLessThanOrEqual(0);
    }
  });

  it('should correctly calculate stem direction', () => {
    // Treble: Middle line is B4 (step 6)
    expect(getStemDirection({ name: 'A', octave: 4 }, 'treble')).toBe('up');
    expect(getStemDirection({ name: 'B', octave: 4 }, 'treble')).toBe('down');
    expect(getStemDirection({ name: 'C', octave: 5 }, 'treble')).toBe('down');

    // Bass: Middle line is D3 (step -6)
    expect(getStemDirection({ name: 'C', octave: 3 }, 'bass')).toBe('up');
    expect(getStemDirection({ name: 'D', octave: 3 }, 'bass')).toBe('down');
    expect(getStemDirection({ name: 'E', octave: 3 }, 'bass')).toBe('down');
  });

  it('should generate only ledger lines when requested', () => {
    const maxLedgerLines = 2;
    // Treble: staff is 2 to 10
    for (let i = 0; i < 100; i++) {
      const note = getRandomNote('treble', maxLedgerLines, true);
      const step = getDiatonicStep(note);
      const isOutside = step < 2 || step > 10;
      expect(isOutside).toBe(true);
    }

    // Bass: staff is -10 to -2
    for (let i = 0; i < 100; i++) {
      const note = getRandomNote('bass', maxLedgerLines, true);
      const step = getDiatonicStep(note);
      const isOutside = step < -10 || step > -2;
      expect(isOutside).toBe(true);
    }
  });
});
