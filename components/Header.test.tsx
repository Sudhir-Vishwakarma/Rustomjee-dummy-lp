import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { ModalProvider } from '@/lib/modal-context';
import { navLinks } from '@/lib/content';

function renderHeader() {
  return render(
    <ModalProvider>
      <Header />
    </ModalProvider>
  );
}

describe('Header', () => {
  it('renders every nav link', () => {
    renderHeader();
    for (const link of navLinks) {
      expect(screen.getAllByText(link.label).length).toBeGreaterThan(0);
    }
  });

  it('mobile menu is closed by default and opens on toggle click', () => {
    renderHeader();
    const nav = screen.getByRole('navigation');
    expect(nav.className).not.toContain('flex');
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getByRole('navigation').className).toContain('flex');
  });

  it('renders an Enquire Now button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: 'Enquire Now' })).toBeInTheDocument();
  });
});
