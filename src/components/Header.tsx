import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { PageId, ThemeMode, TextScale, UserProfile, Language } from '../types';
import { IMAGES, handleLogoError } from '../assets/images';
import { type UiLanguage } from '../i18n/translate';
import { LanguagePicker } from './LanguagePicker';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  textScale: TextScale;
  onTextScaleChange: (scale: TextScale) => void;
  soundOn: boolean;
  onSoundChange: (on: boolean) => void;
  onOpenSupportModal: () => void;
  onSearch: (query: string) => void;
  user: UserProfile;
  lang: Language;
  /** The chosen language; `lang` is the language the page is built in (English for Turkish, Spanish and Croatian). */
  uiLang: UiLanguage;
  onLangChange: (lang: UiLanguage) => void;
}

/** One setting choice: selected = navy, bold and a check mark, so it does not depend on colour. */
const Choice: React.FC<{ selected: boolean; onClick: () => void; children: React.ReactNode }> = ({ selected, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`inline-flex items-center gap-1 px-3 min-h-[44px] rounded-xl border-2 border-[#17324D] text-base ${
      selected ? 'bg-[#17324D] text-white font-bold' : 'bg-[#FFFFFF] text-[#17324D] hover:bg-[#EAF2F8]'
    }`}
  >
    {selected && <Icon name="check" className="text-base" />}
    {children}
  </button>
);

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  theme,
  onThemeChange,
  textScale,
  onTextScaleChange,
  soundOn,
  onSoundChange,
  onOpenSupportModal,
  onSearch,
  user,
  lang,
  uiLang,
  onLangChange,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const isEn = lang === 'en';

  const navItems: { id: PageId; label: string; icon: string }[] = [
    { id: 'home', label: isEn ? 'Home' : 'Startseite', icon: 'home' },
    { id: 'themen', label: isEn ? 'Topics' : 'Themen', icon: 'category' },
    { id: 'tutorials', label: isEn ? 'All tutorials' : 'Alle Anleitungen', icon: 'menu_book' },
    { id: 'sicherheit', label: isEn ? 'Digital safety' : 'Digitale Sicherheit', icon: 'verified_user' },
    { id: 'ueber-uns', label: isEn ? 'About us' : 'Über uns', icon: 'help' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setMenuOpen(false);
    }
  };

  const toolButton = 'w-full h-full md:w-auto md:h-auto inline-flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-1 md:px-3 py-1 md:py-0 min-h-[56px] md:min-h-[44px] rounded-xl text-white text-sm leading-tight text-center font-bold hover:bg-white/15';

  const searchForm = (id: string) => (
    <form onSubmit={handleSearch} role="search" className="flex items-center gap-2">
      <label htmlFor={id} className="sr-only">{isEn ? 'Search for a topic' : 'Thema suchen'}</label>
      <input
        id={id}
        type="search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder={isEn ? 'Search for a topic' : 'Thema suchen'}
        className="w-full min-w-0 md:w-56 px-3 min-h-[44px] rounded-xl border-2 border-[#667382] bg-[#FFFFFF] text-[#202B36] text-base"
      />
      <button type="submit" className="inline-flex items-center gap-2 px-3 min-h-[44px] rounded-xl bg-[#176B68] hover:bg-[#0F514F] text-white text-sm font-bold shrink-0">
        <Icon name="search" className="text-lg" />
        {isEn ? 'Search' : 'Suchen'}
      </button>
    </form>
  );

  return (
    <>
      {/* Tools. Scrolls away, so small screens keep room for the lesson. */}
      {/* Phones: three equal buttons across the full width, icon above the word. Larger screens: one row on the right. */}
      <div className="bg-[#17324D] text-white px-2 sm:px-8 py-1">
        <div className="max-w-[1200px] mx-auto grid grid-cols-3 gap-1 md:flex md:flex-wrap md:items-center md:justify-end md:gap-2">
          <div className="hidden md:block mr-auto">{searchForm('search-top')}</div>
          <button type="button" onClick={onOpenSupportModal} className={toolButton}>
            <Icon name="help" className="text-xl" />
            {isEn ? 'Help' : 'Hilfe'}
          </button>
          {/* Language: its own control. Language names stay in their own language (translate="no"). */}
          <LanguagePicker value={uiLang} onChange={onLangChange} label={isEn ? 'Language' : 'Sprache'} buttonClassName={toolButton} />
          <button
            type="button"
            onClick={() => setSettingsOpen(!settingsOpen)}
            aria-expanded={settingsOpen}
            className={toolButton}
          >
            <Icon name="format_size" className="text-xl" />
            {isEn ? 'Text, colours & sound' : 'Schrift, Farben & Ton'}
          </button>
        </div>
      </div>

      {settingsOpen && (
        <section
          aria-label={isEn ? 'Settings' : 'Einstellungen'}
          className="bg-[#EAF2F8] dark:bg-slate-900 border-b-2 border-[#17324D] px-4 sm:px-8 py-4"
        >
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div role="group" aria-label={isEn ? 'Text size' : 'Schriftgröße'}>
              <p className="font-bold text-[#17324D] mb-1">{isEn ? 'Text size' : 'Schriftgröße'}</p>
              <div className="flex flex-wrap gap-2">
                <Choice selected={textScale === '100'} onClick={() => onTextScaleChange('100')}>{isEn ? 'Normal' : 'Normal'}</Choice>
                <Choice selected={textScale === '115'} onClick={() => onTextScaleChange('115')}>{isEn ? 'Large' : 'Groß'}</Choice>
                <Choice selected={textScale === '130'} onClick={() => onTextScaleChange('130')}>{isEn ? 'Very large' : 'Sehr groß'}</Choice>
              </div>
            </div>
            <div role="group" aria-label={isEn ? 'Colours' : 'Farben'}>
              <p className="font-bold text-[#17324D] mb-1">{isEn ? 'Colours' : 'Farben'}</p>
              <div className="flex flex-wrap gap-2">
                <Choice selected={theme === 'light'} onClick={() => onThemeChange('light')}>{isEn ? 'Light' : 'Hell'}</Choice>
                <Choice selected={theme === 'dark'} onClick={() => onThemeChange('dark')}>{isEn ? 'Dark' : 'Dunkel'}</Choice>
                <Choice selected={theme === 'high-contrast'} onClick={() => onThemeChange('high-contrast')}>{isEn ? 'High contrast' : 'Hoher Kontrast'}</Choice>
              </div>
            </div>
            <div role="group" aria-label={isEn ? 'Click sound' : 'Klick-Ton'}>
              <p className="font-bold text-[#17324D] mb-1">{isEn ? 'Quiet click sound' : 'Leiser Klick-Ton'}</p>
              <div className="flex flex-wrap gap-2">
                <Choice selected={soundOn} onClick={() => onSoundChange(true)}>{isEn ? 'On' : 'An'}</Choice>
                <Choice selected={!soundOn} onClick={() => onSoundChange(false)}>{isEn ? 'Off' : 'Aus'}</Choice>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Same header on every page. Fixed at the top from tablet size; on phones it scrolls away, so the lesson gets the screen. */}
      <header className="md:sticky md:top-0 z-40 w-full bg-white dark:bg-slate-900 border-b-2 border-[#E5E9ED] dark:border-slate-800">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => { onNavigate('home'); setMenuOpen(false); }}
            className="shrink-0 rounded-xl p-1 bg-white"
            aria-label={isEn ? 'Digital Boomer, go to the home page' : 'Digital Boomer, zur Startseite'}
          >
            <img src={IMAGES.logo} alt="" className="h-12 sm:h-14 w-auto max-w-[180px] object-contain" onError={handleLogoError} />
          </button>

          <nav className="hidden lg:flex items-center gap-1" aria-label={isEn ? 'Main navigation' : 'Hauptnavigation'}>
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-2 xl:px-3 min-h-[44px] text-base whitespace-nowrap text-[#17324D] border-b-4 hover:bg-[#EAF2F8] dark:hover:bg-slate-800 ${
                    isActive ? 'font-bold border-[#17324D] dark:border-white' : 'font-normal border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => { onNavigate('dashboard'); setMenuOpen(false); }}
              aria-current={currentPage === 'dashboard' ? 'page' : undefined}
              className="inline-flex items-center gap-2 px-3 min-h-[48px] rounded-xl border-2 border-[#17324D] bg-[#FFFFFF] text-[#17324D] font-bold text-sm hover:bg-[#EAF2F8]"
            >
              <Icon name="task_alt" className="text-xl" />
              <span className="hidden sm:inline whitespace-nowrap">{isEn ? 'My progress' : 'Mein Fortschritt'}</span>
              <span className="sm:hidden max-[379px]:sr-only">{isEn ? 'Progress' : 'Fortschritt'}</span>
              <span className="sr-only">
                {isEn ? `, ${user.completedTutorialIds.length} lessons completed` : `, ${user.completedTutorialIds.length} Lektionen abgeschlossen`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              className="lg:hidden inline-flex items-center gap-2 px-3 min-h-[48px] rounded-xl bg-[#17324D] text-white font-bold text-sm hover:bg-[#0F2438]"
            >
              <Icon name={menuOpen ? 'close' : 'menu'} className="text-xl" />
              {menuOpen ? (isEn ? 'Close' : 'Schließen') : (isEn ? 'Menu' : 'Menü')}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t-2 border-[#E5E9ED] dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-3 max-h-[75vh] overflow-y-auto">
            <nav className="flex flex-col gap-1" aria-label={isEn ? 'Main navigation' : 'Hauptnavigation'}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
                  aria-current={currentPage === item.id ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 min-h-[52px] rounded-xl text-left text-base text-[#17324D] hover:bg-[#EAF2F8] dark:hover:bg-slate-800 ${
                    currentPage === item.id ? 'font-bold underline decoration-4 underline-offset-4' : ''
                  }`}
                >
                  <Icon name={item.icon} className="text-2xl text-[#176B68]" />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="md:hidden">{searchForm('search-menu')}</div>
          </div>
        )}
      </header>
    </>
  );
};
