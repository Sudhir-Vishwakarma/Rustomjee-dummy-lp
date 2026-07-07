# Rustomjee 180 Bayview — Landing Page (Demo Build)

## Purpose

A from-scratch recreation of the `rustomjee180bayview.com` landing page, built as a portfolio/client demonstration piece. Not an official or live listing — no real backend, no real regulatory numbers.

## Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS for styling
- No additional UI/animation/carousel libraries — all interactive widgets (tabs, accordion, lightbox, modals, sticky nav with scroll-spy) are hand-built React components
- Google Fonts: a serif/display font for headings (e.g. Fraunces or Playfair Display), Inter for body text

## Page Structure

Single scrolling page (`app/page.tsx`), composed of the following sections in order:

1. **Sticky header/nav** — logo, links (Overview, Configuration, Amenities, Gallery, About, Location, FAQ, Contact Us), "Enquire Now" CTA button. Scroll-spy highlights the active section. Collapses to a hamburger + slide-in menu on mobile.
2. **Hero** — full-bleed sea-view image, headline ("The Iconic Address Where Sea Views Meet Timeless Charm"), subhead, inline `LeadForm`.
3. **Overview** — key stats (37-storey tower, 2 wings, 1.5 acres, 180° sea view, amenities across 3 levels) + "Download Brochure" CTA (opens `LeadForm` modal).
4. **Configuration** — tabbed 3BHK (1089–1407 sq ft) / 4BHK (1664–1898 sq ft) switcher, unit specs, simple labeled floor-plan-style graphics (not real architectural plans).
5. **Amenities** — grid gallery (Gazebo Pavilion, Kids Outdoor Play Area, Lounge Deck, Sky Deck, Spillover Lawn, etc.), click-to-open lightbox.
6. **Gallery** — mixed location photos + artist-impression-style images, labeled accordingly, lightbox with prev/next.
7. **About** — location/heritage copy block (Matunga bylane framing, sea views, amenity levels), "Know More" expand.
8. **Connectivity/Location** — map graphic + categorized proximity lists: transportation, retail, dining, recreation, hotels, clubs, healthcare, education, worship, future infrastructure.
9. **FAQ** — accordion, 4+ items (location, project status, configurations, investment rationale).
10. **Get in Touch** — contact form section (`LeadForm`).
11. **RERA/legal strip** — placeholder registration numbers (`P00000000000` / `P00000000001`), disclaimer text, "Sample project for demonstration purposes" note, link styled like a Maharera reference link (non-functional or pointing to the real Maharera homepage, not a specific listing).
12. **Footer** — logo, copyright ("© 2026 Rustomjee. All rights reserved — Demo build."), disclaimer link.

## Components

- `Header` — sticky nav + scroll-spy + mobile menu
- `Hero`
- `Overview`
- `ConfigurationTabs` — hand-built tab switcher
- `AmenitiesGrid` + `Lightbox` (shared with Gallery)
- `Gallery`
- `About`
- `Connectivity`
- `FaqAccordion` — hand-built accordion
- `GetInTouch`
- `ReraFooter`
- `Footer`
- `LeadForm` — reusable form (name, phone, email, WhatsApp opt-in checkbox), used inline in Hero/Get-in-Touch and inside modals for "Enquire Now" / "Download Brochure" / "Contact Us"
- `Modal` — generic modal shell used by the three CTA entry points

## Forms Behavior

All forms are front-end only:
- Client-side validation (required fields, email/phone format)
- On submit: show a "Thanks, we'll be in touch" success state in place of the form
- No network request, no backend, no email sending

## Images

Stock photography (Unsplash, freely usable/hotlinkable) standing in for:
- Hero sea-view tower shot
- Interior/lifestyle imagery (Overview)
- Amenity photos
- Gallery mix (location-style + render-style)
- Location/map graphic
- Simple labeled diagram graphics for floor plans (not real architectural drawings)

## Visual Style

- Light background, deep navy/charcoal + gold or warm-sand accent palette
- Generous whitespace, large display font for headings, Inter for body
- Subtle scroll-in fade-up animations per section
- Sticky "Enquire Now" bar appears on mobile after scrolling past the hero

## Responsiveness

Mobile-first Tailwind breakpoints. Nav collapses to hamburger on mobile; Configuration tabs, Amenities grid, and Gallery grid reflow to single/double column on small screens.

## Legal Handling

This is the one deliberate departure from the reference: real RERA registration numbers are replaced with clear placeholders, and a demo/sample disclaimer is added, since this page is not an official listing and must not be mistaken for one.

## Testing / Verification

No automated test suite — this is a static front-end demo. Verification is manual: run `next dev`, click through every interactive element (nav scroll-spy, Configuration tabs, lightbox open/close/nav, FAQ accordion, all 4 form entry points reaching the success state), and check mobile/tablet/desktop breakpoints in-browser before calling the build complete.
