import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { useLanguage } from '../utils/router';
import { SITE_BASE, SITE_ORIGIN, urlFor } from '../utils/routes';
import { wordsIn } from '../data/glossary';
import type { Language, Tutorial } from '../types';

/**
 * "Print": a clean sheet with the lesson's numbered steps, to keep next to the phone.
 * The sheet is only put into the page while printing (outside #root, like the certificate),
 * and print styles in index.css show nothing else. It has a QR code back to the lesson.
 */
export const PrintLessonButton: React.FC<{ lesson: Tutorial; lang: Language; className: string }> = ({ lesson, lang, className }) => {
  const isEn = lang === 'en';
  const uiLang = useLanguage();
  const [printing, setPrinting] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const url = `${SITE_ORIGIN}${urlFor({ page: 'tutorial-detail', tutorialId: lesson.id }, uiLang, SITE_BASE)}`;

  const start = async () => {
    try {
      const QRCode = (await import('qrcode')).default;
      setQr(await QRCode.toDataURL(url, { width: 240, margin: 1, color: { dark: '#17324D', light: '#FFFFFF' } }));
    } catch {
      setQr(null); // the sheet still prints, with the address written out
    }
    setPrinting(true);
  };

  useEffect(() => {
    if (!printing) return;
    const done = () => setPrinting(false);
    window.addEventListener('afterprint', done);
    // A short moment first, so the sheet (and, in Turkish, Spanish or Croatian, its translation) is in place.
    const timer = window.setTimeout(() => window.print(), 250);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('afterprint', done);
    };
  }, [printing]);

  const words = printing ? wordsIn(lesson.steps.flatMap((s) => [s.title, s.lead, ...s.paragraphs, s.tip, s.warning]), lang, 5) : [];
  const locale = { en: 'en-GB', de: 'de-DE', tr: 'tr-TR', es: 'es-ES', hr: 'hr-HR' }[uiLang];
  // Without a final dot (Croatian dates end with one), because the sentence adds its own.
  const printed = new Date().toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' }).replace(/\.$/, '');

  return (
    <>
      <button type="button" onClick={() => void start()} className={className}>
        <Icon name="print" className="text-lg" />
        <span>{isEn ? 'Print' : 'Drucken'}</span>
      </button>
      {printing && createPortal(
        // .phone-sim keeps the sheet's own colours when a dark theme is on.
        <div className="lesson-print phone-sim">
          <header>
            <p className="print-brand">{isEn ? 'Digital Boomer – practice sheet' : 'Digital Boomer – Übungsblatt'}</p>
            <h1>{lesson.title}</h1>
            <p>{lesson.description}</p>
            {lesson.practice && <p className="print-note">{isEn ? 'Practise it on the website: nothing real is sent, and you cannot break anything.' : 'Üben Sie es auf der Website: Es wird nichts wirklich gesendet, und Sie können nichts kaputt machen.'}</p>}
          </header>
          <ol>
            {lesson.steps.map((step) => (
              <li key={step.stepNumber}>
                <span className="print-num">{step.stepNumber}</span>
                <div>
                  <h2>{step.title}</h2>
                  {/* Steps with a tap-the-warning-sign example: that part only works on the website. */}
                  {step.example?.startsWith('scam:')
                    ? <p className="print-lead">{isEn ? 'On the website, this step has an example to tap through.' : 'Auf der Website hat dieser Schritt ein Beispiel zum Durchtippen.'}</p>
                    : step.lead && <p className="print-lead">{step.lead}</p>}
                  {step.paragraphs.map((text) => <p key={text}>{text}</p>)}
                  {step.tip && <p className="print-box"><strong>{isEn ? 'Tip: ' : 'Tipp: '}</strong>{step.tip}</p>}
                  {step.warning && <p className="print-box print-warning"><strong>{isEn ? 'Important: ' : 'Wichtig: '}</strong>{step.warning}</p>}
                </div>
              </li>
            ))}
          </ol>
          {words.length > 0 && (
            <section className="print-words">
              <h2>{isEn ? 'Words explained' : 'Wörter erklärt'}</h2>
              {words.map((word) => <p key={word.id}><strong>{word.term}: </strong>{word.text}</p>)}
            </section>
          )}
          <footer>
            {qr && <img src={qr} width={96} height={96} alt="" />}
            <div>
              <p><strong>{isEn ? 'Practise again on the website:' : 'Noch einmal auf der Website üben:'}</strong></p>
              <p className="print-url">{url}</p>
              <p>{isEn ? `Printed on ${printed}.` : `Gedruckt am ${printed}.`}</p>
            </div>
          </footer>
        </div>,
        document.body,
      )}
    </>
  );
};
