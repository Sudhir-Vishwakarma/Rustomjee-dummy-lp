import { describe, it, expect } from 'vitest';
import { shouldShowStickyBar } from './scroll';

describe('shouldShowStickyBar', () => {
  it('is false while still within the hero', () => {
    expect(shouldShowStickyBar(200, 600)).toBe(false);
  });

  it('is true once scrolled past the hero', () => {
    expect(shouldShowStickyBar(700, 600)).toBe(true);
  });
});
