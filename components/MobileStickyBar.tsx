'use client';

import { useEffect, useState } from 'react';
import { shouldShowStickyBar } from '@/lib/scroll';
import { useModal } from '@/lib/modal-context';

const HERO_HEIGHT = 640;

export default function MobileStickyBar() {
  const [visible, setVisible] = useState(false);
  const { openModal } = useModal();

  useEffect(() => {
    function handleScroll() {
      setVisible(shouldShowStickyBar(window.scrollY, HERO_HEIGHT));
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      data-testid="sticky-bar"
      className={`fixed bottom-0 left-0 z-40 w-full bg-navy p-3 text-center transition-transform md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <button
        type="button"
        onClick={() => openModal('enquire')}
        className="w-full rounded bg-gold px-4 py-2 font-medium text-navy"
      >
        Enquire Now
      </button>
    </div>
  );
}
