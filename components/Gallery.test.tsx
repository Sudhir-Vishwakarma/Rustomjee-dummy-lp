import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Gallery from './Gallery';
import { galleryImages } from '@/lib/content';

describe('Gallery', () => {
  it('renders every gallery thumbnail with its tag', () => {
    render(<Gallery />);
    for (const image of galleryImages) {
      expect(screen.getByAltText(image.alt)).toBeInTheDocument();
    }
    expect(screen.getAllByText('Shot at Location').length).toBeGreaterThan(0);
    expect(screen.getAllByText("Artist's Impression").length).toBeGreaterThan(0);
  });

  it('opens the lightbox at the clicked image', () => {
    render(<Gallery />);
    fireEvent.click(screen.getByAltText(galleryImages[0].alt));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
