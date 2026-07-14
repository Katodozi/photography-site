'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import CollaborationModal from './CollaborationModal';
import SupportModal from './SupportModal';

type ModalType = 'collaborate' | 'support' | null;

const ModalContext = createContext<{
  openModal: (type: ModalType) => void;
  closeModal: () => void;
} | null>(null);

export function useSiteModals() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useSiteModals must be used within SiteModalsProvider');
  return ctx;
}

export default function SiteModalsProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ModalType>(null);

  const openModal = useCallback((type: ModalType) => setActive(type), []);
  const closeModal = useCallback(() => setActive(null), []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <CollaborationModal open={active === 'collaborate'} onClose={closeModal} />
      <SupportModal open={active === 'support'} onClose={closeModal} />
    </ModalContext.Provider>
  );
}
