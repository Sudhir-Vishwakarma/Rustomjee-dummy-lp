import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FadeInSection from './FadeInSection';

describe('FadeInSection', () => {
  const originalIntersectionObserver = global.IntersectionObserver;

  afterEach(() => {
    global.IntersectionObserver = originalIntersectionObserver;
  });

  it('renders its children immediately, regardless of intersection state', () => {
    render(
      <FadeInSection>
        <p>fade content</p>
      </FadeInSection>
    );
    expect(screen.getByText('fade content')).toBeInTheDocument();
  });

  it('starts with the opacity-0/translate-y-4 classes before intersecting', () => {
    render(
      <FadeInSection>
        <p>fade content</p>
      </FadeInSection>
    );
    const wrapper = screen.getByText('fade content').parentElement;
    expect(wrapper?.className).toContain('opacity-0');
    expect(wrapper?.className).toContain('translate-y-4');
  });

  it('degrades gracefully for reduced-motion users via motion-reduce classes', () => {
    render(
      <FadeInSection>
        <p>fade content</p>
      </FadeInSection>
    );
    const wrapper = screen.getByText('fade content').parentElement;
    expect(wrapper?.className).toContain('motion-reduce:opacity-100');
    expect(wrapper?.className).toContain('motion-reduce:translate-y-0');
  });

  it('applies a custom className alongside the animation classes', () => {
    render(
      <FadeInSection className="custom-class">
        <p>fade content</p>
      </FadeInSection>
    );
    expect(screen.getByText('fade content').parentElement?.className).toContain('custom-class');
  });

  it('constructs an IntersectionObserver and observes its own container on mount, disconnecting on unmount', () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    const IntersectionObserverMock = vi.fn().mockImplementation(function (this: unknown) {
      Object.assign(this as object, { observe, unobserve: vi.fn(), disconnect });
    });
    // @ts-expect-error test override of the jsdom mock
    global.IntersectionObserver = IntersectionObserverMock;

    const { unmount } = render(
      <FadeInSection>
        <p>fade content</p>
      </FadeInSection>
    );

    expect(IntersectionObserverMock).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalledTimes(1);

    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
