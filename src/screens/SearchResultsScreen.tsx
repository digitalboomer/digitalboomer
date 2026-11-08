import React, { useState } from 'react';
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

  const results = tutorials.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.categoryTitle.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb & Header */}
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#202B36] dark:text-slate-400 mb-2">
            <button onClick={() => onNavigate('home')} className="hover:underline hover:text-[#176B68]">
              {isEn ? 'Home' : 'Startseite'}
            </button>
            <span>/</span>
            <span className="font-bold text-[#17324D] dark:text-white">
              {isEn ? 'Search Results' : 'Suchergebnisse'}
            </span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] dark:text-white">
            {isEn ? `Search results for "${searchQuery}"` : `Suchergebnisse für „${searchQuery}“`}
          </h1>
          <p className="text-base text-[#202B36] dark:text-slate-300 mt-1">
            {isEn
              ? `${results.length} matching ${results.length === 1 ? 'guide' : 'guides'} found`
              : `${results.length} passende ${results.length === 1 ? 'Anleitung' : 'Anleitungen'} gefunden`}
          </p>
        </div>

        {/* Refined Search Field */}
        <div className="bg-[#FFFFFF] dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="search"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder={isEn ? 'Start a new search...' : 'Neue Suche starten...'}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E5E9ED] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base focus:border-[#176B68] focus:outline-none placeholder-[#202B36]/50"
              />
              <Icon name="search" className="absolute left-3.5 top-3.5 text-[#17324D] text-xl pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-bold text-sm transition-colors shrink-0 shadow-sm"
            >
              {isEn ? 'Search' : 'Suchen'}
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex items-center gap-2 mt-3 flex-wrap text-xs text-[#202B36] dark:text-slate-300">
            <span className="font-semibold text-[#17324D] dark:text-slate-200">{isEn ? 'Recommended keywords:' : 'Empfohlene Suchbegriffe:'}</span>
            {['Phishing', 'WhatsApp', 'Banking', 'Password', 'ChatGPT'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setLocalQuery(tag);
                  onSearch(tag);
                }}
                className="px-3 py-1 bg-[#EAF2F8] dark:bg-slate-800 hover:bg-[#176B68] hover:text-white rounded-full transition-colors font-medium border border-[#E5E9ED] dark:border-slate-700"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {results.length === 0 ? (
          <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-12 text-center border-2 border-dashed border-[#E5E9ED] dark:border-slate-800 space-y-4">
            <Icon name="search_off" className="text-6xl text-[#176B68]/60" />
            <h2 className="text-2xl font-bold text-[#17324D] dark:text-white">
              {isEn ? 'No matching guides found' : 'Leider kein passendes Ergebnis gefunden'}
            </h2>
            <p className="text-[#202B36] dark:text-slate-300 max-w-md mx-auto">
              {isEn
                ? 'Try a broader term like "Safety", "Message", or "Account".'
                : 'Probieren Sie ein allgemeineres Wort wie „Sicherheit“, „Nachrichten“ oder „Konto“ aus.'}
            </p>
            <button
              onClick={() => onNavigate('tutorials')}
              className="px-6 py-3 rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-bold text-sm shadow-sm"
            >
              {isEn ? 'Browse all guides' : 'Alle Anleitungen ansehen'}
            </button>
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => handleImageError(e, '/assets/images/hero_senior_woman_1793286326933.jpg')}
                    />
                    )}
                    <div className="absolute top-3 left-3 bg-[#17324D] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                      {tut.categoryTitle}
                    </div>

                    <button
                      onClick={() => onToggleBookmark(tut.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#FFFFFF]/95 dark:bg-slate-900/90 flex items-center justify-center text-[#17324D] hover:text-[#176B68] shadow-sm border border-[#E5E9ED] dark:border-slate-700"
                      aria-label={isSaved ? (isEn ? 'Saved' : 'Gemerkt') : (isEn ? 'Save' : 'Merken')}
                    >
                      <Icon name={isSaved ? 'bookmark' : 'bookmark_border'} className={`text-xl ${isSaved ? 'text-[#176B68]' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#202B36] dark:text-slate-400 mb-1">
                        <span>{tut.durationMinutes} {isEn ? 'min' : 'Min.'}</span>
                        <span>•</span>
                        <span>{tut.difficulty}</span>
                      </div>
                      <h2 className="text-lg font-bold text-[#17324D] dark:text-white group-hover:text-[#176B68] transition-colors">
                        {tut.title}
                      </h2>
                      <p className="text-sm text-[#202B36] dark:text-slate-300 mt-1 line-clamp-2">
                        {tut.description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectTutorial(tut.id);
                        onNavigate('tutorial-detail');
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors touch-target shadow-sm"
                    >
                      <span>{isEn ? 'View Guide' : 'Anleitung ansehen'}</span>
                      <Icon name="arrow_forward" className="text-base" />
                    </button>
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
