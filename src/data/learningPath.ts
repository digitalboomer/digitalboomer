/**
 * What comes next after each lesson. Everything that recommends a lesson reads
 * from here: "What to do next", the "Next lesson" button and the celebration window.
 *
 * Lessons of one service follow their own order. Then they lead to a general
 * lesson on the same topic, so a lesson about phishing never recommends WhatsApp.
 */
import type { Tutorial } from '../types';

const SERVICE_ORDER: { kinds: string[]; after: string[] }[] = [
  { kinds: ['message', 'photo', 'voice', 'reply', 'group', 'call'], after: ['videotelefonie-familie', 'passwoerter-erstellen'] },
  { kinds: ['reply', 'new', 'forward', 'attach', 'search', 'star', 'archive', 'restore', 'spam', 'unsubscribe'], after: ['email-write-well', 'phishing-erkennen'] },
  { kinds: ['like', 'search', 'post', 'message', 'share', 'follow', 'block'], after: ['social-before-posting', 'social-privacy'] },
  { kinds: ['balance', 'transfer', 'statement', 'own', 'scheduled', 'standing', 'stop-standing', 'international', 'namecheck', 'reject', 'block-card'], after: ['banking-scam-calls', 'banking-abroad-guide'] },
];
// The "Get started on the computer" lesson ("desktop") is not in these chains, so phone learners are never sent to it.
// It is shown first for computer learners, and leads on to the service's first lessons.

const GROUP_ORDER: Record<string, number> = { messaging: 0, email: 1, 'social-media': 2, banking: 3 };

const NEXT: Record<string, string[]> = {
  'whatsapp-nachrichten': ['whatsapp-photo', 'whatsapp-voice'],
  'videotelefonie-familie': ['whatsapp-call', 'whatsapp-group'],
  'phishing-erkennen': ['safety-phishing-examples', 'e-mail-anhaenge-pruefen'],
  'safety-phishing-examples': ['e-mail-anhaenge-pruefen', 'safety-sms-scams'],
  'e-mail-anhaenge-pruefen': ['safety-sms-scams', 'passwoerter-erstellen'],
  'safety-sms-scams': ['safety-phone-scams', 'safety-qr'],
  'safety-phone-scams': ['safety-popups', 'banking-scam-calls'],
  'safety-popups': ['fake-shops-entlarven', 'safety-updates'],
  'fake-shops-entlarven': ['safety-qr', 'social-fake-news'],
  'safety-qr': ['passwoerter-erstellen', 'safety-wifi'],
  'passwoerter-erstellen': ['safety-2fa', 'safety-updates'],
  'safety-2fa': ['safety-updates', 'safety-wifi'],
  'safety-updates': ['safety-wifi', 'safety-lost-phone'],
  'safety-wifi': ['safety-lost-phone', 'safety-what-if'],
  'safety-lost-phone': ['safety-what-if', 'passwoerter-erstellen'],
  'safety-what-if': ['safety-phishing-examples', 'safety-phone-scams'],
  'online-banking-grundlagen': ['banking-balance-practice', 'banking-scam-calls'],
  'banking-balance-practice': ['banking-transfer-practice', 'online-banking-grundlagen'],
  'banking-transfer-practice': ['banking-direct-debit', 'banking-scam-calls'],
  'banking-direct-debit': ['banking-abroad-guide', 'banking-scam-calls'],
  'banking-abroad-guide': ['banking-scam-calls', 'banking-direct-debit'],
  'banking-scam-calls': ['safety-phone-scams', 'phishing-erkennen'],
  'email-reply-practice': ['email-write-well', 'phishing-erkennen'],
  'email-write-well': ['email-cc-bcc', 'email-away-message'],
  'email-cc-bcc': ['email-away-message', 'e-mail-anhaenge-pruefen'],
  'email-away-message': ['phishing-erkennen', 'e-mail-anhaenge-pruefen'],
  'social-before-posting': ['social-privacy', 'social-strangers'],
  'social-privacy': ['social-strangers', 'social-fake-news'],
  'social-strangers': ['social-fake-news', 'banking-scam-calls'],
  'social-fake-news': ['ai-fakes', 'ai-real-or-ai'],
  'ki-chatgpt-alltag': ['ai-first-question', 'ai-good-questions'],
  'ai-what-is-it': ['ai-first-question', 'ai-good-questions'],
  'ai-first-question': ['ai-good-questions', 'ai-voice-assistants'],
  'ai-good-questions': ['ai-voice-assistants', 'ai-translate'],
  'ai-voice-assistants': ['ai-translate', 'ai-letters'],
  'ai-translate': ['ai-letters', 'ai-health'],
  'ai-letters': ['ai-health', 'ai-privacy'],
  'ai-health': ['ai-privacy', 'ai-fakes'],
  'ai-privacy': ['ai-fakes', 'ai-spot-pictures'],
  'ai-fakes': ['ai-spot-pictures', 'ai-real-or-ai'],
  'ai-spot-pictures': ['ai-real-or-ai', 'ai-fakes'],
  'ai-real-or-ai': ['social-fake-news', 'ai-privacy'],
};

function serviceOrder(tutorial: Tutorial) {
  const group = GROUP_ORDER[tutorial.categoryId];
  return group === undefined ? undefined : SERVICE_ORDER[group];
}

/** Sets the recommended lessons on every tutorial. */
export function applyLearningPath(tutorials: Tutorial[]): void {
  const ids = new Set(tutorials.map((t) => t.id));
  tutorials.forEach((tutorial) => {
    const appId = tutorial.practice?.appId;
    let next = NEXT[tutorial.id];
    if (!next && appId) {
      const order = serviceOrder(tutorial);
      if (order) {
        const kind = tutorial.id.slice(appId.length + 1);
        const start = order.kinds.indexOf(kind);
        const rest = order.kinds.slice(start + 1).map((k) => `${appId}-${k}`).filter((id) => ids.has(id));
        next = [...rest, ...order.after].slice(0, 2);
      }
    }
    tutorial.nextIds = (next ?? []).filter((id) => ids.has(id));
    if (tutorial.practice) tutorial.practice.nextTutorialId = tutorial.nextIds[0] ?? '';
  });
}

/** Puts the lessons of one service in their learning order. */
export function lessonRank(tutorial: Tutorial): number {
  const appId = tutorial.practice?.appId;
  const order = serviceOrder(tutorial);
  if (!appId || !order) return 0;
  const rank = order.kinds.indexOf(tutorial.id.slice(appId.length + 1));
  return rank < 0 ? order.kinds.length : rank;
}
