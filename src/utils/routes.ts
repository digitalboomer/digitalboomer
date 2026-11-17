/**
 * Page addresses. Pure functions without the browser, so the build can use them too
 * (one HTML file per page and language, see src/seo/prerender.ts).
 *
 * English has no language part; the other languages start with their code:
 *
 *   /                                  home (English)
 *   /de/                               home (German)
 *   /topics, /hr/topics                any page, by English slug or old page ID
 *   /tutorials?category=whatsapp       lesson list with a filter
 *   /search?q=photo                    search results
 *   /lesson/whatsapp-photo             start of a lesson
 *   /lesson/whatsapp-photo/step/2      a lesson step (counted from 1)
 *   /lesson/whatsapp-photo/done        success page of a practice lesson
 *
 * All paths sit below the site's base (/digitalboomer/ on GitHub Pages). Older
 * links with #/… (QR codes, bookmarks) are read with the same rules.
 */
import type { PageId } from '../types';
import type { UiLanguage } from '../i18n/translate';

export interface Route {
  page: PageId;
  tutorialId?: string;
  /** Zero-based step. Undefined means the start of the lesson. */
  stepIndex?: number;
  isDone?: boolean;
  category?: string;
  query?: string;
}

export const URL_LANGUAGES: UiLanguage[] = ['en', 'de', 'tr', 'es', 'hr'];
/**
 * Languages search engines may index: they get "index" on their pages, a place in sitemap.xml
 * and hreflang links. All five since Nov 2026 (the team's decision). The Turkish, Spanish and
 * Croatian texts are machine-written and should still be checked by native speakers; to take
 * a language out of search again, remove it here.
 */
export const INDEXED_LANGUAGES: UiLanguage[] = ['en', 'de', 'tr', 'es', 'hr'];
/** The public address of the site, for canonical links, the sitemap and QR codes. */
export const SITE_ORIGIN = 'https://digitalboomer.github.io';
export const SITE_BASE = '/digitalboomer/';

type ListPageId = Exclude<PageId, 'tutorial-detail' | 'free-roam'>;

/** Pages where you first choose a service; `category` holds the chosen one. */
export const HUB_PAGES: PageId[] = ['nachrichten-apps', 'email-apps', 'social-apps', 'bank-apps'];

export const SLUGS: Record<ListPageId, string> = {
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

/**
 * Reads a path below the site's base, e.g. "hr/lesson/whatsapp-photo/step/2?x=1".
 * `hasLanguage` says whether the path itself named a language.
 */
export function parsePath(pathAndQuery: string): { route: Route; lang: UiLanguage; hasLanguage: boolean } {
  const [path, queryString = ''] = pathAndQuery.replace(/^[#/]+/, '').split('?');
  let segments = path.split('/').filter(Boolean).map(decode);
  let lang: UiLanguage = 'en';
  let hasLanguage = false;
  if (segments[0] && (URL_LANGUAGES as string[]).includes(segments[0])) {
    lang = segments[0] as UiLanguage;
    hasLanguage = true;
    segments = segments.slice(1);
  }
  // The built page files end in .html; the address without it is the same page.
  if (segments.length) segments[segments.length - 1] = segments[segments.length - 1].replace(/\.html$/, '');
  if (segments[segments.length - 1] === 'index') segments.pop();
  return { route: routeFromSegments(segments, new URLSearchParams(queryString)), lang, hasLanguage };
}

function routeFromSegments(segments: string[], params: URLSearchParams): Route {
  const [first, tutorialId, kind, stepNumber] = segments;

  if (first === 'explore' && tutorialId) return { page: 'free-roam', tutorialId };
  if (first === 'lesson' || first === 'tutorial' || first === 'tutorial-detail') {
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

/** The path of a route below the language part, without a leading slash ("" for home). */
export function routePath(route: Route): string {
  if (route.page === 'free-roam') return `explore/${encodeURIComponent(route.tutorialId ?? 'ai')}`;
  if (route.page === 'tutorial-detail') {
    if (!route.tutorialId) return 'tutorials';
    const base = `lesson/${encodeURIComponent(route.tutorialId)}`;
    if (route.isDone) return `${base}/done`;
    return route.stepIndex === undefined ? base : `${base}/step/${route.stepIndex + 1}`;
  }

  const base = SLUGS[route.page];
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

/** The address of a route in a language, below `base` (which ends with "/"). */
export function urlFor(route: Route, lang: UiLanguage, base: string): string {
  const prefix = lang === 'en' ? '' : `${lang}/`;
  return `${base}${prefix}${routePath(route)}`;
}

/** The address search engines should use for a page: a lesson without its step, no search words. */
export function canonicalRoute(route: Route): Route {
  if (route.page === 'tutorial-detail') return { page: 'tutorial-detail', tutorialId: route.tutorialId };
  if (route.page === 'suche') return { page: 'suche' };
  return route;
}
