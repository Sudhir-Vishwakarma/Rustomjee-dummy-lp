import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About';

describe('About', () => {
  it('renders the location/heritage copy', () => {
    render(<About />);
    expect(screen.getByText(/Matunga/)).toBeInTheDocument();
  });
});
