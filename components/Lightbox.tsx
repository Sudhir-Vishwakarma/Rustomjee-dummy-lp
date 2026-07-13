'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { nextIndex, prevIndex } from '@/lib/lightbox-nav';

export type LightboxImage = { src: string; alt: string; caption?: string };

export type LightboxProps = {
  images: LightboxImage[];
  openIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
};

export default function Lightbox({ images, openIndex, onClose, onNavigate }: LightboxProps) {
  useEffect(() => {
    if (openIndex === null) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openIndex, onClose]);

  useEffect(() => {
    if (openIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex]);

  if (openIndex === null) return null;

  const current = images[openIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Previous image"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(prevIndex(openIndex, images.length));
        }}
        className="absolute left-4 text-3xl text-sand"
      >
        ‹
      </button>

      <div onClick={(e) => e.stopPropagation()} className="max-w-3xl">
        <Image
          src={current.src}
          alt={current.alt}
          width={1024}
          height={768}
          className="max-h-[80vh] w-full rounded object-contain"
        />
        {current.caption && <p className="mt-2 text-center text-sand">{current.caption}</p>}
      </div>

      <button
        type="button"
        aria-label="Next image"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(nextIndex(openIndex, images.length));
        }}
        className="absolute right-4 text-3xl text-sand"
      >
        ›
      </button>

      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 text-2xl text-sand"
      >
        ✕
      </button>
    </div>
  );
}
