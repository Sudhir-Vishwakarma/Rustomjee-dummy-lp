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
