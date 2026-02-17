import { renderHook, act } from '@testing-library/react';
import { useGameTimer } from './useGameTimer';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useGameTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default values', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() => useGameTimer(false, 10, false, onTimeout));

    expect(result.current.isTimeExpired).toBe(false);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.timeLeft).toBe(10);
  });

  it('should start running when enabled and not paused', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() => useGameTimer(true, 10, false, onTimeout));

    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // timeLeft doesn't update in the hook's return value unless it's stopped/paused
    // because useTimer only updates it then. Wait, let's verify useTimer behavior.
  });

  it('should trigger timeout', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() => useGameTimer(true, 10, false, onTimeout));

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(onTimeout).toHaveBeenCalled();
    expect(result.current.isTimeExpired).toBe(true);
  });

  it('should reset timer', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() => useGameTimer(true, 10, false, onTimeout));

    act(() => {
      vi.advanceTimersByTime(5000);
      result.current.resetTimer();
    });

    expect(result.current.isTimeExpired).toBe(false);

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });
});
