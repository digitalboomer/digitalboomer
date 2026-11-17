/**
 * Runs after `vite build` (see "build" in package.json): writes one HTML file per page and
 * language into dist/, so every lesson has its own address that GitHub Pages can serve and
 * search engines can read without running the app:
 *
 *   dist/index.html, dist/de/index.html, dist/hr/index.html …    home
 *   dist/topics.html, dist/de/topics.html …                       pages
 *   dist/lesson/whatsapp-photo.html, dist/de/lesson/… …           lessons
 *   dist/404.html                                                 everything else (steps, search): the app opens it
 *   dist/sitemap.xml                                              English and German pages for search engines
 *
 * Each file is the built index.html with its own title, description, canonical address and
 * language versions, plus the page's text and links inside <div id="root">. The app replaces
 * that text as soon as it starts, so visitors see the normal site.
 */
import fs from 'node:fs';
import path from 'node:path';
import { CATEGORIES_DE, CATEGORIES_EN, FAQS_DE, FAQS_EN, TUTORIALS_DE, TUTORIALS_EN } from '../data/content';
import { GROUP_CATEGORY, GROUP_PAGE, SERVICES, type ServiceGroup } from '../data/services';
import { translateText, useDictionaryForCheck, type UiLanguage } from '../i18n/translate';
import type { PageId, Tutorial } from '../types';
import { categoryRoute, topicTasks } from '../utils/categoryRoute';
import { INDEXED_LANGUAGES, SITE_BASE, SITE_ORIGIN, SLUGS, URL_LANGUAGES, routePath, urlFor, type Route } from '../utils/routes';
import { headHtml } from './head';
import { headInfo } from './pageMeta';

const BASE = import.meta.env.BASE_URL || '/';
const DIST = path.resolve(process.cwd(), 'dist');
const readDictionary = (lang: string) => JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'src/i18n', `${lang}.json`), 'utf8')) as Record<string, string>;
const DICTIONARIES: Record<string, Record<string, string>> = { tr: readDictionary('tr'), es: readDictionary('es'), hr: readDictionary('hr') };
const VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
  .replace(/\s*<title>[\s\S]*?<\/title>/, '')
  .replace(/\s*<meta name="description"[^>]*>/, '')
  .replace(/\s*<meta property="og:(title|description)"[^>]*>/g, '')
  .replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${SITE_ORIGIN}${SITE_BASE}assets/images/digital_boomer_logo.png"`);

function fileFor(route: Route, lang: UiLanguage): string {
  const prefix = lang === 'en' ? '' : `${lang}/`;
  return route.page === 'home' ? `${prefix}index.html` : `${prefix}${routePath(route)}.html`;
}

