'use client';

import { useState } from 'react';
import Image from 'next/image';
import { unitConfigurations } from '@/lib/content';

export default function ConfigurationTabs() {
  const [activeId, setActiveId] = useState(unitConfigurations[0].id);
  const active = unitConfigurations.find((c) => c.id === activeId)!;

  return (
    <div>
      <div role="tablist" className="flex gap-4 border-b border-navy/10">
        {unitConfigurations.map((config) => (
          <button
            key={config.id}
            role="tab"
            aria-selected={config.id === activeId}
            onClick={() => setActiveId(config.id)}
            className={`px-4 py-2 font-medium ${
              config.id === activeId ? 'border-b-2 border-gold text-navy' : 'text-navy/50'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Image
          src={active.image}
          alt={active.label}
          width={640}
          height={480}
          className="rounded-lg object-cover"
        />
        <div>
          <p className="font-display text-2xl text-navy">{active.sizeRange}</p>
          <p className="mt-2 text-navy/80">{active.description}</p>
        </div>
      </div>
    </div>
  );
}
