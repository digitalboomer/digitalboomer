import React, { useEffect, useId, useRef, useState } from 'react';
import { Icon } from './Icon';
import { UI_LANGUAGES, type UiLanguage } from '../i18n/translate';

/**
 * Language menu in the top bar: the button always shows the flag and name of the
 * chosen language; the list shows a flag next to every language name.
 * Flags are drawn here (emoji flags do not show on Windows). Names stay in their
 * own language, so translate="no".
 */
const FLAGS: Record<UiLanguage, React.ReactNode> = {
  // United Kingdom
  en: (
    <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 60 30">
      <clipPath id="flag-uk-clip"><path d="M0 0v30h60V0z" /></clipPath>
      <clipPath id="flag-uk-diag"><path d="M30 15h30v15zv15H0zH0V0zV0h30z" /></clipPath>
      <g clipPath="url(#flag-uk-clip)">
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" clipPath="url(#flag-uk-diag)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  ),
  de: (
    <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 5 3">
      <path d="M0 0h5v3H0z" fill="#000" />
      <path d="M0 1h5v2H0z" fill="#DD0000" />
      <path d="M0 2h5v1H0z" fill="#FFCE00" />
    </svg>
  ),
  tr: (
    <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 30 20">
      <path d="M0 0h30v20H0z" fill="#E30A17" />
      <circle cx="11" cy="10" r="5" fill="#fff" />
      <circle cx="12.25" cy="10" r="4" fill="#E30A17" />
      <path d="M15.6 10l3.9-1.27-2.41 3.32V7.95l2.41 3.32z" fill="#fff" />
    </svg>
  ),
  es: (
    <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 3 2">
      <path d="M0 0h3v2H0z" fill="#AA151B" />
      <path d="M0 .5h3v1H0z" fill="#F1BF00" />
    </svg>
  ),
  hr: (
    <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 30 15">
      <path d="M0 0h30v15H0z" fill="#171796" />
      <path d="M0 0h30v10H0z" fill="#fff" />
      <path d="M0 0h30v5H0z" fill="#FF0000" />
      {/* Simplified red and white chequered shield */}
      <path d="M12.5 3.5h5v5.2a2.5 2.5 0 0 1-5 0z" fill="#fff" stroke="#171796" strokeWidth=".3" />
      {[0, 1, 2, 3, 4].flatMap((r) => [0, 1, 2, 3, 4].filter((c) => (r + c) % 2 === 0).map((c) => (
        <path key={`${r}-${c}`} d={`M${12.5 + c} ${3.5 + r * 1.1}h1v1.1h-1z`} fill="#FF0000" />
      )))}
    </svg>
  ),
};

const Flag: React.FC<{ lang: UiLanguage }> = ({ lang }) => (
  <span aria-hidden="true" className="inline-flex w-7 h-5 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/25 [&>svg]:w-full [&>svg]:h-full [&>svg]:block">
    {FLAGS[lang]}
  </span>
);

export const LanguagePicker: React.FC<{ value: UiLanguage; onChange: (lang: UiLanguage) => void; label: string }> = ({ value, onChange, label }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = UI_LANGUAGES.find((l) => l.id === value) ?? UI_LANGUAGES[0];

  const openList = () => {
    setActive(Math.max(0, UI_LANGUAGES.findIndex((l) => l.id === value)));
    setOpen(true);
  };
  const close = (focusButton = true) => {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  };
  const choose = (lang: UiLanguage) => {
    onChange(lang);
    close();
  };

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // A click anywhere else closes the list.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, UI_LANGUAGES.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(UI_LANGUAGES.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(UI_LANGUAGES[active].id); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') close(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? close() : openList())}
        onKeyDown={(e) => { if (e.key === 'ArrowDown' && !open) { e.preventDefault(); openList(); } }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        className="inline-flex items-center gap-2 px-3 min-h-[44px] rounded-xl text-white text-sm font-bold hover:bg-white/15"
      >
        <span className="sr-only">{label}:</span>
        <Flag lang={current.id} />
        <span lang={current.id} translate="no">{current.name}</span>
        <Icon name="expand_more" className={`text-lg transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${listId}-${UI_LANGUAGES[active].id}`}
          onKeyDown={onListKey}
          className="absolute right-0 top-full mt-1 z-50 min-w-[12rem] py-1 rounded-xl bg-[#FFFFFF] border-2 border-[#17324D] shadow-lg focus:outline-none"
        >
          {UI_LANGUAGES.map((l, i) => {
            const selected = l.id === value;
            return (
              <li
                key={l.id}
                id={`${listId}-${l.id}`}
                role="option"
                aria-selected={selected}
                lang={l.id}
                onClick={() => choose(l.id)}
                onMouseEnter={() => setActive(i)}
                className={`flex items-center gap-3 px-3 min-h-[48px] cursor-pointer text-base text-[#202B36] ${i === active ? 'bg-[#EAF2F8]' : ''} ${selected ? 'font-bold' : ''}`}
              >
                <Flag lang={l.id} />
                <span className="flex-1" translate="no">{l.name}</span>
                {selected && <Icon name="check" className="text-lg text-[#176B68]" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
