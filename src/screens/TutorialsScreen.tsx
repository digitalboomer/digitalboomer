import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { ServiceLogo } from '../components/ServiceLogo';
import { serviceById } from '../data/services';
import { PageId, Language } from '../types';
import { CATEGORIES_EN, CATEGORIES_DE, TUTORIALS_EN, TUTORIALS_DE } from '../data/content';
import { OfficialTopicIcon } from '../components/OfficialTopicIcon';
import { handleImageError } from '../assets/images';
import { fitsDevice, useChosenDevice } from '../utils/phoneType';

interface TutorialsScreenProps {
  onNavigate: (page: PageId) => void;
  onSelectTutorial: (tutorialId: string) => void;
  activeCategoryFilter: string;
  onSetCategoryFilter: (catId: string) => void;
  savedTutorialIds: string[];
  onToggleBookmark: (tutorialId: string) => void;
  lang?: Language;
}

const levelOf = (difficulty: string) =>
  difficulty === 'Easy' || difficulty === 'Einfach' ? 'easy' : difficulty === 'Intermediate' || difficulty === 'Mittel' ? 'medium' : 'advanced';

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
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | string>('all');
  const [visibleCount, setVisibleCount] = useState(12);

  const isEn = lang === 'en';
  const categories = isEn ? CATEGORIES_EN : CATEGORIES_DE;
  const device = useChosenDevice();
  const tutorials = (isEn ? TUTORIALS_EN : TUTORIALS_DE).filter((tut) => fitsDevice(tut, device));

  const filteredTutorials = tutorials.filter((tut) => {
    const matchesCategory =
      activeCategoryFilter === 'all' || tut.categoryId === activeCategoryFilter;
    const matchesDifficulty =
      selectedDifficulty === 'all' ||
      levelOf(tut.difficulty) === selectedDifficulty;
    const matchesSearch =
      tut.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tut.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumb & Title */}
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#202B36] dark:text-slate-400 mb-2" aria-label="Breadcrumb">
            <button onClick={() => onNavigate('home')} className="hover:underline hover:text-[#176B68]">
              {isEn ? 'Home' : 'Startseite'}
            </button>
            <span>/</span>
            <span className="font-bold text-[#17324D] dark:text-white">
              {isEn ? 'Tutorials & Guides' : 'Anleitungen & Tutorials'}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] dark:text-white">
                {isEn ? 'Tutorials & Step-by-Step Guides' : 'Anleitungen & Schritt-für-Schritt Guides'}
              </h1>
              <p className="text-lg text-[#202B36] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
                {isEn
                  ? 'Find concrete assistance for your daily digital tasks. All guides are completely ad-free and crafted for relaxed learning.'
                  : 'Finden Sie konkrete Hilfestellungen für Ihre täglichen Fragen. Alle Guides sind werbefrei und leicht verständlich aufgebaut.'}
              </p>
            </div>

            <div className="text-sm font-semibold text-[#17324D] dark:text-teal-300 bg-[#EAF2F8] dark:bg-slate-800 px-3.5 py-1.5 rounded-full border border-[#E5E9ED] dark:border-slate-700">
              {filteredTutorials.length} {isEn ? 'guides found' : 'Anleitungen gefunden'}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#FFFFFF] dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search input */}
            <div className="md:col-span-6 relative">
              <label htmlFor="search-tutorials" className="block font-bold text-[#17324D] mb-1">
                {isEn ? 'Search' : 'Suchen'}
              </label>
              <input
                id="search-tutorials"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isEn ? 'Search by app, topic or keyword...' : 'Thema, App oder Stichwort suchen...'}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#667382] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base focus:border-[#176B68] focus:outline-none placeholder-[#202B36]/50"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-[#202B36] hover:text-[#17324D] text-sm font-bold"
                  aria-label={isEn ? 'Clear search' : 'Suchtext löschen'}
                >
                  ✕
                </button>
              )}
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
                <option value="all">{isEn ? 'All Topic Areas' : 'Alle Themenbereiche'}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty selector */}
            <div className="md:col-span-3">
              <label htmlFor="filter-diff" className="block font-bold text-[#17324D] mb-1">
                {isEn ? 'Level' : 'Stufe'}
              </label>
              <select
                id="filter-diff"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#667382] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base focus:border-[#176B68] focus:outline-none font-medium"
              >
                <option value="all">{isEn ? 'All Levels' : 'Alle Schwierigkeiten'}</option>
                <option value="easy">{isEn ? 'Easy (Beginners)' : 'Nur Einfach (für Einsteiger)'}</option>
                <option value="medium">{isEn ? 'Intermediate' : 'Mittel (etwas Erfahrung)'}</option>
              </select>
            </div>
          </div>

          {/* Quick Active Filter Badges */}
          {(activeCategoryFilter !== 'all' || selectedDifficulty !== 'all' || searchTerm) && (
            <div className="flex items-center gap-2 pt-2 border-t border-[#E5E9ED] dark:border-slate-800 flex-wrap text-xs">
              <span className="font-bold text-[#17324D] dark:text-slate-300">
                {isEn ? 'Active filters:' : 'Aktive Filter:'}
              </span>
              {activeCategoryFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-teal-300 font-bold border border-[#E5E9ED] dark:border-slate-700">
                  {categories.find((c) => c.id === activeCategoryFilter)?.title}
                  <button onClick={() => onSetCategoryFilter('all')} className="hover:text-red-600 font-bold ml-1">✕</button>
                </span>
              )}
              {selectedDifficulty !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-teal-300 font-bold border border-[#E5E9ED] dark:border-slate-700">
                  Level: {selectedDifficulty}
                  <button onClick={() => setSelectedDifficulty('all')} className="hover:text-red-600 font-bold ml-1">✕</button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-teal-300 font-bold border border-[#E5E9ED] dark:border-slate-700">
                  „{searchTerm}“
                  <button onClick={() => setSearchTerm('')} className="hover:text-red-600 font-bold ml-1">✕</button>
                </span>
              )}
              <button
                onClick={() => {
                  onSetCategoryFilter('all');
                  setSelectedDifficulty('all');
                  setSearchTerm('');
                }}
                className="text-[#176B68] hover:underline font-bold ml-2"
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
              {isEn ? 'No guides found for your selection' : 'Keine Anleitungen für Ihre Auswahl gefunden'}
            </h3>
            <p className="text-[#202B36] dark:text-slate-300 max-w-md mx-auto">
              {isEn
                ? 'Try a different search query or reset your active filters.'
                : 'Versuchen Sie es mit einem anderen Suchbegriff oder setzen Sie die Filter zurück.'}
            </p>
            <button
              onClick={() => {
                onSetCategoryFilter('all');
                setSelectedDifficulty('all');
                setSearchTerm('');
              }}
              className="px-6 py-3 bg-[#17324D] hover:bg-[#0f2336] text-white rounded-xl font-bold transition-colors"
            >
              {isEn ? 'View all guides again' : 'Alle Anleitungen wieder anzeigen'}
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
                      className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#FFFFFF]/95 dark:bg-slate-900/90 flex items-center justify-center text-[#17324D] hover:text-[#176B68] shadow-sm transition-colors touch-target border border-[#E5E9ED] dark:border-slate-700"
                      title={isSaved ? (isEn ? 'Remove bookmark' : 'Aus Merkliste entfernen') : (isEn ? 'Save guide' : 'Merken')}
                      aria-label={isSaved ? (isEn ? 'Bookmarked' : 'Gemerkt') : (isEn ? 'Bookmark' : 'Merken')}
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
                      <button
                        onClick={() => {
                          onSelectTutorial(tut.id);
                          onNavigate('tutorial-detail');
                        }}
                        className="flex-1 py-3 px-4 rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-bold text-base text-center flex items-center justify-center gap-2 transition-colors touch-target shadow-sm"
                      >
                        <span>{tut.practice ? (isEn ? 'Start practice' : 'Übung starten') : (isEn ? 'Open tutorial' : 'Anleitung öffnen')}</span>
                        <Icon name="arrow_forward" className="text-lg" />
                      </button>
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
