/**
 * Lesson text for the computer: "click" instead of "tap", the keyboard instead
 * of the phone keyboard. Applied to every phone lesson in computer mode.
 */
import type { Language, Tutorial } from '../types';

const EN: [RegExp, string][] = [
  [/Tap letters to write something, or tap a word above the letters/g, 'Type with your keyboard, or click a suggested word under the field'],
  [/Tap letters or a word above the letters/g, 'Type with your keyboard, or click a suggested word'],
  [/tap a word above the letters/g, 'click a suggested word'],
  [/a word above the letters/g, 'a suggested word'],
  [/above the letters/g, 'under the field'],
  [/on the keyboard/g, 'with your keyboard'],
  [/Put your finger on (the|Peter's) ([a-z]+) and keep it there for a moment\./g, 'Click the $2 and keep the mouse button pressed for a moment.'],
  [/Press and hold/g, 'Click and hold'],
  [/press and hold/g, 'click and hold'],
  [/Pressing and holding/g, 'Clicking and holding'],
  [/Keep your finger on it/g, 'Keep the mouse button pressed'],
  [/the key with the small cross/g, 'the Backspace key'],
  [/simulated phone/g, 'simulated computer'],
  [/where to tap/g, 'where to click'],
  [/\bTapping\b/g, 'Clicking'],
  [/\bTap\b/g, 'Click'],
  [/\btap\b/g, 'click'],
  [/\btaps\b/g, 'clicks'],
  [/\btapped\b/g, 'clicked'],
];

const DE: [RegExp, string][] = [
  [/Tippen Sie Buchstaben, oder tippen Sie ein Wort über den Buchstaben/g, 'Tippen Sie mit der Tastatur, oder klicken Sie auf ein vorgeschlagenes Wort unter dem Feld'],
  [/Tippen Sie Buchstaben oder ein Wort über den Buchstaben/g, 'Tippen Sie mit der Tastatur, oder klicken Sie auf ein vorgeschlagenes Wort'],
  [/tippen Sie ein Wort über den Buchstaben/g, 'klicken Sie auf ein vorgeschlagenes Wort'],
  [/ein Wort über den Buchstaben/g, 'ein vorgeschlagenes Wort'],
  [/über den Buchstaben/g, 'unter dem Feld'],
  [/auf der Tastatur/g, 'mit Ihrer Tastatur'],
  [/Legen Sie den Finger auf (das|die) ([A-Za-zäöüß]+) und lassen Sie ihn einen Moment dort\./g, 'Klicken Sie auf $1 $2 und halten Sie die Maustaste einen Moment gedrückt.'],
  [/Lassen Sie den Finger einen Moment darauf/g, 'Halten Sie die Maustaste einen Moment gedrückt'],
  [/die Taste mit dem kleinen Kreuz/g, 'die Rücktaste'],
  [/simulierten Handy/g, 'simulierten Computer'],
  [/simulierte Handy/g, 'simulierte Computer'],
  [/wohin Sie tippen/g, 'wohin Sie klicken'],
  [/Tippen Sie (unten |oben |links |rechts )?(auf|in)/g, 'Klicken Sie $1$2'],
  [/tippen Sie (unten |oben |links |rechts )?(auf|in)/g, 'klicken Sie $1$2'],
  [/Tippen Sie auf/g, 'Klicken Sie auf'],
  [/ein weiteres Tippen/gi, 'ein weiterer Klick'],
  [/\bTippen\b(?! Sie)/g, 'Klicken'],
];

export function toComputerText(text: string, lang: Language): string {
  return (lang === 'en' ? EN : DE).reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text);
}

/** The same lesson, with words for the computer. */
export function computerLesson(tutorial: Tutorial, lang: Language): Tutorial {
  const c = (text: string) => toComputerText(text, lang);
  const practice = tutorial.practice!;
  return {
    ...tutorial,
    steps: tutorial.steps.map((step) => ({
      ...step,
      title: c(step.title),
      lead: c(step.lead),
      paragraphs: step.paragraphs.map(c),
      practice: step.practice && {
        ...step.practice,
        successText: c(step.practice.successText),
        fallbackHint: c(step.practice.fallbackHint),
        showMeText: c(step.practice.showMeText),
        hints: Object.fromEntries(Object.entries(step.practice.hints).map(([key, value]) => [key, c(value)])),
      },
    })),
    practice: { ...practice, introText: c(practice.introText), notice: c(practice.notice) },
  };
}
