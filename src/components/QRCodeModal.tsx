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
const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://digitalboomer.github.io/digitalboomer/';

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
        className="w-full max-w-lg m-auto max-h-[calc(100dvh-2rem)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#E5E9ED] dark:border-slate-800 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-[#17324D] text-white p-5 sm:p-6 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#176B68] flex items-center justify-center text-white shrink-0">
              <Icon name="qr_code_2" className="text-2xl" />
            </div>
            <div>
              <h2 id="qr-modal-title" className="text-xl font-bold leading-tight">
                {isEn ? 'Open this page on a phone' : 'Diese Seite am Handy öffnen'}
              </h2>
              <p className="text-base text-white mt-0.5">
                {isEn ? 'Point your phone camera at the square picture.' : 'Halten Sie die Handy-Kamera auf das quadratische Bild.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0"
            aria-label={isEn ? 'Close' : 'Schließen'}
          >
            <Icon name="close" className="text-xl" />
          </button>
        </div>

        {/* Modal Body: scrolls on short screens, so "Close" always stays reachable */}
        <div className="p-6 space-y-5 overflow-y-auto min-h-0">
          <div className="flex justify-center bg-[#F7F8F5] dark:bg-slate-950 p-5 rounded-2xl">
            {generating ? (
              <p className="w-56 h-56 flex items-center justify-center text-base text-[#202B36]">{isEn ? 'The picture is being made…' : 'Das Bild wird erstellt…'}</p>
            ) : qrDataUrl ? (
              <div className="p-3 bg-white rounded-2xl border-2 border-[#E5E9ED]">
                <img src={qrDataUrl} alt={isEn ? 'QR code that opens this page' : 'QR-Code, der diese Seite öffnet'} className="w-52 h-52 sm:w-60 sm:h-60 object-contain" />
              </div>
            ) : (
              <p className="flex items-start gap-2 p-3 rounded-xl bg-[#FDECEA] text-[#202B36] text-base"><Icon name="error" className="text-xl text-[#B3261E] shrink-0" />{isEn ? 'The picture could not be made. Please copy the link below instead.' : 'Das Bild konnte nicht erstellt werden. Bitte kopieren Sie stattdessen den Link unten.'}</p>
            )}
          </div>

          <ol className="space-y-2 text-base text-[#202B36] dark:text-slate-200 list-decimal pl-6">
            <li>{isEn ? 'Open the camera on your phone.' : 'Öffnen Sie die Kamera an Ihrem Handy.'}</li>
            <li>{isEn ? 'Point it at the square picture.' : 'Halten Sie sie auf das quadratische Bild.'}</li>
            <li>{isEn ? 'Tap the link that appears on the screen.' : 'Tippen Sie auf den Link, der auf dem Bildschirm erscheint.'}</li>
          </ol>

          <div className="space-y-2">
            <p className="text-base font-bold text-[#17324D] dark:text-white">{isEn ? 'Or send yourself the link:' : 'Oder schicken Sie sich den Link:'}</p>
            <p className="text-base text-[#202B36] dark:text-slate-300 break-all">{activeUrl}</p>
            <button onClick={handleCopy} className="inline-flex items-center gap-2 px-5 min-h-[48px] rounded-xl border-2 border-[#17324D] text-[#17324D] dark:text-white font-bold text-base hover:bg-[#EAF2F8]">
              <Icon name={copied ? 'check' : 'content_copy'} className="text-xl" />
              <span>{copied ? (isEn ? 'Link copied' : 'Link kopiert') : (isEn ? 'Copy link' : 'Link kopieren')}</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-t-2 border-[#E5E9ED] dark:border-slate-800 flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 min-h-[48px] bg-[#17324D] hover:bg-[#0F2438] text-white rounded-xl font-bold text-base">
            {isEn ? 'Close' : 'Schließen'}
          </button>
        </div>
      </div>
    </div>
  );
};
