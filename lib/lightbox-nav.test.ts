import { describe, it, expect } from 'vitest';
import { nextIndex, prevIndex } from './lightbox-nav';

describe('lightbox navigation', () => {
  it('advances to the next index', () => {
    expect(nextIndex(1, 5)).toBe(2);
  });

  it('wraps from the last index to the first', () => {
    expect(nextIndex(4, 5)).toBe(0);
  });

  it('goes back to the previous index', () => {
    expect(prevIndex(2, 5)).toBe(1);
  });

  it('wraps from the first index to the last', () => {
    expect(prevIndex(0, 5)).toBe(4);
  });
});
