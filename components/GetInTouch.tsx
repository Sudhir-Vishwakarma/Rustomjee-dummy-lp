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
