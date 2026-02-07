import { describe, it, expect } from 'vitest';
import { calculateEstimatedRadius } from '../math-utils';

describe('calculateEstimatedRadius', () => {
  it('calculates radius R=1 for geometric series a_n = 1', () => {
    // sum x^n -> R=1
    expect(calculateEstimatedRadius('1')).toBe(1);
  });

  it('calculates radius R=1 for alternating harmonic series terms', () => {
    // sum (1/n) x^n -> R=1
    // Ratio: (1/n) / (1/(n+1)) = (n+1)/n -> 1
    expect(calculateEstimatedRadius('1/n')).toBe(1);
  });

  it('calculates radius R=Infinity for exponential series', () => {
    // sum (1/n!) x^n -> e^x -> R=Infinity
    // Ratio: (1/n!) / (1/(n+1)!) = (n+1) -> Infinity
    expect(calculateEstimatedRadius('1/n!')).toBe(Infinity);
  });

  it('calculates radius R=0 for factorial series', () => {
    // sum n! x^n -> R=0
    // Ratio: n! / (n+1)! = 1/(n+1) -> 0
    expect(calculateEstimatedRadius('n!')).toBe(0);
  });

  it('calculates radius R=0.5 for a_n = 2^n', () => {
    // sum 2^n x^n -> geometric with r=2x -> |2x|<1 -> |x|<0.5
    // Ratio: 2^n / 2^(n+1) = 1/2
    expect(calculateEstimatedRadius('2^n')).toBe(0.5);
  });
  
  it('handles invalid formulas gracefully', () => {
    expect(calculateEstimatedRadius('invalid^n')).toBeNull();
    expect(calculateEstimatedRadius('')).toBeNull();
  });
});