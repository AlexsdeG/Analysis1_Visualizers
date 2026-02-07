import { useMemo } from 'react';
import { useMathEvaluation } from '../../../hooks/useMathEvaluation';

export interface SequencePoint {
  input: number;
  output: number | null;
  status: 'neutral' | 'success' | 'danger' | 'invalid';
  insideTube: boolean;
}

export const useSequenceData = (formula: string, limit: number, epsilon: number, N: number) => {
  // Generate inputs 1 to 50
  const range = useMemo(() => Array.from({ length: 50 }, (_, i) => i + 1), []);
  
  const { data, error } = useMathEvaluation(formula, 'n', range);

  const processedData: SequencePoint[] = useMemo(() => {
    if (error || !data) return [];
    
    return data.map(point => {
      if (point.output === null) return { ...point, status: 'invalid', insideTube: false };
      
      const dist = Math.abs(point.output - limit);
      const insideTube = dist < epsilon;
      const pastN = point.input > N;
      
      let status: 'neutral' | 'success' | 'danger';
      
      if (!pastN) {
        status = 'neutral';
      } else {
        status = insideTube ? 'success' : 'danger';
      }
      
      return { ...point, status, insideTube };
    });
  }, [data, error, limit, epsilon, N]);

  const { isConvergent, firstViolation } = useMemo(() => {
    if (processedData.length === 0) return { isConvergent: false, firstViolation: null };
    if (error) return { isConvergent: false, firstViolation: null };
    
    // Definition: For ALL n > N, point must be inside tube.
    // So if there is ANY point > N that is NOT inside tube, it fails.
    const violations = processedData.filter(p => p.input > N && !p.insideTube && p.status !== 'invalid');
    
    // Find the first violation to display in the UI
    const first = violations.length > 0 ? violations[0] : null;

    return { 
      isConvergent: violations.length === 0, 
      firstViolation: first 
    };
  }, [processedData, N, error]);

  return { data: processedData, error, isConvergent, firstViolation };
};