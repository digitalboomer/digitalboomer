import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import QRCode from 'qrcode';
import { Language } from '../types';
import { useDialogFocus } from '../utils/useDialogFocus';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

// The public address, used when this page runs on a computer that phones cannot reach
// (set in .env.production; the published address on GitHub Pages)
const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://digital-boomer.netlify.app/';

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  lang = 'en',
}) => {
  const isEn = lang === 'en';
  const [currentUrl, setCurrentUrl] = useState<string>(SITE_URL);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(true);
  const dialogRef = useDialogFocus<HTMLDivElement>(isOpen, onClose);

  // Get current browser URL safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(/^(localhost|127\.|192\.168\.|10\.)/.test(window.location.hostname) ? `${SITE_URL}${window.location.hash}` : window.location.href);
    }
  }, [isOpen]);

  const activeUrl = currentUrl;

  // Generate QR Code data URL whenever activeUrl changes or modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setGenerating(true);

    QRCode.toDataURL(activeUrl, {
      width: 360,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#17324D', // Brand dark navy
        light: '#FFFFFF', // Clean white background
      },
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setGenerating(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err);
        if (isMounted) {
          setGenerating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeUrl]);

  // Copy link handler
  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(activeUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = activeUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm transition-opacity overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg m-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#E5E9ED] dark:border-slate-800 overflow-hidden transform transition-all"
      >
        {/* Modal Header */}
        <div className="bg-[#17324D] text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#176B68] flex items-center justify-center text-white shrink-0">
              <Icon name="qr_code_2" className="text-2xl" />
            </div>
            <div>
              <h2 id="qr-modal-title" className="text-xl font-bold leading-tight">
                {isEn ? 'Open this page on a phone' : 'Diese Seite am Handy öffnen'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {isEn ? 'Point your phone camera at the square picture.' : 'Halten Sie die Handy-Kamera auf das quadratische Bild.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors -mr-1 -mt-1"
            aria-label={isEn ? 'Close dialog' : 'Fenster schließen'}
          >
            <Icon name="close" className="text-xl" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* QR Code Card Display */}
          <div className="flex flex-col items-center justify-center bg-[#F7F8F5] dark:bg-slate-950 p-6 rounded-2xl border border-[#E5E9ED] dark:border-slate-800">
            {generating ? (
              <div className="w-64 h-64 flex flex-col items-center justify-center gap-3 text-[#202B36]">
                <Icon name="progress_activity" className="text-4xl animate-spin text-[#176B68]" />
                <span className="text-sm font-medium">
                  {isEn ? 'Generating scannable QR code...' : 'QR-Code wird generiert...'}
                </span>
              </div>
            ) : qrDataUrl ? (
              <div className="relative group">
                {/* Visual frame with generous contrast padding */}
                <div className="p-4 bg-white rounded-2xl shadow-md border border-[#E5E9ED]">
                  <img
                    src={qrDataUrl}
                    alt={isEn ? 'QR code for Digital Boomer prototype' : 'QR-Code für den Digital Boomer Prototyp'}
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="text-red-600 p-4 text-center text-sm">
                {isEn ? 'Error rendering QR code. Please copy link below.' : 'Fehler beim Laden des QR-Codes. Bitte Link unten kopieren.'}
              </div>
            )}
          </div>

          {/* Active URL with Quick Copy Button */}
          <div>
            <label className="block text-xs font-bold text-[#202B36] dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {isEn ? 'Encoded Destination URL' : 'Enthaltene Ziel-Adresse'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={activeUrl}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#202B36] dark:text-slate-300 font-mono truncate select-all focus:outline-none focus:ring-2 focus:ring-[#176B68]"
              />
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[#17324D] hover:bg-[#0f2336] text-white'
                }`}
                aria-label={isEn ? 'Copy link to clipboard' : 'Link in Zwischenablage kopieren'}
              >
                <Icon name={copied ? 'check' : 'content_copy'} className="text-base" />
                <span>{copied ? (isEn ? 'Copied!' : 'Kopiert!') : (isEn ? 'Copy Link' : 'Link kopieren')}</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Instructions for Evaluation & Professor Presentation */}
          <div className="bg-[#EAF2F8] dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-100 dark:border-slate-700">
            <h3 className="text-xs font-bold text-[#17324D] dark:text-teal-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Icon name="smartphone" className="text-base" />
              <span>{isEn ? 'How to test on your phone:' : 'So testen Sie auf Ihrem Smartphone:'}</span>
            </h3>
            <ol className="text-xs text-[#202B36] dark:text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>
                <strong>{isEn ? 'iOS (iPhone / iPad):' : 'iOS (iPhone / iPad):'}</strong>{' '}
                {isEn ? 'Open Camera app and point directly at the QR code; tap the yellow link banner.' : 'Kamera-App öffnen und auf den Code richten; gelben Banner antippen.'}
              </li>
              <li>
                <strong>{isEn ? 'Android:' : 'Android:'}</strong>{' '}
                {isEn ? 'Open Camera or Google Lens to scan and launch the prototype instantly.' : 'Kamera oder Google Lens öffnen und den Vorschlag antippen.'}
              </li>
            </ol>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-t border-[#E5E9ED] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {qrDataUrl && (
            <a
              href={qrDataUrl}
              download="digital-boomer-clickable-prototype-qr.png"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 text-[#17324D] dark:text-white border border-[#E5E9ED] dark:border-slate-700 rounded-xl font-bold text-xs shadow-sm transition-colors"
            >
              <Icon name="download" className="text-base text-[#176B68]" />
              <span>{isEn ? 'Download QR as PNG' : 'QR-Code als PNG sichern'}</span>
            </a>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#176B68] dark:text-teal-400 hover:underline"
            >
              <span>{isEn ? 'Open URL in new tab' : 'In neuem Tab öffnen'}</span>
              <Icon name="open_in_new" className="text-sm" />
            </a>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#17324D] hover:bg-[#0f2336] text-white rounded-xl font-bold text-xs transition-colors"
            >
              {isEn ? 'Close' : 'Schließen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
