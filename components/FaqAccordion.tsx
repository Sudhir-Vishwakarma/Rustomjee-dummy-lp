'use client';

import { useState } from 'react';
import type { FaqItem } from '@/lib/content';

export type FaqAccordionProps = { items: FaqItem[] };

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-navy/10">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between py-4 text-left font-medium text-navy"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              {item.question}
              <span>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <p className="pb-4 text-navy/80">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
