import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { InfoTooltip } from '../InfoTooltip';

describe('InfoTooltip', () => {
  it('renders the trigger button', () => {
    render(<InfoTooltip>Test Content</InfoTooltip>);
    // The InfoTooltip renders a button with aria-label "Information"
    const trigger = screen.getByLabelText('Information');
    expect(trigger).toBeDefined();
  });
});