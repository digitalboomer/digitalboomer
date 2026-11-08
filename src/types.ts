/**
 * Digital Boomer - Types & Interfaces
 * German-language accessible learning platform
 */

export type PageId =
  | 'home'
  | 'themen'
  | 'nachrichten-apps'
  | 'email-apps'
  | 'social-apps'
  | 'bank-apps'
  | 'tutorials'
  | 'tutorial-detail'
  | 'free-roam'
  | 'sicherheit'
  | 'dashboard'
  | 'anmelden'
  | 'registrieren'
  | 'passwort-vergessen'
  | 'konto-bestaetigt'
  | 'neues-passwort'
  | 'ueber-uns'
  | 'suche'
  | 'barrierefreiheit'
  | 'datenschutz';

export type ThemeMode = 'system' | 'light' | 'dark' | 'high-contrast';

export type TextScale = '100' | '115' | '130';

export type Language = 'en' | 'de';

export type DifficultyLevel = 'Einfach' | 'Mittel' | 'Fortgeschritten' | 'Easy' | 'Intermediate' | 'Advanced';

export interface CategoryInfo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  image: string;
  tutorialCount: number;
  highlightTopics: string[];
}

export interface InteractiveHotspot {
  id: string;
  title: string;
  description: string;
  dangerLevel: 'hoch' | 'mittel' | 'info';
  advice: string;
}

export interface TutorialStep {
  stepNumber: number;
  title: string;
  lead: string;
  paragraphs: string[];
  visualType?: 'standard' | 'phishing-mockup' | 'checklist' | 'quiz' | 'screenshot';
  tip?: string;
  warning?: string;
  hotspots?: InteractiveHotspot[];
  practice?: PracticeStep;
  /** A picture example shown in the lesson, see LessonExample. */
  example?: string;
}

/** What the learner must tap in one step of a guided practice. */
export interface PracticeStep {
  /** Which simulated screen this step shows. */
  screen: string;
  /** Which text this step types into. Default: `main`. */
  field?: string;
  /** The target only works after typing something. */
  requiresText?: boolean;
  /** The target must be pressed and held, as on a real phone. */
  hold?: boolean;
  /** ID of the tap area that is correct in this step. */
  targetId: string;
  /** Shown on the next step after the correct tap. */
  successText: string;
  /** Tap area ID → calm hint after tapping it by mistake. */
  hints: Record<string, string>;
  /** Hint for any other tap, e.g. on an empty part of the screen. */
  fallbackHint: string;
  /** Says where the target is, for the "Show me" button. */
  showMeText: string;
}

/** A simulated screen practice. Add a screen in practiceScreens.ts for a new scenario. */
export interface PracticeScenario {
  /** Key of the simulated screen in PRACTICE_SCREENS. */
  screenId: string;
  /** Which app the screen imitates, and what happens in it. */
  appId?: string;
  kind?: string;
  /** 'desktop': the lesson happens on a simulated computer instead of a phone. */
  device?: 'phone' | 'desktop';
  /** Always visible, says clearly that nothing real happens. */
  notice: string;
  introTitle: string;
  introText: string;
  successTitle: string;
  successText: string;
  nextTutorialId: string;
  /** All words shown on the simulated screen. */
  labels: Record<string, string>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Tutorial {
  id: string;
  title: string;
  categoryId: string;
  categoryTitle: string;
  description: string;
  durationMinutes: number;
  difficulty: DifficultyLevel;
  image: string;
  tags: string[];
  steps: TutorialStep[];
  /** Recommended next lessons, set in data/learningPath.ts. */
  nextIds?: string[];
  quiz?: QuizQuestion[];
  isPopular?: boolean;
  /** When set, the lesson opens as a guided practice instead of text steps. */
  practice?: PracticeScenario;
}

export interface SecurityChecklistItem {
  id: string;
  title: string;
  explanation: string;
  category: 'link' | 'passwort' | 'bezahlen' | 'telefon';
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface UserProfile {
  name: string;
  email: string;
  isLoggedIn: boolean;
  isGuest: boolean;
  completedTutorialIds: string[];
  savedTutorialIds: string[];
  joinedDate: string;
  certificateEarned: boolean;
}

export interface ContrastDocItem {
  element: string;
  fgColor: string;
  fgHex: string;
  bgColor: string;
  bgHex: string;
  ratio: string;
  wcagRequirement: string;
  status: string;
}
