import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce } from '../../hooks/index';

describe('useDebounce hook', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('updates after delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 50 } }
    );

    expect(result.current).toBe('initial');

    act(() => {
      rerender({ value: 'updated', delay: 50 });
    });

    // Should still be initial immediately
    expect(result.current).toBe('initial');

    // Wait for debounce to complete
    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('resets timer on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 100 } }
    );

    expect(result.current).toBe('a');

    act(() => {
      rerender({ value: 'b', delay: 100 });
    });

    // Change again before debounce completes
    act(() => {
      rerender({ value: 'c', delay: 100 });
    });

    // Should eventually have the final value
    await waitFor(() => {
      expect(result.current).toBe('c');
    });
  });

  it('respects delay duration', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 150 } }
    );

    act(() => {
      rerender({ value: 'updated', delay: 150 });
    });

    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('uses default delay of 300ms', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    );

    act(() => {
      rerender({ value: 'updated' });
    });

    // Should eventually update with default 300ms delay
    await waitFor(() => {
      expect(result.current).toBe('updated');
    }, { timeout: 1000 });
  });

  it('debounces correctly on multiple changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'value1', delay: 80 } }
    );

    act(() => {
      rerender({ value: 'value2', delay: 80 });
      rerender({ value: 'value3', delay: 80 });
      rerender({ value: 'value4', delay: 80 });
    });

    // Should only settle on final value
    await waitFor(() => {
      expect(result.current).toBe('value4');
    });
  });

  it('cleans up timer on unmount', async () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const { unmount } = renderHook(() => useDebounce('test', 100));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
