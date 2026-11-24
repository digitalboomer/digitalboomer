import React, { useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { ServiceLogo } from '../components/ServiceLogo';
import { serviceById } from '../data/services';
import { PageId, Language } from '../types';
import { CATEGORIES_EN, CATEGORIES_DE, TUTORIALS_EN, TUTORIALS_DE } from '../data/content';
import { OfficialTopicIcon } from '../components/OfficialTopicIcon';
import { handleImageError } from '../assets/images';
import { fitsDevice, useChosenDevice } from '../utils/phoneType';
import { linkTo, useLanguage } from '../utils/router';
import { buildSearchIndex, searchLessons } from '../utils/search';
import { isExtraLanguage, translateText } from '../i18n/translate';

interface TutorialsScreenProps {
  onNavigate: (page: PageId) => void;
  onSelectTutorial: (tutorialId: string) => void;
  activeCategoryFilter: string;
  onSetCategoryFilter: (catId: string) => void;
  savedTutorialIds: string[];
  onToggleBookmark: (tutorialId: string) => void;
  lang?: Language;
}


export const TutorialsScreen: React.FC<TutorialsScreenProps> = ({
  onNavigate,
  onSelectTutorial,
  activeCategoryFilter,
  onSetCategoryFilter,
  savedTutorialIds,
  onToggleBookmark,
  lang = 'en',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  // "Saved for later" shows only the tutorials the learner has saved (bookmarked).
  const [onlySaved, setOnlySaved] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const isEn = lang === 'en';
  const categories = isEn ? CATEGORIES_EN : CATEGORIES_DE;
  const device = useChosenDevice();
  const tutorials = (isEn ? TUTORIALS_EN : TUTORIALS_DE).filter((tut) => fitsDevice(tut, device));

  // Typing filters word by word, like the site search (src/utils/search.ts); best matches first.
  const uiLang = useLanguage();
  const index = useMemo(
    () => buildSearchIndex(tutorials, isExtraLanguage(uiLang) ? translateText : undefined),
    [isEn, device, uiLang] // `tutorials` follows from these
  );
  const searched = searchTerm.trim() ? searchLessons(index, searchTerm).results : tutorials;

  const filteredTutorials = searched.filter((tut) => {
    const matchesCategory =
      activeCategoryFilter === 'all' || tut.categoryId === activeCategoryFilter;
    const matchesSaved = !onlySaved || savedTutorialIds.includes(tut.id);
    return matchesCategory && matchesSaved;
  });

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumb & Title */}
        <div>
          <nav className="flex items-center gap-2 text-sm text-[#202B36] dark:text-slate-400 mb-2" aria-label="Breadcrumb">
            <a {...linkTo({ page: 'home' }, () => onNavigate('home'))} className="underline text-[#17324D] min-h-[44px] inline-flex items-center">
              {isEn ? 'Home' : 'Startseite'}
            </a>
            <span>/</span>
            <span className="font-bold text-[#17324D] dark:text-white">
              {isEn ? 'All tutorials' : 'Alle Anleitungen'}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] dark:text-white">
                {isEn ? 'All tutorials' : 'Alle Anleitungen'}
              </h1>
              <p className="text-lg text-[#202B36] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
                {isEn
                  ? 'Every lesson in one place. Search for a task, or choose a topic.'
                  : 'Alle Lektionen an einem Ort. Suchen Sie nach einer Aufgabe, oder wählen Sie ein Thema.'}
              </p>
            </div>

            <p className="text-base font-bold text-[#17324D] dark:text-teal-300 bg-[#EAF2F8] dark:bg-slate-800 px-4 py-1.5 rounded-full" aria-live="polite">
              {isEn ? `${filteredTutorials.length} ${filteredTutorials.length === 1 ? 'lesson' : 'lessons'} found` : `${filteredTutorials.length} ${filteredTutorials.length === 1 ? 'Lektion' : 'Lektionen'} gefunden`}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#FFFFFF] dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search input */}
            <div className="md:col-span-6">
              <label htmlFor="search-tutorials" className="block font-bold text-[#17324D] mb-1">
                {isEn ? 'Search' : 'Suchen'}
              </label>
              <div className="relative">
                <input
                  id="search-tutorials"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isEn ? 'Search by app, topic or keyword' : 'Thema, App oder Stichwort suchen'}
                  className="w-full pl-4 pr-14 min-h-[52px] rounded-xl border-2 border-[#667382] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base placeholder-[#5B6672]"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-lg text-[#17324D] hover:bg-[#EAF2F8]"
                    aria-label={isEn ? 'Clear search' : 'Suchtext löschen'}
                  >
                    <Icon name="close" className="text-xl" />
                  </button>
                )}
              </div>
            </div>

            {/* Category dropdown */}
            <div className="md:col-span-3">
              <label htmlFor="filter-cat" className="block font-bold text-[#17324D] mb-1">
                {isEn ? 'Topic' : 'Thema'}
              </label>
              <select
                id="filter-cat"
                value={activeCategoryFilter}
                onChange={(e) => onSetCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#667382] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base focus:border-[#176B68] focus:outline-none font-medium"
              >
                <option value="all">{isEn ? 'All topics' : 'Alle Themen'}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Saved for later */}
            <div className="md:col-span-3">
              <label htmlFor="filter-saved" className="block font-bold text-[#17324D] mb-1">
                {isEn ? 'Show' : 'Anzeigen'}
              </label>
              <select
                id="filter-saved"
                value={onlySaved ? 'saved' : 'all'}
                onChange={(e) => setOnlySaved(e.target.value === 'saved')}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#667382] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base focus:border-[#176B68] focus:outline-none font-medium"
              >
                <option value="all">{isEn ? 'All tutorials' : 'Alle Anleitungen'}</option>
                <option value="saved">{isEn ? `Saved for later (${savedTutorialIds.length})` : `Für später gemerkt (${savedTutorialIds.length})`}</option>
              </select>
            </div>
          </div>

          {/* Quick Active Filter Badges */}
          {(activeCategoryFilter !== 'all' || onlySaved || searchTerm) && (
            <div className="flex items-center gap-2 pt-2 border-t border-[#E5E9ED] dark:border-slate-800 flex-wrap text-base">
              <span className="font-bold text-[#17324D] dark:text-slate-300">
                {isEn ? 'Active filters:' : 'Aktive Filter:'}
              </span>
              {activeCategoryFilter !== 'all' && (
                <button type="button" onClick={() => onSetCategoryFilter('all')} aria-label={isEn ? `Remove filter: ${categories.find((c) => c.id === activeCategoryFilter)?.title}` : `Filter entfernen: ${categories.find((c) => c.id === activeCategoryFilter)?.title}`} className="inline-flex items-center gap-2 px-3 min-h-[44px] rounded-full bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-teal-300 font-bold border-2 border-[#17324D] hover:bg-[#D7E5F2]">
                  {categories.find((c) => c.id === activeCategoryFilter)?.title}
                  <Icon name="close" className="text-lg" />
                </button>
              )}
              {onlySaved && (
                <button type="button" onClick={() => setOnlySaved(false)} aria-label={isEn ? `Remove filter: Saved for later` : `Filter entfernen: Für später gemerkt`} className="inline-flex items-center gap-2 px-3 min-h-[44px] rounded-full bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-teal-300 font-bold border-2 border-[#17324D] hover:bg-[#D7E5F2]">
                  {isEn ? 'Saved for later' : 'Für später gemerkt'}
                  <Icon name="close" className="text-lg" />
                </button>
              )}
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')} aria-label={isEn ? `Remove search: ${searchTerm}` : `Suche entfernen: ${searchTerm}`} className="inline-flex items-center gap-2 px-3 min-h-[44px] rounded-full bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-teal-300 font-bold border-2 border-[#17324D] hover:bg-[#D7E5F2]">
                  „{searchTerm}“
                  <Icon name="close" className="text-lg" />
                </button>
              )}
              <button
                onClick={() => {
                  onSetCategoryFilter('all');
                  setOnlySaved(false);
                  setSearchTerm('');
                }}
                className="px-2 min-h-[44px] text-[#17324D] underline font-bold"
              >
                {isEn ? 'Reset all filters' : 'Alle Filter zurücksetzen'}
              </button>
            </div>
          )}
        </div>

        {/* Tutorial Cards Grid */}
        {filteredTutorials.length === 0 ? (
          <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-12 text-center border-2 border-dashed border-[#E5E9ED] dark:border-slate-800 space-y-4">
            <Icon name="search_off" className="text-6xl text-[#176B68]/60" />
            <h3 className="text-2xl font-bold text-[#17324D] dark:text-white">
              {onlySaved && savedTutorialIds.length === 0
                ? (isEn ? 'You have not saved any lessons yet' : 'Sie haben noch keine Lektionen gemerkt')
                : (isEn ? 'No lessons found for your selection' : 'Keine Lektionen für Ihre Auswahl gefunden')}
            </h3>
            <p className="text-[#202B36] dark:text-slate-300 max-w-md mx-auto">
              {onlySaved && savedTutorialIds.length === 0
                ? (isEn ? 'Press "Save" on a tutorial, and it appears here.' : 'Drücken Sie bei einer Anleitung auf „Merken“, dann erscheint sie hier.')
                : (isEn
                  ? 'Try a different search query or reset your active filters.'
                  : 'Versuchen Sie es mit einem anderen Suchbegriff oder setzen Sie die Filter zurück.')}
            </p>
            <button
              onClick={() => {
                onSetCategoryFilter('all');
                setOnlySaved(false);
                setSearchTerm('');
              }}
              className="px-6 py-3 bg-[#17324D] hover:bg-[#0f2336] text-white rounded-xl font-bold transition-colors"
            >
              {isEn ? 'Show all lessons again' : 'Alle Lektionen wieder zeigen'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.slice(0, visibleCount).map((tut) => {
              const isSaved = savedTutorialIds.includes(tut.id);

              return (
                <div
                  key={tut.id}
                  className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group hover:border-[#176B68]"
                >
                  <div className="relative h-28 sm:h-48 overflow-hidden bg-[#EAF2F8] dark:bg-slate-800">
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
                    <div className="absolute top-3 left-3 bg-[#17324D] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5">
                      <OfficialTopicIcon topicId={tut.categoryId} size="sm" />
                      <span>{tut.categoryTitle}</span>
                    </div>

                    <button
                      onClick={() => onToggleBookmark(tut.id)}
                      aria-pressed={isSaved}
                      className="absolute top-3 right-3 w-11 h-11 rounded-full bg-[#FFFFFF]/95 dark:bg-slate-900/90 flex items-center justify-center text-[#17324D] hover:text-[#176B68] shadow-sm transition-colors touch-target border border-[#E5E9ED] dark:border-slate-700"
                      title={isSaved ? (isEn ? 'Remove bookmark' : 'Aus Merkliste entfernen') : (isEn ? 'Save for later' : 'Merken')}
                      aria-label={`${isEn ? 'Save for later' : 'Für später merken'}: ${tut.title}`}
                    >
                      <Icon name={isSaved ? 'bookmark' : 'bookmark_border'} className={`text-2xl ${isSaved ? 'text-[#176B68]' : ''}`} />
                    </button>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-[#202B36] dark:text-slate-400 mb-2.5">
                        <span className="flex items-center gap-1 font-semibold text-[#17324D] dark:text-slate-200">
                          <Icon name="schedule" className="text-base text-[#176B68]" />
                          {tut.durationMinutes} {isEn ? 'minutes' : 'Minuten'}
                        </span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded bg-[#EAF2F8] dark:bg-slate-800 border border-[#E5E9ED] dark:border-slate-700 font-bold text-[#17324D] dark:text-teal-300">
                          {tut.difficulty}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-[#17324D] dark:text-white group-hover:text-[#176B68] transition-colors leading-snug">
                        {tut.title}
                      </h2>
                      <p className="hidden sm:block text-sm text-[#202B36] dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                        {tut.description}
                      </p>

                      </div>

                    <div className="pt-4 border-t border-[#E5E9ED] dark:border-slate-800 flex items-center gap-3">
                      <a
                        {...linkTo({ page: 'tutorial-detail', tutorialId: tut.id }, () => {
                          onSelectTutorial(tut.id);
                          onNavigate('tutorial-detail');
                        })}
                        aria-label={`${tut.practice ? (isEn ? 'Start practice' : 'Übung starten') : (isEn ? 'Open lesson' : 'Lektion öffnen')}: ${tut.title}`}
                        className="link-card flex-1 py-3 px-4 min-h-[48px] rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-bold text-base text-center flex items-center justify-center gap-2 transition-colors touch-target shadow-sm"
                      >
                        <span>{tut.practice ? (isEn ? 'Start practice' : 'Übung starten') : (isEn ? 'Open lesson' : 'Lektion öffnen')}</span>
                        <Icon name="arrow_forward" className="text-lg" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredTutorials.length > visibleCount && (
          <div className="flex justify-center">
            <button onClick={() => setVisibleCount(visibleCount + 12)} className="px-6 min-h-[56px] rounded-xl border-2 border-[#17324D] text-[#17324D] font-bold text-base hover:bg-[#EAF2F8]">
              {isEn ? `Show more (${filteredTutorials.length - visibleCount} more)` : `Mehr anzeigen (${filteredTutorials.length - visibleCount} weitere)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
