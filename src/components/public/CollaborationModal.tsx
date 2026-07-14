'use client';

import { useEffect } from 'react';
import { FiMail, FiX } from 'react-icons/fi';

const EMAIL = 'anuzbhattarai12@gmail.com';

interface CollaborationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CollaborationModal({ open, onClose }: CollaborationModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="modal-panel relative max-w-lg animate-fade-up">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted transition-colors hover:bg-surface-raised hover:text-text"
        >
          <FiX className="h-5 w-5" />
        </button>

        <p className="text-xs uppercase tracking-[0.25em] text-accent">Work Together</p>
        <h2 className="mt-3 font-heading text-3xl font-medium text-text">
          Let&apos;s Collaborate
        </h2>
        <p className="mt-4 leading-relaxed text-muted">
          Interested in a photo project, exhibition, editorial feature, or creative
          partnership? I&apos;d love to hear your ideas and explore how we can create
          something meaningful together.
        </p>

        <a
          href={`mailto:${EMAIL}?subject=Collaboration%20Inquiry%20-%20Passing%20Through%202000s`}
          className="btn-primary mt-8 w-full gap-2"
        >
          <FiMail className="h-4 w-4" />
          {EMAIL}
        </a>
      </div>
    </div>
  );
}
