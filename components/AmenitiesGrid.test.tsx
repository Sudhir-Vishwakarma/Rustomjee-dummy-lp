import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AmenitiesGrid from './AmenitiesGrid';
import { amenityImages } from '@/lib/content';

describe('AmenitiesGrid', () => {
  it('renders every amenity thumbnail', () => {
    render(<AmenitiesGrid />);
    for (const image of amenityImages) {
      expect(screen.getByAltText(image.alt)).toBeInTheDocument();
    }
  });

  it('opens the lightbox at the clicked image', () => {
    render(<AmenitiesGrid />);
    fireEvent.click(screen.getByAltText(amenityImages[1].alt));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
