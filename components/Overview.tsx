'use client';

import { overviewStats } from '@/lib/content';
import { useModal } from '@/lib/modal-context';

export default function Overview() {
  const { openModal } = useModal();

  return (
    <section id="overview" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-display text-3xl text-navy">Overview</h2>
      <p className="mt-2 max-w-2xl text-navy/80">
        A rare address rising above the city, offering panoramic sea views and amenities spread
        across three levels.
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-5">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white p-4 text-center shadow-sm">
            <dt className="text-sm text-navy/60">{stat.label}</dt>
            <dd className="mt-1 font-display text-xl text-navy">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={() => openModal('brochure')}
        className="mt-8 rounded bg-gold px-6 py-3 font-medium text-navy hover:bg-gold-light"
      >
        Download Brochure
      </button>
    </section>
  );
}
