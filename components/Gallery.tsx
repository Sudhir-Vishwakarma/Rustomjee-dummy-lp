'use client';

import { useState } from 'react';
import Image from 'next/image';
import { galleryImages } from '@/lib/content';
import Lightbox from './Lightbox';

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-display text-3xl text-navy">Gallery</h2>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        {galleryImages.map((image, index) => (
          <button
            key={image.alt}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="relative aspect-video overflow-hidden rounded-lg"
          >
            <Image src={image.src} alt={image.alt} fill className="object-cover" />
            <span className="absolute bottom-1 left-1 rounded bg-navy/70 px-2 py-0.5 text-xs text-sand">
              {image.tag}
            </span>
          </button>
        ))}
      </div>

      <Lightbox
        images={galleryImages}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
