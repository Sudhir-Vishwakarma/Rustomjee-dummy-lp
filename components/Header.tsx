'use client';

import { useEffect, useState } from 'react';
import { navLinks } from '@/lib/content';
import { useModal } from '@/lib/modal-context';

const SECTION_IDS = [
  'home',
  'overview',
  'configuration',
  'amenities',
  'gallery',
  'about',
  'location',
  'faq',
  'contact',
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(SECTION_IDS[0]);
  const { openModal } = useModal();

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 z-40 w-full bg-sand/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="font-display text-lg text-navy">Rustomjee 180 Bayview</span>

        <button
          type="button"
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>

        <nav
          role="navigation"
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } absolute left-0 top-full w-full flex-col gap-4 bg-sand p-4 shadow-md md:static md:flex md:flex-row md:w-auto md:items-center md:p-0 md:shadow-none`}
        >
          {navLinks.map((link) => {
            const isActive = link.href === `#${activeSection}`;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`hover:text-gold ${isActive ? 'text-gold' : 'text-navy'}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            );
          })}
          <button
            type="button"
            onClick={() => {
              openModal('enquire');
              setMenuOpen(false);
            }}
            className="rounded bg-navy px-4 py-2 font-medium text-sand hover:bg-navy-light"
          >
            Enquire Now
          </button>
        </nav>
      </div>
    </header>
  );
}
