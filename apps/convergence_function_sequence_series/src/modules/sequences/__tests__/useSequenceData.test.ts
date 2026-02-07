import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSequenceData } from '../hooks/useSequenceData';

describe('useSequenceData', () => {
  it('correctly identifies points inside epsilon environment', () => {
    // Sequence 1/n, Limit 0, Epsilon 0.2
    // 1/1=1 (>0.2), 1/2=0.5 (>0.2), 1/3=0.33, 1/4=0.25, 1/5=0.2 (fail if < strict), 1/6=0.16 (pass)
    const { result } = renderHook(() => 
      useSequenceData('1/n', 0, 0.2, 5) // N=5
    );
    
    expect(result.current.error).toBeNull();
    const data = result.current.data;
    
    // n=1, <= N=5, should be neutral
    expect(data[0].input).toBe(1);
    expect(data[0].status).toBe('neutral');

    // n=6, > N=5, 1/6 = 0.166 < 0.2, should be success
    expect(data[5].input).toBe(6);
    expect(data[5].status).toBe('success');
  });

  it('detects divergence when points > N are outside tube', () => {
    // Sequence 1/n, Limit 0, Epsilon 0.1, N=2
    // n=3 is 0.33 > 0.1 (Outside!) -> Danger
    const { result } = renderHook(() => 
      useSequenceData('1/n', 0, 0.1, 2)
    );

    expect(result.current.isConvergent).toBe(false);
    
    // n=3 (index 2)
    const p3 = result.current.data[2];
    expect(p3.input).toBe(3);
    expect(p3.status).toBe('danger');
  });

  it('reports convergence when all points > N are inside tube', () => {
    // Sequence 1/n, Limit 0, Epsilon 0.5, N=2
    // n=3 is 0.33 < 0.5 (Inside)
    const { result } = renderHook(() => 
      useSequenceData('1/n', 0, 0.5, 2)
    );

    expect(result.current.isConvergent).toBe(true);
  });
});