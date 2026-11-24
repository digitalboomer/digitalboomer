import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { PageId, ThemeMode, TextScale, UserProfile, Language } from './types';
import { INITIAL_USER_PROFILE, TUTORIALS_DE, TUTORIALS_EN } from './data/content';
import { PageLoading } from './components/PageLoading';
import { currentRoute, goTo, leaveLesson, setLanguage, setLeaveGuard, stayInLesson, useLanguage, usePendingLeave, useRoute } from './utils/router';
import { clearProgress, loadProgress, saveProgress, type SavedProgress } from './utils/progress';
import { handleAuthLink, loadAccountProgress, onAccountChange, saveAccountProgress, signOut } from './utils/auth';
import { clearHelpLevel } from './utils/helpLevel';
import { clearPhoneType } from './utils/phoneType';
import { setPageLanguage, translateText, UI_LANGUAGES, type UiLanguage } from './i18n/translate';
import { headInfo } from './seo/pageMeta';
import { applyHead } from './seo/head';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CelebrationDialog } from './components/CelebrationDialog';
import { LeaveLessonDialog } from './components/LeaveLessonDialog';

import { HomeScreen } from './screens/HomeScreen';
import { GROUP_PAGE, ServiceGroup, groupOfCategory, serviceById } from './data/services';
import { isSoundOn, playClick, playSuccess, setSoundOn } from './utils/feedback';

// Everything except the home page loads when it is first needed, so the first visit is quicker
// on older phones and slow connections. After the first page is shown, the most used parts are
// fetched quietly in the background (see `preloadCommonPages`), so moving on stays instant.
const named = <K extends string, M extends Record<K, React.ComponentType<any>>>(load: () => Promise<M>, name: K) =>
  lazy(() => load().then((module) => ({ default: module[name] })));
const loadPractice = () => import('./components/practice/GuidedPractice');
const loadDetail = () => import('./screens/TutorialDetailScreen');
const loadHub = () => import('./screens/ServiceHubScreen');
const loadTopics = () => import('./screens/TopicsScreen');
const GuidedPractice = named(loadPractice, 'GuidedPractice');
const FreeRoam = named(() => import('./components/practice/FreeRoam'), 'FreeRoam');
const TutorialDetailScreen = named(loadDetail, 'TutorialDetailScreen');
const ServiceHubScreen = named(loadHub, 'ServiceHubScreen');
const TopicsScreen = named(loadTopics, 'TopicsScreen');
const TutorialsScreen = named(() => import('./screens/TutorialsScreen'), 'TutorialsScreen');
const SecurityScreen = named(() => import('./screens/SecurityScreen'), 'SecurityScreen');
const AiLessonsScreen = named(() => import('./screens/AiLessonsScreen'), 'AiLessonsScreen');
const DashboardScreen = named(() => import('./screens/DashboardScreen'), 'DashboardScreen');
const AuthScreens = named(() => import('./screens/AuthScreens'), 'AuthScreens');
const AboutHelpScreen = named(() => import('./screens/AboutHelpScreen'), 'AboutHelpScreen');
const AccessibilityPrivacyScreen = named(() => import('./screens/AccessibilityPrivacyScreen'), 'AccessibilityPrivacyScreen');
const SearchResultsScreen = named(() => import('./screens/SearchResultsScreen'), 'SearchResultsScreen');
const GlossaryScreen = named(() => import('./screens/GlossaryScreen'), 'GlossaryScreen');
const FamilyScreen = named(() => import('./screens/FamilyScreen'), 'FamilyScreen');
const ForYouScreen = named(() => import('./screens/ForYouScreen'), 'ForYouScreen');
const SupportModal = named(() => import('./components/SupportModal'), 'SupportModal');
const QRCodeModal = named(() => import('./components/QRCodeModal'), 'QRCodeModal');

/** Fetches the parts most visitors open next, once the browser has nothing else to do. */
function preloadCommonPages(): void {
  const run = () => { void loadTopics(); void loadHub(); void loadDetail(); void loadPractice(); };
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 2500); // older Safari
}

// Settings in this browser. Storage can be blocked (strict privacy settings): the site then still works, it just forgets.
function readSetting(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeSetting(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Not kept; the choice lasts until the page is closed.
  }
}

