/**
 * Every guide without an app logo gets its own drawn picture. They are small
 * inline SVGs made for this site, without text, so they suit both languages.
 */
import type { Tutorial } from '../types';

const NAVY = '#17324D';
const TEAL = '#176B68';
const WHITE = '#FFFFFF';
const RED = '#B3261E';
const GOLD = '#E0A800';
const GREY = '#667382';

type Part = (x: number, y: number, s?: number) => string;
const at = (x: number, y: number, s: number, inner: string) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;

// Each part is drawn around 0,0 in a box of about 200 by 200.
const phone: Part = (x, y, s = 1) => at(x, y, s, `<rect x="-65" y="-120" width="130" height="240" rx="20" fill="${NAVY}"/><rect x="-53" y="-100" width="106" height="195" rx="6" fill="${WHITE}"/><circle cy="107" r="7" fill="${WHITE}"/>`);
const envelope: Part = (x, y, s = 1) => at(x, y, s, `<rect x="-110" y="-72" width="220" height="144" rx="14" fill="${WHITE}" stroke="${NAVY}" stroke-width="8"/><path d="M-106 -64 L0 18 L106 -64" fill="none" stroke="${NAVY}" stroke-width="8"/>`);
const shield: Part = (x, y, s = 1) => at(x, y, s, `<path d="M0 -115 L92 -80 V5 C92 70 40 100 0 118 C-40 100 -92 70 -92 5 V-80 Z" fill="${TEAL}"/><path d="M-36 0 L-8 28 L40 -28" fill="none" stroke="${WHITE}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`);
const lock: Part = (x, y, s = 1) => at(x, y, s, `<path d="M-42 -20 V-52 C-42 -105 42 -105 42 -52 V-20" fill="none" stroke="${NAVY}" stroke-width="18"/><rect x="-68" y="-22" width="136" height="110" rx="16" fill="${GOLD}"/><circle cy="24" r="14" fill="${NAVY}"/><rect x="-6" y="24" width="12" height="32" rx="5" fill="${NAVY}"/>`);
const key: Part = (x, y, s = 1) => at(x, y, s, `<circle cx="-60" r="42" fill="none" stroke="${GOLD}" stroke-width="20"/><path d="M-18 0 H95 M62 0 V34 M92 0 V26" stroke="${GOLD}" stroke-width="20" stroke-linecap="round" fill="none"/>`);
const warning: Part = (x, y, s = 1) => at(x, y, s, `<path d="M0 -92 L102 78 H-102 Z" fill="${RED}" stroke="${RED}" stroke-width="16" stroke-linejoin="round"/><rect x="-9" y="-36" width="18" height="66" rx="8" fill="${WHITE}"/><circle cy="54" r="11" fill="${WHITE}"/>`);
const bubble: Part = (x, y, s = 1) => at(x, y, s, `<path d="M-100 -70 H100 A18 18 0 0 1 118 -52 V38 A18 18 0 0 1 100 56 H-30 L-70 92 V56 H-100 A18 18 0 0 1 -118 38 V-52 A18 18 0 0 1 -100 -70 Z" fill="${WHITE}" stroke="${TEAL}" stroke-width="8"/><rect x="-82" y="-34" width="164" height="14" rx="7" fill="${TEAL}"/><rect x="-82" y="2" width="110" height="14" rx="7" fill="${GREY}"/>`);
const card: Part = (x, y, s = 1) => at(x, y, s, `<rect x="-115" y="-72" width="230" height="144" rx="16" fill="${NAVY}"/><rect x="-115" y="-38" width="230" height="30" fill="${GOLD}"/><rect x="-92" y="24" width="84" height="14" rx="7" fill="${WHITE}"/>`);
const globe: Part = (x, y, s = 1) => at(x, y, s, `<circle r="98" fill="#BFE3F7" stroke="${NAVY}" stroke-width="8"/><path d="M-92 -30 H92 M-92 30 H92 M0 -98 C-52 -40 -52 40 0 98 M0 -98 C52 -40 52 40 0 98" fill="none" stroke="${NAVY}" stroke-width="7"/>`);
const person: Part = (x, y, s = 1) => at(x, y, s, `<circle cy="-58" r="44" fill="${TEAL}"/><path d="M-82 86 C-82 -8 82 -8 82 86 Z" fill="${TEAL}"/>`);
const doc: Part = (x, y, s = 1) => at(x, y, s, `<path d="M-72 -100 H36 L72 -64 V100 H-72 Z" fill="${WHITE}" stroke="${NAVY}" stroke-width="8"/><path d="M-44 -38 H44 M-44 -6 H44 M-44 26 H20" stroke="${GREY}" stroke-width="10" stroke-linecap="round"/>`);
const glass: Part = (x, y, s = 1) => at(x, y, s, `<circle cx="-20" cy="-20" r="62" fill="#E3F1F0" stroke="${NAVY}" stroke-width="16"/><path d="M26 26 L92 92" stroke="${NAVY}" stroke-width="22" stroke-linecap="round"/>`);
const coin: Part = (x, y, s = 1) => at(x, y, s, `<circle r="58" fill="${GOLD}" stroke="#A67C00" stroke-width="7"/><path d="M26 -24 C-6 -44 -28 -18 -28 0 C-28 22 -6 42 26 24 M-42 -11 H14 M-42 11 H10" fill="none" stroke="#6E5200" stroke-width="9" stroke-linecap="round"/>`);
const clock: Part = (x, y, s = 1) => at(x, y, s, `<circle r="84" fill="${WHITE}" stroke="${NAVY}" stroke-width="10"/><path d="M0 -50 V0 L34 22" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round"/>`);
const heart: Part = (x, y, s = 1) => at(x, y, s, `<path d="M0 80 C-110 5 -82 -72 -30 -72 C-10 -72 0 -56 0 -48 C0 -56 10 -72 30 -72 C82 -72 110 5 0 80 Z" fill="${RED}"/>`);
const mic: Part = (x, y, s = 1) => at(x, y, s, `<rect x="-34" y="-100" width="68" height="124" rx="34" fill="${TEAL}"/><path d="M-62 -10 C-62 62 62 62 62 -10 M0 50 V94 M-36 94 H36" fill="none" stroke="${NAVY}" stroke-width="11" stroke-linecap="round"/>`);
const robot: Part = (x, y, s = 1) => at(x, y, s, `<rect x="-78" y="-62" width="156" height="118" rx="28" fill="${NAVY}"/><circle cx="-30" cy="-8" r="15" fill="#BFE3F7"/><circle cx="30" cy="-8" r="15" fill="#BFE3F7"/><path d="M-26 30 Q0 44 26 30" fill="none" stroke="#BFE3F7" stroke-width="7" stroke-linecap="round"/><path d="M0 -62 V-94" stroke="${NAVY}" stroke-width="9"/><circle cy="-100" r="11" fill="${GOLD}"/>`);
const camera: Part = (x, y, s = 1) => at(x, y, s, `<rect x="-112" y="-62" width="150" height="124" rx="18" fill="${TEAL}"/><path d="M50 -24 L112 -58 V58 L50 24 Z" fill="${NAVY}"/>`);
const picture: Part = (x, y, s = 1) => at(x, y, s, `<rect x="-112" y="-80" width="224" height="160" rx="10" fill="${WHITE}" stroke="${NAVY}" stroke-width="8"/><circle cx="-54" cy="-30" r="20" fill="${GOLD}"/><path d="M-100 68 L-24 -6 L24 40 L54 12 L100 68 Z" fill="${TEAL}"/>`);
const cart: Part = (x, y, s = 1) => at(x, y, s, `<path d="M-112 -72 H-78 L-46 40 H72 L100 -40 H-68" fill="none" stroke="${NAVY}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><circle cx="-30" cy="70" r="16" fill="${TEAL}"/><circle cx="58" cy="70" r="16" fill="${TEAL}"/>`);
const receiver: Part = (x, y, s = 1) => at(x, y, s, `<path d="M-74 -86 L-34 -90 L-12 -36 L-40 -14 C-30 16 -8 38 24 50 L46 22 L98 44 L92 86 C30 110 -90 20 -74 -86 Z" fill="${TEAL}"/>`);
const qr: Part = (x, y, s = 1) => {
  const cell = (cx: number, cy: number, w = 24) => `<rect x="${cx}" y="${cy}" width="${w}" height="${w}" fill="${NAVY}"/>`;
  return at(x, y, s, `<rect x="-92" y="-92" width="184" height="184" rx="8" fill="${WHITE}" stroke="${NAVY}" stroke-width="6"/>${[[-78, -78], [30, -78], [-78, 30]].map(([a, b]) => `<rect x="${a}" y="${b}" width="48" height="48" fill="none" stroke="${NAVY}" stroke-width="10"/>`).join('')}${cell(-14, -14)}${cell(26, -2)}${cell(-14, 34)}${cell(44, 40)}${cell(16, 60)}`);
};
const wifi: Part = (x, y, s = 1) => at(x, y, s, `<path d="M-108 -30 C-46 -86 46 -86 108 -30 M-70 12 C-30 -22 30 -22 70 12 M-32 52 C-14 38 14 38 32 52" fill="none" stroke="${NAVY}" stroke-width="16" stroke-linecap="round"/><circle cy="84" r="15" fill="${TEAL}"/>`);
const arrows: Part = (x, y, s = 1) => at(x, y, s, `<path d="M-70 -24 A74 74 0 0 1 62 -44 M70 24 A74 74 0 0 1 -62 44" fill="none" stroke="${TEAL}" stroke-width="16" stroke-linecap="round"/><path d="M38 -66 L72 -30 L92 -76 Z M-38 66 L-72 30 L-92 76 Z" fill="${TEAL}"/>`);
const calendar: Part = (x, y, s = 1) => at(x, y, s, `<rect x="-88" y="-78" width="176" height="164" rx="14" fill="${WHITE}" stroke="${NAVY}" stroke-width="8"/><rect x="-88" y="-78" width="176" height="42" rx="12" fill="${TEAL}"/>${[-48, 0, 48].flatMap((a) => [-6, 44].map((b) => `<rect x="${a - 14}" y="${b - 14}" width="28" height="28" rx="5" fill="${GREY}"/>`)).join('')}`);
const paperclip: Part = (x, y, s = 1) => at(x, y, s, `<path d="M42 -48 V38 C42 88 -42 88 -42 38 V-58 C-42 -96 14 -96 14 -58 V26 C14 44 -14 44 -14 26 V-44" fill="none" stroke="${NAVY}" stroke-width="13" stroke-linecap="round"/>`);
const stethoscope: Part = (x, y, s = 1) => at(x, y, s, `<path d="M-56 -92 V-20 C-56 34 40 34 40 -20 V-92 M-8 22 V60 C-8 104 74 104 74 56" fill="none" stroke="${NAVY}" stroke-width="13" stroke-linecap="round"/><circle cx="74" cy="42" r="22" fill="${TEAL}"/>`);
const flag: Part = (x, y, s = 1) => at(x, y, s, `<path d="M-60 -100 V104" stroke="${NAVY}" stroke-width="13" stroke-linecap="round"/><path d="M-54 -94 C-14 -116 22 -68 80 -92 V8 C22 32 -14 -16 -54 6 Z" fill="${RED}"/>`);

