import { describe, it, expect } from 'vitest';
import {
  navLinks,
  overviewStats,
  unitConfigurations,
  amenityImages,
  galleryImages,
  connectivityCategories,
  faqItems,
  heroImage,
  locationMapImage,
  overviewImages,
} from './content';

describe('content data', () => {
  it('has 8 nav links', () => {
    expect(navLinks).toHaveLength(8);
  });

  it('has overview stats', () => {
    expect(overviewStats.length).toBeGreaterThan(0);
  });

  it('has both 3 BHK and 4 BHK configurations', () => {
    const ids = unitConfigurations.map((c) => c.id);
    expect(ids).toContain('3bhk');
    expect(ids).toContain('4bhk');
  });

  it('has 5 amenity images', () => {
    expect(amenityImages).toHaveLength(5);
  });

  it('has gallery images with both location and artist-impression tags', () => {
    const tags = galleryImages.map((g) => g.tag);
    expect(tags).toContain('Shot at Location');
    expect(tags).toContain("Artist's Impression");
  });

  it('every image has a non-empty https src', () => {
    const allImages = [
      ...unitConfigurations.map((c) => c.image),
      ...amenityImages.map((g) => g.src),
      ...galleryImages.map((g) => g.src),
    ];
    for (const src of allImages) {
      expect(src.startsWith('https://images.unsplash.com/')).toBe(true);
    }
  });

  it('has 9 connectivity categories', () => {
    expect(connectivityCategories).toHaveLength(9);
  });

  it('has 4 faq items', () => {
    expect(faqItems).toHaveLength(4);
  });

  it('has a non-empty hero image url', () => {
    expect(typeof heroImage).toBe('string');
    expect(heroImage.startsWith('https://images.unsplash.com/')).toBe(true);
  });

  it('has a non-empty location map image url', () => {
    expect(typeof locationMapImage).toBe('string');
    expect(locationMapImage.startsWith('https://images.unsplash.com/')).toBe(true);
  });

  it('has at least one overview image, all valid unsplash urls', () => {
    expect(overviewImages.length).toBeGreaterThan(0);
    for (const src of overviewImages) {
      expect(src.startsWith('https://images.unsplash.com/')).toBe(true);
    }
  });
});
