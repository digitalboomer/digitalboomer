import React, { useState, useEffect, useRef } from 'react';
import { PageId, ThemeMode, TextScale, UserProfile, Language } from './types';
import { INITIAL_USER_PROFILE, TUTORIALS_DE, TUTORIALS_EN } from './data/content';
import { GuidedPractice } from './components/practice/GuidedPractice';
import { currentRoute, goTo, leaveLesson, setLeaveGuard, stayInLesson, usePendingLeave, useRoute } from './utils/router';
import { clearProgress, loadProgress, saveProgress, type SavedProgress } from './utils/progress';
import { handleAuthLink, loadAccountProgress, onAccountChange, saveAccountProgress, signOut } from './utils/auth';
import { clearHelpLevel } from './utils/helpLevel';
import { clearPhoneType } from './utils/phoneType';
import { setPageLanguage, startLanguage, UI_LANGUAGES, type UiLanguage } from './i18n/translate';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SupportModal } from './components/SupportModal';
import { QRCodeModal } from './components/QRCodeModal';
import { CelebrationDialog } from './components/CelebrationDialog';
import { LeaveLessonDialog } from './components/LeaveLessonDialog';

import { HomeScreen } from './screens/HomeScreen';
import { ServiceHubScreen } from './screens/ServiceHubScreen';
import { FreeRoam } from './components/practice/FreeRoam';
import { GROUP_PAGE, ServiceGroup, groupOfCategory, serviceById } from './data/services';
import { isSoundOn, playClick, playSuccess, setSoundOn } from './utils/feedback';
import { TopicsScreen } from './screens/TopicsScreen';
import { TutorialsScreen } from './screens/TutorialsScreen';
import { TutorialDetailScreen } from './screens/TutorialDetailScreen';
import { SecurityScreen } from './screens/SecurityScreen';
import { AiLessonsScreen } from './screens/AiLessonsScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { AuthScreens } from './screens/AuthScreens';
import { AboutHelpScreen } from './screens/AboutHelpScreen';
import { AccessibilityPrivacyScreen } from './screens/AccessibilityPrivacyScreen';
import { SearchResultsScreen } from './screens/SearchResultsScreen';

export default function App() {
  const route = useRoute();
  const currentPage = route.page;
  const selectedTutorialId = route.tutorialId ?? '';
  const activeCategoryFilter = route.category ?? 'all';
  const searchQuery = route.query ?? '';

  const [textScale, setTextScale] = useState<TextScale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('digital-boomer-text-scale') as TextScale;
      if (saved === '100' || saved === '115' || saved === '130') {
        return saved;
      }
    }
    return '100';
  });

  // Language: the visitor's choice from the menu, else the browser's language if the site offers it, else English.
  // Turkish, Spanish and Croatian show the English page, translated while it runs (src/i18n/translate.ts),
  // so `lang` (the language the page is built in) is 'en' for them.
  const [uiLang, setLangState] = useState<UiLanguage>(startLanguage);
  const lang: Language = uiLang === 'de' ? 'de' : 'en';
  useEffect(() => {
    void setPageLanguage(uiLang);
  }, [uiLang]);
  const setLang = (next: UiLanguage) => {
    setLangState(next);
    try {
      localStorage.setItem('digital-boomer-language', next);
    } catch {
      // The choice then lasts until the page is reloaded.
    }
  };
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
        setAccountId(account.id);
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
        const saved = await loadAccountProgress(account.id);
        if (saved) {
          setUser((prev) => ({
            ...prev,
            completedTutorialIds: Array.from(new Set([...saved.completedTutorialIds, ...prev.completedTutorialIds])),
            savedTutorialIds: Array.from(new Set([...saved.savedTutorialIds, ...prev.savedTutorialIds])),
          }));
          setTutorialSteps((prev) => ({ ...saved.tutorialSteps, ...prev }));
        }
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
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('digital-boomer-theme') as ThemeMode;
      if (saved === 'light' || saved === 'dark' || saved === 'high-contrast') {
        return saved;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // AI & Email Support Modal (Replaces Phone Helpline)
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Mobile prototype QR code modal
  const [qrModalOpen, setQrModalOpen] = useState(false);

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
    if (typeof window !== 'undefined') {
      localStorage.setItem('digital-boomer-text-scale', scale);
    }
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('digital-boomer-theme', newTheme);
    }
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

  // Listen to system prefers-color-scheme changes only if user hasn't explicitly set a preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const hasManual = localStorage.getItem('digital-boomer-theme');
    if (hasManual) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
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

      {/* Help assistant (pre-written answers) & email support */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        lang={lang}
      />

      {/* Universal Mobile Prototype QR Code Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
