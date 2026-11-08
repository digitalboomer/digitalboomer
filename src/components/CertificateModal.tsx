import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../components/Icon';
import { UserProfile, Language } from '../types';
import { useDialogFocus } from '../utils/useDialogFocus';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  completed: { id: string; title: string; categoryTitle: string }[];
  lang?: Language;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  user,
  completed,
  lang = 'en',
}) => {
  const dialogRef = useDialogFocus<HTMLDivElement>(isOpen, onClose);
  // A guest writes the name for the certificate. It stays only in this browser.
  const [guestName, setGuestName] = useState(() => {
    try {
      return localStorage.getItem('digital-boomer-certificate-name') ?? '';
    } catch {
      return '';
    }
  });
  const [nameMissing, setNameMissing] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const changeName = (value: string) => {
    setGuestName(value);
    setNameMissing(false);
    try {
      localStorage.setItem('digital-boomer-certificate-name', value);
    } catch {
      // Without storage the name lasts until the page is closed.
    }
  };

  if (!isOpen) return null;

  const isEn = lang === 'en';

  const learner = user.isGuest ? guestName.trim() : user.name;

  const handlePrint = () => {
    if (!learner) {
      setNameMissing(true);
      nameRef.current?.focus();
      return;
    }
    window.print();
  };
  const issued = new Date().toLocaleDateString(isEn ? 'en-GB' : 'de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
  const groups = Array.from(new Set(completed.map((lesson) => lesson.categoryTitle))).map((name) => ({
    name,
    lessons: completed.filter((lesson) => lesson.categoryTitle === name),
  }));

  // Rendered directly in the page body, so that printing can leave out everything else.
  return createPortal(
    <>
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-title"
      className="certificate-dialog fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl shadow-2xl border-4 border-[#17324D] dark:border-[#176B68] p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#202B36] hover:text-[#17324D] dark:hover:text-white rounded-lg focus-visible:outline-2 focus-visible:outline-[#176B68]"
          aria-label={isEn ? 'Close Certificate' : 'Zertifikat schließen'}
        >
          <Icon name="close" className="text-3xl" />
        </button>

        {user.isGuest && (
          <div className="mb-4 pr-12 space-y-1">
            <label htmlFor="certificate-name" className="block font-bold text-[#17324D] dark:text-white">{isEn ? 'Your name for the certificate' : 'Ihr Name für die Bestätigung'}</label>
            <p id="certificate-name-hint" className="text-base text-[#202B36] dark:text-slate-300">{isEn ? 'It is only saved in this browser.' : 'Er wird nur in diesem Browser gespeichert.'}</p>
            <input
              ref={nameRef}
              id="certificate-name"
              type="text"
              autoComplete="name"
              value={guestName}
              onChange={(event) => changeName(event.target.value)}
              aria-describedby="certificate-name-hint"
              aria-invalid={nameMissing}
              className="w-full px-4 min-h-[48px] rounded-xl border-2 border-[#667382] bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base"
            />
            {nameMissing && <p role="alert" className="flex items-center gap-2 font-bold text-[#B3261E]"><Icon name="error" className="text-xl" />{isEn ? 'Please write your name first. Then you can print.' : 'Bitte schreiben Sie zuerst Ihren Namen. Dann können Sie drucken.'}</p>}
          </div>
        )}

        {/* Certificate Content */}
        <div className="text-center border-2 border-dashed border-[#E5E9ED] dark:border-slate-800 p-8 rounded-2xl bg-[#F7F8F5] dark:bg-slate-950">
          <div className="flex justify-center items-center gap-2 text-[#17324D] dark:text-[#EAF2F8] mb-3">
            <Icon name="school" className="text-4xl text-[#176B68]" />
            <span className="text-sm font-semibold tracking-widest uppercase">
              {isEn ? 'Digital Boomer – Student Prototype' : 'Digital Boomer – Studentischer Prototyp'}
            </span>
          </div>

          <h2 id="cert-title" className="text-3xl font-extrabold text-[#17324D] dark:text-white mb-2">
            {isEn ? 'Certificate of Completion' : 'Teilnahmebestätigung'}
          </h2>
          <p className="text-base text-[#202B36] dark:text-slate-300 mb-6">
            {isEn ? 'for successful, self-paced digital learning' : 'für erfolgreiches, selbstbestimmtes digitales Lernen'}
          </p>

          <p className="text-lg text-[#202B36] dark:text-slate-200">
            {isEn ? 'This certificate confirms that' : 'Diese Urkunde bestätigt, dass'}
          </p>
          <p className="text-3xl font-bold text-[#176B68] my-3">
            {learner || (isEn ? '(your name)' : '(Ihr Name)')}
          </p>
          <p className="text-base text-[#202B36] dark:text-slate-300 max-w-md mx-auto mb-6">
            {isEn ? 'has completed these lessons:' : 'diese Lektionen abgeschlossen hat:'}
          </p>

          {/* Only the lessons this learner really completed */}
          <ul className="space-y-2 my-6 text-left">
            {completed.map(({ id, title }) => (
              <li
                key={id}
                className="bg-[#FFFFFF] dark:bg-slate-900 p-3 rounded-xl border border-[#E5E9ED] dark:border-slate-800 text-sm font-bold text-[#17324D] dark:text-white"
              >
                ✓ {title}
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-end pt-6 border-t border-[#E5E9ED] dark:border-slate-800 text-xs text-[#202B36] dark:text-slate-400">
            <div>
              <p className="font-bold text-[#17324D] dark:text-slate-300">Digital Boomer Initiative</p>
              <p>{isEn ? 'Course project: BIS5152 Human-Centered AI Interface Design' : 'Kursprojekt: BIS5152 Human-Centered AI Interface Design'}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#17324D] dark:text-slate-300">{isEn ? 'Issue Date:' : 'Ausstellungsdatum:'}</p>
              <p>{issued}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-4 justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176B68] shadow-sm"
          >
            <Icon name="print" className="" />
            {isEn ? 'Print Certificate / Save as PDF' : 'Zertifikat drucken / Als PDF speichern'}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-[#E5E9ED] dark:border-slate-700 text-[#202B36] dark:text-slate-200 font-semibold hover:bg-[#EAF2F8] transition-colors"
          >
            {isEn ? 'Close' : 'Schließen'}
          </button>
        </div>
      </div>
    </div>

    {/* The printed sheet. .phone-sim keeps it readable when a dark theme is on. */}
    <div className="certificate-print phone-sim">
      <header>
        <p className="cert-brand">{isEn ? 'Digital Boomer – Student Prototype' : 'Digital Boomer – Studentischer Prototyp'}</p>
        <h2>{isEn ? 'Certificate of Completion' : 'Teilnahmebestätigung'}</h2>
        <p>{isEn ? 'This certificate confirms that' : 'Diese Urkunde bestätigt, dass'}</p>
        <p className="cert-name">{learner}</p>
        <p>
          {isEn
            ? `has completed ${completed.length} ${completed.length === 1 ? 'lesson' : 'lessons'}:`
            : `${completed.length} ${completed.length === 1 ? 'Lektion' : 'Lektionen'} abgeschlossen hat:`}
        </p>
      </header>
      <div className={`cert-list ${completed.length <= 12 ? 'is-short' : ''}`}>
        {groups.map((group) => (
          <section key={group.name} className="cert-group">
            <h3>{group.name}</h3>
            <ul>
              {group.lessons.map((lesson) => <li key={lesson.id}>✓ {lesson.title}</li>)}
            </ul>
          </section>
        ))}
      </div>
      <footer>
        <span>{isEn ? 'Course project: BIS5152 Human-Centered AI Interface Design' : 'Kursprojekt: BIS5152 Human-Centered AI Interface Design'}</span>
        <span>{isEn ? 'Issue date:' : 'Ausstellungsdatum:'} {issued}</span>
      </footer>
    </div>
    </>,
    document.body
  );
};