export default function App() {
  const route = useRoute();
  const currentPage = route.page;
  const selectedTutorialId = route.tutorialId ?? '';
  const activeCategoryFilter = route.category ?? 'all';
  const searchQuery = route.query ?? '';

  const [textScale, setTextScale] = useState<TextScale>(() => {
    const saved = readSetting('digital-boomer-text-scale');
    return saved === '100' || saved === '115' || saved === '130' ? saved : '100';
  });

  // Language: part of the address (/de/…, /hr/…), see src/utils/router.ts. A choice from the menu always wins.
  // Turkish, Spanish and Croatian show the English page, translated while it runs (src/i18n/translate.ts),
  // so `lang` (the language the page is built in) is 'en' for them.
  const uiLang = useLanguage();
  const lang: Language = uiLang === 'de' ? 'de' : 'en';
  // Title, description, canonical address and language versions of the open page (src/seo).
  const updateHead = () => applyHead(headInfo(currentRoute(), uiLang, { en: TUTORIALS_EN, de: TUTORIALS_DE }, translateText));
  useEffect(() => {
    void setPageLanguage(uiLang).then(updateHead); // Turkish, Spanish, Croatian: once the dictionary is there
  }, [uiLang]);
  useEffect(updateHead, [route]);
  const setLang = (next: UiLanguage) => setLanguage(next);
  const [soundOn, setSoundState] = useState(isSoundOn);
  const handleSoundChange = (on: boolean) => {
    setSoundOn(on);
    setSoundState(on);
  };

  // Every button and link answers with a quiet tick. Keys on the phone are buttons too.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const control = (event.target as Element | null)?.closest?.('button, a, select, [role="button"], summary');
      if (control && !control.matches(':disabled')) playClick();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // A new visitor is a guest. Progress comes from this browser's storage.
  const [initialProgress] = useState(loadProgress);
  const [user, setUser] = useState<UserProfile>({
    ...INITIAL_USER_PROFILE,
    completedTutorialIds: initialProgress.completedTutorialIds,
    savedTutorialIds: initialProgress.savedTutorialIds,
    certificateEarned: initialProgress.completedTutorialIds.length > 0,
  });
  const [tutorialSteps, setTutorialSteps] = useState<Record<string, number>>(initialProgress.tutorialSteps);

  useEffect(() => {
    saveProgress({
      completedTutorialIds: user.completedTutorialIds,
      savedTutorialIds: user.savedTutorialIds,
      tutorialSteps,
    });
  }, [user.completedTutorialIds, user.savedTutorialIds, tutorialSteps]);

  // Accounts (optional). A link from a confirmation or password email lands here first.
  const [accountId, setAccountId] = useState<string | null>(null);
  const [authLinkFailed, setAuthLinkFailed] = useState(false);
  const accountRef = useRef<string | null>(null);
  useEffect(() => {
    handleAuthLink().then((landing) => {
      if (landing === 'confirmed') goTo({ page: 'konto-bestaetigt' }, { replace: true, force: true });
      else if (landing === 'recovery') goTo({ page: 'neues-passwort' }, { replace: true, force: true });
      else if (landing === 'failed') {
        setAuthLinkFailed(true);
        goTo({ page: 'anmelden' }, { replace: true, force: true });
      }
    });
    return onAccountChange(async (account) => {
      if (account) {
        if (accountRef.current === account.id) return;
        accountRef.current = account.id;
        const meta = account.user_metadata as { name?: string };
        setUser((prev) => ({
          ...prev,
          name: meta.name || account.email?.split('@')[0] || '',
          email: account.email ?? '',
          isLoggedIn: true,
          isGuest: false,
          joinedDate: account.created_at,
        }));
        // What was done before signing in is kept and added to the account.
        // Saving to the account starts only after its progress has been read, so a slow
        // connection can never overwrite progress made on another device.
        let saved = await loadAccountProgress(account.id);
        if (saved === 'error') {
          await new Promise((resolve) => window.setTimeout(resolve, 2000));
          saved = await loadAccountProgress(account.id);
        }
        if (accountRef.current !== account.id) return; // signed out in the meantime
        if (saved === 'error') return; // progress stays in this browser; the account keeps what it has
        if (saved) {
          setUser((prev) => ({
            ...prev,
            completedTutorialIds: Array.from(new Set([...saved.completedTutorialIds, ...prev.completedTutorialIds])),
            savedTutorialIds: Array.from(new Set([...saved.savedTutorialIds, ...prev.savedTutorialIds])),
          }));
          setTutorialSteps((prev) => ({ ...saved.tutorialSteps, ...prev }));
        }
        setAccountId(account.id);
      } else if (accountRef.current) {
        // Signed out: this browser goes back to an empty guest, so the next person on a shared computer sees nothing.
        accountRef.current = null;
        setAccountId(null);
        clearProgress();
        setUser(INITIAL_USER_PROFILE);
        setTutorialSteps({});
      }
    });
  }, []);

  // Save progress to the account, a moment after it changes.
  useEffect(() => {
    if (!accountId) return;
    const progress: SavedProgress = { completedTutorialIds: user.completedTutorialIds, savedTutorialIds: user.savedTutorialIds, tutorialSteps };
    const timer = window.setTimeout(() => { void saveAccountProgress(accountId, progress); }, 1500);
    return () => window.clearTimeout(timer);
  }, [accountId, user.completedTutorialIds, user.savedTutorialIds, tutorialSteps]);

  // Automatic dark mode detection or persisted preference
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = readSetting('digital-boomer-theme');
    if (saved === 'light' || saved === 'dark' || saved === 'high-contrast') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  // Once the visitor picks a theme, the device's own light/dark switch no longer changes it.
  const themeChosenRef = useRef(readSetting('digital-boomer-theme') !== null);

  // AI & Email Support Modal (Replaces Phone Helpline)
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Mobile prototype QR code modal
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // The help and QR windows load the first time they are opened, and then stay ready (the chat keeps its messages).
  const supportUsed = useRef(false);
  const qrUsed = useRef(false);
  if (supportModalOpen) supportUsed.current = true;
  if (qrModalOpen) qrUsed.current = true;

  useEffect(preloadCommonPages, []);

  // The lesson just finished, for the celebration window
  const [celebratedId, setCelebratedId] = useState<string | null>(null);

  // Ask before leaving a lesson that was started and is not finished yet.
  const pendingLeave = usePendingLeave();
  const completedRef = useRef<string[]>([]);
  completedRef.current = user.completedTutorialIds;
  const inUnfinishedLesson = currentPage === 'tutorial-detail' && route.stepIndex !== undefined && !route.isDone && !user.completedTutorialIds.includes(selectedTutorialId);

  useEffect(() => {
    setLeaveGuard((from, to) =>
      from.page === 'tutorial-detail' &&
      from.stepIndex !== undefined &&
      !from.isDone &&
      !completedRef.current.includes(from.tutorialId ?? '') &&
      !(to.page === 'tutorial-detail' && to.tutorialId === from.tutorialId)
    );
    return () => setLeaveGuard(null);
  }, []);

  // Closing the tab or reloading: the browser asks with its own window.
  useEffect(() => {
    if (!inUnfinishedLesson) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [inUnfinishedLesson]);

  useEffect(() => {
    if (celebratedId && (currentPage !== 'tutorial-detail' || selectedTutorialId !== celebratedId)) setCelebratedId(null);
  }, [celebratedId, currentPage, selectedTutorialId]);

  // The page language (<html lang>) is set by setPageLanguage above, also for Turkish, Spanish and Croatian.

  // Apply textScale to root html element for true rem/em typography scaling
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-text-scale', textScale);
  }, [textScale]);

  const handleTextScaleChange = (scale: TextScale) => {
    setTextScale(scale);
    writeSetting('digital-boomer-text-scale', scale);
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    themeChosenRef.current = true;
    setTheme(newTheme);
    writeSetting('digital-boomer-theme', newTheme);
  };

  // Apply theme classes and attributes to root HTML element and body
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('dark', 'high-contrast', 'light');
    body.classList.remove('dark', 'high-contrast', 'light');
    root.removeAttribute('data-theme');
    body.removeAttribute('data-theme');

    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      body.setAttribute('data-theme', 'dark');
    } else if (theme === 'high-contrast') {
      root.classList.add('dark', 'high-contrast');
      body.classList.add('dark', 'high-contrast');
      root.setAttribute('data-theme', 'high-contrast');
      body.setAttribute('data-theme', 'high-contrast');
    } else {
      root.classList.add('light');
      body.classList.add('light');
      root.setAttribute('data-theme', 'light');
      body.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  // Follow the device's light/dark switch, until the visitor picks a theme themselves (also later in this visit).
  useEffect(() => {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!themeChosenRef.current) setTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Start at the top of the page after moving to another page or lesson.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedTutorialId]);

  // An old or mistyped lesson link leads to the list of lessons, not to an error.
  const tutorialExists = TUTORIALS_EN.some((t) => t.id === selectedTutorialId);
  const selectedPractice = (lang === 'en' ? TUTORIALS_EN : TUTORIALS_DE).find(
    (t) => t.id === selectedTutorialId && t.practice
  );
  useEffect(() => {
    if (currentPage === 'tutorial-detail' && !tutorialExists) {
      goTo({ page: 'tutorials' }, { replace: true });
    }
  }, [currentPage, tutorialExists]);

  // Screens call this after opening a lesson, filter or search. Those already
  // changed the hash, so staying on the same page keeps the details in the link.
  const handleNavigate = (page: PageId) => {
    if (currentRoute().page === page) {
      window.scrollTo(0, 0);
      return;
    }
    goTo({ page });
  };

  const handleOpenTutorial = (tutorialId: string, stepIndex?: number) => {
    goTo({ page: 'tutorial-detail', tutorialId, stepIndex });
  };

  // Remember the step of the open lesson, so "Resume lesson" continues exactly there.
  useEffect(() => {
    if (currentPage !== 'tutorial-detail' || !tutorialExists || route.isDone) return;
    const tutorial = TUTORIALS_EN.find((t) => t.id === selectedTutorialId);
    if (!tutorial) return;
    if (tutorial.practice && route.stepIndex === undefined) return; // only the introduction so far
    const stepIndex = Math.min(route.stepIndex ?? 0, tutorial.steps.length - 1);
    setTutorialSteps((prev) =>
      prev[selectedTutorialId] === stepIndex ? prev : { ...prev, [selectedTutorialId]: stepIndex }
    );
  }, [currentPage, selectedTutorialId, tutorialExists, route.stepIndex, route.isDone]);

  // "Reset my progress": a fresh start. Theme and text size stay as they are.
  // Signed in, the account stays signed in, and its saved progress is emptied too, on every device.
  const handleResetDemo = () => {
    clearProgress();
    clearHelpLevel();
    clearPhoneType();
    if (accountId) {
      setUser((prev) => ({ ...prev, completedTutorialIds: [], savedTutorialIds: [], certificateEarned: false }));
      void saveAccountProgress(accountId, { completedTutorialIds: [], savedTutorialIds: [], tutorialSteps: {} });
    } else {
      setUser(INITIAL_USER_PROFILE);
    }
    setTutorialSteps({});
    goTo({ page: 'home' }, { force: true });
  };

  // Toggle bookmark / saved tutorial
  const handleToggleBookmark = (tutId: string) => {
    setUser((prev) => {
      const isSaved = prev.savedTutorialIds.includes(tutId);
      return {
        ...prev,
        savedTutorialIds: isSaved
          ? prev.savedTutorialIds.filter((id) => id !== tutId)
          : [...prev.savedTutorialIds, tutId],
      };
    });
  };

  // A link from a family member: keep all its lessons as bookmarks, so they are in "My progress".
  const handleSaveAll = (ids: string[]) => {
    setUser((prev) => ({ ...prev, savedTutorialIds: Array.from(new Set([...prev.savedTutorialIds, ...ids])) }));
  };

  // Mark tutorial completed
  const handleMarkCompleted = (tutId: string) => {
    playSuccess();
    setCelebratedId(tutId);
    setTutorialSteps(({ [tutId]: _finished, ...rest }) => rest);
    setUser((prev) => {
      if (prev.completedTutorialIds.includes(tutId)) return prev;
      return {
        ...prev,
        completedTutorialIds: [...prev.completedTutorialIds, tutId],
        certificateEarned: true,
      };
    });
  };

  // Select category filter and jump to tutorials
  const handleSelectCategoryFilter = (catId: string) => {
    const group = groupOfCategory(catId);
    if (group) goTo({ page: GROUP_PAGE[group] });
    else if (catId === 'sicherheit') goTo({ page: 'sicherheit' }); // their own pages with all lessons
    else if (catId === 'ki') goTo({ page: 'ki-alltag' });
    else goTo({ page: 'tutorials', category: catId });
  };

  // Initiate search
  const handleSearch = (query: string) => {
    goTo({ page: 'suche', query });
  };

  const lessonsInLanguage = lang === 'en' ? TUTORIALS_EN : TUTORIALS_DE;
  const celebrated = lessonsInLanguage.find((t) => t.id === celebratedId);
  const nextAfterCelebrated = lessonsInLanguage.find((t) => t.id === celebrated?.nextIds?.[0]);

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F7F8F5] dark:bg-slate-950 text-[#202B36] dark:text-slate-100 transition-colors duration-200`}
      data-theme={theme}
    >
      {/* Top Accessible Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        theme={theme}
        onThemeChange={handleThemeChange}
        textScale={textScale}
        onTextScaleChange={handleTextScaleChange}
        soundOn={soundOn}
        onSoundChange={handleSoundChange}
        onOpenSupportModal={() => setSupportModalOpen(true)}
        onSearch={handleSearch}
        user={user}
        lang={lang}
        uiLang={uiLang}
        onLangChange={setLang}
      />

      {/* Main Content Router */}
      <main key={`${currentPage}-${selectedTutorialId}`} className="page-enter flex-1 w-full flex flex-col">
        <Suspense fallback={<PageLoading lang={lang} />}>
        {currentPage === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onSelectTutorial={handleOpenTutorial}
            onSelectCategory={handleSelectCategoryFilter}
            onOpenSupportModal={() => setSupportModalOpen(true)}
            lang={lang}
          />
        )}

        {currentPage === 'themen' && (
          <TopicsScreen
            onNavigate={handleNavigate}
            onSelectCategoryFilter={handleSelectCategoryFilter}
            onSelectTutorial={handleOpenTutorial}
            lang={lang}
          />
        )}

        {(Object.keys(GROUP_PAGE) as ServiceGroup[]).filter((group) => GROUP_PAGE[group] === currentPage).map((group) => (
          <ServiceHubScreen
            key={group}
            group={group}
            selectedService={route.category}
            onSelectService={(service) => goTo({ page: currentPage, category: service }, { replace: true })}
            onNavigate={handleNavigate}
            onSelectTutorial={handleOpenTutorial}
            completedIds={user.completedTutorialIds}
            lang={lang}
          />
        ))}

        {currentPage === 'tutorials' && (
          <TutorialsScreen
            onNavigate={handleNavigate}
            onSelectTutorial={handleOpenTutorial}
            activeCategoryFilter={activeCategoryFilter}
            onSetCategoryFilter={(category) =>
              goTo({ page: 'tutorials', category }, { replace: true })
            }
            savedTutorialIds={user.savedTutorialIds}
            onToggleBookmark={handleToggleBookmark}
            lang={lang}
          />
        )}

        {currentPage === 'free-roam' && (
          <FreeRoam key={selectedTutorialId} appId={selectedTutorialId} onExit={() => { const service = serviceById(selectedTutorialId); goTo(service ? { page: GROUP_PAGE[service.group], category: service.id } : { page: 'themen' }); }} lang={lang} />
        )}

        {currentPage === 'tutorial-detail' && selectedPractice && (
          <GuidedPractice
            key={selectedTutorialId}
            tutorial={selectedPractice}
            tutorials={lang === 'en' ? TUTORIALS_EN : TUTORIALS_DE}
            stepIndex={route.stepIndex}
            isDone={!!route.isDone}
            isSaved={user.savedTutorialIds.includes(selectedTutorialId)}
            onGoToStep={(stepIndex) => handleOpenTutorial(selectedTutorialId, stepIndex)}
            onFinish={() => {
              handleMarkCompleted(selectedTutorialId);
              goTo({ page: 'tutorial-detail', tutorialId: selectedTutorialId, isDone: true });
            }}
            onLeave={() => {
              const group = groupOfCategory(selectedPractice.categoryId);
              if (group) goTo({ page: GROUP_PAGE[group], category: selectedPractice.practice?.appId });
              else goTo({ page: 'tutorials', category: selectedPractice.categoryId });
            }}
            onNavigate={handleNavigate}
            onSelectTutorial={handleOpenTutorial}
            onToggleBookmark={handleToggleBookmark}
            lang={lang}
          />
        )}

        {currentPage === 'tutorial-detail' && tutorialExists && !selectedPractice && (
          <TutorialDetailScreen
            key={selectedTutorialId}
            tutorialId={selectedTutorialId}
            stepIndex={route.stepIndex ?? 0}
            onGoToStep={(stepIndex) => handleOpenTutorial(selectedTutorialId, stepIndex)}
            onNavigate={handleNavigate}
            onToggleBookmark={handleToggleBookmark}
            isSaved={user.savedTutorialIds.includes(selectedTutorialId)}
            isCompleted={user.completedTutorialIds.includes(selectedTutorialId)}
            onMarkCompleted={handleMarkCompleted}
            onSelectTutorial={handleOpenTutorial}
            lang={lang}
          />
        )}

        {currentPage === 'sicherheit' && (
          <SecurityScreen
            onNavigate={handleNavigate}
            onSelectTutorial={handleOpenTutorial}
            onOpenSupportModal={() => setSupportModalOpen(true)}
            lang={lang}
          />
        )}

        {currentPage === 'ki-alltag' && (
          <AiLessonsScreen onNavigate={handleNavigate} onSelectTutorial={handleOpenTutorial} completedIds={user.completedTutorialIds} lang={lang} />
        )}

        {currentPage === 'dashboard' && (
          <DashboardScreen
            onNavigate={handleNavigate}
            user={user}
            onUpdateUser={(next) => {
              if (user.isLoggedIn && !next.isLoggedIn) void signOut();
              else setUser(next);
            }}
            tutorialSteps={tutorialSteps}
            onSelectTutorial={handleOpenTutorial}
            onToggleBookmark={handleToggleBookmark}
            onOpenSupportModal={() => setSupportModalOpen(true)}
            lang={lang}
          />
        )}

        {(currentPage === 'anmelden' ||
          currentPage === 'registrieren' ||
          currentPage === 'passwort-vergessen' ||
          currentPage === 'konto-bestaetigt' ||
          currentPage === 'neues-passwort') && (
          <AuthScreens
            key={currentPage}
            initialView={currentPage}
            onNavigate={handleNavigate}
            onContinueAsGuest={() => handleNavigate('dashboard')}
            linkFailed={authLinkFailed}
            lang={lang}
          />
        )}

        {currentPage === 'ueber-uns' && (
          <AboutHelpScreen
            onNavigate={handleNavigate}
            onOpenSupportModal={() => setSupportModalOpen(true)}
            lang={lang}
          />
        )}

        {(currentPage === 'barrierefreiheit' || currentPage === 'datenschutz') && (
          <AccessibilityPrivacyScreen
            key={currentPage}
            initialTab={currentPage}
            onNavigate={handleNavigate}
            lang={lang}
          />
        )}

        {currentPage === 'familie' && <FamilyScreen lang={lang} onNavigate={handleNavigate} />}

        {currentPage === 'fuer-dich' && (
          <ForYouScreen
            lang={lang}
            lessonList={route.query ?? ''}
            name={route.category}
            completedIds={user.completedTutorialIds}
            savedIds={user.savedTutorialIds}
            onSaveAll={handleSaveAll}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'glossar' && (
          <GlossaryScreen lang={lang} selectedWord={route.category} onNavigate={handleNavigate} />
        )}

        {currentPage === 'suche' && (
          <SearchResultsScreen
            searchQuery={searchQuery}
            onSearch={(query) => goTo({ page: 'suche', query }, { replace: true })}
            onNavigate={handleNavigate}
            onSelectTutorial={handleOpenTutorial}
            savedTutorialIds={user.savedTutorialIds}
            onToggleBookmark={handleToggleBookmark}
            lang={lang}
          />
        )}
        </Suspense>
      </main>

      {/* Accessible Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSupportModal={() => setSupportModalOpen(true)}
        onOpenQrCode={() => setQrModalOpen(true)}
        onResetDemo={handleResetDemo}
        signedIn={!!accountId}
        lang={lang}
      />

      {/* A practice lesson opens this once its success page is showing, so focus lands in the window. */}
      <CelebrationDialog
        isOpen={!!celebrated && (!celebrated.practice || !!route.isDone)}
        lessonId={celebrated?.id ?? ''}
        lessonTitle={celebrated?.title ?? ''}
        isPractice={!!celebrated?.practice}
        completedCount={user.completedTutorialIds.length}
        nextTitle={nextAfterCelebrated?.title}
        onNext={() => {
          setCelebratedId(null);
          if (nextAfterCelebrated) handleOpenTutorial(nextAfterCelebrated.id);
        }}
        onProgress={() => {
          setCelebratedId(null);
          handleNavigate('dashboard');
        }}
        onClose={() => setCelebratedId(null)}
        lang={lang}
      />

      <LeaveLessonDialog isOpen={pendingLeave !== null} onStay={stayInLesson} onLeave={leaveLesson} lang={lang} />

      {/* Help assistant & email support, and the QR code: loaded when first opened */}
      <Suspense fallback={null}>
        {supportUsed.current && (
          <SupportModal
            isOpen={supportModalOpen}
            onClose={() => setSupportModalOpen(false)}
            lang={lang}
          />
        )}
        {qrUsed.current && (
          <QRCodeModal
            isOpen={qrModalOpen}
            onClose={() => setQrModalOpen(false)}
            lang={lang}
          />
        )}
      </Suspense>
    </div>
  );
}
