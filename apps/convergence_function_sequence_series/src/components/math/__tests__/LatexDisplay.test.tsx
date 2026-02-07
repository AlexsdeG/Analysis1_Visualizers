import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { LatexDisplay } from '../LatexDisplay';

// Since we can't fully render KaTeX in this test environment without canvas/real DOM layout sometimes,
// we mostly check if it renders the wrapper or handles errors.
// However, react-katex typically renders spans.

describe('LatexDisplay', () => {
  it('renders without crashing', () => {
    const { container } = render(<LatexDisplay math="E = mc^2" />);
    expect(container).toBeDefined();
  });

  it('renders block math when prop is set', () => {
    const { container } = render(<LatexDisplay math="\sum" block />);
    // BlockMath usually renders a div or a display mode span
    expect(container.innerHTML).toContain('katex-display');
  });
});