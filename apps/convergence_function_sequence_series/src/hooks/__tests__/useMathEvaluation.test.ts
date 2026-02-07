import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMathEvaluation } from '../useMathEvaluation';

describe('useMathEvaluation', () => {
  it('evaluates a simple quadratic formula correctly', () => {
    const { result } = renderHook(() => 
      useMathEvaluation('n^2', 'n', [1, 2, 3])
    );
    
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual([
      { input: 1, output: 1 },
      { input: 2, output: 4 },
      { input: 3, output: 9 }
    ]);
  });

  it('handles invalid syntax gracefully', () => {
    const { result } = renderHook(() => 
      useMathEvaluation('n^^2', 'n', [1, 2, 3])
    );
    
    expect(result.current.error).toBe("Invalid syntax");
    expect(result.current.data).toEqual([]);
  });

  it('handles division by zero as null (Infinity)', () => {
    const { result } = renderHook(() => 
      useMathEvaluation('1/n', 'n', [0, 1])
    );
    
    expect(result.current.error).toBeNull();
    expect(result.current.data[0]).toEqual({ input: 0, output: null });
    expect(result.current.data[1]).toEqual({ input: 1, output: 1 });
  });

  it('handles empty input', () => {
    const { result } = renderHook(() => 
      useMathEvaluation('', 'n', [1, 2])
    );
    
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual([]);
  });
});