/**
 * The title, description and search-engine settings of every page, in English and German.
 * Turkish, Spanish and Croatian translate the English texts with their dictionaries.
 * Used while the site runs (src/seo/head.ts) and when the build writes one HTML file per page.
 */
import type { PageId, Tutorial } from '../types';
import type { UiLanguage } from '../i18n/translate';
import { canonicalRoute, INDEXED_LANGUAGES, SITE_BASE, SITE_ORIGIN, urlFor, type Route } from '../utils/routes';

interface PageText {
  en: [heading: string, description: string];
  de: [heading: string, description: string];
  /** false: search engines should not list it (personal pages, search results, sign-in). */
  index: boolean;
}

const HOME_DESCRIPTION: [string, string] = [
  'Learn everyday digital skills step by step, at your own pace: send photos on WhatsApp, write emails, bank online safely, spot scams and try AI chatbots. Free, calm and without an account.',
  'Digitale Alltagsfähigkeiten Schritt für Schritt lernen, in Ihrem Tempo: Fotos per WhatsApp senden, E-Mails schreiben, sicher Online-Banking nutzen, Betrug erkennen und KI-Chatbots ausprobieren. Kostenlos, in Ruhe und ohne Konto.',
];

const PAGES: Record<Exclude<PageId, 'tutorial-detail'>, PageText> = {
  home: {
    en: ['Digital Boomer: Practise WhatsApp, Email and Online Banking', HOME_DESCRIPTION[0]],
    de: ['Digital Boomer: WhatsApp, E-Mail und Online-Banking üben', HOME_DESCRIPTION[1]],
    index: true,
  },
  themen: {
    en: ['Topics: WhatsApp, Email, Online Banking and More', 'Choose a topic and practise step by step: messaging apps, email, social media, online banking, digital safety and everyday AI.'],
    de: ['Themen: WhatsApp, E-Mail, Online-Banking und mehr', 'Wählen Sie ein Thema und üben Sie Schritt für Schritt: Nachrichten-Apps, E-Mail, soziale Medien, Online-Banking, digitale Sicherheit und KI im Alltag.'],
    index: true,
  },
  'nachrichten-apps': {
    en: ['Messaging Apps: Practise WhatsApp, Signal and More', 'Practise sending messages, photos, voice messages and video calls on a screen that looks like your app. WhatsApp, Signal, Telegram and nine more apps.'],
    de: ['Nachrichten-Apps: WhatsApp, Signal und mehr üben', 'Üben Sie Nachrichten, Fotos, Sprachnachrichten und Videoanrufe auf einem Bildschirm, der wie Ihre App aussieht. WhatsApp, Signal, Telegram und neun weitere Apps.'],
    index: true,
  },
  'email-apps': {
    en: ['Email: Practise Writing, Answering and Sending Photos', 'Practise email with Gmail, Outlook, GMX, WEB.DE and more: write and answer emails, send photos, open attachments safely and deal with spam.'],
    de: ['E-Mail: Schreiben, Antworten und Fotos senden üben', 'Üben Sie E-Mail mit Gmail, Outlook, GMX, WEB.DE und mehr: E-Mails schreiben und beantworten, Fotos senden, Anhänge sicher öffnen und mit Spam umgehen.'],
    index: true,
  },
  'social-apps': {
    en: ['Social Media: Practise Facebook, Instagram, YouTube and More', 'Practise likes, comments, posts and messages, and learn how to protect your privacy and block people who bother you.'],
    de: ['Soziale Medien: Facebook, Instagram, YouTube und mehr üben', 'Üben Sie Likes, Kommentare, Beiträge und Nachrichten, und lernen Sie, Ihre Privatsphäre zu schützen und Menschen zu blockieren, die Sie stören.'],
    index: true,
  },
  'bank-apps': {
    en: ['Online Banking: Practise Safely with Made-up Money', 'Practise checking your balance, transfers, standing orders and blocking a card on a neutral practice bank. Nothing real happens.'],
    de: ['Online-Banking: Sicher üben mit Spielgeld', 'Üben Sie Kontostand, Überweisung, Dauerauftrag und Kartensperre in einer neutralen Übungsbank. Es passiert nichts Echtes.'],
    index: true,
  },
  sicherheit: {
    en: ['Digital Safety: Recognise Phishing, Scam Calls and Fake Shops', 'Learn the warning signs of fake emails, text messages and calls, protect your accounts and know what to do if something has happened.'],
    de: ['Digitale Sicherheit: Phishing, Betrugsanrufe und Fake-Shops erkennen', 'Lernen Sie die Warnzeichen falscher E-Mails, SMS und Anrufe, schützen Sie Ihre Konten und wissen Sie, was zu tun ist, wenn etwas passiert ist.'],
    index: true,
  },
  'ki-alltag': {
    en: ['Everyday AI: ChatGPT and Chatbots Explained in Plain Words', 'What AI is, how to ask a chatbot good questions, how to check its answers and how to recognise AI fakes. With a practice chat.'],
    de: ['KI im Alltag: ChatGPT und Chatbots einfach erklärt', 'Was KI ist, wie Sie einem Chatbot gute Fragen stellen, wie Sie seine Antworten prüfen und wie Sie KI-Fälschungen erkennen. Mit einem Übungs-Chat.'],
    index: true,
  },
  tutorials: {
    en: ['All Lessons', 'Every Digital Boomer lesson in one list: filter by topic or search for what you want to do.'],
    de: ['Alle Lektionen', 'Alle Lektionen von Digital Boomer in einer Liste: nach Thema filtern oder nach dem suchen, was Sie tun möchten.'],
    index: true,
  },
  'ueber-uns': {
    en: ['About Us and Common Questions', 'Who is behind Digital Boomer, answers to common questions such as how to send a photo on WhatsApp, and how to contact the team.'],
    de: ['Über uns und häufige Fragen', 'Wer hinter Digital Boomer steht, Antworten auf häufige Fragen, etwa wie man ein Foto per WhatsApp sendet, und wie Sie das Team erreichen.'],
    index: true,
  },
  barrierefreiheit: {
    en: ['Accessibility', 'How Digital Boomer is made easy to use: large text, high contrast, read aloud and use with the keyboard.'],
    de: ['Barrierefreiheit', 'So ist Digital Boomer leicht zu bedienen: große Schrift, hoher Kontrast, Vorlesen und Bedienung mit der Tastatur.'],
    index: true,
  },
  datenschutz: {
    en: ['Privacy and Legal Notice', 'What Digital Boomer stores, and who is responsible for this student project.'],
    de: ['Datenschutz und Impressum', 'Was Digital Boomer speichert, und wer für dieses studentische Projekt verantwortlich ist.'],
    index: true,
  },
  glossar: {
    en: ['Digital Words Explained', 'What does app, update, link, cloud or Wi-Fi mean? Plain explanations of the words you meet on your phone and online.'],
    de: ['Digitale Begriffe erklärt', 'Was heißt App, Update, Link, Cloud oder WLAN? Einfache Erklärungen der Wörter, die Ihnen am Handy und im Internet begegnen.'],
    index: true,
  },
  familie: {
    en: ['For Families: Send Lessons to Your Parents', 'Helping a parent or grandparent with their phone? Pick a few lessons and send them a link by WhatsApp, email or QR code. No account needed.'],
    de: ['Für Familien: Lektionen an Ihre Eltern schicken', 'Sie helfen Eltern oder Großeltern mit dem Handy? Wählen Sie ein paar Lektionen aus und schicken Sie ihnen einen Link per WhatsApp, E-Mail oder QR-Code. Ohne Konto.'],
    index: true,
  },
  'fuer-dich': { en: ['Lessons Picked for You', HOME_DESCRIPTION[0]], de: ['Für Sie ausgesuchte Lektionen', HOME_DESCRIPTION[1]], index: false },
  dashboard: { en: ['My Progress', HOME_DESCRIPTION[0]], de: ['Mein Fortschritt', HOME_DESCRIPTION[1]], index: false },
  anmelden: { en: ['Sign In', HOME_DESCRIPTION[0]], de: ['Anmelden', HOME_DESCRIPTION[1]], index: false },
  registrieren: { en: ['Create an Account', HOME_DESCRIPTION[0]], de: ['Konto erstellen', HOME_DESCRIPTION[1]], index: false },
  'passwort-vergessen': { en: ['Forgotten Password', HOME_DESCRIPTION[0]], de: ['Passwort vergessen', HOME_DESCRIPTION[1]], index: false },
  'konto-bestaetigt': { en: ['Account Confirmed', HOME_DESCRIPTION[0]], de: ['Konto bestätigt', HOME_DESCRIPTION[1]], index: false },
  'neues-passwort': { en: ['New Password', HOME_DESCRIPTION[0]], de: ['Neues Passwort', HOME_DESCRIPTION[1]], index: false },
  suche: { en: ['Search', HOME_DESCRIPTION[0]], de: ['Suche', HOME_DESCRIPTION[1]], index: false },
  'free-roam': { en: ['Explore an App', HOME_DESCRIPTION[0]], de: ['Eine App erkunden', HOME_DESCRIPTION[1]], index: false },
};

