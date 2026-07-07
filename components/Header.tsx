'use client';

import { useState } from 'react';
import { navLinks } from '@/lib/content';
import { useModal } from '@/lib/modal-context';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openModal } = useModal();

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
            menuOpen ? 'flex flex-col md:static md:flex md:flex-row' : 'hidden md:static'
          } absolute left-0 top-full w-full gap-4 bg-sand p-4 shadow-md md:w-auto md:items-center md:p-0 md:shadow-none`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-navy hover:text-gold"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
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
