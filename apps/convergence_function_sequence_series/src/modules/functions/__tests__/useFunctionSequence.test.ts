import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFunctionSequence } from '../hooks/useFunctionSequence';

describe('useFunctionSequence', () => {
  it('evaluates x^n correctly', () => {
    const { result } = renderHook(() => 
      useFunctionSequence('x^n', 2)
    );
    
    const { fn, error } = result.current;
    expect(error).toBeNull();
    expect(fn(2)).toBe(4); // 2^2
    expect(fn(3)).toBe(9); // 3^2
  });

  it('updates evaluation when n changes', () => {
    const { result, rerender } = renderHook(
      ({ formula, n }) => useFunctionSequence(formula, n),
      { initialProps: { formula: 'x + n', n: 1 } }
    );
    
    expect(result.current.fn(1)).toBe(2); // 1 + 1

    // Change n to 10
    rerender({ formula: 'x + n', n: 10 });
    expect(result.current.fn(1)).toBe(11); // 1 + 10
  });

  it('handles invalid syntax gracefully', () => {
    const { result } = renderHook(() => 
      useFunctionSequence('x ^^ n', 1)
    );
    
    expect(result.current.error).toBe("Invalid syntax");
    expect(result.current.fn(1)).toBe(0); // Safe fallback
  });

  it('returns NaN for undefined operations', () => {
    const { result } = renderHook(() => 
      useFunctionSequence('1/x', 1)
    );
    
    // 1/0 is Infinity -> clamped/filtered to NaN by our hook
    expect(result.current.fn(0)).toBeNaN(); 
  });
});
