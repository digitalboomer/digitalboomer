/**
 * Moving between pages with real addresses (see routes.ts), so the browser Back
 * button works, every page and lesson step can be linked, bookmarked or opened
 * from a QR code, and search engines see one address per page and language.
 *
 * The language is part of the address. Which language is shown:
 *   1. the visitor's own choice from the language menu, if they made one: it always
 *      wins, also when they open a link in another language (the page then switches);
 *   2. otherwise the language in the address (/de/…, /hr/…);
 *   3. for an address without a language: the browser's language if the site offers it,
 *      otherwise English. Search engines have English set, so they stay on these pages.
 *
 * Older links with #/… are still read, and turned into the new address.
 */
import { useMemo, useSyncExternalStore } from 'react';
import type { MouseEvent } from 'react';
import type { UiLanguage } from '../i18n/translate';
import { parsePath, urlFor, URL_LANGUAGES, SITE_BASE, SITE_ORIGIN, type Route } from './routes';

export type { Route } from './routes';

/** The site's base path: /digitalboomer/ on GitHub Pages, / on the local development server. */
const BASE = import.meta.env.BASE_URL || '/';
const LANGUAGE_KEY = 'digital-boomer-language';

function savedLanguage(): UiLanguage | null {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return (URL_LANGUAGES as string[]).includes(saved ?? '') ? (saved as UiLanguage) : null;
  } catch {
    return null;
  }
}

function browserLanguage(): UiLanguage | null {
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language ?? ''];
  for (const tag of preferred) {
    const base = (tag ?? '').slice(0, 2).toLowerCase() as UiLanguage;
    if (URL_LANGUAGES.includes(base)) return base;
  }
  return null;
}

/** The part of an address below the base, e.g. "hr/lesson/x?y=1". */
function relative(pathname: string, search = ''): string {
  const path = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '');
  return `${path}${search}`;
}

function readAddress(): ReturnType<typeof parsePath> {
  // An old link: #/tutorial/whatsapp-photo
  if (window.location.hash.startsWith('#/')) return { ...parsePath(window.location.hash.slice(2)), hasLanguage: false };
  return parsePath(relative(window.location.pathname, window.location.search));
}

const routeOf = (url: string) => parsePath(relative(url.split('?')[0], url.includes('?') ? `?${url.split('?')[1]}` : '')).route;
const here = () => `${window.location.pathname}${window.location.search}`;

// Where we start.
const start = readAddress();
let activeLang: UiLanguage = savedLanguage() ?? (start.hasLanguage ? start.lang : browserLanguage() ?? 'en');
let shownUrl = urlFor(start.route, activeLang, BASE);
// A link from an account email carries a one-time code in the address. It stays until it is used.
const fromEmail = /[?&](token_hash|code|error|error_description)=/.test(window.location.search);
if (!fromEmail && (shownUrl !== here() || window.location.hash.startsWith('#/'))) {
  window.history.replaceState(null, '', shownUrl);
}
if (fromEmail) shownUrl = here();

/** The language the site starts in. */
export function initialLanguage(): UiLanguage {
  return activeLang;
}

/** Decides whether moving between two routes needs a question first. */
type LeaveGuard = (from: Route, to: Route) => boolean;

let leaveGuard: LeaveGuard | null = null;
let pendingUrl: string | null = null;
let allowedUrl: string | null = null;
const listeners = new Set<() => void>();
const pendingListeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

export function setLeaveGuard(guard: LeaveGuard | null): void {
  leaveGuard = guard;
}

function setPending(url: string | null): void {
  pendingUrl = url;
  pendingListeners.forEach((listener) => listener());
}

// The browser's Back and Forward buttons, and #/… typed into the address bar.
window.addEventListener('popstate', () => {
  const next = readAddress();
  const nextUrl = urlFor(next.route, activeLang, BASE); // option A: the chosen language stays
  if (nextUrl === shownUrl) {
    if (here() !== shownUrl) window.history.replaceState(null, '', shownUrl);
    return;
  }
  if (nextUrl !== allowedUrl && leaveGuard?.(routeOf(shownUrl), next.route)) {
    window.history.pushState(null, '', shownUrl); // stay on the lesson, and ask
    setPending(nextUrl);
    return;
  }
  allowedUrl = null;
  if (here() !== nextUrl) window.history.replaceState(null, '', nextUrl);
  shownUrl = nextUrl;
  notify();
});

export function usePendingLeave(): string | null {
  return useSyncExternalStore(
    (listener) => {
      pendingListeners.add(listener);
      return () => pendingListeners.delete(listener);
    },
    () => pendingUrl
  );
}

export function stayInLesson(): void {
  setPending(null);
}

export function leaveLesson(): void {
  const target = pendingUrl;
  setPending(null);
  if (target === null) return;
  allowedUrl = target;
  window.history.pushState(null, '', target);
  shownUrl = target;
  notify();
}

export function currentRoute(): Route {
  return routeOf(shownUrl);
}

/** Goes to a route. `replace` leaves no extra entry for the Back button. */
export function goTo(route: Route, options: { replace?: boolean; force?: boolean } = {}): void {
  const url = urlFor(route, activeLang, BASE);
  if (url === shownUrl) return;
  if (!options.force && leaveGuard?.(routeOf(shownUrl), route)) {
    setPending(url);
    return;
  }
  if (options.replace) window.history.replaceState(null, '', url);
  else window.history.pushState(null, '', url);
  shownUrl = url;
  notify();
}

/**
 * The visitor chooses a language in the menu. The same page stays open (no reload, same step),
 * only its address changes, and the choice is remembered for every later visit.
 */
export function setLanguage(lang: UiLanguage): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch {
    // The choice then lasts until the page is reloaded.
  }
  if (lang === activeLang) return;
  activeLang = lang;
  const url = urlFor(routeOf(shownUrl), lang, BASE);
  window.history.replaceState(null, '', url);
  shownUrl = url;
  notify();
}

/** The address of a route, for links (`<a href>`). */
export function hrefFor(route: Route, lang: UiLanguage = activeLang): string {
  return urlFor(route, lang, BASE);
}

/** The public address of the page that is open, also when the site runs on this computer (for QR codes). */
export function publicUrl(): string {
  return `${SITE_ORIGIN}${SITE_BASE}${relative(window.location.pathname, window.location.search)}`;
}

/**
 * Props for a real link (<a href>) that moves inside the site without reloading.
 * Ctrl-, Shift- or middle-click still open the page in a new tab or window, as people expect.
 */
export function linkTo(route: Route, onActivate?: () => void) {
  return {
    href: hrefFor(route),
    onClick: (event: MouseEvent<HTMLAnchorElement>) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (onActivate) onActivate();
      else goTo(route);
    },
  };
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function useRoute(): Route {
  const url = useSyncExternalStore(subscribe, () => shownUrl);
  return useMemo(() => routeOf(url), [url]);
}

export function useLanguage(): UiLanguage {
  return useSyncExternalStore(subscribe, () => activeLang);
}
