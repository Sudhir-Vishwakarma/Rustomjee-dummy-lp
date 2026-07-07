import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from './Hero';

describe('Hero', () => {
  it('renders the headline and an inline lead form', () => {
    render(<Hero />);
    expect(
      screen.getByText('The Iconic Address Where Sea Views Meet Timeless Charm')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });
});
