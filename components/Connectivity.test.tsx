import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Connectivity from './Connectivity';
import { connectivityCategories } from '@/lib/content';

describe('Connectivity', () => {
  it('renders every category title', () => {
    render(<Connectivity />);
    for (const category of connectivityCategories) {
      expect(screen.getByText(category.title)).toBeInTheDocument();
    }
  });

  it('renders items with their distance when present', () => {
    render(<Connectivity />);
    expect(screen.getByText(/Matunga Station/)).toBeInTheDocument();
    expect(screen.getByText(/0.6 km/)).toBeInTheDocument();
  });

  it('renders a map graphic', () => {
    render(<Connectivity />);
    expect(screen.getByAltText('Map of the neighbourhood')).toBeInTheDocument();
  });
});
