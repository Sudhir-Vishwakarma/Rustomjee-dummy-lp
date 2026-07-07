import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the copyright with a demo-build note', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 Rustomjee/)).toBeInTheDocument();
    expect(screen.getByText(/Demo build/)).toBeInTheDocument();
  });
});
