/**
 * Email lessons on the computer: each service's website (or the Mail app on a Mac) is laid
 * out differently from its phone app, so the hints say where things are on that screen
 * (src/components/practice/EmailWeb.tsx). Steps that only exist on the phone are left out:
 * opening the folder menu (on the computer the folders are always on the left), and going
 * back from an email where the email opens next to the list.
 */
import type { Language, Tutorial, TutorialStep } from '../types';

/** Services whose website opens an email next to the list (a reading pane). Gmail and Yahoo open it in place of the list. */
export const READING_PANE: Record<string, boolean> = { gmail: false, yahoo: false, outlook: true, applemail: true, gmx: true, webde: true, tonline: true, proton: true };

type Where = Record<string, [string, string]>;

/** Where each button is, per service. Keys: target id, or "screen:target" when one id means different things. */
function whereTable(service: string, labels: Record<string, string>): Where {
  const compose = labels.compose ?? 'Compose';
  const trash = labels.trashFolder ?? 'Trash';
  const starred = labels.starredFolder ?? 'Starred';
  const move = labels.moveToInbox ?? 'Move to inbox';
  const sidebarCompose: [string, string] = [`"${compose}" is the button at the top left, above your folders.`, `„${compose}“ ist der Knopf oben links, über Ihren Ordnern.`];
  const common: Where = {
    'folder-trash': [`"${trash}" is in the list of folders on the left.`, `„${trash}“ steht links in der Liste der Ordner.`],
    'folder-starred': [`"${starred}" is in the list of folders on the left.`, `„${starred}“ steht links in der Liste der Ordner.`],
    'move-inbox': [`"${move}" is in the bar above the email.`, `„${move}“ ist in der Leiste über der E-Mail.`],
    'mail-more': ['The three dots are at the top right of the email.', 'Die drei Punkte sind oben rechts an der E-Mail.'],
    'search-mail:send': ['Press the Enter key, or click the magnifying glass in the search field.', 'Drücken Sie die Eingabetaste, oder klicken Sie auf die Lupe im Suchfeld.'],
    search: ['The search field is at the top of the page.', 'Das Suchfeld ist oben auf der Seite.'],
    archive: ['The box symbol is in the bar above the email.', 'Das Kisten-Symbol ist in der Leiste über der E-Mail.'],
    delete: ['The bin symbol is in the bar above the email.', 'Das Papierkorb-Symbol ist in der Leiste über der E-Mail.'],
    back: ['The arrow is at the top left, above the email.', 'Der Pfeil ist oben links, über der E-Mail.'],
    unsubscribe: ['"Unsubscribe" is in the note at the top of the email.', '„Abmelden“ steht im Hinweis oben in der E-Mail.'],
  };
  const byService: Record<string, Where> = {
    gmail: {
      compose: sidebarCompose,
      reply: ['"Reply" is the first button under the email.', '„Antworten“ ist der erste Knopf unter der E-Mail.'],
      forward: ['"Forward" is under the email, next to "Reply".', '„Weiterleiten“ ist unter der E-Mail, neben „Antworten“.'],
      star: ['The star is at the right of the sender, next to the time.', 'Der Stern ist rechts neben dem Absender, bei der Uhrzeit.'],
      unsubscribe: ['"Unsubscribe" is next to the sender\'s name, at the top of the email.', '„Abmelden“ steht neben dem Namen des Absenders, oben in der E-Mail.'],
      attach: ['The paper clip is at the bottom of the window, next to "Send".', 'Die Büroklammer ist unten im Fenster, neben „Senden“.'],
      send: ['"Send" is the blue button at the bottom left of the window.', '„Senden“ ist der blaue Knopf unten links im Fenster.'],
    },
    yahoo: {
      compose: sidebarCompose,
      reply: ['"Reply" is at the top right of the email.', '„Antworten“ ist oben rechts an der E-Mail.'],
      forward: ['"Forward" is at the top right of the email, next to "Reply".', '„Weiterleiten“ ist oben rechts an der E-Mail, neben „Antworten“.'],
      star: ['The star is at the right of the sender, next to the time.', 'Der Stern ist rechts neben dem Absender, bei der Uhrzeit.'],
      unsubscribe: ['"Unsubscribe" is next to the sender\'s name, at the top of the email.', '„Abmelden“ steht neben dem Namen des Absenders, oben in der E-Mail.'],
      attach: ['The paper clip is at the bottom, next to "Send".', 'Die Büroklammer ist unten, neben „Senden“.'],
      send: ['"Send" is the button at the bottom left.', '„Senden“ ist der Knopf unten links.'],
    },
    proton: {
      compose: sidebarCompose,
      reply: ['"Reply" is at the top right of the email, next to the sender.', '„Antworten“ ist oben rechts an der E-Mail, neben dem Absender.'],
      forward: ['"Forward" is at the top right of the email, next to "Reply".', '„Weiterleiten“ ist oben rechts an der E-Mail, neben „Antworten“.'],
      star: ['The star is in the bar above the email.', 'Der Stern ist in der Leiste über der E-Mail.'],
      attach: ['The paper clip is at the bottom of the window, next to "Send".', 'Die Büroklammer ist unten im Fenster, neben „Senden“.'],
      send: ['"Send" is the purple button at the bottom right of the window.', '„Senden“ ist der violette Knopf unten rechts im Fenster.'],
    },
    outlook: {
      compose: [`"${compose}" is the blue button at the top left.`, `„${compose}“ ist der blaue Knopf oben links.`],
      reply: ['"Reply" is at the right of the sender\'s name.', '„Antworten“ ist rechts neben dem Namen des Absenders.'],
      forward: ['"Forward" is at the right of the sender\'s name, next to "Reply".', '„Weiterleiten“ ist rechts neben dem Namen des Absenders, neben „Antworten“.'],
      star: ['The flag is in the bar at the top of the page.', 'Das Fähnchen ist in der Leiste oben auf der Seite.'],
      archive: ['"Archive" is in the bar at the top of the page.', '„Archivieren“ ist in der Leiste oben auf der Seite.'],
      delete: ['"Delete" is in the bar at the top of the page.', '„Löschen“ ist in der Leiste oben auf der Seite.'],
      attach: ['The paper clip is at the top, next to "Send".', 'Die Büroklammer ist oben, neben „Senden“.'],
      send: ['"Send" is the blue button at the top left of the new email.', '„Senden“ ist der blaue Knopf oben links in der neuen E-Mail.'],
      'move-inbox': [`"${move}" is in the bar at the top of the page.`, `„${move}“ ist in der Leiste oben auf der Seite.`],
    },
    applemail: {
      compose: ['The square with the pencil is in the bar at the top of the window.', 'Das Quadrat mit dem Stift ist in der Leiste oben im Fenster.'],
      search: ['The search field is at the top right of the window.', 'Das Suchfeld ist oben rechts im Fenster.'],
      reply: ['The arrow for "Reply" is in the bar at the top of the window.', 'Der Pfeil für „Antworten“ ist in der Leiste oben im Fenster.'],
      forward: ['The arrow for "Forward" is in the bar at the top, next to "Reply".', 'Der Pfeil für „Weiterleiten“ ist in der Leiste oben, neben „Antworten“.'],
      star: ['The flag is in the bar at the top of the window.', 'Das Fähnchen ist in der Leiste oben im Fenster.'],
      archive: ['The box symbol is in the bar at the top of the window.', 'Das Kisten-Symbol ist in der Leiste oben im Fenster.'],
      delete: ['The bin symbol is in the bar at the top of the window.', 'Das Papierkorb-Symbol ist in der Leiste oben im Fenster.'],
      'mail-more': ['The three dots are at the right of the bar at the top.', 'Die drei Punkte sind rechts in der Leiste oben.'],
      'move-inbox': [`"${move}" is in the bar at the top of the window.`, `„${move}“ ist in der Leiste oben im Fenster.`],
      attach: ['The paper clip is at the top right of the new window.', 'Die Büroklammer ist oben rechts im neuen Fenster.'],
      send: ['The paper plane at the top left of the new window sends the email.', 'Der Papierflieger oben links im neuen Fenster sendet die E-Mail.'],
    },
  };
  const portal: Where = {
    compose: sidebarCompose,
    search: service === 'tonline' ? common.search : ['The search field is above your emails.', 'Das Suchfeld ist über Ihren E-Mails.'],
    reply: ['"Reply" is the first button in the bar above the email.', '„Antworten“ ist der erste Knopf in der Leiste über der E-Mail.'],
    forward: ['"Forward" is in the bar above the email, next to "Reply".', '„Weiterleiten“ ist in der Leiste über der E-Mail, neben „Antworten“.'],
    star: ['The star is in the bar above the email.', 'Der Stern ist in der Leiste über der E-Mail.'],
    attach: ['The paper clip is at the top, next to "Send".', 'Die Büroklammer ist oben, neben „Senden“.'],
    send: ['"Send" is the button at the top left, above "To".', '„Senden“ ist der Knopf oben links, über „An“.'],
  };
  return { ...common, ...(byService[service] ?? portal) };
}

