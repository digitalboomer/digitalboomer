/**
 * Lesson search that understands everyday wording: word by word (not the exact phrase),
 * common other words ("picture" finds "photo", "Überweisung" finds "transfer"),
 * plural forms and small typos ("whatsap", "pasword"). Filler words ("how do I")
 * are ignored. In Turkish, Spanish and Croatian, the translated lesson texts are searched too.
 */
import type { Tutorial } from '../types';

/** Lowercase, without accents (ü → u, č → c, ß → ss), only letters and digits. */
export function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** Words that say nothing about the topic (English and German). */
const STOP_WORDS = new Set(
  normalizeWords(`
    a an the and or of to in on at for with by from my your our me i you we it is are be can could
    how do does did what when where which who why will would should please want wish help need
    get make use using about this that these those there here some any one just also not
    ein eine einen einem einer der die das den dem des und oder von zu im in an am auf fur mit bei
    aus mein meine meinen meiner ihr ihre ihren sie ich wir es ist sind kann konnen wie was wann wo
    welche welcher wer warum mochte will bitte brauche hilfe etwas man mir mich uns
  `)
);

/** Groups of words that mean the same thing here. A search for one finds all of them. */
const SYNONYM_GROUPS: string[][] = [
  'photo photos picture pictures pic pics image images selfie foto fotos bild bilder',
  'send sending sent senden schicken verschicken versenden',
  'transfer transfers money pay paying payment payments ueberweisung uberweisung uberweisen ueberweisen uberweisungen geld bezahlen zahlung zahlungen',
  'call calls videocall facetime phone anruf anrufe anrufen videoanruf videotelefonie telefonieren telefonat',
  'message messages text texts texting chat chats sms nachricht nachrichten',
  'voice audio recording sprachnachricht sprachnachrichten sprachmemo',
  'email emails mail mails inbox postfach',
  'scam scams fraud fraudster fake fakes trick tricks scammer scammers betrug betruger abzocke falle',
  'password passwords passcode passwort passworter kennwort',
  'delete deleting remove erase loschen entfernen',
  'balance kontostand',
  'bank banking onlinebanking banken',
  'ai chatbot chatbots chatgpt gemini copilot ki',
  'group groups gruppe gruppen',
  'grandchildren grandchild grandkids grandson granddaughter enkel enkelkind enkelkinder family familie',
  'attachment attachments file files document documents anhang anhange datei dateien dokument',
  'reply answer respond antworten antwort',
  'post posts posting share sharing posten teilen beitrag',
  'block blocking blockieren sperren',
  'video videos',
  'safe safety secure security sicher sicherheit',
  'phone smartphone mobile handy telefon',
  'computer laptop pc desktop rechner',
  'contact contacts kontakt kontakte',
].map((group) => group.split(' ').flatMap((word) => normalizeWords(word)));

const SYNONYMS = new Map<string, string[]>();
for (const group of SYNONYM_GROUPS) for (const word of group) SYNONYMS.set(word, group);

/** At most one letter added, missing, changed, or two letters swapped. */
function oneTypoApart(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a.length === b.length) {
    if (a.slice(i + 1) === b.slice(i + 1)) return true; // one letter changed
    return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2); // swapped
  }
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  return short.slice(i) === long.slice(i + 1); // one letter added or missing
}

/** Does a word of the lesson match a searched word (or one of its other words)? Typos only count for the typed word. */
function wordMatches(token: string, variant: string, typed: boolean): boolean {
  if (token === variant) return true;
  if (variant.length >= 3 && token.startsWith(variant)) return true; // "whatsap" → "whatsapp", "bank" → "banking"
  if (token.length >= 4 && variant.startsWith(token) && variant.length - token.length <= 2) return true; // "photos" → "photo"
  return typed && variant.length >= 5 && oneTypoApart(token, variant);
}

interface IndexedLesson {
  tutorial: Tutorial;
  fields: { words: Set<string>; weight: number }[];
}

/** Prepares the lessons for searching. `translate` adds the text in the visitor's language (Turkish, Spanish, Croatian). */
export function buildSearchIndex(tutorials: Tutorial[], translate?: (text: string) => string): IndexedLesson[] {
  const words = (texts: string[]) => {
    const all = translate ? [...texts, ...texts.map(translate)] : texts;
    return new Set(normalizeWords(all.join(' ')));
  };
  return tutorials.map((tutorial) => ({
    tutorial,
    fields: [
      { words: words([tutorial.title]), weight: 4 },
      { words: words([...tutorial.tags, tutorial.categoryTitle]), weight: 3 },
      { words: words([tutorial.description]), weight: 2 },
      { words: words(tutorial.steps.map((step) => step.title)), weight: 1 },
    ],
  }));
}

export interface SearchOutcome {
  results: Tutorial[];
  /** No lesson has all the searched words: these are the closest ones. */
  partial: boolean;
}

export function searchLessons(index: IndexedLesson[], query: string): SearchOutcome {
  const all = Array.from(new Set(normalizeWords(query)));
  const words = all.filter((word) => !STOP_WORDS.has(word));
  if (words.length === 0) return { results: [], partial: false };

  // For every searched word: how well each lesson matches it (0 = not at all).
  const perWord = words.map((word) => {
    const variants = SYNONYMS.get(word) ?? [word];
    return index.map(({ fields }) => {
      let best = 0;
      for (const field of fields) {
        if (field.weight <= best) continue;
        for (const token of field.words) {
          if (variants.some((variant) => wordMatches(token, variant, variant === word))) {
            best = field.weight;
            break;
          }
        }
      }
      return best;
    });
  });

  // Words no lesson knows ("grandma", a name) are left out, so the rest still finds something.
  const known = perWord.filter((scores) => scores.some((score) => score > 0));
  if (known.length === 0) return { results: [], partial: false };

  const ranked = index.map((lesson, i) => ({
    tutorial: lesson.tutorial,
    order: i,
    matched: known.filter((scores) => scores[i] > 0).length,
    score: known.reduce((sum, scores) => sum + scores[i], 0),
  }));
  const most = Math.max(...ranked.map((r) => r.matched));
  const results = ranked
    .filter((r) => r.matched === most)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((r) => r.tutorial);
  return { results, partial: most < known.length };
}
