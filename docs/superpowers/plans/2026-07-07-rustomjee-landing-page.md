# Rustomjee 180 Bayview Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a from-scratch Next.js recreation of the `rustomjee180bayview.com` landing page as a portfolio/demo build, per `docs/superpowers/specs/2026-07-07-rustomjee-landing-page-design.md`.

**Architecture:** Single-page Next.js App Router site. Static copy/data lives in `lib/content.ts`. Stateful logic (form validation, lightbox index math, sticky-bar threshold) is extracted into pure functions in `lib/*.ts` and unit-tested directly. Interactive UI (Modal, LeadForm, Header, Lightbox, ConfigurationTabs, FaqAccordion, MobileStickyBar) are hand-built client components with no third-party UI/animation libraries. All 12 sections are assembled in `app/page.tsx`.

**Tech Stack:** Next.js 14.2.5 (App Router, TypeScript), Tailwind CSS 3, next/font/google (Fraunces + Inter), Vitest + React Testing Library + jsdom for tests.

## Global Constraints

- No backend and no real network requests for any form — all submissions resolve to a client-side fake success state (per spec's "Forms Behavior").
- RERA numbers must be clearly fake placeholders (`P00000000000` / `P00000000001`), never the real project's numbers (per spec's "Legal Handling").
- No UI/animation/carousel/lightbox third-party libraries — all interactive widgets are hand-built (per spec's "Interactivity, all hand-built").
- All images are real, verified-working `images.unsplash.com` URLs (per spec's "Images") — every URL must be checked with `curl -sI` returning `200` before being committed into `lib/content.ts`.
- TypeScript throughout; no `any`.
- Mobile-first Tailwind breakpoints for every section (per spec's "Responsiveness").
- Every stateful/logic-bearing unit (validation, lightbox nav, accordion, tabs, sticky bar threshold, modal context) gets a unit test written before implementation (TDD). Purely static presentational sections get a lightweight render/smoke test instead.

---

### Task 1: Project Scaffolding, Tailwind Theme, Testing Harness

**Files:**
- Create (via CLI): full Next.js project skeleton (`app/`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.mjs`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`)
- Modify: `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, `next.config.mjs`
- Create: `vitest.config.ts`, `vitest.setup.ts`, `tests/sanity.test.tsx`

**Interfaces:**
- Produces: Tailwind theme tokens `colors.navy`, `colors.gold`, `colors.sand`, `fontFamily.display` (Fraunces), `fontFamily.sans` (Inter) — every later section task uses these exact token names.
- Produces: `npm test` runs Vitest once; `npm run test:watch` runs it in watch mode.

- [ ] **Step 1: Scaffold the Next.js app**

Run (from the project root `/home/sudhirvishwakarma/Documents/Landing Pages/rustomjee-dummy-lp`):

```bash
npx --yes create-next-app@14.2.5 . --typescript --eslint --tailwind --app --no-src-dir --import-alias "@/*" --use-npm
```

Expected: command completes without error; `package.json`, `app/layout.tsx`, `app/page.tsx`, `tailwind.config.ts`, `next.config.mjs`, `tsconfig.json` now exist. (The existing `docs/` and `.git/` directories are left untouched — `docs` is on create-next-app's allowed-non-empty-directory list.)

- [ ] **Step 2: Verify the scaffold builds**

Run: `npm run build`
Expected: ends with `Compiled successfully` and a route summary listing `/`.

- [ ] **Step 3: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 4: Create Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Add test scripts to `package.json`**

In the `"scripts"` block of `package.json`, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: Write a sanity test for the harness**

Create `tests/sanity.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('testing harness', () => {
  it('renders and queries a basic element', () => {
    render(<div>hello rustomjee</div>);
    expect(screen.getByText('hello rustomjee')).toBeInTheDocument();
  });
});
```

- [ ] **Step 7: Run the sanity test**

Run: `npm test`
Expected: `1 passed` (the sanity test). If it fails, fix the Vitest/jsdom/RTL config before continuing — every later task depends on this harness working.

- [ ] **Step 8: Configure the Tailwind theme**

Replace the `theme` block in `tailwind.config.ts` with:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0b1f2a',
          light: '#16303f',
        },
        gold: {
          DEFAULT: '#b8925a',
          light: '#d8b98a',
        },
        sand: '#f4efe6',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 9: Wire up fonts and base layout**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Rustomjee 180 Bayview — Demo Landing Page',
  description:
    'Portfolio/demo recreation of the Rustomjee 180 Bayview landing page. Not an official listing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans bg-sand text-navy scroll-smooth">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 10: Set base global styles**

Replace the contents of `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

section[id] {
  scroll-margin-top: 96px;
}
```

- [ ] **Step 11: Allow Unsplash images in `next/image`**

Replace `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 12: Rebuild to confirm everything still compiles**

Run: `npm run build`
Expected: `Compiled successfully`.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js app with Tailwind theme and Vitest harness"
```

---

### Task 2: Shared Logic Utilities (validation, lightbox nav, sticky-bar threshold)

**Files:**
- Create: `lib/validation.ts`, `lib/validation.test.ts`
- Create: `lib/lightbox-nav.ts`, `lib/lightbox-nav.test.ts`
- Create: `lib/scroll.ts`, `lib/scroll.test.ts`

**Interfaces:**
- Produces: `validateLeadForm(values: LeadFormValues): LeadFormErrors` — consumed by Task 5 (`LeadForm`).
- Produces: `nextIndex(current: number, length: number): number`, `prevIndex(current: number, length: number): number` — consumed by Task 11 (`Lightbox`).
- Produces: `shouldShowStickyBar(scrollY: number, heroHeight: number): boolean` — consumed by Task 7 (`MobileStickyBar`).

- [ ] **Step 1: Write failing tests for form validation**

Create `lib/validation.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { validateLeadForm } from './validation';

describe('validateLeadForm', () => {
  it('returns no errors for valid values', () => {
    const errors = validateLeadForm({
      name: 'Asha Mehta',
      phone: '9876543210',
      email: 'asha@example.com',
      whatsappOptIn: true,
    });
    expect(errors).toEqual({});
  });

  it('flags an empty name', () => {
    const errors = validateLeadForm({
      name: '',
      phone: '9876543210',
      email: 'asha@example.com',
      whatsappOptIn: false,
    });
    expect(errors.name).toBe('Please enter your name.');
  });

  it('flags an invalid phone number', () => {
    const errors = validateLeadForm({
      name: 'Asha Mehta',
      phone: '123',
      email: 'asha@example.com',
      whatsappOptIn: false,
    });
    expect(errors.phone).toBe('Please enter a valid 10-digit phone number.');
  });

  it('flags an invalid email', () => {
    const errors = validateLeadForm({
      name: 'Asha Mehta',
      phone: '9876543210',
      email: 'not-an-email',
      whatsappOptIn: false,
    });
    expect(errors.email).toBe('Please enter a valid email address.');
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- lib/validation.test.ts`
Expected: FAIL — `Cannot find module './validation'`.

- [ ] **Step 3: Implement `lib/validation.ts`**

```ts
export type LeadFormValues = {
  name: string;
  phone: string;
  email: string;
  whatsappOptIn: boolean;
};

export type LeadFormErrors = Partial<Record<'name' | 'phone' | 'email', string>>;

const PHONE_PATTERN = /^\d{10}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLeadForm(values: LeadFormValues): LeadFormErrors {
  const errors: LeadFormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Please enter your name.';
  }

  if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = 'Please enter a valid 10-digit phone number.';
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  return errors;
}
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test -- lib/validation.test.ts`
Expected: `4 passed`.

- [ ] **Step 5: Write failing tests for lightbox navigation**

Create `lib/lightbox-nav.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { nextIndex, prevIndex } from './lightbox-nav';

describe('lightbox navigation', () => {
  it('advances to the next index', () => {
    expect(nextIndex(1, 5)).toBe(2);
  });

  it('wraps from the last index to the first', () => {
    expect(nextIndex(4, 5)).toBe(0);
  });

  it('goes back to the previous index', () => {
    expect(prevIndex(2, 5)).toBe(1);
  });

  it('wraps from the first index to the last', () => {
    expect(prevIndex(0, 5)).toBe(4);
  });
});
```

- [ ] **Step 6: Run and confirm failure**

Run: `npm test -- lib/lightbox-nav.test.ts`
Expected: FAIL — `Cannot find module './lightbox-nav'`.

- [ ] **Step 7: Implement `lib/lightbox-nav.ts`**

```ts
export function nextIndex(current: number, length: number): number {
  return (current + 1) % length;
}

export function prevIndex(current: number, length: number): number {
  return (current - 1 + length) % length;
}
```

- [ ] **Step 8: Run and confirm pass**

Run: `npm test -- lib/lightbox-nav.test.ts`
Expected: `4 passed`.

- [ ] **Step 9: Write failing test for sticky-bar threshold**

Create `lib/scroll.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { shouldShowStickyBar } from './scroll';

describe('shouldShowStickyBar', () => {
  it('is false while still within the hero', () => {
    expect(shouldShowStickyBar(200, 600)).toBe(false);
  });

  it('is true once scrolled past the hero', () => {
    expect(shouldShowStickyBar(700, 600)).toBe(true);
  });
});
```

- [ ] **Step 10: Run and confirm failure**

Run: `npm test -- lib/scroll.test.ts`
Expected: FAIL — `Cannot find module './scroll'`.

- [ ] **Step 11: Implement `lib/scroll.ts`**

```ts
export function shouldShowStickyBar(scrollY: number, heroHeight: number): boolean {
  return scrollY > heroHeight;
}
```

- [ ] **Step 12: Run and confirm pass**

Run: `npm test -- lib/scroll.test.ts`
Expected: `2 passed`.

- [ ] **Step 13: Commit**

```bash
git add lib/validation.ts lib/validation.test.ts lib/lightbox-nav.ts lib/lightbox-nav.test.ts lib/scroll.ts lib/scroll.test.ts
git commit -m "Add shared logic utilities: form validation, lightbox nav, sticky-bar threshold"
```

---

### Task 3: Content Data Module + Sourced Images

**Files:**
- Create: `lib/content.ts`, `lib/content.test.ts`

**Interfaces:**
- Produces: `navLinks`, `overviewStats`, `unitConfigurations`, `amenityImages`, `galleryImages`, `connectivityCategories`, `faqItems` — consumed by Header (Task 6), Overview (Task 9), ConfigurationTabs (Task 10), AmenitiesGrid/Gallery (Task 12), Connectivity (Task 14), FaqAccordion (Task 13).
- Produces types: `NavLink`, `Stat`, `UnitConfig`, `GalleryImage`, `ConnectivityCategory`, `FaqItem`.

- [ ] **Step 1: Write failing tests for the content module**

Create `lib/content.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  navLinks,
  overviewStats,
  unitConfigurations,
  amenityImages,
  galleryImages,
  connectivityCategories,
  faqItems,
} from './content';

describe('content data', () => {
  it('has 8 nav links', () => {
    expect(navLinks).toHaveLength(8);
  });

  it('has overview stats', () => {
    expect(overviewStats.length).toBeGreaterThan(0);
  });

  it('has both 3 BHK and 4 BHK configurations', () => {
    const ids = unitConfigurations.map((c) => c.id);
    expect(ids).toContain('3bhk');
    expect(ids).toContain('4bhk');
  });

  it('has 5 amenity images', () => {
    expect(amenityImages).toHaveLength(5);
  });

  it('has gallery images with both location and artist-impression tags', () => {
    const tags = galleryImages.map((g) => g.tag);
    expect(tags).toContain('Shot at Location');
    expect(tags).toContain("Artist's Impression");
  });

  it('every image has a non-empty https src', () => {
    const allImages = [
      ...unitConfigurations.map((c) => c.image),
      ...amenityImages.map((g) => g.src),
      ...galleryImages.map((g) => g.src),
    ];
    for (const src of allImages) {
      expect(src.startsWith('https://images.unsplash.com/')).toBe(true);
    }
  });

  it('has 9 connectivity categories', () => {
    expect(connectivityCategories).toHaveLength(9);
  });

  it('has 4 faq items', () => {
    expect(faqItems).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- lib/content.test.ts`
Expected: FAIL — `Cannot find module './content'`.

- [ ] **Step 3: Source and verify real Unsplash image URLs**

For each category below, find a suitable photo (e.g. via a web search or by browsing unsplash.com for the keyword), take its `images.unsplash.com/photo-<id>` CDN URL, append `?auto=format&fit=crop&w=1600&q=80`, and verify it resolves before using it:

```bash
curl -sI "https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=1600&q=80" | head -1
```

Expected: `HTTP/2 200` (or `HTTP/1.1 200 OK`). If it doesn't return 200, pick a different photo.

Categories to source (12 total): hero sea-view tower/skyline, 2x lifestyle/interior shots (Overview), 3BHK interior shot, 4BHK interior shot, 5x amenity shots (gazebo/pavilion, kids play area, lounge deck, rooftop sky deck, lawn/garden), 6x gallery shots (3 architectural/location-style, 3 interior render-style), 1x city map / aerial shot (Location section).

- [ ] **Step 4: Implement `lib/content.ts`**

```ts
export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: 'Overview', href: '#overview' },
  { label: 'Configuration', href: '#configuration' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Location', href: '#location' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact Us', href: '#contact' },
];

export type Stat = { label: string; value: string };

export const overviewStats: Stat[] = [
  { label: 'Tower', value: '37 Storeys' },
  { label: 'Wings', value: '2 Wings' },
  { label: 'Land Parcel', value: '1.5 Acres' },
  { label: 'Sea View', value: '180°' },
  { label: 'Amenity Levels', value: '3 Levels' },
];

export type UnitConfig = {
  id: '3bhk' | '4bhk';
  label: string;
  sizeRange: string;
  description: string;
  image: string;
};

export const unitConfigurations: UnitConfig[] = [
  {
    id: '3bhk',
    label: '3 BHK',
    sizeRange: '1,089 – 1,407 sq. ft.',
    description:
      'Thoughtfully designed 3 BHK residences framed by sweeping sea views and cross ventilation.',
    image: 'REPLACE_WITH_VERIFIED_URL',
  },
  {
    id: '4bhk',
    label: '4 BHK',
    sizeRange: '1,664 – 1,898 sq. ft.',
    description:
      'Expansive 4 BHK residences designed for panoramic living with dedicated entertaining spaces.',
    image: 'REPLACE_WITH_VERIFIED_URL',
  },
];

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  tag: 'Shot at Location' | "Artist's Impression";
};

export const amenityImages: GalleryImage[] = [
  { src: 'REPLACE_WITH_VERIFIED_URL', alt: 'Gazebo Pavilion', caption: 'Gazebo Pavilion', tag: "Artist's Impression" },
  { src: 'REPLACE_WITH_VERIFIED_URL', alt: 'Kids Outdoor Play Area', caption: 'Kids Outdoor Play Area', tag: "Artist's Impression" },
  { src: 'REPLACE_WITH_VERIFIED_URL', alt: 'Lounge Deck', caption: 'Lounge Deck', tag: "Artist's Impression" },
  { src: 'REPLACE_WITH_VERIFIED_URL', alt: 'Sky Deck', caption: 'Sky Deck', tag: "Artist's Impression" },
  { src: 'REPLACE_WITH_VERIFIED_URL', alt: 'Spillover Lawn', caption: 'Spillover Lawn', tag: "Artist's Impression" },
];

export const galleryImages: GalleryImage[] = [
  { src: 'REPLACE_WITH_VERIFIED_URL', alt: 'Tower exterior at dusk', caption: 'Tower Exterior', tag: 'Shot at Location' },
  { src: 'REPLACE_WITH_VERIFIED_URL', alt: 'Matunga neighbourhood street', caption: 'Matunga Bylane', tag: 'Shot at Location' },
  { src: 'REPLACE_WITH_VERIFIED_URL', alt: 'Sea view from the tower', caption: 'Sea View', tag: 'Shot at Location' },
  { src: 'REPLACE_WITH_VERIFIED_URL', alt: 'Rendered living room interior', caption: 'Living Room', tag: "Artist's Impression" },
  { src: 'REPLACE_WITH_VERIFIED_URL', alt: 'Rendered rooftop deck', caption: 'Rooftop Deck', tag: "Artist's Impression" },
  { src: 'REPLACE_WITH_VERIFIED_URL', alt: 'Rendered lobby', caption: 'Grand Lobby', tag: "Artist's Impression" },
];

export type ConnectivityCategory = {
  title: string;
  items: { label: string; distance?: string }[];
};

export const connectivityCategories: ConnectivityCategory[] = [
  {
    title: 'Transportation',
    items: [
      { label: 'Bandra-Worli Sea Link', distance: '6 km' },
      { label: 'Matunga Station', distance: '0.6 km' },
      { label: 'Western Express Highway', distance: '2.5 km' },
    ],
  },
  {
    title: 'Retail',
    items: [
      { label: 'Kohinoor Square' },
      { label: 'Phoenix Palladium' },
      { label: 'Jio World Drive' },
    ],
  },
  {
    title: 'Dining',
    items: [
      { label: 'Bastian' },
      { label: 'The Bombay Canteen' },
      { label: 'Ram Ashraya' },
      { label: 'Café Madras' },
    ],
  },
  {
    title: 'Recreation',
    items: [
      { label: 'Chatrapati Shivaji Maharaj Park' },
      { label: 'Dadar Chowpatty' },
    ],
  },
  {
    title: 'Hotels',
    items: [
      { label: "Taj Land's End" },
      { label: 'St. Regis' },
      { label: 'Sofitel' },
      { label: 'Trident' },
      { label: 'Four Seasons' },
    ],
  },
  {
    title: 'Clubs',
    items: [
      { label: 'Matunga Gymkhana' },
      { label: 'Shivaji Park Gymkhana' },
      { label: 'Park Club' },
    ],
  },
  {
    title: 'Healthcare',
    items: [
      { label: 'Hinduja Hospital', distance: '750 m' },
      { label: 'S.L. Raheja Hospital' },
    ],
  },
  {
    title: 'Education',
    items: [
      { label: 'Bombay Scottish School' },
      { label: 'R.A. Podar College' },
      { label: 'Welingkar Institute' },
    ],
  },
  {
    title: 'Future Infrastructure',
    items: [
      { label: 'Underground Metro Station', distance: '500 m' },
      { label: 'Coastal Promenade' },
    ],
  },
];

export type FaqItem = { question: string; answer: string };

export const faqItems: FaqItem[] = [
  {
    question: 'Where is this project located?',
    answer:
      'In a quaint bylane of Matunga, Mumbai — close to the Western Express Highway, Matunga Station, and the upcoming coastal promenade.',
  },
  {
    question: 'What is the current status of the project?',
    answer:
      'This is a demo/sample listing built to showcase landing page design and is not tied to a live construction timeline.',
  },
  {
    question: 'What configurations are available?',
    answer:
      '3 BHK residences (1,089 – 1,407 sq. ft.) and 4 BHK residences (1,664 – 1,898 sq. ft.).',
  },
  {
    question: 'Why should I consider a home here?',
    answer:
      'Sweeping 180° sea views, a prime Matunga location, and amenities spread across three levels make this an example of a premium coastal residence.',
  },
];
```

- [ ] **Step 5: Replace every `REPLACE_WITH_VERIFIED_URL` with the verified URLs from Step 3**

- [ ] **Step 6: Run and confirm pass**

Run: `npm test -- lib/content.test.ts`
Expected: `8 passed`.

- [ ] **Step 7: Commit**

```bash
git add lib/content.ts lib/content.test.ts
git commit -m "Add content data module with sourced and verified imagery"
```

---

### Task 4: Modal Component + Modal Context

**Files:**
- Create: `components/Modal.tsx`, `components/Modal.test.tsx`
- Create: `lib/modal-context.tsx`, `lib/modal-context.test.tsx`

**Interfaces:**
- Produces: `type ModalProps = { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }`, `export default function Modal(props: ModalProps)`.
- Produces: `type ModalType = 'enquire' | 'brochure' | 'contact' | null`, `ModalProvider`, `useModal(): { activeModal: ModalType; openModal: (type: Exclude<ModalType, null>) => void; closeModal: () => void }` — consumed by Header (Task 6), Overview (Task 9), GetInTouch (Task 15), and `app/page.tsx` (Task 16).

- [ ] **Step 1: Write failing tests for `Modal`**

Create `components/Modal.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test">
        <p>content</p>
      </Modal>
    );
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });

  it('renders children and title when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Title">
        <p>content</p>
      </Modal>
    );
    expect(screen.getByText('content')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>content</p>
      </Modal>
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>content</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- components/Modal.test.tsx`
Expected: FAIL — `Cannot find module './Modal'`.

- [ ] **Step 3: Implement `components/Modal.tsx`**

```tsx
'use client';

import { useEffect } from 'react';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-lg bg-sand p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 id="modal-title" className="font-display text-xl text-navy">
            {title}
          </h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-navy/60 hover:text-navy"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test -- components/Modal.test.tsx`
Expected: `4 passed`.

- [ ] **Step 5: Write failing tests for the modal context**

Create `lib/modal-context.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalProvider, useModal } from './modal-context';

function TestConsumer() {
  const { activeModal, openModal, closeModal } = useModal();
  return (
    <div>
      <p>active: {activeModal ?? 'none'}</p>
      <button onClick={() => openModal('enquire')}>open enquire</button>
      <button onClick={closeModal}>close</button>
    </div>
  );
}

describe('modal context', () => {
  it('starts with no active modal', () => {
    render(
      <ModalProvider>
        <TestConsumer />
      </ModalProvider>
    );
    expect(screen.getByText('active: none')).toBeInTheDocument();
  });

  it('opens and closes a modal by type', () => {
    render(
      <ModalProvider>
        <TestConsumer />
      </ModalProvider>
    );
    fireEvent.click(screen.getByText('open enquire'));
    expect(screen.getByText('active: enquire')).toBeInTheDocument();
    fireEvent.click(screen.getByText('close'));
    expect(screen.getByText('active: none')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run and confirm failure**

Run: `npm test -- lib/modal-context.test.tsx`
Expected: FAIL — `Cannot find module './modal-context'`.

- [ ] **Step 7: Implement `lib/modal-context.tsx`**

```tsx
'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export type ModalType = 'enquire' | 'brochure' | 'contact' | null;

type ModalContextValue = {
  activeModal: ModalType;
  openModal: (type: Exclude<ModalType, null>) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const value = useMemo<ModalContextValue>(
    () => ({
      activeModal,
      openModal: (type) => setActiveModal(type),
      closeModal: () => setActiveModal(null),
    }),
    [activeModal]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within a ModalProvider');
  return ctx;
}
```

- [ ] **Step 8: Run and confirm pass**

Run: `npm test -- lib/modal-context.test.tsx`
Expected: `2 passed`.

- [ ] **Step 9: Commit**

```bash
git add components/Modal.tsx components/Modal.test.tsx lib/modal-context.tsx lib/modal-context.test.tsx
git commit -m "Add Modal component and modal context"
```

---

### Task 5: LeadForm Component

**Files:**
- Create: `components/LeadForm.tsx`, `components/LeadForm.test.tsx`

**Interfaces:**
- Consumes: `validateLeadForm` from `lib/validation.ts` (Task 2).
- Produces: `type LeadFormProps = { formId: string; submitLabel?: string }`, `export default function LeadForm(props: LeadFormProps)` — consumed by Hero (Task 8), Overview brochure modal (Task 9), GetInTouch (Task 15), and the Enquire/Contact modals (Task 16).

- [ ] **Step 1: Write failing tests for `LeadForm`**

Create `components/LeadForm.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LeadForm from './LeadForm';

describe('LeadForm', () => {
  it('shows validation errors when submitted empty', () => {
    render(<LeadForm formId="test-form" />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid 10-digit phone number.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('shows a success state after a valid submission', () => {
    render(<LeadForm formId="test-form" />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Asha Mehta' } });
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'asha@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/thanks/i)).toBeInTheDocument();
  });

  it('uses a custom submit label when provided', () => {
    render(<LeadForm formId="test-form" submitLabel="Download Brochure" />);
    expect(screen.getByRole('button', { name: 'Download Brochure' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- components/LeadForm.test.tsx`
Expected: FAIL — `Cannot find module './LeadForm'`.

- [ ] **Step 3: Implement `components/LeadForm.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { validateLeadForm, type LeadFormValues, type LeadFormErrors } from '@/lib/validation';

export type LeadFormProps = {
  formId: string;
  submitLabel?: string;
};

const initialValues: LeadFormValues = {
  name: '',
  phone: '',
  email: '',
  whatsappOptIn: false,
};

export default function LeadForm({ formId, submitLabel = 'Submit' }: LeadFormProps) {
  const [values, setValues] = useState<LeadFormValues>(initialValues);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="rounded-md bg-navy/5 p-4 text-navy">
        Thanks! We&apos;ll be in touch shortly.
      </p>
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validationErrors = validateLeadForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      <div>
        <label htmlFor={`${formId}-name`}>Name</label>
        <input
          id={`${formId}-name`}
          type="text"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          className="mt-1 w-full rounded border border-navy/20 p-2"
        />
        {errors.name && <p className="text-sm text-red-700">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor={`${formId}-phone`}>Phone</label>
        <input
          id={`${formId}-phone`}
          type="tel"
          value={values.phone}
          onChange={(e) => setValues({ ...values, phone: e.target.value })}
          className="mt-1 w-full rounded border border-navy/20 p-2"
        />
        {errors.phone && <p className="text-sm text-red-700">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor={`${formId}-email`}>Email</label>
        <input
          id={`${formId}-email`}
          type="email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          className="mt-1 w-full rounded border border-navy/20 p-2"
        />
        {errors.email && <p className="text-sm text-red-700">{errors.email}</p>}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.whatsappOptIn}
          onChange={(e) => setValues({ ...values, whatsappOptIn: e.target.checked })}
        />
        Contact me on WhatsApp
      </label>

      <button
        type="submit"
        className="mt-2 rounded bg-navy px-4 py-2 font-medium text-sand hover:bg-navy-light"
      >
        {submitLabel}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test -- components/LeadForm.test.tsx`
Expected: `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/LeadForm.tsx components/LeadForm.test.tsx
git commit -m "Add LeadForm component with client-side validation and fake success state"
```

---

### Task 6: Header (Nav + Mobile Menu)

**Files:**
- Modify: `vitest.setup.ts` (add `IntersectionObserver` mock)
- Create: `components/Header.tsx`, `components/Header.test.tsx`

**Interfaces:**
- Consumes: `navLinks` from `lib/content.ts` (Task 3), `useModal` from `lib/modal-context.tsx` (Task 4).
- Produces: `export default function Header()` — rendered once in `app/page.tsx` (Task 16).

- [ ] **Step 1: Add an `IntersectionObserver` mock for jsdom**

Append to `vitest.setup.ts`:

```ts
class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error jsdom does not implement IntersectionObserver
global.IntersectionObserver = IntersectionObserverMock;
```

- [ ] **Step 2: Write failing tests for `Header`**

Create `components/Header.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { ModalProvider } from '@/lib/modal-context';
import { navLinks } from '@/lib/content';

function renderHeader() {
  return render(
    <ModalProvider>
      <Header />
    </ModalProvider>
  );
}

describe('Header', () => {
  it('renders every nav link', () => {
    renderHeader();
    for (const link of navLinks) {
      expect(screen.getAllByText(link.label).length).toBeGreaterThan(0);
    }
  });

  it('mobile menu is closed by default and opens on toggle click', () => {
    renderHeader();
    const nav = screen.getByRole('navigation');
    expect(nav.className).not.toContain('flex');
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getByRole('navigation').className).toContain('flex');
  });

  it('renders an Enquire Now button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: 'Enquire Now' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run and confirm failure**

Run: `npm test -- components/Header.test.tsx`
Expected: FAIL — `Cannot find module './Header'`.

- [ ] **Step 4: Implement `components/Header.tsx`**

```tsx
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
            menuOpen ? 'flex' : 'hidden'
          } absolute left-0 top-full w-full flex-col gap-4 bg-sand p-4 shadow-md md:static md:flex md:w-auto md:flex-row md:items-center md:p-0 md:shadow-none`}
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
```

- [ ] **Step 5: Run and confirm pass**

Run: `npm test -- components/Header.test.tsx`
Expected: `3 passed`.

- [ ] **Step 6: Commit**

```bash
git add vitest.setup.ts components/Header.tsx components/Header.test.tsx
git commit -m "Add sticky Header with mobile menu and Enquire Now trigger"
```

---

### Task 7: MobileStickyBar

**Files:**
- Create: `components/MobileStickyBar.tsx`, `components/MobileStickyBar.test.tsx`

**Interfaces:**
- Consumes: `shouldShowStickyBar` from `lib/scroll.ts` (Task 2), `useModal` from `lib/modal-context.tsx` (Task 4).
- Produces: `export default function MobileStickyBar()` — rendered once in `app/page.tsx` (Task 16).

- [ ] **Step 1: Write failing tests for `MobileStickyBar`**

Create `components/MobileStickyBar.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileStickyBar from './MobileStickyBar';
import { ModalProvider } from '@/lib/modal-context';

function renderBar() {
  return render(
    <ModalProvider>
      <MobileStickyBar />
    </ModalProvider>
  );
}

describe('MobileStickyBar', () => {
  it('is hidden before scrolling', () => {
    renderBar();
    expect(screen.getByTestId('sticky-bar').className).toContain('translate-y-full');
  });

  it('becomes visible after scrolling past the hero', () => {
    renderBar();
    Object.defineProperty(window, 'scrollY', { value: 900, writable: true });
    fireEvent.scroll(window);
    expect(screen.getByTestId('sticky-bar').className).not.toContain('translate-y-full');
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- components/MobileStickyBar.test.tsx`
Expected: FAIL — `Cannot find module './MobileStickyBar'`.

- [ ] **Step 3: Implement `components/MobileStickyBar.tsx`**

```tsx
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
    window.addEventListener('scroll', handleScroll);
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
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test -- components/MobileStickyBar.test.tsx`
Expected: `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/MobileStickyBar.tsx components/MobileStickyBar.test.tsx
git commit -m "Add mobile sticky Enquire Now bar"
```

---

### Task 8: Hero Section

**Files:**
- Create: `components/Hero.tsx`, `components/Hero.test.tsx`

**Interfaces:**
- Consumes: `LeadForm` from `components/LeadForm.tsx` (Task 5).
- Produces: `export default function Hero()` — rendered first in `app/page.tsx` (Task 16), root element has `id="home"`.

- [ ] **Step 1: Write a failing smoke test for `Hero`**

Create `components/Hero.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from './Hero';

describe('Hero', () => {
  it('renders the headline and an inline lead form', () => {
    render(<Hero />);
    expect(
      screen.getByText('The Iconic Address Where Sea Views Meet Timeless Charm')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- components/Hero.test.tsx`
Expected: FAIL — `Cannot find module './Hero'`.

- [ ] **Step 3: Implement `components/Hero.tsx`**

```tsx
import Image from 'next/image';
import LeadForm from './LeadForm';
import { unitConfigurations } from '@/lib/content';

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-[640px] items-center pt-24 text-sand">
      <Image
        src={unitConfigurations[0].image}
        alt="Sea-facing tower exterior"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-navy/60" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 md:grid-cols-2">
        <div>
          <h1 className="font-display text-3xl leading-tight md:text-5xl">
            The Iconic Address Where Sea Views Meet Timeless Charm
          </h1>
          <p className="mt-4 max-w-md text-sand/90">
            Rustomjee 180 Bayview blends heritage charm with modern luxury in the heart of
            Matunga, Mumbai.
          </p>
        </div>

        <div className="rounded-lg bg-sand p-6 text-navy shadow-xl">
          <h2 className="font-display text-xl">Get in Touch</h2>
          <LeadForm formId="hero" submitLabel="Enquire Now" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test -- components/Hero.test.tsx`
Expected: `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx components/Hero.test.tsx
git commit -m "Add Hero section with inline lead capture form"
```

---

### Task 9: Overview Section

**Files:**
- Create: `components/Overview.tsx`, `components/Overview.test.tsx`

**Interfaces:**
- Consumes: `overviewStats` from `lib/content.ts` (Task 3), `useModal` from `lib/modal-context.tsx` (Task 4).
- Produces: `export default function Overview()` — root element has `id="overview"`.

- [ ] **Step 1: Write failing tests for `Overview`**

Create `components/Overview.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Overview from './Overview';
import { ModalProvider } from '@/lib/modal-context';
import { overviewStats } from '@/lib/content';

describe('Overview', () => {
  it('renders every stat', () => {
    render(
      <ModalProvider>
        <Overview />
      </ModalProvider>
    );
    for (const stat of overviewStats) {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
    }
  });

  it('opens the brochure modal via context when the CTA is clicked', () => {
    function Probe() {
      const { useModal } = require('@/lib/modal-context');
      const { activeModal } = useModal();
      return <p>modal: {activeModal ?? 'none'}</p>;
    }
    render(
      <ModalProvider>
        <Overview />
        <Probe />
      </ModalProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /download brochure/i }));
    expect(screen.getByText('modal: brochure')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- components/Overview.test.tsx`
Expected: FAIL — `Cannot find module './Overview'`.

- [ ] **Step 3: Implement `components/Overview.tsx`**

```tsx
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
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test -- components/Overview.test.tsx`
Expected: `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/Overview.tsx components/Overview.test.tsx
git commit -m "Add Overview section with stats and brochure download CTA"
```

---

### Task 10: ConfigurationTabs

**Files:**
- Create: `components/ConfigurationTabs.tsx`, `components/ConfigurationTabs.test.tsx`

**Interfaces:**
- Consumes: `unitConfigurations` from `lib/content.ts` (Task 3).
- Produces: `export default function ConfigurationTabs()` — rendered inside a `<section id="configuration">` wrapper in `app/page.tsx` (Task 16).

- [ ] **Step 1: Write failing tests for `ConfigurationTabs`**

Create `components/ConfigurationTabs.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfigurationTabs from './ConfigurationTabs';

describe('ConfigurationTabs', () => {
  it('shows the 3 BHK panel by default', () => {
    render(<ConfigurationTabs />);
    expect(screen.getByText('1,089 – 1,407 sq. ft.')).toBeInTheDocument();
  });

  it('switches to the 4 BHK panel on click', () => {
    render(<ConfigurationTabs />);
    fireEvent.click(screen.getByRole('tab', { name: '4 BHK' }));
    expect(screen.getByText('1,664 – 1,898 sq. ft.')).toBeInTheDocument();
    expect(screen.queryByText('1,089 – 1,407 sq. ft.')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- components/ConfigurationTabs.test.tsx`
Expected: FAIL — `Cannot find module './ConfigurationTabs'`.

- [ ] **Step 3: Implement `components/ConfigurationTabs.tsx`**

```tsx
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
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test -- components/ConfigurationTabs.test.tsx`
Expected: `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/ConfigurationTabs.tsx components/ConfigurationTabs.test.tsx
git commit -m "Add ConfigurationTabs for 3 BHK / 4 BHK switching"
```

---

### Task 11: Lightbox Component

**Files:**
- Create: `components/Lightbox.tsx`, `components/Lightbox.test.tsx`

**Interfaces:**
- Consumes: `nextIndex`, `prevIndex` from `lib/lightbox-nav.ts` (Task 2).
- Produces: `type LightboxImage = { src: string; alt: string; caption?: string }`, `type LightboxProps = { images: LightboxImage[]; openIndex: number | null; onClose: () => void; onNavigate: (newIndex: number) => void }`, `export default function Lightbox(props: LightboxProps)` — consumed by AmenitiesGrid and Gallery (Task 12).

- [ ] **Step 1: Write failing tests for `Lightbox`**

Create `components/Lightbox.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Lightbox from './Lightbox';

const images = [
  { src: 'https://images.unsplash.com/a.jpg', alt: 'A', caption: 'A' },
  { src: 'https://images.unsplash.com/b.jpg', alt: 'B', caption: 'B' },
  { src: 'https://images.unsplash.com/c.jpg', alt: 'C', caption: 'C' },
];

describe('Lightbox', () => {
  it('renders nothing when openIndex is null', () => {
    render(<Lightbox images={images} openIndex={null} onClose={() => {}} onNavigate={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the image at openIndex', () => {
    render(<Lightbox images={images} openIndex={1} onClose={() => {}} onNavigate={() => {}} />);
    expect(screen.getByAltText('B')).toBeInTheDocument();
  });

  it('calls onNavigate with the next index, wrapping at the end', () => {
    const onNavigate = vi.fn();
    render(
      <Lightbox images={images} openIndex={2} onClose={() => {}} onNavigate={onNavigate} />
    );
    fireEvent.click(screen.getByLabelText('Next image'));
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it('calls onNavigate with the previous index, wrapping at the start', () => {
    const onNavigate = vi.fn();
    render(
      <Lightbox images={images} openIndex={0} onClose={() => {}} onNavigate={onNavigate} />
    );
    fireEvent.click(screen.getByLabelText('Previous image'));
    expect(onNavigate).toHaveBeenCalledWith(2);
  });

  it('calls onClose on Escape', () => {
    const onClose = vi.fn();
    render(<Lightbox images={images} openIndex={0} onClose={onClose} onNavigate={() => {}} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- components/Lightbox.test.tsx`
Expected: FAIL — `Cannot find module './Lightbox'`.

- [ ] **Step 3: Implement `components/Lightbox.tsx`**

```tsx
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

  if (openIndex === null) return null;

  const current = images[openIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
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
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test -- components/Lightbox.test.tsx`
Expected: `5 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/Lightbox.tsx components/Lightbox.test.tsx
git commit -m "Add shared Lightbox component with wraparound navigation"
```

---

### Task 12: AmenitiesGrid + Gallery Sections

**Files:**
- Create: `components/AmenitiesGrid.tsx`, `components/AmenitiesGrid.test.tsx`
- Create: `components/Gallery.tsx`, `components/Gallery.test.tsx`

**Interfaces:**
- Consumes: `amenityImages`, `galleryImages` from `lib/content.ts` (Task 3); `Lightbox` from `components/Lightbox.tsx` (Task 11).
- Produces: `export default function AmenitiesGrid()` (root `id="amenities"`), `export default function Gallery()` (root `id="gallery"`).

- [ ] **Step 1: Write failing tests for `AmenitiesGrid`**

Create `components/AmenitiesGrid.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AmenitiesGrid from './AmenitiesGrid';
import { amenityImages } from '@/lib/content';

describe('AmenitiesGrid', () => {
  it('renders every amenity thumbnail', () => {
    render(<AmenitiesGrid />);
    for (const image of amenityImages) {
      expect(screen.getByAltText(image.alt)).toBeInTheDocument();
    }
  });

  it('opens the lightbox at the clicked image', () => {
    render(<AmenitiesGrid />);
    fireEvent.click(screen.getByAltText(amenityImages[1].alt));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- components/AmenitiesGrid.test.tsx`
Expected: FAIL — `Cannot find module './AmenitiesGrid'`.

- [ ] **Step 3: Implement `components/AmenitiesGrid.tsx`**

```tsx
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
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test -- components/AmenitiesGrid.test.tsx`
Expected: `2 passed`.

- [ ] **Step 5: Write failing tests for `Gallery`**

Create `components/Gallery.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Gallery from './Gallery';
import { galleryImages } from '@/lib/content';

describe('Gallery', () => {
  it('renders every gallery thumbnail with its tag', () => {
    render(<Gallery />);
    for (const image of galleryImages) {
      expect(screen.getByAltText(image.alt)).toBeInTheDocument();
    }
    expect(screen.getAllByText('Shot at Location').length).toBeGreaterThan(0);
    expect(screen.getAllByText("Artist's Impression").length).toBeGreaterThan(0);
  });

  it('opens the lightbox at the clicked image', () => {
    render(<Gallery />);
    fireEvent.click(screen.getByAltText(galleryImages[0].alt));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run and confirm failure**

Run: `npm test -- components/Gallery.test.tsx`
Expected: FAIL — `Cannot find module './Gallery'`.

- [ ] **Step 7: Implement `components/Gallery.tsx`**

```tsx
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
```

- [ ] **Step 8: Run and confirm pass**

Run: `npm test -- components/Gallery.test.tsx`
Expected: `2 passed`.

- [ ] **Step 9: Commit**

```bash
git add components/AmenitiesGrid.tsx components/AmenitiesGrid.test.tsx components/Gallery.tsx components/Gallery.test.tsx
git commit -m "Add Amenities and Gallery sections with shared Lightbox"
```

---

### Task 13: FaqAccordion

**Files:**
- Create: `components/FaqAccordion.tsx`, `components/FaqAccordion.test.tsx`

**Interfaces:**
- Consumes: `FaqItem` type and `faqItems` from `lib/content.ts` (Task 3).
- Produces: `type FaqAccordionProps = { items: FaqItem[] }`, `export default function FaqAccordion(props: FaqAccordionProps)` — rendered inside a `<section id="faq">` wrapper in `app/page.tsx` (Task 16).

- [ ] **Step 1: Write failing tests for `FaqAccordion`**

Create `components/FaqAccordion.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FaqAccordion from './FaqAccordion';

const items = [
  { question: 'Q1', answer: 'A1' },
  { question: 'Q2', answer: 'A2' },
];

describe('FaqAccordion', () => {
  it('starts with all answers collapsed', () => {
    render(<FaqAccordion items={items} />);
    expect(screen.queryByText('A1')).not.toBeInTheDocument();
    expect(screen.queryByText('A2')).not.toBeInTheDocument();
  });

  it('expands an answer on click and collapses it on a second click', () => {
    render(<FaqAccordion items={items} />);
    fireEvent.click(screen.getByText('Q1'));
    expect(screen.getByText('A1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Q1'));
    expect(screen.queryByText('A1')).not.toBeInTheDocument();
  });

  it('only keeps one answer open at a time', () => {
    render(<FaqAccordion items={items} />);
    fireEvent.click(screen.getByText('Q1'));
    fireEvent.click(screen.getByText('Q2'));
    expect(screen.queryByText('A1')).not.toBeInTheDocument();
    expect(screen.getByText('A2')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- components/FaqAccordion.test.tsx`
Expected: FAIL — `Cannot find module './FaqAccordion'`.

- [ ] **Step 3: Implement `components/FaqAccordion.tsx`**

```tsx
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
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test -- components/FaqAccordion.test.tsx`
Expected: `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/FaqAccordion.tsx components/FaqAccordion.test.tsx
git commit -m "Add single-open FaqAccordion component"
```

---

### Task 14: About + Connectivity Sections

**Files:**
- Create: `components/About.tsx`, `components/About.test.tsx`
- Create: `components/Connectivity.tsx`, `components/Connectivity.test.tsx`

**Interfaces:**
- Consumes: `connectivityCategories` from `lib/content.ts` (Task 3).
- Produces: `export default function About()` (root `id="about"`), `export default function Connectivity()` (root `id="location"`).

- [ ] **Step 1: Write a failing smoke test for `About`**

Create `components/About.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About';

describe('About', () => {
  it('renders the location/heritage copy', () => {
    render(<About />);
    expect(screen.getByText(/Matunga/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- components/About.test.tsx`
Expected: FAIL — `Cannot find module './About'`.

- [ ] **Step 3: Implement `components/About.tsx`**

```tsx
export default function About() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-4 py-16">
      <h2 className="font-display text-3xl text-navy">About</h2>
      <p className="mt-4 text-navy/80">
        Tucked into a quaint bylane of Matunga, Rustomjee 180 Bayview rises 37 storeys above the
        city, offering sweeping 180° sea views and amenities spread across three levels — a rare
        address where heritage neighbourhood charm meets contemporary luxury.
      </p>
      <a href="#location" className="mt-4 inline-block font-medium text-gold hover:underline">
        Know More →
      </a>
    </section>
  );
}
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test -- components/About.test.tsx`
Expected: `1 passed`.

- [ ] **Step 5: Write a failing test for `Connectivity`**

Create `components/Connectivity.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Connectivity from './Connectivity';
import { connectivityCategories } from '@/lib/content';

describe('Connectivity', () => {
  it('renders every category title', () => {
    render(<Connectivity />);
    for (const category of connectivityCategories) {
      expect(screen.getByText(category.title)).toBeInTheDocument();
    }
  });

  it('renders items with their distance when present', () => {
    render(<Connectivity />);
    expect(screen.getByText(/Matunga Station/)).toBeInTheDocument();
    expect(screen.getByText(/0.6 km/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run and confirm failure**

Run: `npm test -- components/Connectivity.test.tsx`
Expected: FAIL — `Cannot find module './Connectivity'`.

- [ ] **Step 7: Implement `components/Connectivity.tsx`**

```tsx
import { connectivityCategories } from '@/lib/content';

export default function Connectivity() {
  return (
    <section id="location" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-display text-3xl text-navy">Connectivity</h2>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {connectivityCategories.map((category) => (
          <div key={category.title}>
            <h3 className="font-medium text-navy">{category.title}</h3>
            <ul className="mt-2 space-y-1 text-navy/80">
              {category.items.map((item) => (
                <li key={item.label}>
                  {item.label}
                  {item.distance ? ` — ${item.distance}` : ''}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Run and confirm pass**

Run: `npm test -- components/Connectivity.test.tsx`
Expected: `2 passed`.

- [ ] **Step 9: Commit**

```bash
git add components/About.tsx components/About.test.tsx components/Connectivity.tsx components/Connectivity.test.tsx
git commit -m "Add About and Connectivity sections"
```

---

### Task 15: GetInTouch, ReraFooter, Footer

**Files:**
- Create: `components/GetInTouch.tsx`, `components/GetInTouch.test.tsx`
- Create: `components/ReraFooter.tsx`, `components/ReraFooter.test.tsx`
- Create: `components/Footer.tsx`, `components/Footer.test.tsx`

**Interfaces:**
- Consumes: `LeadForm` from `components/LeadForm.tsx` (Task 5).
- Produces: `export default function GetInTouch()` (root `id="contact"`), `export default function ReraFooter()`, `export default function Footer()`.

- [ ] **Step 1: Write a failing test for `GetInTouch`**

Create `components/GetInTouch.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GetInTouch from './GetInTouch';

describe('GetInTouch', () => {
  it('renders a heading and a lead form', () => {
    render(<GetInTouch />);
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- components/GetInTouch.test.tsx`
Expected: FAIL — `Cannot find module './GetInTouch'`.

- [ ] **Step 3: Implement `components/GetInTouch.tsx`**

```tsx
import LeadForm from './LeadForm';

export default function GetInTouch() {
  return (
    <section id="contact" className="mx-auto max-w-md px-4 py-16">
      <h2 className="font-display text-3xl text-navy">Get in Touch</h2>
      <p className="mt-2 text-navy/80">
        Leave your details and our team will reach out with more information.
      </p>
      <div className="mt-6">
        <LeadForm formId="contact-section" submitLabel="Contact Us" />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test -- components/GetInTouch.test.tsx`
Expected: `1 passed`.

- [ ] **Step 5: Write a failing test for `ReraFooter`**

Create `components/ReraFooter.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReraFooter from './ReraFooter';

describe('ReraFooter', () => {
  it('shows placeholder RERA numbers, never the real ones', () => {
    render(<ReraFooter />);
    expect(screen.getByText(/P00000000000/)).toBeInTheDocument();
    expect(screen.getByText(/P00000000001/)).toBeInTheDocument();
    expect(screen.queryByText(/P51900066547/)).not.toBeInTheDocument();
    expect(screen.queryByText(/P51900066548/)).not.toBeInTheDocument();
  });

  it('shows a demo disclaimer', () => {
    render(<ReraFooter />);
    expect(screen.getByText(/demonstration purposes only/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run and confirm failure**

Run: `npm test -- components/ReraFooter.test.tsx`
Expected: FAIL — `Cannot find module './ReraFooter'`.

- [ ] **Step 7: Implement `components/ReraFooter.tsx`**

```tsx
export default function ReraFooter() {
  return (
    <section className="bg-navy-light px-4 py-8 text-sm text-sand/90">
      <div className="mx-auto max-w-6xl">
        <p>RERA Registration — Wing A: P00000000000 | Wing B: P00000000001</p>
        <p className="mt-2">
          This is a sample project built for demonstration purposes only and is not an official
          or live real estate listing. For details on any real project, refer to the developer&apos;s
          official website and the{' '}
          <a
            href="https://maharera.mahaonline.gov.in"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Maharashtra RERA portal
          </a>
          .
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Run and confirm pass**

Run: `npm test -- components/ReraFooter.test.tsx`
Expected: `2 passed`.

- [ ] **Step 9: Write a failing test for `Footer`**

Create `components/Footer.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the copyright with a demo-build note', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 Rustomjee/)).toBeInTheDocument();
    expect(screen.getByText(/Demo build/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 10: Run and confirm failure**

Run: `npm test -- components/Footer.test.tsx`
Expected: FAIL — `Cannot find module './Footer'`.

- [ ] **Step 11: Implement `components/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="bg-navy px-4 py-6 text-center text-sm text-sand/70">
      <p>
        © 2026 Rustomjee. All rights reserved. Demo build for portfolio purposes — not an
        official listing.
      </p>
    </footer>
  );
}
```

- [ ] **Step 12: Run and confirm pass**

Run: `npm test -- components/Footer.test.tsx`
Expected: `1 passed`.

- [ ] **Step 13: Commit**

```bash
git add components/GetInTouch.tsx components/GetInTouch.test.tsx components/ReraFooter.tsx components/ReraFooter.test.tsx components/Footer.tsx components/Footer.test.tsx
git commit -m "Add GetInTouch, RERA disclaimer, and Footer sections"
```

---

### Task 16: Assemble the Full Page

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: every component from Tasks 4–15, `faqItems` from `lib/content.ts` (Task 3).

- [ ] **Step 1: Write a failing integration test for `app/page.tsx`**

Create `app/page.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from './page';

describe('Home page', () => {
  it('renders every major section landmark', () => {
    render(<Page />);
    expect(document.getElementById('home')).toBeInTheDocument();
    expect(document.getElementById('overview')).toBeInTheDocument();
    expect(document.getElementById('configuration')).toBeInTheDocument();
    expect(document.getElementById('amenities')).toBeInTheDocument();
    expect(document.getElementById('gallery')).toBeInTheDocument();
    expect(document.getElementById('about')).toBeInTheDocument();
    expect(document.getElementById('location')).toBeInTheDocument();
    expect(document.getElementById('faq')).toBeInTheDocument();
    expect(document.getElementById('contact')).toBeInTheDocument();
  });

  it('opens the Enquire Now modal from the header', () => {
    render(<Page />);
    fireEvent.click(screen.getByRole('button', { name: 'Enquire Now' }));
    expect(screen.getByRole('dialog', { name: /enquire now/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- app/page.test.tsx`
Expected: FAIL — the sections/modal don't exist yet in the current `app/page.tsx` scaffold.

- [ ] **Step 3: Implement `app/page.tsx`**

```tsx
'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Overview from '@/components/Overview';
import ConfigurationTabs from '@/components/ConfigurationTabs';
import AmenitiesGrid from '@/components/AmenitiesGrid';
import Gallery from '@/components/Gallery';
import About from '@/components/About';
import Connectivity from '@/components/Connectivity';
import FaqAccordion from '@/components/FaqAccordion';
import GetInTouch from '@/components/GetInTouch';
import ReraFooter from '@/components/ReraFooter';
import Footer from '@/components/Footer';
import MobileStickyBar from '@/components/MobileStickyBar';
import Modal from '@/components/Modal';
import LeadForm from '@/components/LeadForm';
import { ModalProvider, useModal } from '@/lib/modal-context';
import { faqItems } from '@/lib/content';

function GlobalModals() {
  const { activeModal, closeModal } = useModal();

  return (
    <>
      <Modal isOpen={activeModal === 'enquire'} onClose={closeModal} title="Enquire Now">
        <LeadForm formId="modal-enquire" submitLabel="Enquire Now" />
      </Modal>
      <Modal isOpen={activeModal === 'brochure'} onClose={closeModal} title="Download Brochure">
        <LeadForm formId="modal-brochure" submitLabel="Download Brochure" />
      </Modal>
      <Modal isOpen={activeModal === 'contact'} onClose={closeModal} title="Contact Us">
        <LeadForm formId="modal-contact" submitLabel="Contact Us" />
      </Modal>
    </>
  );
}

export default function Page() {
  return (
    <ModalProvider>
      <Header />
      <main>
        <Hero />
        <Overview />
        <section id="configuration" className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl text-navy">Configuration</h2>
          <div className="mt-8">
            <ConfigurationTabs />
          </div>
        </section>
        <AmenitiesGrid />
        <Gallery />
        <About />
        <Connectivity />
        <section id="faq" className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="font-display text-3xl text-navy">FAQ</h2>
          <div className="mt-8">
            <FaqAccordion items={faqItems} />
          </div>
        </section>
        <GetInTouch />
      </main>
      <ReraFooter />
      <Footer />
      <MobileStickyBar />
      <GlobalModals />
    </ModalProvider>
  );
}
```

- [ ] **Step 4: Give the modal an accessible name matching the test**

The `Modal` component (Task 4) already sets `aria-labelledby="modal-title"` pointing at the title heading, so `getByRole('dialog', { name: /enquire now/i })` will match once the "Enquire Now" modal's `title` prop renders as its `h3#modal-title`. No further change needed if Task 4 was implemented as specified — just confirm this in the next step.

- [ ] **Step 5: Run and confirm pass**

Run: `npm test -- app/page.test.tsx`
Expected: `2 passed`.

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: all test files pass, 0 failures.

- [ ] **Step 7: Build the production bundle**

Run: `npm run build`
Expected: `Compiled successfully`.

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx app/page.test.tsx
git commit -m "Assemble full landing page with global enquiry modals"
```

---

### Task 17: Manual Verification Pass

**Files:** none (verification only; fix forward in whichever file if an issue is found)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: server starts on `http://localhost:3000`.

- [ ] **Step 2: Walk the desktop viewport (≥1280px wide)**

Check, in order: header nav links scroll to each section; mobile hamburger is hidden; hero form validates then shows the thank-you state; Overview stats render; "Download Brochure" opens the brochure modal; Configuration tabs switch between 3 BHK and 4 BHK; clicking an amenity image opens the lightbox and next/prev/Escape all work; same for the gallery; About "Know More" link scrolls to Location; Connectivity lists all 9 categories; FAQ accordion opens one item at a time; Get in Touch form works; RERA section shows only placeholder numbers; footer shows the demo disclaimer.

- [ ] **Step 3: Walk the mobile viewport (375px wide, e.g. via browser dev tools device toolbar)**

Check: hamburger menu opens/closes and closes after navigating; the sticky "Enquire Now" bar appears after scrolling past the hero and opens the enquire modal; Configuration tabs, Amenities grid, and Gallery grid reflow to a single/double column; all forms remain usable.

- [ ] **Step 4: Fix any issues found**

If any check in Step 2 or 3 fails, fix it in the relevant component file, re-run `npm test` and `npm run build` to confirm nothing regressed, then commit the fix with a message describing what was broken.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "Manual verification pass: confirm all interactions and responsive breakpoints" --allow-empty
```
