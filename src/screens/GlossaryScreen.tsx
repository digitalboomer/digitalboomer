import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { linkTo } from '../utils/router';
import { glossary } from '../data/glossary';
import { TUTORIALS_DE, TUTORIALS_EN } from '../data/content';
import { normalizeWords } from '../utils/search';
import type { Language, PageId } from '../types';

/** "Digital words explained": every word from the lessons, A to Z, with a filter. `selectedWord` scrolls to one word. */
export const GlossaryScreen: React.FC<{ lang: Language; selectedWord?: string; onNavigate: (page: PageId) => void }> = ({ lang, selectedWord, onNavigate }) => {
  const isEn = lang === 'en';
  const words = useMemo(() => glossary(lang), [lang]);
  const lessons = isEn ? TUTORIALS_EN : TUTORIALS_DE;
  const [filter, setFilter] = useState('');

  const shown = useMemo(() => {
    const wanted = normalizeWords(filter);
    if (!wanted.length) return words;
    const hits = (text: string) => { const have = normalizeWords(text); return wanted.every((q) => have.some((h) => h.startsWith(q))); };
    // Words whose name matches first, then words that only mention it in their explanation.
    const inName = words.filter((w) => hits(w.term));
    return [...inName, ...words.filter((w) => !inName.includes(w) && hits(`${w.term} ${w.text}`))];
  }, [filter, words]);

  // Coming from a lesson: show that word.
  useEffect(() => {
    if (!selectedWord) return;
    const heading = document.getElementById(`word-${selectedWord}`);
    if (heading) {
      heading.scrollIntoView({ block: 'start' });
      heading.focus({ preventScroll: true });
    }
  }, [selectedWord]);

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <nav aria-label={isEn ? 'Breadcrumb' : 'Brotkrumen-Navigation'} className="flex items-center gap-2 text-base text-[#202B36] dark:text-slate-300 mb-2">
            <a {...linkTo({ page: 'home' }, () => onNavigate('home'))} className="underline text-[#17324D] dark:text-white min-h-[44px] inline-flex items-center">{isEn ? 'Home' : 'Startseite'}</a>
            <span aria-hidden="true">/</span>
            <span className="font-bold text-[#17324D] dark:text-white">{isEn ? 'Digital words explained' : 'Digitale Begriffe erklärt'}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#17324D] dark:text-white">{isEn ? 'Digital words explained' : 'Digitale Begriffe erklärt'}</h1>
          <p className="text-lg text-[#202B36] dark:text-slate-200 mt-2 max-w-2xl">
            {isEn
              ? 'App, update, link, cloud: here every word from our lessons is explained in a sentence or two. In the lessons, the button "Words explained" leads here too.'
              : 'App, Update, Link, Cloud: Hier ist jedes Wort aus unseren Lektionen in ein, zwei Sätzen erklärt. In den Lektionen führt der Knopf „Wörter erklärt“ ebenfalls hierher.'}
          </p>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800">
          <label htmlFor="glossary-filter" className="block text-lg font-bold text-[#17324D] dark:text-white mb-2">{isEn ? 'Find a word' : 'Wort suchen'}</label>
          <div className="relative">
            <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#17324D] text-xl pointer-events-none" />
            <input
              id="glossary-filter"
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={isEn ? 'For example: update' : 'Zum Beispiel: Update'}
              className="w-full pl-11 pr-4 min-h-[48px] rounded-xl border-2 border-[#667382] dark:border-slate-600 bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base placeholder-[#5B6672]"
            />
          </div>
          <p className="mt-2 text-base text-[#202B36] dark:text-slate-300" aria-live="polite">
            {isEn ? `${shown.length} ${shown.length === 1 ? 'word' : 'words'}` : `${shown.length} ${shown.length === 1 ? 'Wort' : 'Wörter'}`}
          </p>
        </div>

        {shown.length === 0 ? (
          <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-6 border-2 border-[#E5E9ED] dark:border-slate-800 space-y-3">
            <p className="text-lg font-bold text-[#17324D] dark:text-white">{isEn ? 'This word is not in the list yet.' : 'Dieses Wort ist noch nicht in der Liste.'}</p>
            <p className="text-[#202B36] dark:text-slate-300">{isEn ? 'Tell us which word you were looking for, and we will add it.' : 'Schreiben Sie uns, welches Wort Sie gesucht haben, dann ergänzen wir es.'}</p>
            <a {...linkTo({ page: 'ueber-uns' }, () => onNavigate('ueber-uns'))} className="underline font-bold text-[#17324D] dark:text-white">{isEn ? 'Write to us' : 'Schreiben Sie uns'}</a>
          </div>
        ) : (
          <ul className="space-y-4">
            {shown.map((word) => {
              const related = word.lessons.map((id) => lessons.find((t) => t.id === id)).filter((t): t is (typeof lessons)[number] => !!t);
              const selected = word.id === selectedWord;
              return (
                <li key={word.id} className={`bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border-2 ${selected ? 'border-[#17324D] dark:border-white' : 'border-[#E5E9ED] dark:border-slate-800'}`}>
                  <h2 id={`word-${word.id}`} tabIndex={-1} className="text-2xl font-bold text-[#17324D] dark:text-white scroll-mt-28">{word.term}</h2>
                  <p className="mt-2 text-lg text-[#202B36] dark:text-slate-200">{word.text}</p>
                  {word.example && <p className="mt-2 text-base text-[#202B36] dark:text-slate-300"><strong>{isEn ? 'For example: ' : 'Zum Beispiel: '}</strong>{word.example}</p>}
                  {related.map((lesson) => (
                    <a key={lesson.id} {...linkTo({ page: 'tutorial-detail', tutorialId: lesson.id })} className="mt-3 inline-flex items-center gap-2 underline font-bold text-[#17324D] dark:text-white min-h-[44px]">
                      <Icon name="menu_book" className="text-xl" />
                      {isEn ? 'Lesson: ' : 'Lektion: '}{lesson.title}
                    </a>
                  ))}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
