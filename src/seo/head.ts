/** Keeps the <head> (title, description, canonical address, language versions) in step with the open page. */
import type { HeadInfo } from './pageMeta';

const OWN = 'data-page-head';

function setMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function applyHead(info: HeadInfo): void {
  document.title = info.title;
  setMeta('name', 'description', info.description);
  setMeta('name', 'robots', info.robots);
  setMeta('property', 'og:title', info.title);
  setMeta('property', 'og:description', info.description);
  setMeta('property', 'og:url', info.canonical);
  document.head.querySelectorAll(`link[${OWN}], link[rel="canonical"], link[rel="alternate"][hreflang]`).forEach((link) => link.remove());
  const add = (attributes: Record<string, string>) => {
    const link = document.createElement('link');
    Object.entries(attributes).forEach(([name, value]) => link.setAttribute(name, value));
    link.setAttribute(OWN, '');
    document.head.appendChild(link);
  };
  add({ rel: 'canonical', href: info.canonical });
  info.alternates.forEach((alternate) => add({ rel: 'alternate', hreflang: alternate.hreflang, href: alternate.href }));
}

/** The same tags as HTML text, for the page files the build writes. */
export function headHtml(info: HeadInfo, extra = ''): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return [
    `<title>${esc(info.title)}</title>`,
    `<meta name="description" content="${esc(info.description)}" />`,
    `<meta name="robots" content="${info.robots}" />`,
    `<link rel="canonical" href="${info.canonical}" ${OWN} />`,
    ...info.alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" ${OWN} />`),
    `<meta property="og:title" content="${esc(info.title)}" />`,
    `<meta property="og:description" content="${esc(info.description)}" />`,
    `<meta property="og:url" content="${info.canonical}" />`,
    extra,
  ].filter(Boolean).join('\n    ');
}
