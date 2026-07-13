import Image from 'next/image';
import LeadForm from './LeadForm';
import { heroImage } from '@/lib/content';

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-[640px] items-center pt-24 text-sand">
      <Image
        src={heroImage}
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
