'use client';

import { useState } from 'react';
import Image from 'next/image';
import { amenityImages } from '@/lib/content';
import Lightbox from './Lightbox';

export default function AmenitiesGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="amenities" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-display text-3xl text-navy">Amenities</h2>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        {amenityImages.map((image, index) => (
          <button
            key={image.alt}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="relative aspect-square overflow-hidden rounded-lg"
          >
            <Image src={image.src} alt={image.alt} fill className="object-cover" />
            <span className="absolute bottom-0 w-full bg-navy/60 p-1 text-sm text-sand">
              {image.caption}
            </span>
          </button>
        ))}
      </div>

      <Lightbox
        images={amenityImages}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
