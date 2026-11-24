import React, { useMemo, useRef, useState } from 'react';
import { Icon } from './Icon';
import { linkTo } from '../utils/router';
import { useDialogFocus } from '../utils/useDialogFocus';
import { wordsIn, type GlossaryWord } from '../data/glossary';
import type { Language } from '../types';

/**
 * "Words explained" under a lesson step: buttons for the glossary words the step uses.
 * A tap opens a short explanation. The step's own text stays as it is (see src/data/glossary.ts).
 */
export const WordHelp: React.FC<{ texts: (string | undefined)[]; lang: Language }> = ({ texts, lang }) => {
  const isEn = lang === 'en';
  const key = texts.join('|');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const words = useMemo(() => wordsIn(texts, lang), [key, lang]);
  const [open, setOpen] = useState<GlossaryWord | null>(null);
  // Back to the word's button after closing, also in browsers that do not focus a tapped button (Safari).
  const opener = useRef<HTMLButtonElement | null>(null);
  const close = () => {
    setOpen(null);
    window.setTimeout(() => opener.current?.focus(), 0);
  };
  const dialogRef = useDialogFocus<HTMLDivElement>(open !== null, close);
  if (words.length === 0) return null;

  return (
    <div className="rounded-xl bg-[#EAF2F8] dark:bg-slate-800 p-4">
      <p className="flex items-center gap-2 font-bold text-[#17324D] dark:text-white text-base">
        <Icon name="menu_book" className="text-xl" />
        {isEn ? 'Words explained:' : 'Wörter erklärt:'}
      </p>
      <ul className="flex flex-wrap gap-2 mt-2">
        {words.map((word) => (
          <li key={word.id}>
            <button
              type="button"
              onClick={(event) => { opener.current = event.currentTarget; setOpen(word); }}
              aria-haspopup="dialog"
              className="inline-flex items-center gap-1.5 px-4 min-h-[44px] rounded-full border-2 border-[#17324D] dark:border-white bg-[#FFFFFF] dark:bg-slate-900 text-[#17324D] dark:text-white font-bold text-base hover:bg-[#F7F8F5] active:bg-[#E5E9ED]"
            >
              <Icon name="help" className="text-lg" />
              {word.term}
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="word-title"
          aria-describedby="word-text"
          onClick={(event) => { if (event.target === event.currentTarget) close(); }}
          className="fixed inset-0 z-50 overflow-y-auto flex p-4 bg-black/60"
        >
          <div className="m-auto w-full max-w-lg bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#17324D] p-6 space-y-4">
            <h2 id="word-title" className="text-2xl font-bold text-[#17324D] dark:text-white flex items-start gap-3">
              <Icon name="menu_book" className="text-3xl shrink-0" />
              {open.term}
            </h2>
            <p id="word-text" className="text-lg text-[#202B36] dark:text-slate-100">{open.text}</p>
            {open.example && <p className="text-base text-[#202B36] dark:text-slate-200"><strong>{isEn ? 'For example: ' : 'Zum Beispiel: '}</strong>{open.example}</p>}
            <div className="flex flex-col sm:flex-row gap-2">
              <button type="button" onClick={close} className="flex-1 inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl bg-[#17324D] hover:bg-[#0F2438] active:bg-[#0A1A2A] text-white font-bold text-base">
                <Icon name="close" className="text-xl" />
                {isEn ? 'Close' : 'Schließen'}
              </button>
              <a
                {...linkTo({ page: 'glossar', category: open.id }, undefined)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl border-2 border-[#17324D] dark:border-white text-[#17324D] dark:text-white font-bold text-base hover:bg-[#EAF2F8] dark:hover:bg-slate-800"
              >
                {isEn ? 'All words explained' : 'Alle Begriffe erklärt'}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
