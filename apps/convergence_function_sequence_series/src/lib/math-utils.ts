import { compile } from 'mathjs';

/**
 * Estimates the radius of convergence for a power series sum(a_n * z^n)
 * using the Ratio Test: R = lim |a_n / a_{n+1}| as n -> infinity.
 * 
 * @param formula The formula for the coefficient a_n (in terms of 'n')
 * @returns The estimated radius, Infinity, or null if invalid
 */
export function calculateEstimatedRadius(formula: string): number | null {
  if (!formula || !formula.trim()) return null;

  try {
    const code = compile(formula);
    // Use a sufficiently large n to approximate the limit
    // We sample two large points to check for stability/convergence behavior
    const n = 10000;
    
    // Evaluate a_n and a_{n+1}
    // We assume real coefficients for standard Analysis 1 examples
    const an = code.evaluate({ n });
    const an_next = code.evaluate({ n: n + 1 });

    // Handle zero denominator (division by zero -> Infinity radius, usually)
    // But if a_n is also zero, it's trivial.
    // Ratio test: |a_n / a_{n+1}|
    
    if (Math.abs(an_next) < 1e-15) {
      // If the next term is 0, the ratio goes to infinity (Radius Infinity)
      // unless an is also 0.
      return Math.abs(an) < 1e-15 ? null : Infinity;
    }

    const ratio = Math.abs(an / an_next);

    // Sanitize results
    if (!isFinite(ratio)) return Infinity;
    if (isNaN(ratio)) return null;

    // Heuristic rounding for cleaner UI (e.g. 0.99999 -> 1)
    if (Math.abs(ratio - Math.round(ratio)) < 0.001) {
      return Math.round(ratio);
    }

    return parseFloat(ratio.toFixed(4));
  } catch (e) {
    // console.error("Error calculating radius:", e);
    return null;
  }
}