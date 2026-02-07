import { useMemo } from 'react';
import { compile } from 'mathjs';

interface EvaluationPoint {
  input: number;
  output: number | null;
}

interface EvaluationResult {
  data: EvaluationPoint[];
  error: string | null;
}

/**
 * Parses and evaluates a mathematical formula over a range of values.
 * @param formula The mathematical string to evaluate (e.g., "n^2 + 1")
 * @param variable The variable name in the formula (e.g., "n")
 * @param range An array of input values to evaluate against
 */
export const useMathEvaluation = (formula: string, variable: string, range: number[]): EvaluationResult => {
  return useMemo<EvaluationResult>(() => {
    // Return empty if no formula provided
    if (!formula || !formula.trim()) {
      return { data: [], error: null };
    }

    try {
      // Compile the formula once
      const code = compile(formula);
      
      const data = range.map((val) => {
        let output: any;
        try {
          // Create scope with the variable
          const scope = { [variable]: val };
          output = code.evaluate(scope);
        } catch (e) {
          // Evaluation error for specific point (e.g., divide by zero)
          output = NaN;
        }

        // Handle sanitization of results
        // We filter out complex numbers (if mathjs returns them), Inifinity, and NaN for plotting safety
        if (
          typeof output !== 'number' || 
          isNaN(output) || 
          !isFinite(output)
        ) {
          return { input: val, output: null };
        }
        
        // Optional: Clamp extremely large values to prevent graph distortions or rendering issues
        // For standard visualization, values > 10000 might be effectively "infinite" depending on zoom
        if (Math.abs(output) > 100000) {
            return { input: val, output: null };
        }

        return { input: val, output: output };
      });

      return { data, error: null };
    } catch (err: any) {
      // Compilation error (syntax error in formula)
      return { data: [], error: "Invalid syntax" };
    }
  }, [formula, variable, range]); // Re-run only when these change
};