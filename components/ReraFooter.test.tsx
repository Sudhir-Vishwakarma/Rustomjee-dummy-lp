import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReraFooter from './ReraFooter';

describe('ReraFooter', () => {
  it('shows placeholder RERA numbers, never the real ones', () => {
    render(<ReraFooter />);
    expect(screen.getByText(/P00000000000/)).toBeInTheDocument();
    expect(screen.getByText(/P00000000001/)).toBeInTheDocument();
    expect(screen.queryByText(/P51900066547/)).not.toBeInTheDocument();
    expect(screen.queryByText(/P51900066548/)).not.toBeInTheDocument();
  });

  it('shows a demo disclaimer', () => {
    render(<ReraFooter />);
    expect(screen.getByText(/demonstration purposes only/i)).toBeInTheDocument();
  });
});
