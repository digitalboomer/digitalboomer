/**
 * Hash-based routing, so the browser Back button works and every page and
 * tutorial step can be linked or opened from a QR code.
 *
 *   #/                                  home
 *   #/topics                            any page, by English slug or old page ID
 *   #/tutorials?category=whatsapp       tutorial list with a filter
 *   #/search?q=photo                    search results
 *   #/tutorial/whatsapp-photo           start of a lesson
 *   #/tutorial/whatsapp-photo/step/2    a lesson step (counted from 1)
 *   #/tutorial/whatsapp-photo/done      success page of a practice lesson
 */
import { useMemo, useSyncExternalStore } from 'react';
import { PageId } from '../types';

export interface Route {
  page: PageId;
  tutorialId?: string;
  /** Zero-based step. Undefined means the start of the lesson. */
  stepIndex?: number;
  isDone?: boolean;
  category?: string;
  query?: string;
}

type ListPageId = Exclude<PageId, 'tutorial-detail' | 'free-roam'>;

/** Pages where you first choose a service; `category` holds the chosen one. */
const HUB_PAGES: PageId[] = ['nachrichten-apps', 'email-apps', 'social-apps', 'bank-apps'];

const SLUGS: Record<ListPageId, string> = {
  home: '',
  themen: 'topics',
  'nachrichten-apps': 'messaging',
  'email-apps': 'email',
  'social-apps': 'social',
  'bank-apps': 'banks',
  tutorials: 'tutorials',
  sicherheit: 'safety',
  'ki-alltag': 'everyday-ai',
  dashboard: 'progress',
  anmelden: 'sign-in',
  registrieren: 'register',
  'passwort-vergessen': 'forgot-password',
  'konto-bestaetigt': 'account-confirmed',
  'neues-passwort': 'new-password',
  'ueber-uns': 'about',
  suche: 'search',
  barrierefreiheit: 'accessibility',
  datenschutz: 'privacy',
};

const PAGE_BY_SEGMENT = new Map<string, ListPageId>();
(Object.entries(SLUGS) as [ListPageId, string][]).forEach(([page, slug]) => {
  PAGE_BY_SEGMENT.set(slug, page);
  PAGE_BY_SEGMENT.set(page, page); // old page IDs keep working, e.g. #/themen
});

function decode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function parseHash(hash: string): Route {
  const [path, queryString = ''] = hash.replace(/^#\/?/, '').split('?');
  const segments = path.split('/').filter(Boolean).map(decode);
  const params = new URLSearchParams(queryString);
  const [first, tutorialId, kind, stepNumber] = segments;

  if (first === 'explore' && tutorialId) return { page: 'free-roam', tutorialId };
  if (first === 'tutorial' || first === 'tutorial-detail') {
    if (!tutorialId) return { page: 'tutorials' };
    const route: Route = { page: 'tutorial-detail', tutorialId };
    if (kind === 'done') {
      route.isDone = true;
    } else if (kind === 'step') {
      const parsed = parseInt(stepNumber, 10);
      route.stepIndex = Number.isNaN(parsed) ? 0 : Math.max(parsed - 1, 0);
    }
    return route;
  }

  const page = PAGE_BY_SEGMENT.get(first ?? '') ?? 'home';
  if (page === 'tutorials') {
    const category = params.get('category') ?? undefined;
    if (category === 'whatsapp') return { page: 'nachrichten-apps', category: 'whatsapp' }; // old links
    return { page, category };
  }
  if (HUB_PAGES.includes(page)) {
    return { page, category: params.get('app') ?? undefined };
  }
  if (page === 'suche') {
    return { page, query: params.get('q') ?? '' };
  }
  return { page };
}

export function buildHash(route: Route): string {
  if (route.page === 'free-roam') return `#/explore/${encodeURIComponent(route.tutorialId ?? 'ai')}`;
  if (route.page === 'tutorial-detail') {
    if (!route.tutorialId) return '#/tutorials';
    const base = `#/tutorial/${encodeURIComponent(route.tutorialId)}`;
    if (route.isDone) return `${base}/done`;
    return route.stepIndex === undefined ? base : `${base}/step/${route.stepIndex + 1}`;
  }

  const base = `#/${SLUGS[route.page]}`;
  if (route.page === 'tutorials' && route.category && route.category !== 'all') {
    return `${base}?category=${encodeURIComponent(route.category)}`;
  }
  if (HUB_PAGES.includes(route.page) && route.category) {
    return `${base}?app=${encodeURIComponent(route.category)}`;
  }
  if (route.page === 'suche' && route.query) {
    return `${base}?q=${encodeURIComponent(route.query)}`;
  }
  return base;
}

/** Decides whether moving between two routes needs a question first. */
type LeaveGuard = (from: Route, to: Route) => boolean;

let leaveGuard: LeaveGuard | null = null;
let shownHash = window.location.hash;
let pendingHash: string | null = null;
let allowedHash: string | null = null;
const routeListeners = new Set<() => void>();
const pendingListeners = new Set<() => void>();

export function setLeaveGuard(guard: LeaveGuard | null): void {
  leaveGuard = guard;
}

function setPending(hash: string | null): void {
  pendingHash = hash;
  pendingListeners.forEach((listener) => listener());
}

// The first listener, so that every way of moving passes here, also the browser's Back button.
window.addEventListener('hashchange', () => {
  const next = window.location.hash;
  if (next === shownHash) return;
  if (next !== allowedHash && leaveGuard?.(parseHash(shownHash), parseHash(next))) {
    window.history.pushState(null, '', shownHash); // stay on the lesson, and ask
    setPending(next);
    return;
  }
  allowedHash = null;
  shownHash = next;
  routeListeners.forEach((listener) => listener());
});

export function usePendingLeave(): string | null {
  return useSyncExternalStore(
    (listener) => {
      pendingListeners.add(listener);
      return () => pendingListeners.delete(listener);
    },
    () => pendingHash
  );
}

export function stayInLesson(): void {
  setPending(null);
}

export function leaveLesson(): void {
  const target = pendingHash;
  setPending(null);
  if (target === null) return;
  allowedHash = target;
  window.location.hash = target;
}

export function currentRoute(): Route {
  return parseHash(window.location.hash);
}

/** Goes to a route. `replace` leaves no extra entry for the Back button. */
export function goTo(route: Route, options: { replace?: boolean; force?: boolean } = {}): void {
  const hash = buildHash(route);
  if (hash === window.location.hash) return;
  if (options.force) {
    allowedHash = hash;
  } else if (leaveGuard?.(parseHash(shownHash), parseHash(hash))) {
    setPending(hash);
    return;
  }
  if (options.replace) {
    window.history.replaceState(null, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = hash;
  }
}

function subscribe(onChange: () => void): () => void {
  routeListeners.add(onChange);
  return () => routeListeners.delete(onChange);
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => shownHash);
  return useMemo(() => parseHash(hash), [hash]);
}
