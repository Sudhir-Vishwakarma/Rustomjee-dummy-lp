import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import About from './About';

describe('About', () => {
  it('renders the location/heritage copy', () => {
    render(<About />);
    expect(screen.getByText(/Matunga/)).toBeInTheDocument();
  });

  it('expands to reveal extra copy on Know More click, and collapses again', () => {
    render(<About />);

    expect(screen.queryByText(/heritage facade lines/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Know More/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Know More/ }));

    expect(screen.getByText(/heritage facade lines/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show Less' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Show Less' }));

    expect(screen.queryByText(/heritage facade lines/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Know More/ })).toBeInTheDocument();
  });
});
