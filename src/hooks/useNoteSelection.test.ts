import { renderHook, act } from '@testing-library/react';
import { useNoteSelection } from './useNoteSelection';
import type { GameSettings } from '../types/musical';

const settings: GameSettings = {
  clef: 'treble',
  maxLedgerLines: 1,
  onlyLedgerLines: false,
  timeLimitEnabled: false,
  timeLimitSeconds: 10,
};

describe('useNoteSelection', () => {
  it('should initialize with a note and hidden answer', () => {
    const { result } = renderHook(() => useNoteSelection(settings));
    expect(result.current.currentNote).toBeDefined();
    expect(result.current.currentClef).toBe('treble');
    expect(result.current.isAnswerRevealed).toBe(false);
  });

  it('should reveal answer', () => {
    const { result } = renderHook(() => useNoteSelection(settings));
    act(() => {
      result.current.revealAnswer();
    });
    expect(result.current.isAnswerRevealed).toBe(true);
  });

  it('should generate next note and hide answer', () => {
    const { result } = renderHook(() => useNoteSelection(settings));

    act(() => {
      result.current.revealAnswer();
      result.current.nextNote();
    });

    expect(result.current.isAnswerRevealed).toBe(false);
  });

  it('should use bass clef when settings say bass', () => {
    const { result } = renderHook(() => useNoteSelection({ ...settings, clef: 'bass' }));
    expect(result.current.currentClef).toBe('bass');
  });

  it('should pick from both clefs when settings say both', () => {
    const randomSpy = vi.spyOn(Math, 'random');

    randomSpy.mockReturnValue(0.1);
    const { result: res1 } = renderHook(() => useNoteSelection({ ...settings, clef: 'both' }));
    expect(res1.current.currentClef).toBe('bass');

    randomSpy.mockReturnValue(0.9);
    const { result: res2 } = renderHook(() => useNoteSelection({ ...settings, clef: 'both' }));
    expect(res2.current.currentClef).toBe('treble');

    randomSpy.mockRestore();
  });

  it('should constrain max ledger lines if height is 380 or less', () => {
    const manyLedgerLines: GameSettings = { ...settings, maxLedgerLines: 6 };

    // Height 300 (constrained)
    const { result: res1 } = renderHook(() => useNoteSelection(manyLedgerLines, 300));

    // We can't easily check the internal state of getRandomNote call without spying
    // but we can check if the generated note is within the constrained range.
    // Max step for treble with 3 ledger lines is 10 + 3*2 = 16.
    // With 6 ledger lines it would be 10 + 6*2 = 22.

    for (let i = 0; i < 50; i++) {
      act(() => {
        res1.current.nextNote();
      });
      expect(res1.current.currentNote.diatonicStep).toBeLessThanOrEqual(16);
      expect(res1.current.currentNote.diatonicStep).toBeGreaterThanOrEqual(-4);
    }

    // Height 500 (not constrained)
    const { result: res2 } = renderHook(() => useNoteSelection(manyLedgerLines, 500));
    let sawHighNote = false;
    for (let i = 0; i < 100; i++) {
      act(() => {
        res2.current.nextNote();
      });
      if (res2.current.currentNote.diatonicStep > 16) {
        sawHighNote = true;
        break;
      }
    }
    expect(sawHighNote).toBe(true);
  });

  it('should initialize with provided state', () => {
    const initialState = {
      note: { name: 'G' as const, octave: 4, diatonicStep: 4 },
      clef: 'treble' as const,
      isAnswerRevealed: true,
    };
    const { result } = renderHook(() => useNoteSelection(settings, undefined, initialState));

    expect(result.current.currentNote).toEqual(initialState.note);
    expect(result.current.currentClef).toBe(initialState.clef);
    expect(result.current.isAnswerRevealed).toBe(true);
  });
});
