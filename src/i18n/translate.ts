/**
 * Turkish, Spanish and Croatian.
 *
 * The site's texts are written in English and German (the `isEn ? … : …` pairs
 * and `t(en, de)` helpers). For the other languages the site renders its English
 * version, and this module replaces every English text on the page with the
 * translation from a dictionary file (`tr.json`, `es.json`, `hr.json`), while
 * the page runs. Read aloud uses the same dictionary.
 *
 * Dictionary keys are English texts. A key may contain {0}, {1}, … for parts that
 * change, e.g. "Tap \"{0}\"." Longer texts that are put together from several
 * sentences are translated sentence by sentence. Text without a translation stays
 * in English. Elements with translate="no" are left alone.
 *
 * To add a text: put the English text and its translation into all three files.
 * `npm run i18n:check` lists English texts that have no translation yet.
 */

export type ExtraLanguage = 'tr' | 'es' | 'hr';
export type UiLanguage = 'en' | 'de' | ExtraLanguage;

export const UI_LANGUAGES: { id: UiLanguage; name: string; speech: string }[] = [
  { id: 'en', name: 'English', speech: 'en-US' },
  { id: 'de', name: 'Deutsch', speech: 'de-DE' },
  { id: 'tr', name: 'Türkçe', speech: 'tr-TR' },
  { id: 'es', name: 'Español', speech: 'es-ES' },
  { id: 'hr', name: 'Hrvatski', speech: 'hr-HR' },
];

export const isExtraLanguage = (lang: string): lang is ExtraLanguage => lang === 'tr' || lang === 'es' || lang === 'hr';

type Dictionary = Record<string, string>;

const loaders: Record<ExtraLanguage, () => Promise<{ default: Dictionary }>> = {
  tr: () => import('./tr.json'),
  es: () => import('./es.json'),
  hr: () => import('./hr.json'),
};

