'use client';

import { useState } from 'react';

export default function About() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="about" className="mx-auto max-w-4xl px-4 py-16">
      <h2 className="font-display text-3xl text-navy">About</h2>
      <p className="mt-4 text-navy/80">
        Tucked into a quaint bylane of Matunga, Rustomjee 180 Bayview rises 37 storeys above the
        city, offering sweeping 180° sea views and amenities spread across three levels — a rare
        address where heritage neighbourhood charm meets contemporary luxury.
      </p>
      {expanded && (
        <p className="mt-4 text-navy/80">
          The design carefully preserves the heritage facade lines of the surrounding Matunga
          bylane while introducing a contemporary tower silhouette, reflecting the developer&apos;s
          long-standing track record of delivering landmark addresses across Mumbai.
        </p>
      )}
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-4 inline-block font-medium text-gold hover:underline"
      >
        {expanded ? 'Show Less' : 'Know More →'}
      </button>
    </section>
  );
}