function render(route: Route, lang: UiLanguage): { file: string; html: string; indexable: boolean; url: string } {
  const isDe = lang === 'de';
  const extra = lang !== 'en' && lang !== 'de';
  const tx = (s: string) => (extra ? translateText(s) : s);
  const L = (en: string, de: string) => (isDe ? de : tx(en));
  const tutorials = isDe ? TUTORIALS_DE : TUTORIALS_EN;
  const categories = isDe ? CATEGORIES_DE : CATEGORIES_EN;
  const info = headInfo(route, lang, { en: TUTORIALS_EN, de: TUTORIALS_DE }, translateText);
  const href = (to: Route) => urlFor(to, lang, BASE);
  const link = (to: Route, label: string) => `<a href="${href(to)}">${esc(label)}</a>`;
  const lessonList = (items: Tutorial[]) => `<ul>${items.map((t) => `<li>${link({ page: 'tutorial-detail', tutorialId: t.id }, tx(t.title))}</li>`).join('')}</ul>`;
  const parts: string[] = [];

  parts.push(`<nav aria-label="${esc(L('Main navigation', 'Hauptnavigation'))}"><ul>${[
    link({ page: 'home' }, L('Home', 'Startseite')),
    link({ page: 'themen' }, L('Topics', 'Themen')),
    link({ page: 'tutorials' }, L('All tutorials', 'Alle Anleitungen')),
    link({ page: 'sicherheit' }, L('Digital safety', 'Digitale Sicherheit')),
    link({ page: 'ki-alltag' }, L('Everyday AI', 'KI im Alltag')),
    link({ page: 'ueber-uns' }, L('About us', 'Über uns')),
  ].map((a) => `<li>${a}</li>`).join('')}</ul></nav>`);

  const tutorial = route.page === 'tutorial-detail' ? tutorials.find((t) => t.id === route.tutorialId) : undefined;
  if (tutorial) {
    parts.push(`<nav aria-label="${esc(L('Breadcrumb', 'Brotkrumen-Navigation'))}">${link({ page: 'home' }, L('Home', 'Startseite'))} / ${link(categoryRoute(tutorial.categoryId), tx(tutorial.categoryTitle))}</nav>`);
  }
  parts.push(`<h1>${esc(info.heading)}</h1>`, `<p>${esc(info.description)}</p>`);

  if (tutorial) {
    parts.push(`<ol>${tutorial.steps.map((step) => [
      '<li>',
      `<h2>${esc(tx(step.title))}</h2>`,
      step.lead ? `<p>${esc(tx(step.lead))}</p>` : '',
      ...(step.paragraphs ?? []).map((p) => `<p>${esc(tx(p))}</p>`),
      step.tip ? `<p>${esc(L('Tip', 'Tipp'))}: ${esc(tx(step.tip))}</p>` : '',
      step.warning ? `<p>${esc(L('Important', 'Wichtig'))}: ${esc(tx(step.warning))}</p>` : '',
      ...(step.links ?? []).map((l) => `<p>${link({ page: l.page, tutorialId: l.tutorialId, category: l.category }, tx(l.label))}</p>`),
      '</li>',
    ].join('')).join('')}</ol>`);
    const next = (tutorial.nextIds ?? []).map((id) => tutorials.find((t) => t.id === id)).filter((t): t is Tutorial => !!t);
    if (next.length) parts.push(`<h2>${esc(L('What to do next', 'Das passt als Nächstes'))}</h2>`, lessonList(next));
  } else if (route.page === 'home' || route.page === 'themen') {
    for (const cat of categories) {
      const tasks = topicTasks(cat.id, !isDe);
      parts.push(`<h2>${link(categoryRoute(cat.id), tx(cat.title))}</h2>`, tasks ? `<p>${esc(tx(tasks))}</p>` : '', `<p>${esc(tx(cat.description))}</p>`);
    }
  } else if ((Object.values(GROUP_PAGE) as PageId[]).includes(route.page)) {
    const group = (Object.keys(GROUP_PAGE) as ServiceGroup[]).find((g) => GROUP_PAGE[g] === route.page)!;
    const inGroup = tutorials.filter((t) => t.categoryId === GROUP_CATEGORY[group]);
    for (const service of SERVICES.filter((s) => s.group === group)) {
      const own = inGroup.filter((t) => t.practice?.appId === service.id);
      if (own.length) parts.push(`<h2>${esc(service.name)}</h2>`, lessonList(own));
    }
    const general = inGroup.filter((t) => !t.practice?.appId);
    if (general.length) parts.push(`<h2>${esc(L('Good to know', 'Gut zu wissen'))}</h2>`, lessonList(general));
  } else if (route.page === 'sicherheit' || route.page === 'ki-alltag') {
    parts.push(lessonList(tutorials.filter((t) => t.categoryId === (route.page === 'sicherheit' ? 'sicherheit' : 'ki'))));
  } else if (route.page === 'tutorials') {
    for (const cat of categories) {
      parts.push(`<h2>${esc(tx(cat.title))}</h2>`, lessonList(tutorials.filter((t) => t.categoryId === cat.id)));
    }
  } else if (route.page === 'ueber-uns') {
    const faqs = isDe ? FAQS_DE : FAQS_EN;
    parts.push(`<h2>${esc(L('Common questions', 'Häufige Fragen'))}</h2>`);
    for (const faq of faqs) {
      parts.push(`<h3>${esc(tx(faq.question))}</h3>`, `<p>${esc(tx(faq.answer))}</p>`);
      if (faq.lessonId) {
        const lesson = tutorials.find((t) => t.id === faq.lessonId);
        if (lesson) parts.push(`<p>${link({ page: 'tutorial-detail', tutorialId: lesson.id }, tx(lesson.title))}</p>`);
      }
    }
  }

  const verification = VERIFICATION ? `<meta name="google-site-verification" content="${esc(VERIFICATION)}" />` : '';
  const html = template
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace('</head>', `    ${headHtml(info, verification)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"><div class="max-w-3xl mx-auto px-4 py-8 space-y-4">${parts.filter(Boolean).join('\n')}</div></div>`);
  return { file: fileFor(route, lang), html, indexable: info.robots.startsWith('index'), url: info.canonical };
}

// The routes that get a file: every page except search results with words, and every lesson.
const routes: Route[] = [
  ...(Object.keys(SLUGS) as Exclude<PageId, 'tutorial-detail' | 'free-roam'>[]).map((page) => ({ page })),
  ...TUTORIALS_EN.map((t) => ({ page: 'tutorial-detail' as const, tutorialId: t.id })),
];

const sitemap: string[] = [];
let written = 0;
for (const lang of URL_LANGUAGES) {
  useDictionaryForCheck(DICTIONARIES[lang] ?? null); // Turkish, Spanish, Croatian translate the English page
  for (const route of routes) {
    const page = render(route, lang);
    const target = path.join(DIST, page.file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, page.html);
    written++;
    if (page.indexable && INDEXED_LANGUAGES.includes(lang)) sitemap.push(page.url);
  }
}
useDictionaryForCheck(null);

// Any other address (a lesson step, search, an old link): the app opens and shows the right page.
fs.writeFileSync(path.join(DIST, '404.html'), template.replace('</head>', '    <title>Digital Boomer</title>\n    <meta name="robots" content="noindex" />\n  </head>'));

fs.writeFileSync(path.join(DIST, 'sitemap.xml'), [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...Array.from(new Set(sitemap)).map((url) => `  <url><loc>${esc(url)}</loc></url>`),
  '</urlset>',
  '',
].join('\n'));

console.log(`prerender: ${written} pages, ${new Set(sitemap).size} in the sitemap, plus 404.html`);
