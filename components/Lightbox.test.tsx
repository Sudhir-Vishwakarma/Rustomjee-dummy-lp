import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Lightbox from './Lightbox';

const images = [
  { src: 'https://images.unsplash.com/a.jpg', alt: 'A', caption: 'A' },
  { src: 'https://images.unsplash.com/b.jpg', alt: 'B', caption: 'B' },
  { src: 'https://images.unsplash.com/c.jpg', alt: 'C', caption: 'C' },
];

describe('Lightbox', () => {
  it('renders nothing when openIndex is null', () => {
    render(<Lightbox images={images} openIndex={null} onClose={() => {}} onNavigate={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the image at openIndex', () => {
    render(<Lightbox images={images} openIndex={1} onClose={() => {}} onNavigate={() => {}} />);
    expect(screen.getByAltText('B')).toBeInTheDocument();
  });

  it('calls onNavigate with the next index, wrapping at the end', () => {
    const onNavigate = vi.fn();
    render(
      <Lightbox images={images} openIndex={2} onClose={() => {}} onNavigate={onNavigate} />
    );
    fireEvent.click(screen.getByLabelText('Next image'));
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it('calls onNavigate with the previous index, wrapping at the start', () => {
    const onNavigate = vi.fn();
    render(
      <Lightbox images={images} openIndex={0} onClose={() => {}} onNavigate={onNavigate} />
    );
    fireEvent.click(screen.getByLabelText('Previous image'));
    expect(onNavigate).toHaveBeenCalledWith(2);
  });

  it('calls onClose on Escape', () => {
    const onClose = vi.fn();
    render(<Lightbox images={images} openIndex={0} onClose={onClose} onNavigate={() => {}} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('has an accessible name for the dialog', () => {
    render(<Lightbox images={images} openIndex={0} onClose={() => {}} onNavigate={() => {}} />);
    expect(screen.getByRole('dialog', { name: 'Image viewer' })).toBeInTheDocument();
  });

  it('locks body scroll while open and restores it on close', () => {
    const { rerender } = render(
      <Lightbox images={images} openIndex={0} onClose={() => {}} onNavigate={() => {}} />
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Lightbox images={images} openIndex={null} onClose={() => {}} onNavigate={() => {}} />
    );
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
