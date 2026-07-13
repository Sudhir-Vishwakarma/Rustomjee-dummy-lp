import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { ModalProvider } from '@/lib/modal-context';
import { navLinks } from '@/lib/content';

const SECTION_IDS = [
  'home',
  'overview',
  'configuration',
  'amenities',
  'gallery',
  'about',
  'location',
  'faq',
  'contact',
];

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
    expect(nav.className).toContain('hidden');
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getByRole('navigation').className).not.toContain('hidden');
  });

  it('renders an Enquire Now button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: 'Enquire Now' })).toBeInTheDocument();
  });

  describe('scroll-spy wiring', () => {
    const originalIntersectionObserver = global.IntersectionObserver;

    afterEach(() => {
      global.IntersectionObserver = originalIntersectionObserver;
      SECTION_IDS.forEach((id) => document.getElementById(id)?.remove());
    });

    it('constructs an IntersectionObserver and observes every section it finds in the DOM', () => {
      SECTION_IDS.forEach((id) => {
        const section = document.createElement('section');
        section.id = id;
        document.body.appendChild(section);
      });

      const observe = vi.fn();
      const disconnect = vi.fn();
      const IntersectionObserverMock = vi.fn().mockImplementation(function (
        this: unknown
      ) {
        Object.assign(this as object, { observe, unobserve: vi.fn(), disconnect });
      });
      // @ts-expect-error test override of the jsdom mock
      global.IntersectionObserver = IntersectionObserverMock;

      const { unmount } = renderHeader();

      expect(IntersectionObserverMock).toHaveBeenCalledTimes(1);
      expect(observe).toHaveBeenCalledTimes(SECTION_IDS.length);

      unmount();
      expect(disconnect).toHaveBeenCalledTimes(1);
    });
  });
});