const STEP_COUNT: [RegExp, (n: number) => string][] = [
  [/in (\d+) steps/, (n) => `in ${n} steps`],
  [/in (\d+) Schritten/, (n) => `in ${n} Schritten`],
];

/** The email lesson as it works on the service's website or Mac program. */
export function emailDesktopLesson(tutorial: Tutorial, lang: Language): Tutorial {
  const practice = tutorial.practice;
  if (!practice || (practice.screenId !== 'email' && practice.screenId !== 'desktop-email')) return tutorial;
  const service = practice.appId ?? 'gmail';
  const pane = READING_PANE[service] ?? true;
  const table = whereTable(service, practice.labels);
  const pick = (pair: [string, string]) => (lang === 'en' ? pair[0] : pair[1]);
  const isEn = lang === 'en';

  const keep = tutorial.steps.filter((step) => {
    const target = step.practice?.targetId;
    if (target === 'menu') return false; // folders are always on the left
    if (target === 'back' && step.practice?.screen === 'mail-starred' && pane) return false; // the list is still next to the email
    return true;
  });

  const steps: TutorialStep[] = keep.map((step, index) => {
    const p = step.practice;
    if (!p) return { ...step, stepNumber: index + 1 };
    const screen = p.screen.replace(/^web-/, '');
    const entry = table[`${screen}:${p.targetId}`] ?? (screen === 'search-mail' ? undefined : table[p.targetId]);
    if (!entry) return { ...step, stepNumber: index + 1 };
    const where = pick(entry);
    const old = p.fallbackHint;
    const swap = (text: string) => (old && text.includes(old) ? text.split(old).join(where) : text);
    let lead = step.lead;
    let paragraphs = step.paragraphs;
    if (p.targetId === 'send' && screen !== 'search-mail') {
      // "tap send at the top right" is the phone; on the computer "Send" sits elsewhere.
      lead = lead
        .replace(/(?:tap|click) (?:the )?send(?: button)? at the top right/i, 'click "Send"')
        .replace(/(?:tap|click) send\.?$/i, 'click "Send".')
        .replace(/(?:tippen|klicken) Sie oben rechts auf (?:den Senden-Knopf|Senden)/, 'klicken Sie auf „Senden“')
        .replace(/klicken Sie auf Senden\./, 'klicken Sie auf „Senden“.');
      lead = `${lead} ${where}`;
      paragraphs = paragraphs.filter((text) => !/top right in most|oben rechts\./.test(text));
    } else if (p.targetId === 'reply') {
      lead = `${isEn ? 'Read the email. Then click "Reply".' : 'Lesen Sie die E-Mail. Dann klicken Sie auf „Antworten“.'} ${where}`;
    } else if (p.targetId === 'archive') {
      lead = `${isEn ? 'It looks like a box.' : 'Es sieht aus wie eine Kiste.'} ${where}`;
    } else if (p.targetId === 'move-inbox' || p.targetId === 'delete') {
      lead = `${lead.replace(/ at the top\.| oben auf das Papierkorb-Symbol\./, p.targetId === 'delete' ? (isEn ? '.' : ' auf das Papierkorb-Symbol.') : '.')} ${where}`.replace('..', '.');
    } else if (['compose', 'attach', 'forward', 'star', 'search'].includes(p.targetId)) {
      lead = where;
    }
    return {
      ...step,
      stepNumber: index + 1,
      lead,
      paragraphs,
      practice: {
        ...p,
        fallbackHint: where,
        showMeText: swap(p.showMeText),
        hints: Object.fromEntries(Object.entries(p.hints).map(([key, value]) => [key, swap(value)])),
      },
    };
  });

  const removed = tutorial.steps.length - steps.length;
  const fixCount = (text: string) => (removed ? STEP_COUNT.reduce((result, [pattern, make]) => result.replace(pattern, (_, n: string) => make(Number(n) - removed)), text) : text);
  return { ...tutorial, steps, practice: { ...practice, introText: fixCount(practice.introText) } };
}
