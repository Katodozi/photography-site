'use client';

import { useEffect, useState } from 'react';
import { FiHeart, FiMail, FiMessageCircle, FiX } from 'react-icons/fi';

const EMAIL = 'anuzbhattarai12@gmail.com';
const QR_IMAGE = '/donate-qr-placeholder.svg';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SupportModal({ open, onClose }: SupportModalProps) {
  const [feedback, setFeedback] = useState('');
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowQr(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showQr) setShowQr(false);
        else onClose();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, showQr]);

  if (!open) return null;

  const feedbackMailto = `mailto:${EMAIL}?subject=Feedback%20-%20Passing%20Through%202000s&body=${encodeURIComponent(feedback || 'Your feedback here...')}`;

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

        <p className="text-xs uppercase tracking-[0.25em] text-gold">Community</p>
        <h2 className="mt-3 font-heading text-3xl font-medium text-text">
          Help Me Buy a Camera
        </h2>
        <p className="mt-4 leading-relaxed text-muted">
          This archive is a personal passion project. Your support — whether through a
          donation or thoughtful feedback — helps keep it alive and growing.
        </p>

        <div className="mt-8 space-y-4">
          <button
            type="button"
            onClick={() => setShowQr(true)}
            className="btn-gold flex w-full items-center justify-center gap-2"
          >
            <FiHeart className="h-4 w-4" />
            One drop for a camera
          </button>

          <div className="rounded-xl border border-border bg-bg p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-text">
              <FiMessageCircle className="h-4 w-4 text-accent" />
              Share Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder="Tell me what you enjoy, what you'd like to see more of..."
              className="input-dark resize-none"
            />
            <a href={feedbackMailto} className="btn-outline mt-3 w-full gap-2">
              <FiMail className="h-4 w-4" />
              Send Feedback
            </a>
          </div>
        </div>
      </div>

      {showQr && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close QR code"
            onClick={() => setShowQr(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-sm animate-fade-up rounded-2xl border border-border bg-surface p-6 shadow-elevated">
            <button
              type="button"
              onClick={() => setShowQr(false)}
              className="absolute right-3 top-3 rounded-full p-2 text-muted transition-colors hover:bg-surface-raised hover:text-text"
            >
              <FiX className="h-5 w-5" />
            </button>

            <p className="text-xs uppercase tracking-[0.25em] text-gold">Support</p>
            <h3 className="mt-2 font-heading text-xl font-medium text-text">
              Scan to contribute
            </h3>
            <p className="mt-2 text-sm text-muted">
              Every drop helps me get closer to a proper camera for this archive.
            </p>

            <div className="mx-auto mt-6 w-full max-w-[240px] overflow-hidden rounded-xl border border-border bg-white p-3">
              <img
                src={QR_IMAGE}
                alt="Donation QR code"
                className="aspect-square w-full object-contain p-2"
              />
            </div>

            <p className="mt-4 text-center text-xs text-muted">
              Thank you for supporting this journey.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
