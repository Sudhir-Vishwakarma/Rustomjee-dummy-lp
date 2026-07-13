import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileStickyBar from './MobileStickyBar';
import { ModalProvider } from '@/lib/modal-context';

function renderBar() {
  return render(
    <ModalProvider>
      <MobileStickyBar />
    </ModalProvider>
  );
}

describe('MobileStickyBar', () => {
  it('is hidden before scrolling', () => {
    renderBar();
    expect(screen.getByTestId('sticky-bar').className).toContain('translate-y-full');
  });

  it('becomes visible after scrolling past the hero', () => {
    renderBar();
    Object.defineProperty(window, 'scrollY', { value: 900, writable: true });
    fireEvent.scroll(window);
    expect(screen.getByTestId('sticky-bar').className).not.toContain('translate-y-full');
  });

  it('is visible immediately on mount when already scrolled past the hero', () => {
    Object.defineProperty(window, 'scrollY', { value: 900, writable: true });
    renderBar();
    expect(screen.getByTestId('sticky-bar').className).not.toContain('translate-y-full');
  });
});
