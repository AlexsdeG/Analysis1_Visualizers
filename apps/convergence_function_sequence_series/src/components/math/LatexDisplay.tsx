import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

interface LatexDisplayProps {
  math: string;
  block?: boolean;
  className?: string;
  errorColor?: string;
}

export const LatexDisplay: React.FC<LatexDisplayProps> = ({ 
  math, 
  block = false, 
  className,
  errorColor = 'text-red-500'
}) => {
  const Component = block ? BlockMath : InlineMath;

  return (
    <span className={className}>
      <Component 
        math={math} 
        renderError={(error: Error) => (
          <span className={`${errorColor} text-xs font-mono`} title={error.message}>
            {error.name}: {error.message}
          </span>
        )} 
      />
    </span>
  );
};