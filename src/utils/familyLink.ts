/**
 * "For families": a family member picks lessons and sends a link (/for-you?l=…&n=…).
 * The link holds only the lesson ids and, if given, a first name. Nothing is stored anywhere.
 */
import { SITE_BASE, SITE_ORIGIN, urlFor } from './routes';
import type { UiLanguage } from '../i18n/translate';
import type { Tutorial } from '../types';

export const MAX_FAMILY_LESSONS = 8;

/** Good first lessons, by topic. More can be found with the search on the page. */
export const FAMILY_STARTERS: { title: [string, string]; ids: string[] }[] = [
  { title: ['Messages and calls', 'Nachrichten und Anrufe'], ids: ['whatsapp-message', 'whatsapp-photo', 'whatsapp-voice', 'whatsapp-call', 'videotelefonie-familie', 'messaging-wrong-chat'] },
  { title: ['Staying safe', 'Sicher bleiben'], ids: ['safety-phishing-examples', 'safety-phone-scams', 'safety-sms-scams', 'safety-account-code', 'passwoerter-erstellen'] },
  { title: ['Email and online banking', 'E-Mail und Online-Banking'], ids: ['gmail-new', 'email-reply-practice', 'online-banking-grundlagen', 'banking-balance-practice'] },
  { title: ['Everyday AI', 'KI im Alltag'], ids: ['ai-what-is-it', 'ai-first-question'] },
];

/** A first name for the greeting: letters, spaces, hyphens and apostrophes, at most 30 characters. */
export function cleanName(name: string | undefined): string {
  return (name ?? '').replace(/[^\p{L}\s'’-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 30);
}

/** The lesson ids of a link, checked against the real lessons, without repeats, at most 8. */
export function lessonIdsFromLink(value: string | undefined, lessons: Tutorial[]): string[] {
  const known = new Set(lessons.map((t) => t.id));
  return Array.from(new Set((value ?? '').split(',').map((id) => id.trim()).filter((id) => known.has(id)))).slice(0, MAX_FAMILY_LESSONS);
}

/** The public address of the link, also when the site runs on this computer. */
export function familyLinkUrl(ids: string[], name: string, lang: UiLanguage): string {
  const route = { page: 'fuer-dich' as const, query: ids.join(','), category: cleanName(name) || undefined };
  return `${SITE_ORIGIN}${urlFor(route, lang, SITE_BASE)}`;
}

/** The message to send with the link, in the language the person reads. Written by the family member, so informal. */
export function familyMessage(lang: UiLanguage, name: string, url: string): string {
  return `${familyText(lang, name)} ${url}`;
}

/** The suggested text of the message, without the link (the family page lets people change it; the link is always added). */
export function familyText(lang: UiLanguage, name: string): string {
  const n = cleanName(name);
  const greet: Record<UiLanguage, string> = {
    en: n ? `Hello ${n},` : 'Hello,',
    de: n ? `Hallo ${n},` : 'Hallo,',
    tr: n ? `Merhaba ${n},` : 'Merhaba,',
    es: n ? `Hola, ${n}:` : 'Hola:',
    hr: n ? `Bok ${n},` : 'Bok,',
  };
  const body: Record<UiLanguage, string> = {
    en: 'I picked a few lessons for you on Digital Boomer. You can practise there step by step on a pretend phone, and you cannot break anything:',
    de: 'ich habe dir ein paar Lektionen bei Digital Boomer ausgesucht. Dort kannst du Schritt für Schritt an einem Übungs-Handy üben und nichts kaputt machen:',
    tr: 'sana Digital Boomer\'da birkaç ders seçtim. Orada adım adım bir alıştırma telefonunda deneyebilirsin, hiçbir şeyi bozamazsın:',
    es: 'te he elegido algunas lecciones en Digital Boomer. Allí puedes practicar paso a paso en un móvil de prueba, y no puedes romper nada:',
    hr: 'evo nekoliko lekcija za tebe na Digital Boomeru. Ondje možeš korak po korak vježbati na mobitelu za vježbu i ništa ne možeš pokvariti:',
  };
  return `${greet[lang]} ${body[lang]}`;
}

/** The subject when the message is sent by email, in the same language as the message. */
export function familySubject(lang: UiLanguage): string {
  return { en: 'Lessons for you', de: 'Lektionen für dich', tr: 'Senin için dersler', es: 'Lecciones para ti', hr: 'Lekcije za tebe' }[lang];
}
