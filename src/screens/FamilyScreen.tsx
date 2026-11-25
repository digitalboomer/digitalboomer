import React, { useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { linkTo, useLanguage } from '../utils/router';
import { TUTORIALS_DE, TUTORIALS_EN } from '../data/content';
import { buildSearchIndex, searchLessons } from '../utils/search';
import { isExtraLanguage, translateText, UI_LANGUAGES, type UiLanguage } from '../i18n/translate';
import { FAMILY_STARTERS, MAX_FAMILY_LESSONS, familyLinkUrl, familySubject, familyText } from '../utils/familyLink';
import { emailLinks, emailProgramHint } from '../utils/contact';
import type { Language, PageId, Tutorial } from '../types';

const card = 'bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 p-5 sm:p-6';
const stepTitle = 'text-2xl font-bold text-[#17324D] dark:text-white flex items-center gap-3';
const stepNumber = 'w-10 h-10 shrink-0 rounded-full bg-[#17324D] text-white font-bold flex items-center justify-center';
const outline = 'inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl border-2 border-[#17324D] dark:border-white text-[#17324D] dark:text-white font-bold text-base hover:bg-[#EAF2F8] dark:hover:bg-slate-800 active:bg-[#E5E9ED]';

/** "For families": pick lessons for a parent or grandparent and send them a link. */
export const FamilyScreen: React.FC<{ lang: Language; onNavigate: (page: PageId) => void }> = ({ lang, onNavigate }) => {
  const isEn = lang === 'en';
  const uiLang = useLanguage();
  const lessons = isEn ? TUTORIALS_EN : TUTORIALS_DE;
  const byId = (id: string) => lessons.find((t) => t.id === id);
  const [picked, setPicked] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [theirLang, setTheirLang] = useState<UiLanguage>(uiLang);
  const [find, setFind] = useState('');
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [ownText, setOwnText] = useState<string | null>(null); // null = the suggested text

  const index = useMemo(() => buildSearchIndex(lessons, isExtraLanguage(uiLang) ? translateText : undefined), [isEn, uiLang]); // `lessons` follows from these
  const found = useMemo(() => (find.trim() ? searchLessons(index, find).results.slice(0, 6) : []), [index, find]);

  const full = picked.length >= MAX_FAMILY_LESSONS;
  const toggle = (id: string) => {
    setQr(null);
    setCopied(false);
    setPicked((now) => (now.includes(id) ? now.filter((x) => x !== id) : now.length >= MAX_FAMILY_LESSONS ? now : [...now, id]));
  };

  const url = picked.length ? familyLinkUrl(picked, name, theirLang) : '';
  // The text can be changed; the link is kept apart and always added at the end, so it stays correct.
  const suggested = familyText(theirLang, name);
  const text = ownText ?? suggested;
  const message = picked.length ? `${text.trim()} ${url}`.trim() : '';
  const q = encodeURIComponent;
  const mail = emailLinks('', familySubject(theirLang), message);
  const programHint = emailProgramHint(isEn);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  const showQr = async () => {
    const QRCode = (await import('qrcode')).default;
    setQr(await QRCode.toDataURL(url, { width: 320, margin: 2, color: { dark: '#17324D', light: '#FFFFFF' } }));
  };

  const pickButton = (tutorial: Tutorial) => {
    const on = picked.includes(tutorial.id);
    return (
      <button
        key={tutorial.id}
        type="button"
        onClick={() => toggle(tutorial.id)}
        aria-pressed={on}
        disabled={!on && full}
        className={`w-full text-left flex items-center gap-3 px-4 py-2 min-h-[56px] rounded-xl border-2 font-bold text-base ${on ? 'bg-[#E3F1F0] dark:bg-slate-800 border-[#176B68] text-[#17324D] dark:text-white' : 'bg-[#FFFFFF] dark:bg-slate-900 border-[#667382] text-[#17324D] dark:text-white hover:bg-[#EAF2F8] dark:hover:bg-slate-800'} disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        <span aria-hidden="true" className={`w-7 h-7 shrink-0 rounded-md border-2 flex items-center justify-center ${on ? 'bg-[#176B68] border-[#176B68] text-white' : 'border-[#667382]'}`}>
          {on && <Icon name="check" className="text-lg" />}
        </span>
        <span className="flex-1 min-w-0">{tutorial.title}</span>
        <span className="text-sm font-normal shrink-0">{on ? (isEn ? 'Chosen' : 'Ausgewählt') : `${tutorial.durationMinutes} ${isEn ? 'min' : 'Min.'}`}</span>
      </button>
    );
  };

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <nav aria-label={isEn ? 'Breadcrumb' : 'Brotkrumen-Navigation'} className="flex items-center gap-2 text-base text-[#202B36] dark:text-slate-300 mb-2">
            <a {...linkTo({ page: 'home' }, () => onNavigate('home'))} className="underline text-[#17324D] dark:text-white min-h-[44px] inline-flex items-center">{isEn ? 'Home' : 'Startseite'}</a>
            <span aria-hidden="true">/</span>
            <span className="font-bold text-[#17324D] dark:text-white">{isEn ? 'For families' : 'Für Familien'}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#17324D] dark:text-white">{isEn ? 'For families' : 'Für Familien'}</h1>
          <p className="text-lg text-[#202B36] dark:text-slate-200 mt-2 max-w-2xl">
            {isEn
              ? 'Helping your mother, father or grandparent with their phone? Pick a few lessons and send them a link. They open it and start right away, without an account.'
              : 'Sie helfen Mutter, Vater oder Großeltern mit dem Handy? Wählen Sie ein paar Lektionen aus und schicken Sie ihnen einen Link. Sie öffnen ihn und legen sofort los, ohne Konto.'}
          </p>
        </div>

        {/* 1. Choose lessons */}
        <section aria-labelledby="family-step-1" className={`${card} space-y-5`}>
          <h2 id="family-step-1" className={stepTitle}><span aria-hidden="true" className={stepNumber}>1</span>{isEn ? 'Choose lessons' : 'Lektionen auswählen'}</h2>
          <p className="text-base text-[#202B36] dark:text-slate-300" aria-live="polite">
            {isEn ? `${picked.length} of ${MAX_FAMILY_LESSONS} chosen. Two or three are a good start.` : `${picked.length} von ${MAX_FAMILY_LESSONS} ausgewählt. Zwei oder drei sind ein guter Anfang.`}
          </p>
          {FAMILY_STARTERS.map((group) => (
            <div key={group.title[0]} className="space-y-2">
              <h3 className="text-xl font-bold text-[#17324D] dark:text-white">{isEn ? group.title[0] : group.title[1]}</h3>
              <div className="grid gap-2">{group.ids.map(byId).filter((t): t is Tutorial => !!t).map(pickButton)}</div>
            </div>
          ))}
          <div className="space-y-2">
            <label htmlFor="family-find" className="block text-xl font-bold text-[#17324D] dark:text-white">{isEn ? 'Find more lessons, for other apps too' : 'Weitere Lektionen finden, auch für andere Apps'}</label>
            <div className="relative">
              <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#17324D] text-xl pointer-events-none" />
              <input id="family-find" type="search" value={find} onChange={(e) => setFind(e.target.value)} placeholder={isEn ? 'For example: Signal photo' : 'Zum Beispiel: Signal Foto'} className="w-full pl-11 pr-4 min-h-[48px] rounded-xl border-2 border-[#667382] dark:border-slate-600 bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base placeholder-[#5B6672]" />
            </div>
            {find.trim() && (found.length ? <div className="grid gap-2">{found.map(pickButton)}</div> : <p className="text-base text-[#202B36] dark:text-slate-300">{isEn ? 'No lesson found. Try another word.' : 'Keine Lektion gefunden. Versuchen Sie ein anderes Wort.'}</p>)}
          </div>
        </section>

        {/* 2. Who is it for */}
        <section aria-labelledby="family-step-2" className={`${card} space-y-4`}>
          <h2 id="family-step-2" className={stepTitle}><span aria-hidden="true" className={stepNumber}>2</span>{isEn ? 'Who is it for?' : 'Für wen ist es?'}</h2>
          <div>
            <label htmlFor="family-name" className="block text-lg font-bold text-[#17324D] dark:text-white">{isEn ? 'First name (optional)' : 'Vorname (freiwillig)'}</label>
            <p className="text-base text-[#202B36] dark:text-slate-300">{isEn ? 'Used only for the greeting. It becomes part of the link.' : 'Nur für die Begrüßung. Er wird Teil des Links.'}</p>
            <input id="family-name" type="text" value={name} maxLength={30} autoComplete="off" onChange={(e) => { setName(e.target.value); setQr(null); setCopied(false); }} placeholder={isEn ? 'For example: Karl' : 'Zum Beispiel: Karl'} className="mt-2 w-full sm:w-80 px-4 min-h-[48px] rounded-xl border-2 border-[#667382] dark:border-slate-600 bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base placeholder-[#5B6672]" />
          </div>
          <div>
            <label htmlFor="family-lang" className="block text-lg font-bold text-[#17324D] dark:text-white">{isEn ? 'Which language do they read?' : 'In welcher Sprache lesen sie?'}</label>
            <select id="family-lang" value={theirLang} onChange={(e) => { setTheirLang(e.target.value as UiLanguage); setQr(null); setCopied(false); }} className="mt-2 w-full sm:w-80 px-4 min-h-[48px] rounded-xl border-2 border-[#667382] dark:border-slate-600 bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base">
              {UI_LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
        </section>

        {/* 3. Send it */}
        <section aria-labelledby="family-step-3" className={`${card} space-y-4`}>
          <h2 id="family-step-3" className={stepTitle}><span aria-hidden="true" className={stepNumber}>3</span>{isEn ? 'Send the link' : 'Link senden'}</h2>
          {picked.length === 0 ? (
            <p className="text-base text-[#202B36] dark:text-slate-300 flex items-start gap-2"><Icon name="info" className="text-xl shrink-0" />{isEn ? 'First choose at least one lesson above.' : 'Wählen Sie oben zuerst mindestens eine Lektion aus.'}</p>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="family-text" className="block text-lg font-bold text-[#17324D] dark:text-white">{isEn ? 'Your message' : 'Ihre Nachricht'}</label>
                <p id="family-text-hint" className="text-base text-[#202B36] dark:text-slate-300">
                  {isEn ? 'You can change the text. The link to the lessons is always added at the end.' : 'Sie können den Text ändern. Der Link zu den Lektionen wird immer am Ende angefügt.'}
                </p>
                <textarea
                  id="family-text"
                  translate="no"
                  rows={4}
                  maxLength={600}
                  value={text}
                  aria-describedby="family-text-hint"
                  onChange={(e) => { setOwnText(e.target.value); setCopied(false); }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#667382] dark:border-slate-600 bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base"
                />
                <p className="text-base text-[#202B36] dark:text-slate-300 break-words">
                  <span className="font-bold">{isEn ? 'Link at the end:' : 'Link am Ende:'}</span> <span translate="no">{url}</span>
                </p>
                {ownText !== null && ownText !== suggested && (
                  <button type="button" onClick={() => { setOwnText(null); setCopied(false); }} className={outline}>
                    <Icon name="restart_alt" className="text-xl" />{isEn ? 'Use the suggested text again' : 'Wieder den vorgeschlagenen Text nehmen'}
                  </button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                <a href={`https://wa.me/?text=${q(message)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl bg-[#17324D] hover:bg-[#0F2438] active:bg-[#0A1A2A] text-white font-bold text-base">
                  <Icon name="send" className="text-xl" />{isEn ? 'Send with WhatsApp' : 'Mit WhatsApp senden'}<span className="sr-only">{isEn ? '(opens in a new tab)' : '(öffnet in einem neuen Tab)'}</span>
                </a>
                {/* A plain mailto link does nothing without an email program, so people choose where they write emails. */}
                <button type="button" onClick={() => setEmailOpen((open) => !open)} aria-expanded={emailOpen} aria-controls="family-email" className={outline}>
                  <Icon name="mail" className="text-xl" />{isEn ? 'Send by email' : 'Per E-Mail senden'}
                  <Icon name="expand_more" className={`text-xl transition-transform motion-reduce:transition-none ${emailOpen ? 'rotate-180' : ''}`} />
                </button>
                <button type="button" onClick={copy} className={outline}>
                  <Icon name={copied ? 'check' : 'content_copy'} className="text-xl" />{copied ? (isEn ? 'Copied' : 'Kopiert') : (isEn ? 'Copy message' : 'Nachricht kopieren')}
                </button>
                <button type="button" onClick={showQr} className={outline}>
                  <Icon name="qr_code_2" className="text-xl" />{isEn ? 'Show QR code' : 'QR-Code zeigen'}
                </button>
              </div>
              {emailOpen && (
                <div id="family-email" className="p-4 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 space-y-3">
                  <p className="text-lg font-bold text-[#17324D] dark:text-white">{isEn ? 'Where do you write your emails?' : 'Wo schreiben Sie Ihre E-Mails?'}</p>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                    <a href={mail.gmail} target="_blank" rel="noopener noreferrer" className={`${outline} bg-[#FFFFFF] dark:bg-slate-900`}>
                      <Icon name="mail" className="text-xl" />Gmail<span className="sr-only">{isEn ? '(opens in a new tab)' : '(öffnet in einem neuen Tab)'}</span><Icon name="open_in_new" className="text-lg" />
                    </a>
                    <a href={mail.outlook} target="_blank" rel="noopener noreferrer" className={`${outline} bg-[#FFFFFF] dark:bg-slate-900`}>
                      <Icon name="mail" className="text-xl" />Outlook / Hotmail<span className="sr-only">{isEn ? '(opens in a new tab)' : '(öffnet in einem neuen Tab)'}</span><Icon name="open_in_new" className="text-lg" />
                    </a>
                    <a href={mail.program} className={`${outline} bg-[#FFFFFF] dark:bg-slate-900`}>
                      <Icon name="mail" className="text-xl" />{isEn ? 'Email program on this device' : 'E-Mail-Programm auf diesem Gerät'}
                    </a>
                  </div>
                  <p className="text-base text-[#202B36] dark:text-slate-300">
                    {isEn
                      ? 'Gmail and Outlook open in a new tab with the message already filled in. You only add the address. With another email service, press "Copy message" and paste it into a new email.'
                      : 'Gmail und Outlook öffnen sich in einem neuen Tab, mit der Nachricht schon ausgefüllt. Sie tragen nur noch die Adresse ein. Bei einem anderen E-Mail-Dienst drücken Sie „Nachricht kopieren“ und fügen sie in eine neue E-Mail ein.'}
                  </p>
                  <p className="text-base text-[#202B36] dark:text-slate-300">{programHint}</p>
                </div>
              )}
              <p className="sr-only" aria-live="polite">{copied ? (isEn ? 'The message was copied.' : 'Die Nachricht wurde kopiert.') : ''}</p>
              {qr && (
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <img src={qr} width={240} height={240} alt={isEn ? 'QR code with the link to the chosen lessons' : 'QR-Code mit dem Link zu den ausgewählten Lektionen'} className="rounded-xl border-2 border-[#E5E9ED]" />
                  <p className="text-base text-[#202B36] dark:text-slate-300 max-w-sm">{isEn ? 'Sitting together? They scan this with their phone camera, and the lessons open right away.' : 'Sie sitzen zusammen? Dann scannen sie das mit der Handykamera, und die Lektionen öffnen sich sofort.'}</p>
                </div>
              )}
            </>
          )}
          <p className="text-base text-[#202B36] dark:text-slate-300 flex items-start gap-2">
            <Icon name="lock" className="text-xl shrink-0" />
            {isEn ? 'The link only contains the chosen lessons and the first name. Nothing is stored, and nobody needs an account.' : 'Der Link enthält nur die ausgewählten Lektionen und den Vornamen. Es wird nichts gespeichert, und niemand braucht ein Konto.'}
          </p>
        </section>
      </div>
    </div>
  );
};
