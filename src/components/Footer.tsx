import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { PageId, Language } from '../types';
import { IMAGES, handleLogoError } from '../assets/images';
import { useDialogFocus } from '../utils/useDialogFocus';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenSupportModal: () => void;
  onOpenQrCode: () => void;
  onResetDemo: () => void;
  signedIn?: boolean;
  lang?: Language;
}

/** "Are you sure?" before all progress is deleted. "Keep my progress" comes first, so it is the safe choice. */
const ResetDialog: React.FC<{ isOpen: boolean; signedIn: boolean; isEn: boolean; onKeep: () => void; onReset: () => void }> = ({ isOpen, signedIn, isEn, onKeep, onReset }) => {
  const dialogRef = useDialogFocus<HTMLDivElement>(isOpen, onKeep);
  if (!isOpen) return null;
  return (
    <div
      ref={dialogRef}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="reset-title"
      aria-describedby="reset-text"
      onClick={(event) => {
        if (event.target === event.currentTarget) onKeep();
      }}
      className="fixed inset-0 z-50 overflow-y-auto flex p-4 pb-[76px] bg-black/60"
    >
      <div className="m-auto w-full max-w-lg bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#B3261E] p-6 space-y-4 text-[#202B36] dark:text-slate-100">
        <h2 id="reset-title" className="text-2xl font-bold text-[#17324D] dark:text-white flex items-start gap-3">
          <Icon name="warning" className="text-3xl shrink-0 text-[#B3261E]" />
          {isEn ? 'Are you sure you want to delete your progress?' : 'Möchten Sie Ihren Fortschritt wirklich löschen?'}
        </h2>
        <div id="reset-text" className="space-y-2">
          <p>
            {isEn
              ? 'This deletes your finished lessons, your saved lessons, the places where you stopped, and your choices for device and help.'
              : 'Damit werden Ihre abgeschlossenen Lektionen, Ihre gemerkten Lektionen, die Stellen, an denen Sie aufgehört haben, und Ihre Auswahl für Gerät und Hilfe gelöscht.'}
          </p>
          <p className="font-bold">
            {signedIn
              ? (isEn ? 'You are signed in, so the progress saved in your account is deleted too, on all your devices. You stay signed in.' : 'Sie sind angemeldet. Deshalb wird auch der Fortschritt in Ihrem Konto gelöscht, auf allen Ihren Geräten. Sie bleiben angemeldet.')
              : (isEn ? 'This cannot be undone.' : 'Das kann nicht rückgängig gemacht werden.')}
          </p>
          {signedIn && <p className="font-bold">{isEn ? 'This cannot be undone.' : 'Das kann nicht rückgängig gemacht werden.'}</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={onKeep} className="flex-1 inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl bg-[#17324D] hover:bg-[#0F2438] active:bg-[#0A1A2A] text-white font-bold text-base">
            {isEn ? 'No, keep my progress' : 'Nein, Fortschritt behalten'}
          </button>
          <button onClick={onReset} className="flex-1 inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl border-2 border-[#B3261E] text-[#B3261E] dark:text-red-300 dark:border-red-300 font-bold text-base hover:bg-[#FDECEA] dark:hover:bg-slate-800">
            <Icon name="delete" className="text-xl" />
            {isEn ? 'Yes, delete everything' : 'Ja, alles löschen'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSupportModal, onOpenQrCode, onResetDemo, signedIn = false, lang = 'en' }) => {
  const isEn = lang === 'en';
  const [confirmingReset, setConfirmingReset] = useState(false);
  const link = 'text-left text-white underline underline-offset-4 min-h-[44px] hover:text-[#EAF2F8]';

  return (
    <footer className="bg-[#17324D] text-white mt-auto">
      {/* Extra bottom space: the "Powered by Netlify" badge must not cover the last links */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-2 inline-flex">
              <img src={IMAGES.logo} alt="Digital Boomer" className="h-14 w-auto max-w-[180px] object-contain" loading="lazy" onError={handleLogoError} />
            </div>
            <p className="text-white">
              {isEn ? 'You can do it, at your own pace. No prior knowledge required.' : 'Sie schaffen das, in Ihrem eigenen Tempo. Keine Vorkenntnisse nötig.'}
            </p>
          </div>

          <nav aria-label={isEn ? 'Learning' : 'Lernen'} className="flex flex-col items-start gap-1">
            <h2 className="text-xl font-bold text-white mb-1">{isEn ? 'Learning' : 'Lernen'}</h2>
            <button onClick={() => onNavigate('themen')} className={link}>{isEn ? 'All topics' : 'Alle Themen'}</button>
            <button onClick={() => onNavigate('nachrichten-apps')} className={link}>{isEn ? 'Messaging apps' : 'Nachrichten-Apps'}</button>
            <button onClick={() => onNavigate('email-apps')} className={link}>{isEn ? 'Email' : 'E-Mail'}</button>
            <button onClick={() => onNavigate('social-apps')} className={link}>{isEn ? 'Social media' : 'Soziale Medien'}</button>
            <button onClick={() => onNavigate('bank-apps')} className={link}>{isEn ? 'Online banking' : 'Online-Banking'}</button>
            <button onClick={() => onNavigate('sicherheit')} className={link}>{isEn ? 'Digital safety' : 'Digitale Sicherheit'}</button>
            <button onClick={() => onNavigate('dashboard')} className={link}>{isEn ? 'My progress' : 'Mein Fortschritt'}</button>
          </nav>

          <nav aria-label={isEn ? 'Help and information' : 'Hilfe und Informationen'} className="flex flex-col items-start gap-1">
            <h2 className="text-xl font-bold text-white mb-1">{isEn ? 'Help & information' : 'Hilfe & Informationen'}</h2>
            <button onClick={onOpenSupportModal} className={link}>{isEn ? 'Help assistant (pre-written answers)' : 'Hilfe-Assistent (vorgefertigte Antworten)'}</button>
            <button onClick={() => onNavigate('ueber-uns')} className={link}>{isEn ? 'About us & common questions' : 'Über uns & häufige Fragen'}</button>
            <button onClick={() => onNavigate('barrierefreiheit')} className={link}>{isEn ? 'Accessibility' : 'Barrierefreiheit'}</button>
            <button onClick={() => onNavigate('datenschutz')} className={link}>{isEn ? 'Privacy & legal notice' : 'Datenschutz & Impressum'}</button>
            <button onClick={onOpenQrCode} className={`${link} inline-flex items-center gap-2`}>
              <Icon name="qr_code_2" className="text-xl" />
              {isEn ? 'Open this page on a phone (QR code)' : 'Diese Seite am Handy öffnen (QR-Code)'}
            </button>
          </nav>
        </div>

        <div className="mt-8 pt-4 border-t border-white/30 flex flex-wrap items-center justify-between gap-3">
          <p className="text-white text-base">
            {isEn
              ? 'Student prototype, BIS5152 Human-Centered AI Interface Design. Designed to support WCAG 2.2 AA, testing still to come.'
              : 'Studentischer Prototyp, BIS5152 Human-Centered AI Interface Design. Auf WCAG 2.2 AA ausgerichtet, Prüfung folgt noch.'}
          </p>
          <button onClick={() => setConfirmingReset(true)} className={`${link} inline-flex items-center gap-2`}>
            <Icon name="restart_alt" className="text-xl" />
            {isEn ? 'Reset my progress' : 'Meinen Fortschritt zurücksetzen'}
          </button>
        </div>
      </div>

      {/* A second step is needed, so saved progress is never lost by accident */}
      <ResetDialog
        isOpen={confirmingReset}
        signedIn={signedIn}
        isEn={isEn}
        onKeep={() => setConfirmingReset(false)}
        onReset={() => { setConfirmingReset(false); onResetDemo(); }}
      />
    </footer>
  );
};
