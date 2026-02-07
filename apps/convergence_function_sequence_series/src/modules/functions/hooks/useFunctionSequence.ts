import { useMemo } from 'react';
import { compile, EvalFunction } from 'mathjs';

interface UseFunctionSequenceResult {
  fn: (x: number) => number;
  error: string | null;
}

/**
 * Compiles a mathematical formula f(x, n) into a executable JavaScript function.
 * Optimized to only re-compile when the formula string changes.
 * 
 * @param formula string expression like "x^n"
 * @param n current sequence index
 * @returns { fn: (x) => y, error }
 */
export const useFunctionSequence = (formula: string, n: number): UseFunctionSequenceResult => {
  // 1. Compile the code object (expensive part) only when formula changes
  const { code, error } = useMemo(() => {
    if (!formula || !formula.trim()) {
      return { code: null, error: null };
    }
    try {
      const c = compile(formula);
      return { code: c, error: null };
    } catch (e) {
      return { code: null, error: "Invalid syntax" };
    }
  }, [formula]);

  // 2. Return a closure that evaluates using the current 'n' and 'x'
  const fn = useMemo(() => {
    if (!code) return (x: number) => 0;

    return (x: number) => {
      try {
        // Evaluate with x and n in scope
        const res = code.evaluate({ x, n });
        
        // Ensure result is a valid number for plotting
        if (typeof res !== 'number' || isNaN(res) || !isFinite(res)) {
          return NaN;
        }
        
        // Clamp extreme values to avoid rendering glitches
        if (Math.abs(res) > 10000) return NaN;
        
        return res;
      } catch (e) {
        return NaN;
      }
    };
  }, [code, n]);

  return { fn, error };
};