export interface PageMeta {
  heading: string;
  description: string;
  index: boolean;
}

/** Heading and description of a page, in English or German. */
export function pageMeta(route: Route, lang: 'en' | 'de', tutorials: Tutorial[]): PageMeta {
  if (route.page === 'tutorial-detail') {
    const tutorial = tutorials.find((t) => t.id === route.tutorialId);
    if (tutorial) return { heading: tutorial.title, description: tutorial.description, index: true };
    const list = PAGES.tutorials[lang];
    return { heading: list[0], description: list[1], index: false };
  }
  const page = PAGES[route.page];
  return { heading: page[lang][0], description: page[lang][1], index: page.index };
}

export interface HeadInfo {
  lang: UiLanguage;
  heading: string;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  /** Other language versions of the page (hreflang), only for pages search engines may list. */
  alternates: { hreflang: string; href: string }[];
}

/**
 * Everything the <head> needs for a page in a language. `translate` turns English into
 * Turkish, Spanish or Croatian (the dictionary must already be loaded).
 */
export function headInfo(route: Route, lang: UiLanguage, tutorials: { en: Tutorial[]; de: Tutorial[] }, translate: (text: string) => string): HeadInfo {
  const base = lang === 'de' ? 'de' : 'en';
  const meta = pageMeta(route, base, tutorials[base]);
  const extra = lang !== 'en' && lang !== 'de';
  const heading = extra ? translate(meta.heading) : meta.heading;
  const description = extra ? translate(meta.description) : meta.description;
  const target = canonicalRoute(route);
  const address = (l: UiLanguage) => `${SITE_ORIGIN}${urlFor(target, l, SITE_BASE)}`;
  const indexable = meta.index && INDEXED_LANGUAGES.includes(lang);
  return {
    lang,
    heading,
    title: route.page === 'home' ? heading : `${heading} | Digital Boomer`,
    description,
    canonical: address(lang),
    robots: indexable ? 'index, follow' : 'noindex, follow',
    alternates: meta.index
      ? [...INDEXED_LANGUAGES.map((l) => ({ hreflang: l, href: address(l) })), { hreflang: 'x-default', href: address('en') }]
      : [],
  };
}
