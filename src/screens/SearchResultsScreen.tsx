import React, { useMemo, useState } from 'react';
import { linkTo, useLanguage } from '../utils/router';
import { buildSearchIndex, searchLessons } from '../utils/search';
import { wordsIn } from '../data/glossary';
import { isExtraLanguage, translateText } from '../i18n/translate';
import { Icon } from '../components/Icon';
import { ServiceLogo } from '../components/ServiceLogo';
import { serviceById } from '../data/services';
import { PageId, Language } from '../types';
import { TUTORIALS_EN, TUTORIALS_DE } from '../data/content';
import { handleImageError } from '../assets/images';
import { fitsDevice, useChosenDevice } from '../utils/phoneType';

interface SearchResultsScreenProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onNavigate: (page: PageId) => void;
  onSelectTutorial: (tutorialId: string) => void;
  savedTutorialIds: string[];
  onToggleBookmark: (tutorialId: string) => void;
  lang?: Language;
}

export const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  searchQuery,
  onSearch,
  onNavigate,
  onSelectTutorial,
  savedTutorialIds,
  onToggleBookmark,
  lang = 'en',
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const isEn = lang === 'en';
  const device = useChosenDevice();
  const tutorials = (isEn ? TUTORIALS_EN : TUTORIALS_DE).filter((tut) => fitsDevice(tut, device));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery.trim());
    }
  };

  // Word by word, with other words for the same thing and small typos (src/utils/search.ts).
  // Turkish, Spanish and Croatian: the translated texts are searched as well.
  const uiLang = useLanguage();
  const index = useMemo(
    () => buildSearchIndex(tutorials, isExtraLanguage(uiLang) ? translateText : undefined),
    [isEn, device, uiLang] // `tutorials` follows from these
  );
  const { results, partial } = useMemo(() => searchLessons(index, searchQuery), [index, searchQuery]);
  // "What is a browser?": the explanation comes first, from "Digital words explained".
  const explained = useMemo(() => wordsIn([searchQuery], lang, 2), [searchQuery, lang]);

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb & Header */}
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#202B36] dark:text-slate-400 mb-2">
            <a {...linkTo({ page: 'home' }, () => onNavigate('home'))} className="underline text-[#17324D] min-h-[44px] inline-flex items-center">
              {isEn ? 'Home' : 'Startseite'}
            </a>
            <span>/</span>
            <span className="font-bold text-[#17324D] dark:text-white">
              {isEn ? 'Search results' : 'Suchergebnisse'}
            </span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] dark:text-white">
            {isEn ? `Search results for "${searchQuery}"` : `Suchergebnisse für „${searchQuery}“`}
          </h1>
          <p className="text-base text-[#202B36] dark:text-slate-300 mt-1">
            {isEn
              ? `${results.length} matching ${results.length === 1 ? 'lesson' : 'lessons'} found`
              : `${results.length} passende ${results.length === 1 ? 'Lektion' : 'Lektionen'} gefunden`}
          </p>
          {partial && results.length > 0 && (
            <p className="text-base text-[#202B36] dark:text-slate-300 mt-1">
              {isEn
                ? 'No lesson contains all of your words. These lessons come closest.'
                : 'Keine Lektion enthält alle Ihre Wörter. Diese Lektionen passen am besten.'}
            </p>
          )}
        </div>

        {/* Refined Search Field */}
        <div className="bg-[#FFFFFF] dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <label htmlFor="search-again" className="sr-only">{isEn ? 'Search again' : 'Erneut suchen'}</label>
              <input
                id="search-again"
                type="search"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder={isEn ? 'Start a new search' : 'Neue Suche starten'}
                className="w-full pl-11 pr-4 min-h-[48px] rounded-xl border-2 border-[#667382] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base placeholder-[#5B6672]"
              />
              <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#17324D] text-xl pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-bold text-sm transition-colors shrink-0 shadow-sm"
            >
              {isEn ? 'Search' : 'Suchen'}
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex items-center gap-2 mt-3 flex-wrap text-base text-[#202B36] dark:text-slate-300">
            <span className="font-bold text-[#17324D] dark:text-slate-200">{isEn ? 'Try for example:' : 'Versuchen Sie zum Beispiel:'}</span>
            {['Phishing', 'WhatsApp', 'Banking', 'Password', 'ChatGPT'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setLocalQuery(tag);
                  onSearch(tag);
                }}
                className="px-4 min-h-[44px] bg-[#FFFFFF] dark:bg-slate-800 hover:bg-[#EAF2F8] text-[#17324D] rounded-full font-bold border-2 border-[#17324D]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {explained.map((word) => (
          <section key={word.id} aria-labelledby={`explain-${word.id}`} className="bg-[#EAF2F8] dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border-2 border-[#17324D] dark:border-slate-600">
            <p className="flex items-center gap-2 text-base font-bold text-[#176B68] dark:text-teal-300"><Icon name="menu_book" className="text-xl" />{isEn ? 'Word explained' : 'Begriff erklärt'}</p>
            <h2 id={`explain-${word.id}`} className="text-2xl font-bold text-[#17324D] dark:text-white mt-1">{word.term}</h2>
            <p className="text-lg text-[#202B36] dark:text-slate-200 mt-1">{word.text}</p>
            {word.example && <p className="text-base text-[#202B36] dark:text-slate-300 mt-1"><strong>{isEn ? 'For example: ' : 'Zum Beispiel: '}</strong>{word.example}</p>}
            <a {...linkTo({ page: 'glossar', category: word.id })} className="mt-2 inline-flex items-center gap-2 underline font-bold text-[#17324D] dark:text-white min-h-[44px]">{isEn ? 'All words explained' : 'Alle Begriffe erklärt'}</a>
          </section>
        ))}

        {/* Results Grid */}
        {results.length === 0 ? (
          <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-12 text-center border-2 border-dashed border-[#E5E9ED] dark:border-slate-800 space-y-4">
            <Icon name="search_off" className="text-6xl text-[#176B68]/60" />
            <h2 className="text-2xl font-bold text-[#17324D] dark:text-white">
              {isEn ? 'No matching lessons found' : 'Keine passende Lektion gefunden'}
            </h2>
            <p className="text-[#202B36] dark:text-slate-300 max-w-md mx-auto">
              {isEn
                ? 'Try a broader term like "Safety", "Message", or "Account".'
                : 'Probieren Sie ein allgemeineres Wort wie „Sicherheit“, „Nachrichten“ oder „Konto“ aus.'}
            </p>
            <a {...linkTo({ page: 'tutorials' }, () => onNavigate('tutorials'))} className="link-card px-6 min-h-[48px] rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-bold text-base shadow-sm inline-flex items-center">
              {isEn ? 'Show all lessons' : 'Alle Lektionen zeigen'}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((tut) => {
              const isSaved = savedTutorialIds.includes(tut.id);

              return (
                <div
                  key={tut.id}
                  className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group hover:border-[#176B68]"
                >
                  <div className="relative h-28 sm:h-44 overflow-hidden bg-[#EAF2F8] dark:bg-slate-800">
                    {serviceById(tut.practice?.appId) ? (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: serviceById(tut.practice?.appId)!.color + '22' }}>
                        <ServiceLogo service={serviceById(tut.practice?.appId)!} size={72} />
                      </div>
                    ) : (
                    <img
                      src={tut.image}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => handleImageError(e, '/assets/images/hero_senior_woman_1793286326933.jpg')}
                    />
                    )}
                    <div className="absolute top-3 left-3 bg-[#17324D] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                      {tut.categoryTitle}
                    </div>

                    <button
                      onClick={() => onToggleBookmark(tut.id)}
                      aria-pressed={isSaved}
                      className="absolute top-3 right-3 w-11 h-11 rounded-full bg-[#FFFFFF]/95 dark:bg-slate-900/90 flex items-center justify-center text-[#17324D] hover:text-[#176B68] shadow-sm border border-[#E5E9ED] dark:border-slate-700"
                      aria-label={`${isEn ? 'Save for later' : 'Für später merken'}: ${tut.title}`}
                    >
                      <Icon name={isSaved ? 'bookmark' : 'bookmark_border'} className={`text-xl ${isSaved ? 'text-[#176B68]' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-base text-[#202B36] dark:text-slate-400 mb-1">
                        <span>{tut.durationMinutes} {isEn ? 'min' : 'Min.'}</span>
                        <span>•</span>
                        <span>{tut.difficulty}</span>
                      </div>
                      <h2 className="text-lg font-bold text-[#17324D] dark:text-white group-hover:text-[#176B68] transition-colors">
                        {tut.title}
                      </h2>
                      <p className="text-base text-[#202B36] dark:text-slate-300 mt-1">
                        {tut.description}
                      </p>
                    </div>

                    <a {...linkTo({ page: 'tutorial-detail', tutorialId: tut.id }, () => { onSelectTutorial(tut.id); onNavigate('tutorial-detail'); })} className="link-card w-full min-h-[48px] rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-sm">
                      <span>{tut.practice ? (isEn ? 'Start practice' : 'Übung starten') : (isEn ? 'Open lesson' : 'Lektion öffnen')}</span>
                      <Icon name="arrow_forward" className="text-base" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
