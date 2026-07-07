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