let active: ExtraLanguage | null = null;
let exact = new Map<string, string>();
let patterns: { regex: RegExp; order: number[]; target: string }[] = [];
const cache = new Map<string, string>();

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Same text whatever the quotes and spaces: "…", „…“ and ‘…’ count as the same. */
const normalize = (s: string) => s.replace(/[“”„"]/g, '"').replace(/[‘’‚]/g, "'").replace(/\s+/g, ' ').trim();

function load(dictionary: Dictionary) {
  exact = new Map();
  patterns = [];
  cache.clear();
  for (const [key, value] of Object.entries(dictionary)) {
    if (!value) continue;
    const k = normalize(key);
    if (!/\{\d\}/.test(k)) {
      exact.set(k, value);
      continue;
    }
    const order: number[] = [];
    const source = k.split(/(\{\d\})/).map((part) => {
      const m = /^\{(\d)\}$/.exec(part);
      if (m) {
        order.push(Number(m[1]));
        return '(.+?)';
      }
      return escapeRegex(part);
    }).join('');
    patterns.push({ regex: new RegExp(`^${source}$`), order, target: value });
  }
  // Longer patterns first: they are more specific.
  patterns.sort((a, b) => b.regex.source.length - a.regex.source.length);
}

function translateWhole(text: string, depth: number): string | undefined {
  const hit = exact.get(text);
  if (hit !== undefined) return hit;
  // A title read aloud gets a full stop ("Open the chat."); the dictionary has it without one, or the other way round.
  const end = /[.:!?]$/.exec(text)?.[0];
  if (end) {
    const bare = exact.get(text.slice(0, -1));
    if (bare !== undefined) return /[.:!?…]$/.test(bare) ? bare : bare + end;
  } else {
    const withStop = exact.get(text + '.');
    if (withStop !== undefined) return withStop.replace(/[.]$/, '');
  }
  if (depth > 2) return undefined;
  for (const p of patterns) {
    const m = p.regex.exec(text);
    if (!m) continue;
    let out = p.target;
    p.order.forEach((n, i) => {
      const part = m[i + 1];
      out = out.split(`{${n}}`).join(translateWhole(part, depth + 1) ?? part);
    });
    return out;
  }
  return undefined;
}

/** Sentence ends: . ! ? : followed by a space. Quotes stay with their sentence. */
const SENTENCE = /(?<=[.!?:…])\s+(?=["„“(A-Z0-9])/;

/** Translates one English text. Unknown text comes back unchanged. */
export function translateText(text: string): string {
  if (!active) return text;
  const lead = /^\s*/.exec(text)![0];
  const trail = /\s*$/.exec(text)![0];
  const core = normalize(text);
  if (!core || !/[A-Za-z]/.test(core)) return text;
  const cached = cache.get(core);
  if (cached !== undefined) return lead + cached + trail;
  let result = translateWhole(core, 0);
  if (result === undefined) {
    const parts = core.split(SENTENCE);
    if (parts.length > 1) {
      const done = parts.map((p) => translateWhole(p, 0));
      if (done.some((d) => d !== undefined)) result = parts.map((p, i) => done[i] ?? p).join(' ');
    }
  }
  const final = result ?? core;
  cache.set(core, final);
  return result === undefined ? text : lead + final + trail;
}

// ---------------------------------------------------------------------------
// Live page translation
// ---------------------------------------------------------------------------

/** The English text of each translated text node, so it can be restored or translated again. */
const originals = new WeakMap<Node, string>();
const shown = new WeakMap<Node, string>();
const ATTRIBUTES = ['placeholder', 'aria-label', 'title', 'alt', 'aria-description'];
const attributeOriginals = new WeakMap<Element, Record<string, string>>();
let observer: MutationObserver | null = null;

const skip = (el: Element | null) => !!el?.closest('[translate="no"], .notranslate, script, style, textarea, code');

function translateTextNode(node: Text) {
  const current = node.nodeValue ?? '';
  if (shown.get(node) === current) return; // our own change
  if (skip(node.parentElement)) return;
  originals.set(node, current);
  const next = translateText(current);
  shown.set(node, next);
  if (next !== current) node.nodeValue = next;
}

function translateAttributes(el: Element) {
  if (skip(el)) return;
  let saved = attributeOriginals.get(el);
  for (const name of ATTRIBUTES) {
    const value = el.getAttribute(name);
    if (value === null) continue;
    if (saved?.[`shown:${name}`] === value) continue;
    saved = saved ?? {};
    saved[name] = value;
    const next = translateText(value);
    saved[`shown:${name}`] = next;
    if (next !== value) el.setAttribute(name, next);
  }
  if (saved) attributeOriginals.set(el, saved);
}

function translateTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  translateAttributes(root as Element);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node as Text);
    else translateAttributes(node as Element);
    node = walker.nextNode();
  }
}

function restoreTree(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let node: Node | null = root;
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const original = originals.get(node);
      if (original !== undefined && shown.get(node) === node.nodeValue) node.nodeValue = original;
      originals.delete(node);
      shown.delete(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const saved = attributeOriginals.get(el);
      if (saved) {
        for (const name of ATTRIBUTES) if (name in saved && el.getAttribute(name) === saved[`shown:${name}`]) el.setAttribute(name, saved[name]);
        attributeOriginals.delete(el);
      }
    }
    node = walker.nextNode();
  }
}

function start() {
  if (observer) return;
  translateTree(document.body);
  document.title = translateText(document.title);
  observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'characterData') translateTextNode(record.target as Text);
      else if (record.type === 'attributes') translateAttributes(record.target as Element);
      else record.addedNodes.forEach((n) => translateTree(n));
    }
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRIBUTES });
}

function stop() {
  observer?.disconnect();
  observer = null;
  restoreTree(document.body);
}

/**
 * Switches the page language. English and German are rendered by the site itself;
 * the other languages load their dictionary and translate the English page.
 */
export async function setPageLanguage(lang: UiLanguage): Promise<void> {
  document.documentElement.lang = lang;
  if (!isExtraLanguage(lang)) {
    active = null;
    stop();
    return;
  }
  const { default: dictionary } = await loaders[lang]();
  stop();
  load(dictionary);
  active = lang;
  start();
}

/** For checks only: use this dictionary for translateText, without touching the page. */
export function useDictionaryForCheck(dictionary: Dictionary | null): void {
  if (!dictionary) {
    active = null;
    return;
  }
  load(dictionary);
  active = 'tr';
}

export function activeExtraLanguage(): ExtraLanguage | null {
  return active;
}

/** The speech-synthesis language for read aloud. */
export function speechLanguage(fallback: 'en' | 'de'): string {
  return UI_LANGUAGES.find((l) => l.id === (active ?? fallback))!.speech;
}