const scene = (bg: string, parts: string, accent = '#FFFFFF') =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 670"><rect width="1200" height="670" fill="${bg}"/><circle cx="1060" cy="110" r="130" fill="${accent}" opacity=".55"/><circle cx="110" cy="590" r="170" fill="${accent}" opacity=".55"/>${parts}</svg>`)}`;

const BLUE = '#EAF2F8';
const MINT = '#E3F1F0';
const SAND = '#F6EFD9';
const ROSE = '#FDECEA';

const ART: Record<string, string> = {
  // Digital Safety
  'phishing-erkennen': scene(BLUE, envelope(520, 330, 1.5) + glass(830, 410, 1.2)),
  'safety-phishing-examples': scene(ROSE, envelope(380, 240, .9) + envelope(600, 390, 1.15) + warning(880, 250, .95)),
  'safety-sms-scams': scene(MINT, phone(440, 335, 1.75) + warning(760, 240, 1) + bubble(800, 470, .8)),
  'safety-phone-scams': scene(ROSE, receiver(460, 340, 2) + warning(790, 300, 1.2)),
  'safety-popups': scene(SAND, picture(560, 340, 1.8) + warning(560, 330, 1.2)),
  'safety-qr': scene(BLUE, qr(480, 335, 1.8) + phone(860, 340, 1.5)),
  'safety-2fa': scene(MINT, lock(420, 340, 1.8) + phone(790, 335, 1.75) + key(790, 330, .55)),
  'safety-updates': scene(BLUE, phone(500, 335, 1.75) + arrows(500, 330, .75) + shield(860, 330, 1.1)),
  'safety-wifi': scene(SAND, wifi(500, 300, 1.8) + lock(860, 360, 1.2)),
  'safety-lost-phone': scene(ROSE, phone(450, 335, 1.75) + glass(740, 350, 1.5)),
  'safety-what-if': scene(MINT, heart(460, 340, 1.8) + person(780, 350, 1.5)),
  'passwoerter-erstellen': scene(SAND, key(460, 340, 2) + lock(840, 350, 1.4)),
  'fake-shops-entlarven': scene(ROSE, cart(500, 340, 2) + warning(880, 260, 1)),
  'e-mail-anhaenge-pruefen': scene(BLUE, paperclip(520, 340, 2.4) + doc(790, 340, 1.5)),
  // Messaging
  'whatsapp-nachrichten': scene(MINT, bubble(460, 280, 1.5) + mic(860, 360, 1.5)),
  'videotelefonie-familie': scene(BLUE, camera(540, 340, 1.9) + person(880, 360, 1)),
  // Email
  'email-reply-practice': scene(BLUE, envelope(480, 340, 1.6) + arrows(860, 340, 1.1)),
  'email-write-well': scene(SAND, doc(450, 335, 1.9) + envelope(800, 350, 1.1)),
  'email-cc-bcc': scene(MINT, envelope(600, 240, .9) + person(370, 450, .95) + person(600, 480, .95) + person(830, 450, .95)),
  'email-away-message': scene(BLUE, calendar(470, 340, 1.8) + envelope(830, 350, 1)),
  // Banking
  'online-banking-grundlagen': scene(BLUE, phone(470, 335, 1.75) + coin(470, 320, 1) + shield(830, 340, 1.2)),
  'banking-transfer-practice': scene(MINT, card(440, 340, 1.5) + arrows(800, 240, .8) + coin(830, 450, 1.3)),
  'banking-balance-practice': scene(SAND, phone(430, 335, 1.75) + coin(720, 290, 1) + coin(860, 400, 1.3)),
  'banking-abroad-guide': scene(BLUE, globe(480, 340, 2) + coin(830, 350, 1.7)),
  'banking-direct-debit': scene(SAND, calendar(450, 340, 1.8) + coin(800, 360, 1.7)),
  'banking-scam-calls': scene(ROSE, receiver(430, 340, 1.8) + card(800, 290, 1) + warning(860, 480, .75)),
  // Social media
  'social-privacy': scene(BLUE, person(470, 350, 1.9) + lock(820, 350, 1.3)),
  'social-fake-news': scene(ROSE, doc(460, 335, 1.8) + flag(810, 340, 1.5)),
  'social-before-posting': scene(MINT, picture(480, 330, 1.7) + glass(860, 380, 1.15)),
  'social-strangers': scene(SAND, person(420, 350, 1.5) + bubble(790, 290, 1.15) + warning(960, 500, .65)),
  // Everyday AI
  'ki-chatgpt-alltag': scene(BLUE, bubble(470, 290, 1.4) + robot(850, 370, 1.4)),
  'ai-first-question': scene(MINT, person(400, 350, 1.4) + bubble(740, 260, 1.1) + robot(910, 450, .9)),
  'ai-what-is-it': scene(SAND, robot(600, 350, 2.2)),
  'ai-good-questions': scene(MINT, glass(440, 340, 1.8) + bubble(800, 300, 1.25)),
  'ai-voice-assistants': scene(BLUE, mic(460, 340, 2) + wifi(830, 340, 1.1)),
  'ai-fakes': scene(ROSE, person(450, 340, 1.8) + flag(800, 350, 1.5)),
  'ai-privacy': scene(MINT, robot(440, 340, 1.6) + lock(820, 340, 1.5)),
  'ai-spot-pictures': scene(SAND, picture(490, 340, 1.8) + glass(870, 420, 1)),
  'ai-real-or-ai': scene(BLUE, picture(370, 330, 1.2) + robot(830, 330, 1.45) + arrows(600, 340, .55)),
  'ai-translate': scene(MINT, bubble(420, 270, 1.15) + bubble(760, 420, 1.15) + globe(960, 180, .55)),
  'ai-letters': scene(SAND, doc(440, 335, 1.9) + robot(810, 370, 1.3)),
  'ai-health': scene(ROSE, stethoscope(460, 340, 1.8) + heart(810, 340, 1.5)),
};

/** Sets the picture of each guide that has no app logo of its own. */
export function applyGuideArt(tutorials: Tutorial[]): void {
  tutorials.forEach((tutorial) => {
    const art = ART[tutorial.id];
    if (art) tutorial.image = art;
  });
}
