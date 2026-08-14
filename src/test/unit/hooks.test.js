import { describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@shared/hooks';

describe('useDebounce', () => {
  it('updates only after the configured delay', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });
    rerender({ value: 'ab' });
    expect(result.current).toBe('a');
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('ab');
    vi.useRealTimers();
  });
});
