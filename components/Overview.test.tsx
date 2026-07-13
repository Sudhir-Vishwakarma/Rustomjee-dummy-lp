import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Overview from './Overview';
import { ModalProvider, useModal } from '@/lib/modal-context';
import { overviewImages, overviewStats } from '@/lib/content';

function Probe() {
  const { activeModal } = useModal();
  return <p>modal: {activeModal ?? 'none'}</p>;
}

describe('Overview', () => {
  it('renders every stat', () => {
    render(
      <ModalProvider>
        <Overview />
      </ModalProvider>
    );
    for (const stat of overviewStats) {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
    }
  });

  it('renders lifestyle imagery', () => {
    render(
      <ModalProvider>
        <Overview />
      </ModalProvider>
    );
    for (let i = 0; i < overviewImages.length; i++) {
      expect(screen.getByAltText(`Lifestyle interior view ${i + 1}`)).toBeInTheDocument();
    }
  });

  it('opens the brochure modal via context when the CTA is clicked', () => {
    render(
      <ModalProvider>
        <Overview />
        <Probe />
      </ModalProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /download brochure/i }));
    expect(screen.getByText('modal: brochure')).toBeInTheDocument();
  });
});
