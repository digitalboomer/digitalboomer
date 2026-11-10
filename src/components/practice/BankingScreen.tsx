import React from 'react';
import {
  ArrowRightLeft, Bell, CalendarClock, Car, CheckCircle2, ChevronDown, ChevronRight, ChevronUp, CircleHelp, CreditCard, Eye,
  FileText, Fingerprint, Globe, House, Landmark, LayoutGrid, Lock, Mic, MoreHorizontal, PiggyBank, Pill, Repeat, Search,
  Send, ShieldCheck, ShoppingCart, Smartphone, Sparkles, TriangleAlert, User, Wallet,
} from 'lucide-react';
import { PracticeTap } from './PracticeTap';
import { StatusBar, BackGlyph } from './PhoneParts';
import type { PracticeScreenProps } from './practiceScreens';

/**
 * A neutral practice bank with fictional data. The layouts follow how today's
 * German banking apps are organised (a start page with quick access, the total of
 * all accounts, collapsible "Accounts and cards", recent transactions by date, and a
 * bottom bar), but no real bank's name, logo or colours appear on these screens:
 * a copy of a real bank's app on a website would look like phishing.
 */

const INK = '#1A1C1E';
const MUTED = '#5C6670';
const LINE = '#E3E7EB';
const PLUS = '#1E7B34';
const MINUS = '#B3261E';

const Row: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="flex justify-between gap-3 py-2 border-b text-[0.98rem]" style={{ borderColor: LINE }}>
    <span style={{ color: MUTED }}>{label}</span>
    <span className={`${strong ? 'font-bold' : 'font-semibold'} text-right`} style={{ color: INK }}>{value}</span>
  </div>
);

/** The practice bank's own simple mark (not a real bank's logo). */
const PracticeMark: React.FC<{ brand: string; name: string; text?: string }> = ({ brand, name, text }) => (
  <span className="flex items-center gap-1.5 font-bold text-[0.95rem]" style={{ color: text ?? brand }}>
    <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: brand, color: '#FFFFFF' }}><Landmark size={17} aria-hidden="true" /></span>
    {name}
  </span>
);

export const BankingScreen: React.FC<PracticeScreenProps> = ({ screen, isDone, kind, labels, lang }) => {
  const de = lang === 'de';
  const t = (en: string, deText: string) => (de ? deText : en);
  const brand = labels.brandColor ?? '#14457A';
  const onBrand = labels.brandText ?? '#FFFFFF';
  const layout = labels.layout ?? 'classic';
  // Yellow bank colours are too light for text on white: then text accents are dark.
  const accent = onBrand === '#000000' ? INK : brand;

  // Fictional bookings, grouped by day like in real apps.
  const bookings = [
    { day: t('Today', 'Heute'), id: 'payment-one', name: labels.bookingOne, note: t('Card payment', 'Kartenzahlung'), value: '-48,20 €', Glyph: ShoppingCart, tint: '#E8F1FB' },
    { day: t('Today', 'Heute'), id: 'payment-two', name: labels.bookingTwo, note: t('Card payment', 'Kartenzahlung'), value: '-12,99 €', Glyph: Pill, tint: '#EAF6EC' },
    { day: t('Yesterday', 'Gestern'), id: 'payment-three', name: labels.bookingThree, note: t('Pension insurance', 'Rentenversicherung'), value: '+1.450,00 €', Glyph: Wallet, tint: '#FFF4D6' },
    { day: t('Yesterday', 'Gestern'), id: 'payment-four', name: t('Car insurance', 'Kfz-Versicherung'), note: t('Direct debit', 'Lastschrift'), value: '-31,40 €', Glyph: Car, tint: '#F2ECF8' },
  ];

  // ---- Shared building blocks -------------------------------------------------
  /** Sub-pages: white bar with back arrow, title in the middle, "Not real" on the right. */
  const header = (title: string, back: boolean) => (
    <div className="flex items-center gap-1 px-1 py-1 shrink-0 border-b" style={{ background: '#FFFFFF', color: INK, borderColor: LINE }}>
      {back ? (
        <PracticeTap id="back" label={labels.back} className="flex items-center justify-center rounded-full" style={{ color: accent }}><BackGlyph size={24} /></PracticeTap>
      ) : (
        <span className="w-11 h-11 flex items-center justify-center" style={{ color: accent }}><Landmark size={22} aria-hidden="true" /></span>
      )}
      <h3 className="flex-1 text-center text-[1.05rem] font-bold truncate">{title}</h3>
      <span className="flex items-center gap-1 pr-2 text-[0.75rem] shrink-0 font-semibold" style={{ color: MUTED }}><Lock size={13} aria-hidden="true" />{labels.fictional}</span>
    </div>
  );

  /** Bottom bar. The item whose name is labels.navMore can be tapped (id "more"); a third value makes another item tappable. */
  const nav = (items: ([string, React.ElementType] | [string, React.ElementType, string])[]) => (
    <div className="flex shrink-0 pt-1.5 pb-1 border-t" style={{ background: '#FAFAFA', borderColor: LINE, color: MUTED }}>
      {items.map(([name, Glyph, tapId], i) => name === labels.navMore || tapId ? (
        <PracticeTap key={name} id={tapId ?? 'more'} label={name} pointer={i > items.length / 2 ? 'above-right' : 'above-left'} className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 text-[0.7rem] rounded-lg"><Glyph size={21} aria-hidden="true" />{name}</PracticeTap>
      ) : (
        <span key={name} aria-hidden="true" className="flex-1 min-w-0 flex flex-col items-center gap-0.5 text-[0.7rem] truncate" style={i === 0 ? { color: INK, fontWeight: 700 } : undefined}><Glyph size={21} />{name}</span>
      ))}
    </div>
  );

  const money = (value: string, size = '1rem') => (
    <span className="font-bold whitespace-nowrap" style={{ color: value.startsWith('-') ? MINUS : value.startsWith('+') ? PLUS : INK, fontSize: size }}>{value}</span>
  );

  /** One booking line: round category icon, name, note, amount. */
  const bookingLine = (b: (typeof bookings)[number], tappable: boolean) => {
    const inner = (
      <>
        <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: b.tint, color: INK }}><b.Glyph size={19} aria-hidden="true" /></span>
        <span className="flex-1 min-w-0 text-left">
          <span className="block font-semibold text-[0.98rem] truncate" style={{ color: INK }}>{b.name}</span>
          <span className="block text-[0.8rem] truncate" style={{ color: MUTED }}>{b.note}</span>
        </span>
        {money(b.value)}
      </>
    );
    return tappable ? (
      <PracticeTap key={b.id} id={b.id} label={`${b.name}, ${b.value}`} className="w-full flex items-center gap-3 px-1 rounded-xl">{inner}</PracticeTap>
    ) : (
      <div key={b.id} className="flex items-center gap-3 px-1 py-2" aria-hidden="true">{inner}</div>
    );
  };
  const bookingList = (tappable: boolean, count = bookings.length) => {
    const shown = bookings.slice(0, count);
    return shown.map((b, i) => (
      <React.Fragment key={b.id}>
        {(i === 0 || shown[i - 1].day !== b.day) && <p className="text-[0.8rem] font-bold pt-2 pb-0.5" style={{ color: MUTED }}>{b.day}</p>}
        {bookingLine(b, tappable)}
      </React.Fragment>
    ));
  };

  /** The current account line with its balance (id "account"). */
  const accountLine = (style: 'card' | 'row') => (
    <PracticeTap id="account" label={`${labels.account}, ${labels.balance}`}
      className={`w-full text-left flex items-center gap-3 ${style === 'card' ? 'p-3 rounded-2xl' : 'px-3 py-2 rounded-xl'}`}
      style={style === 'card' ? { background: '#FFFFFF', color: INK, border: `1px solid ${LINE}`, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' } : { color: INK }}>
      <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: '#E8EEF5', color: accent }}><CreditCard size={19} aria-hidden="true" /></span>
      <span className="flex-1 min-w-0">
        <span className="block font-bold text-[1rem]">{labels.account}</span>
        <span className="block text-[0.75rem]" style={{ color: MUTED }}>DE00 •••• •••• 0000 00</span>
      </span>
      {money(labels.balance, '1.05rem')}
      <ChevronRight size={18} aria-hidden="true" style={{ color: MUTED }} />
    </PracticeTap>
  );

  const roundAction = (id: string | null, label: string, Glyph: React.ElementType, highlight = false) => {
    const circle = (
      <span className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: highlight ? '#E8EEF5' : '#F1F2F4', color: accent, border: `1px solid ${LINE}` }}><Glyph size={24} aria-hidden="true" /></span>
    );
    return id ? (
      <PracticeTap key={label} id={id} label={label} className="flex flex-col items-center gap-1 w-[4.6rem] shrink-0 rounded-xl text-[0.75rem] font-semibold text-center leading-tight" style={{ color: INK }}>{circle}{label}</PracticeTap>
    ) : (
      <span key={label} aria-hidden="true" className="flex flex-col items-center gap-1 w-[4.6rem] shrink-0 text-[0.75rem] font-semibold text-center leading-tight" style={{ color: INK }}>{circle}{label}</span>
    );
  };

  const menuRow = (id: string, label: string, Glyph?: React.ElementType, note?: string) => (
    <PracticeTap key={id} id={id} label={note ? `${label}, ${note}` : label} className="flex items-center gap-3 px-2 py-1 rounded-xl text-left text-[1rem] font-semibold w-full border-b" style={{ borderColor: LINE, color: INK }}>
      {Glyph && <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#E8EEF5', color: accent }}><Glyph size={18} aria-hidden="true" /></span>}
      <span className="flex-1 min-w-0">{label}{note && <span className="block text-[0.82rem] font-normal" style={{ color: MUTED }}>{note}</span>}</span>
      <ChevronRight size={18} aria-hidden="true" style={{ color: MUTED }} />
    </PracticeTap>
  );
  const listScreen = (title: string, question: string | undefined, rows: React.ReactNode) => (
    <>
      {header(title, true)}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 flex flex-col gap-1 sim-fade" style={{ background: '#FFFFFF', color: INK }}>
        {question && <p className="font-bold text-[1rem] py-1">{question}</p>}
        {rows}
      </div>
    </>
  );
  const primaryButton = (id: string, label: string) => (
    <PracticeTap id={id} label={label} pointer="above-right" className="w-full rounded-full font-bold text-[1.02rem] px-4" style={{ background: brand, color: onBrand }}>{label}</PracticeTap>
  );
  const secondaryButton = (id: string, label: string) => (
    <PracticeTap id={id} label={label} className="w-full rounded-full font-bold text-[1.02rem] px-4" style={{ border: `2px solid ${brand}`, color: accent, background: '#FFFFFF' }}>{label}</PracticeTap>
  );
  const confirmScreen = (text: string, yesId: string, yesLabel: string) => (
    <>
      {header(labels.checkTitle, true)}
      <div className="flex-1 p-4 flex flex-col gap-3 sim-fade" style={{ background: '#FFFFFF', color: INK }}>
        <p className="flex items-start gap-2 text-[1.02rem] p-3 rounded-xl" style={{ background: '#FDECEA' }}><TriangleAlert size={22} className="shrink-0" style={{ color: MINUS }} aria-hidden="true" />{text}</p>
        <div className="mt-auto flex flex-col gap-2">
          {primaryButton(yesId, yesLabel)}
          {secondaryButton('back', labels.noKeep)}
        </div>
      </div>
    </>
  );
  const checkName = labels.checkName ?? labels.recipient;
  const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  // ---- Screens -----------------------------------------------------------------
  let body: React.ReactNode;
  if (isDone) {
    body = kind === 'balance' ? (
      <>
        {header(labels.statements, false)}
        <div className="flex-1 p-4 sim-fade" style={{ background: '#FFFFFF', color: INK }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#E8F1FB' }}><ShoppingCart size={22} aria-hidden="true" /></span>
            <span className="flex-1"><span className="block text-[1.15rem] font-bold">{labels.bookingOne}</span><span className="block text-[0.85rem]" style={{ color: MUTED }}>{t('Groceries', 'Lebensmittel')}</span></span>
            {money('-48,20 €', '1.2rem')}
          </div>
          <Row label={labels.dateLabel} value={labels.dateValue} />
          <Row label={t('Type', 'Art')} value={labels.bookingPurpose} />
          <Row label={labels.account} value={labels.balance} />
          <p className="mt-3 text-[0.88rem]" style={{ color: MUTED }}>{labels.noRealMoney}</p>
        </div>
      </>
    ) : (
      <>
        {header(labels.bankName, false)}
        <div className="flex-1 p-4 flex flex-col items-center text-center gap-2 sim-fade" style={{ color: INK, background: '#FFFFFF' }}>
          <CheckCircle2 size={64} style={{ color: PLUS }} aria-hidden="true" />
          <h3 className="text-[1.25rem] font-bold">{labels.doneTitle}</h3>
          <div className="w-full text-left">
            {!labels.hideTransferRows && (
              <>
                <Row label={labels.to} value={checkName} />
                <Row label={labels.amountLabel} value={labels.amount} strong />
                {labels.extraOneLabel && <Row label={labels.extraOneLabel} value={labels.extraOneValue} />}
                {labels.extraTwoLabel && <Row label={labels.extraTwoLabel} value={labels.extraTwoValue} />}
                {labels.balanceAfter && <Row label={labels.newBalance} value={labels.balanceAfter} />}
              </>
            )}
            {labels.doneText && <p className="text-[1.02rem] text-center">{labels.doneText}</p>}
          </div>
          <p className="text-[0.88rem]" style={{ color: MUTED }}>{labels.noRealMoney}</p>
        </div>
      </>
    );
  } else if (screen === 'unlock') {
    // Login: practice mark, a password field that only shows dots, fingerprint, and "Unlock".
    body = (
      <div className="flex-1 flex flex-col items-center gap-4 px-5 pt-10 pb-6 text-center sim-fade" style={{ background: '#FFFFFF', color: INK }}>
        <span className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: brand, color: onBrand }}><Landmark size={34} aria-hidden="true" /></span>
        <h3 className="text-[1.3rem] font-bold">{labels.bankName}</h3>
        <p className="text-[0.92rem]" style={{ color: MUTED }}>{labels.unlockNote}</p>
        <div aria-hidden="true" className="w-full flex items-center gap-2 px-3 py-3 rounded-xl text-left" style={{ background: '#F1F2F4', color: MUTED }}>
          <Lock size={18} /><span className="flex-1">{t('Password', 'Passwort')}</span><span className="tracking-[0.3em]">••••••</span>
        </div>
        <span aria-hidden="true" className="flex items-center gap-2 text-[0.9rem]" style={{ color: accent }}><Fingerprint size={28} />{t('or fingerprint', 'oder Fingerabdruck')}</span>
        <div className="w-full mt-auto">
          <PracticeTap id="unlock" label={labels.unlock} pointer="above-right" className="w-full rounded-full font-bold text-[1.05rem]" style={{ background: brand, color: onBrand }}>{labels.unlock}</PracticeTap>
        </div>
      </div>
    );
  } else if (screen === 'overview') {
    if (layout === 'action') {
      // Start page: eye / bank mark / help and bell, search, round quick actions, total, accounts, recent transactions, bottom bar.
      body = (
        <>
          <div className="flex items-center justify-between px-3 py-2 shrink-0" style={{ background: '#F6F6F6', color: INK }}>
            <Eye size={22} aria-hidden="true" />
            <PracticeMark brand={brand} name={labels.bankName} text={accent} />
            <span className="flex items-center gap-3" aria-hidden="true"><CircleHelp size={22} /><Bell size={22} /></span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 flex flex-col gap-3" style={{ background: '#FFFFFF', color: INK }}>
            <div aria-hidden="true" className="flex items-center gap-2 mt-2 px-3 py-2.5 rounded-xl text-[0.95rem]" style={{ background: '#F1F2F4', color: MUTED }}>
              <Search size={18} /><span className="flex-1">{t('What would you like to do?', 'Was möchten Sie tun?')}</span><Mic size={18} />
            </div>
            <div>
              <p className="flex justify-between items-baseline text-[0.92rem] mb-2">
                <span className="font-semibold" style={{ color: MUTED }}>{t('Quick access', 'Schnellzugriffe')}</span>
                <span aria-hidden="true" className="underline font-semibold" style={{ color: accent }}>{t('Show all', 'Alle anzeigen')}</span>
              </p>
              <div className="flex gap-2 overflow-hidden">
                {roundAction('send-money', labels.sendMoney, Send, true)}
                {roundAction(null, t('Search payments', 'Umsätze suchen'), Search)}
                {roundAction(null, t('Standing order', 'Dauerauftrag'), Repeat)}
                {roundAction(null, t('Block card', 'Karte sperren'), ShieldCheck)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[1.05rem]">{t('Total', 'Gesamtsumme')}</span>
              <span className="px-3 py-1 rounded-full font-bold" style={{ background: '#E6F2E8', color: PLUS }}>{labels.balance}</span>
            </div>
            <div className="rounded-2xl" style={{ border: `1px solid ${LINE}` }}>
              <p className="flex items-center gap-2 px-3 pt-2 font-bold text-[1rem]" aria-hidden="true"><ChevronUp size={18} />{t('Accounts and cards', 'Konten und Karten')}</p>
              {accountLine('row')}
            </div>
            <div className="rounded-2xl px-3 pb-1" style={{ background: '#F6F6F6' }}>
              <p className="flex items-center gap-2 pt-2 font-bold text-[1rem]" aria-hidden="true"><ChevronUp size={18} />{t('Latest transactions', 'Letzte Umsätze')}</p>
              {bookingList(false, 3)}
            </div>
          </div>
          {nav([[t('Start', 'Start'), House], [t('Products', 'Produkte'), LayoutGrid], [labels.navMore, Sparkles], [t('Profile', 'Profil'), User]])}
        </>
      );
    } else if (layout === 'neo') {
      // Mobile-only bank: one big balance, round actions, transactions straight below.
      body = (
        <>
          <div className="px-4 pt-3 pb-4 shrink-0" style={{ background: '#FFFFFF', color: INK }}>
            <p className="flex items-center justify-between text-[0.9rem]" style={{ color: MUTED }}>
              <span className="w-9 h-9 rounded-full flex items-center justify-center font-bold" style={{ background: '#F1F2F4', color: INK }}>KB</span>
              <span className="flex items-center gap-3" aria-hidden="true"><Search size={20} /><Bell size={20} /></span>
            </p>
            <p className="mt-4 text-[0.9rem]" style={{ color: MUTED }}>{labels.account}</p>
            <PracticeTap id="account" label={`${labels.account}, ${labels.balance}`} className="text-left text-[2.2rem] font-bold leading-tight rounded-lg">{labels.balance}</PracticeTap>
            <div className="flex gap-2 mt-3">
              <PracticeTap id="transfer" label={labels.transfer} className="flex-1 rounded-full flex items-center justify-center gap-2 font-bold" style={{ background: brand, color: onBrand }}><Send size={18} aria-hidden="true" />{labels.transfer}</PracticeTap>
              <PracticeTap id="statements" label={labels.statements} className="flex-1 rounded-full font-bold" style={{ background: '#F1F2F4', color: INK }}>{labels.statements}</PracticeTap>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-1" style={{ background: '#FFFFFF', color: INK, borderTop: `8px solid #F4F5F6` }}>
            {bookingList(false)}
          </div>
          {nav([[labels.navHome, House], [labels.navMoney, PiggyBank], [labels.navCard, CreditCard], [labels.navMore, MoreHorizontal]])}
        </>
      );
    } else if (layout === 'vr') {
      // Cooperative-bank style: opens straight on the accounts, a coloured top bar, "Expected bookings" and "Menu" at the bottom.
      body = (
        <>
          <div className="flex items-center justify-between px-3 py-2.5 shrink-0" style={{ background: brand, color: onBrand }}>
            <span className="flex items-center gap-2 font-bold"><Landmark size={20} aria-hidden="true" />{labels.bankName}</span>
            <span className="flex items-center gap-3" aria-hidden="true"><Search size={20} /><Bell size={20} /></span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 flex flex-col gap-2" style={{ background: '#F3F5F8', color: INK }}>
            <p className="flex justify-between text-[0.85rem] font-bold pt-1" style={{ color: MUTED }}><span>{t('Accounts', 'Konten')}</span><span>{labels.fictional}</span></p>
            <div className="rounded-2xl" style={{ background: '#FFFFFF', border: `1px solid ${LINE}` }}>
              {accountLine('row')}
              <div aria-hidden="true" className="flex items-center gap-3 px-3 py-2 border-t" style={{ borderColor: LINE }}>
                <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#EAF6EC', color: PLUS }}><PiggyBank size={19} /></span>
                <span className="flex-1 font-bold">{t('Savings account', 'Sparkonto')}</span>{money('3.400,00 €')}
              </div>
            </div>
            <PracticeTap id="transfer" label={labels.transfer} className="w-full rounded-full flex items-center justify-center gap-2 font-bold text-[1rem]" style={{ background: brand, color: onBrand }}><ArrowRightLeft size={19} aria-hidden="true" />{labels.transfer}</PracticeTap>
            <div className="rounded-2xl px-3 pb-1" style={{ background: '#FFFFFF' }}>
              <p className="pt-2 font-bold text-[0.95rem]">{t('Latest transactions', 'Letzte Umsätze')}</p>
              {bookingList(false, 3)}
            </div>
          </div>
          {nav([[t('Overview', 'Übersicht'), House], [t('Expected', 'Erwartet'), CalendarClock], [t('Mailbox', 'Postfach'), FileText], [labels.navMore, MoreHorizontal]])}
        </>
      );
    } else if (layout === 'db') {
      // Big-bank style: a dark block with the total, a white account box on top of it, round actions, transactions.
      body = (
        <>
          <div className="px-4 pt-3 pb-10 shrink-0" style={{ background: brand, color: onBrand }}>
            <p className="flex items-center justify-between text-[0.85rem]">
              <span className="flex items-center gap-2 font-bold"><Landmark size={18} aria-hidden="true" />{labels.bankName}</span>
              <span className="flex items-center gap-3" aria-hidden="true"><Eye size={19} /><Bell size={19} /></span>
            </p>
            <p className="mt-3 text-[0.85rem] opacity-90">{t('Total assets', 'Gesamtvermögen')}</p>
            <p className="text-[1.9rem] font-bold leading-tight">{labels.balance}</p>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-2 flex flex-col gap-3" style={{ background: '#F4F5F7', color: INK }}>
            <div className="-mt-8 rounded-2xl" style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
              {accountLine('row')}
              <div className="flex justify-around px-2 pb-2 pt-1 border-t" style={{ borderColor: LINE }}>
                {roundAction('transfer', labels.transfer, ArrowRightLeft, true)}
                {roundAction('statements', labels.statements, FileText)}
                {roundAction(null, t('Cards', 'Karten'), CreditCard)}
              </div>
            </div>
            <div className="rounded-2xl px-3 pb-1" style={{ background: '#FFFFFF' }}>{bookingList(false, 3)}</div>
          </div>
          {nav([[t('Overview', 'Übersicht'), House], [t('Payments', 'Zahlungen'), ArrowRightLeft], [t('Products', 'Produkte'), LayoutGrid], [labels.navMore, MoreHorizontal]])}
        </>
      );
    } else if (layout === 'cb') {
      // Assistant-style: greeting with a help assistant, account box with buttons, bar with Overview, Banking, Service, Profile.
      body = (
        <>
          <div className="flex items-center justify-between px-3 py-2 shrink-0" style={{ background: '#FFFFFF', color: INK }}>
            <PracticeMark brand={brand} name={labels.bankName} text={accent} />
            <span className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[0.85rem]" style={{ background: brand, color: onBrand }} aria-hidden="true">KB</span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 flex flex-col gap-3" style={{ background: '#F5F5F3', color: INK }}>
            <p className="font-bold text-[1.1rem]">{t('Good morning', 'Guten Morgen')}</p>
            <div aria-hidden="true" className="flex items-center gap-2 px-3 py-2 rounded-2xl text-[0.9rem]" style={{ background: '#FFFFFF', border: `1px solid ${LINE}` }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: brand, color: onBrand }}><Sparkles size={16} /></span>
              <span className="flex-1">{t('Assistant: How can I help you? (practice, not real)', 'Assistent: Wie kann ich helfen? (Übung, nicht echt)')}</span>
            </div>
            <div className="rounded-2xl p-1" style={{ background: '#FFFFFF', border: `1px solid ${LINE}` }}>
              {accountLine('row')}
              <div className="grid grid-cols-2 gap-2 px-2 pb-2">
                <PracticeTap id="transfer" label={labels.transfer} className="rounded-xl flex items-center justify-center gap-2 font-bold text-[0.95rem]" style={{ background: brand, color: onBrand }}><ArrowRightLeft size={18} aria-hidden="true" />{labels.transfer}</PracticeTap>
                <PracticeTap id="statements" label={labels.statements} className="rounded-xl flex items-center justify-center gap-2 font-bold text-[0.95rem]" style={{ background: '#F1F2F4', color: INK }}><FileText size={18} aria-hidden="true" />{labels.statements}</PracticeTap>
              </div>
            </div>
            <div className="rounded-2xl px-3 pb-1" style={{ background: '#FFFFFF' }}>{bookingList(false, 2)}</div>
          </div>
          {nav([[t('Overview', 'Übersicht'), House], [labels.navMore, ArrowRightLeft], [t('Service', 'Service'), CircleHelp], [t('Profile', 'Profil'), User]])}
        </>
      );
    } else if (layout === 'pb') {
      // "Financial status" first, and "Transfer" right in the bottom bar.
      body = (
        <>
          <div className="px-3 py-2.5 shrink-0" style={{ background: brand, color: onBrand }}>
            <p className="flex items-center justify-between font-bold"><span className="flex items-center gap-2"><Landmark size={19} aria-hidden="true" />{labels.bankName}</span><span className="text-[0.75rem] font-semibold flex items-center gap-1"><Lock size={13} aria-hidden="true" />{labels.fictional}</span></p>
            <p className="text-[1.15rem] font-bold mt-1">{t('Financial status', 'Finanzstatus')}</p>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 flex flex-col gap-2" style={{ background: '#FFFFFF', color: INK }}>
            <p className="flex justify-between items-center py-1 border-b font-bold" style={{ borderColor: LINE }}><span>{t('Total', 'Gesamt')}</span>{money('4.650,00 €', '1.05rem')}</p>
            <p className="text-[0.8rem] font-bold" style={{ color: MUTED }}>{t('Current accounts', 'Girokonten')}</p>
            {accountLine('row')}
            <p className="text-[0.8rem] font-bold" style={{ color: MUTED }}>{t('Savings', 'Sparen')}</p>
            <div aria-hidden="true" className="flex items-center gap-3 px-3 py-2"><span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#EAF6EC', color: PLUS }}><PiggyBank size={19} /></span><span className="flex-1 font-bold">{t('Savings account', 'Sparkonto')}</span>{money('3.400,00 €')}</div>
            <div className="rounded-2xl px-3 pb-1" style={{ background: '#F5F5F5' }}>{bookingList(false, 2)}</div>
          </div>
          {nav([[t('Financial status', 'Finanzstatus'), House], [labels.transfer, ArrowRightLeft, 'transfer'], [t('Mailbox', 'Postfach'), FileText], [labels.navMore, MoreHorizontal]])}
        </>
      );
    } else if (layout === 'ing' || layout === 'direct') {
      // Direct-bank style: account cards with buttons inside, the savings account below, bar with Accounts, Orders, Investing, Products, Profile.
      body = (
        <>
          <div className="flex items-center justify-between px-3 py-2 shrink-0" style={{ background: '#FFFFFF', color: INK }}>
            <span className="font-bold text-[1.1rem]">{t('Hello', 'Hallo')}</span>
            <PracticeMark brand={brand} name={labels.bankName} text={accent} />
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 flex flex-col gap-3" style={{ background: '#F4F4F4', color: INK }}>
            <div className="rounded-2xl p-3" style={{ background: '#FFFFFF', borderLeft: `6px solid ${brand}` }}>
              <PracticeTap id="account" label={`${labels.account}, ${labels.balance}`} className="w-full text-left rounded-lg">
                <span className="block text-[0.85rem]" style={{ color: MUTED }}>{labels.account}</span>
                <span className="block text-[1.7rem] font-bold">{labels.balance}</span>
              </PracticeTap>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <PracticeTap id="transfer" label={labels.transfer} className="rounded-full font-bold text-[0.95rem]" style={{ background: brand, color: onBrand }}>{labels.transfer}</PracticeTap>
                <PracticeTap id="statements" label={labels.statements} className="rounded-full font-bold text-[0.95rem]" style={{ border: `2px solid ${brand}`, color: accent }}>{labels.statements}</PracticeTap>
              </div>
            </div>
            <div aria-hidden="true" className="rounded-2xl p-3 flex items-center justify-between" style={{ background: '#FFFFFF' }}>
              <span><span className="block text-[0.85rem]" style={{ color: MUTED }}>{t('Savings account', 'Tagesgeld')}</span><span className="font-bold text-[1.2rem]">3.400,00 €</span></span><PiggyBank size={24} style={{ color: accent }} />
            </div>
            <div className="rounded-2xl px-3 pb-1" style={{ background: '#FFFFFF' }}>{bookingList(false, 2)}</div>
          </div>
          {nav([[t('Accounts', 'Konten'), Wallet], [labels.navMore, ArrowRightLeft], [t('Investing', 'Investieren'), Sparkles], [t('Products', 'Produkte'), LayoutGrid], [t('Profile', 'Profil'), User]])}
        </>
      );
    } else if (layout === 'dkb') {
      // Financial overview with a collapsible "Accounts" group, quick buttons, bar with Overview, Orders, Cards, Products.
      body = (
        <>
          <div className="flex items-center justify-between px-3 py-2 shrink-0" style={{ background: '#FFFFFF', color: INK }}>
            <PracticeMark brand={brand} name={labels.bankName} text={accent} />
            <span className="flex items-center gap-3" aria-hidden="true" style={{ color: MUTED }}><Search size={20} /><Bell size={20} /></span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 flex flex-col gap-2" style={{ background: '#F2F4F7', color: INK }}>
            <p className="font-bold text-[1.15rem]">{t('Financial overview', 'Finanzübersicht')}</p>
            <div className="rounded-2xl" style={{ background: '#FFFFFF' }}>
              <p className="flex items-center justify-between px-3 pt-2 font-bold text-[0.95rem]" aria-hidden="true"><span className="flex items-center gap-1"><ChevronUp size={17} />{t('Accounts', 'Konten')}</span>{money(labels.balance)}</p>
              {accountLine('row')}
              <div aria-hidden="true" className="flex items-center gap-3 px-3 py-2 border-t" style={{ borderColor: LINE }}>
                <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#E8EEF5', color: accent }}><CreditCard size={19} /></span>
                <span className="flex-1 font-semibold">{t('Debit card', 'Debitkarte')}<span className="block text-[0.75rem]" style={{ color: MUTED }}>•••• 0000</span></span>
              </div>
            </div>
            <div className="flex gap-2">
              <PracticeTap id="transfer" label={labels.transfer} className="flex-1 rounded-full flex items-center justify-center gap-2 font-bold text-[0.95rem]" style={{ background: brand, color: onBrand }}><ArrowRightLeft size={18} aria-hidden="true" />{labels.transfer}</PracticeTap>
              <PracticeTap id="statements" label={labels.statements} className="flex-1 rounded-full font-bold text-[0.95rem]" style={{ background: '#FFFFFF', color: accent, border: `1px solid ${LINE}` }}>{labels.statements}</PracticeTap>
            </div>
            <div className="rounded-2xl px-3 pb-1" style={{ background: '#FFFFFF' }}>{bookingList(false, 2)}</div>
          </div>
          {nav([[t('Overview', 'Übersicht'), House], [labels.navMore, ArrowRightLeft], [t('Cards', 'Karten'), CreditCard], [t('Products', 'Produkte'), LayoutGrid]])}
        </>
      );
    } else {
      // Classic: greeting, account card, tiles for the main actions, transactions.
      body = (
        <>
          <div className="flex items-center justify-between px-3 py-2 shrink-0" style={{ background: '#FFFFFF', color: INK }}>
            <PracticeMark brand={brand} name={labels.bankName} text={accent} />
            <span className="flex items-center gap-3" aria-hidden="true" style={{ color: MUTED }}><Bell size={21} /><User size={21} /></span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-3" style={{ background: '#F4F5F6', color: INK }}>
            <p className="font-bold text-[1.05rem]">{t('Good morning', 'Guten Morgen')}</p>
            {accountLine('card')}
            <div className="grid grid-cols-2 gap-2">
              <PracticeTap id="transfer" label={labels.transfer} className="p-3 rounded-2xl flex flex-col items-center gap-1 text-[0.95rem] font-bold" style={{ background: '#FFFFFF', color: accent, border: `1px solid ${LINE}` }}><ArrowRightLeft size={24} aria-hidden="true" />{labels.transfer}</PracticeTap>
              <PracticeTap id="statements" label={labels.statements} className="p-3 rounded-2xl flex flex-col items-center gap-1 text-[0.95rem] font-bold" style={{ background: '#FFFFFF', color: accent, border: `1px solid ${LINE}` }}><FileText size={24} aria-hidden="true" />{labels.statements}</PracticeTap>
            </div>
            <div className="rounded-2xl px-3 pb-1" style={{ background: '#FFFFFF' }}>{bookingList(false, 2)}</div>
          </div>
          {nav([[labels.navHome, House], [labels.navMoney, CreditCard], [labels.navMore, MoreHorizontal]])}
        </>
      );
    }
  } else if (screen === 'more') {
    body = listScreen(labels.moreTitle, undefined, [
      <p key="h1" className="text-[0.8rem] font-bold pt-1" style={{ color: MUTED }}>{t('Payments', 'Zahlungsverkehr')}</p>,
      menuRow('abroad', labels.menuAbroad, Globe), menuRow('standing-orders', labels.menuStanding, Repeat), menuRow('scheduled', labels.menuScheduled, CalendarClock),
      menuRow('own-transfer', labels.menuOwn, PiggyBank),
      <p key="h2" className="text-[0.8rem] font-bold pt-2" style={{ color: MUTED }}>{t('Account and card', 'Konto und Karte')}</p>,
      menuRow('documents', labels.menuDocuments, FileText), menuRow('card', labels.menuCard, CreditCard),
    ]);
  } else if (screen === 'intl-country') {
    body = listScreen(labels.menuAbroad, labels.whereTo, [menuRow('country-it', labels.italy, Globe, 'EUR · SEPA'), menuRow('country-fr', labels.france, Globe, 'EUR · SEPA'), menuRow('country-us', labels.usa, Globe, 'USD')]);
  } else if (screen === 'standing-list') {
    body = listScreen(labels.menuStanding, undefined, (
      <>
        {menuRow('order-rent', labels.orderRent, Repeat, `650,00 € · ${labels.monthly ?? ''}`)}
        {menuRow('order-club', labels.orderClub, Repeat, `12,00 € · ${labels.monthly ?? ''}`)}
        <div className="mt-auto pt-3">{primaryButton('standing-new', labels.orderNew)}</div>
      </>
    ));
  } else if (screen === 'order-detail') {
    body = listScreen(labels.orderClub, undefined, (
      <>
        <Row label={labels.amountLabel} value="12,00 €" strong />
        <Row label={labels.howOften} value={labels.monthly} />
        <Row label={t('Next payment', 'Nächste Ausführung')} value={t('1 December', '1. Dezember')} />
        <PracticeTap id="order-delete" label={labels.orderDelete} pointer="above-right" className="mt-auto w-full rounded-full font-bold text-[1.02rem] px-4" style={{ border: `2px solid ${MINUS}`, color: MINUS }}>{labels.orderDelete}</PracticeTap>
      </>
    ));
  } else if (screen === 'order-confirm') {
    body = confirmScreen(labels.orderSure, 'order-yes', labels.orderYes);
  } else if (screen === 'frequency') {
    body = listScreen(labels.menuStanding, labels.howOften, [menuRow('freq-weekly', labels.weekly), menuRow('freq-monthly', labels.monthly), menuRow('freq-yearly', labels.yearly)]);
  } else if (screen === 'start-date') {
    body = listScreen(labels.transfer, labels.whenStart, [menuRow('date-first', labels.dateFirst, CalendarClock), menuRow('date-15', labels.dateFifteen, CalendarClock), menuRow('date-other', labels.dateOther, CalendarClock)]);
  } else if (screen === 'new-details') {
    body = listScreen(labels.newRecipient, undefined, (
      <>
        <div aria-hidden="true" className="rounded-xl px-3 py-2" style={{ background: '#F1F2F4' }}><span className="block text-[0.78rem]" style={{ color: MUTED }}>{labels.newName}</span><span className="font-semibold">{checkName}</span></div>
        <div aria-hidden="true" className="rounded-xl px-3 py-2" style={{ background: '#F1F2F4' }}><span className="block text-[0.78rem]" style={{ color: MUTED }}>IBAN</span><span className="font-semibold">{labels.ibanValue}</span></div>
        <div className="mt-auto pt-3">{primaryButton('new-continue', labels.newContinue)}</div>
      </>
    ));
  } else if (screen === 'own-account') {
    body = listScreen(labels.menuOwn, labels.toWhichAccount, [menuRow('own-savings', labels.savings, PiggyBank, '3.400,00 €'), menuRow('own-other', labels.otherAccount, Landmark, '210,00 €')]);
  } else if (screen === 'push-notice') {
    // Lock screen with a notification from the approval app.
    body = (
      <div className="flex-1 flex flex-col p-4 sim-fade" style={{ background: 'linear-gradient(180deg, #2B3A4A 0%, #16202A 100%)' }}>
        <p className="text-center text-white text-[3rem] font-light mt-6" aria-hidden="true">9:41</p>
        <p className="text-center text-white/80 text-[0.9rem] mb-6" aria-hidden="true">{t('Monday, 9 November', 'Montag, 9. November')}</p>
        <PracticeTap id="open-request" label={`${labels.pushTitle}. ${labels.pushText}`} className="w-full p-3 rounded-2xl text-left flex items-start gap-3" style={{ background: 'rgba(255,255,255,0.92)', color: INK }}>
          <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: brand, color: onBrand }}><ShieldCheck size={20} aria-hidden="true" /></span>
          <span className="min-w-0 flex-1"><span className="flex justify-between gap-2 font-bold text-[0.98rem]">{labels.pushTitle}<span className="font-normal text-[0.78rem]" style={{ color: MUTED }}>{labels.pushTime}</span></span><span className="block text-[0.92rem]">{labels.pushText}</span></span>
        </PracticeTap>
      </div>
    );
  } else if (screen === 'card-screen') {
    body = listScreen(labels.menuCard, undefined, (
      <>
        <div className="rounded-2xl p-4 h-36 flex flex-col justify-between shrink-0" style={{ background: `linear-gradient(135deg, ${brand}, #0B2747)`, color: '#FFFFFF' }} aria-hidden="true">
          <span className="flex justify-between"><span className="font-bold">{labels.bankName}</span><CreditCard size={26} /></span>
          <span className="text-[1rem] font-bold">{labels.cardName}<span className="block font-normal text-[0.9rem] tracking-widest">•••• 0000</span></span>
        </div>
        <Row label={t('Status', 'Status')} value={t('Active', 'Aktiv')} />
        <Row label={t('Valid until', 'Gültig bis')} value="12/29" />
        <div className="mt-auto pt-3">
          <PracticeTap id="card-block" label={labels.cardBlock} pointer="above-right" className="w-full rounded-full font-bold text-[1.02rem] px-4" style={{ border: `2px solid ${MINUS}`, color: MINUS }}>{labels.cardBlock}</PracticeTap>
        </div>
      </>
    ));
  } else if (screen === 'card-reason') {
    body = listScreen(labels.cardBlock, labels.reasonTitle, [menuRow('reason-lost', labels.reasonLost), menuRow('reason-stolen', labels.reasonStolen), menuRow('reason-damaged', labels.reasonDamaged)]);
  } else if (screen === 'card-confirm') {
    body = confirmScreen(labels.cardSure, 'card-yes', labels.cardYes);
  } else if (screen === 'documents-list') {
    body = listScreen(labels.menuDocuments, undefined, [menuRow('doc-october', labels.docOctober, FileText, 'PDF'), menuRow('doc-september', labels.docSeptember, FileText, 'PDF'), menuRow('doc-august', labels.docAugust, FileText, 'PDF')]);
  } else if (screen === 'sendmenu') {
    // "Send money" opens a short choice, like a sheet sliding up.
    body = (
      <>
        {header(labels.sendMoney, true)}
        <div className="flex-1 px-3 py-2 flex flex-col gap-1 sim-fade" style={{ background: '#FFFFFF', color: INK }}>
          <PracticeTap id="transfer" label={labels.transfer} className="flex items-center gap-3 px-2 rounded-xl text-left text-[1.02rem] font-bold border-b" style={{ borderColor: LINE }}>
            <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#E8EEF5', color: accent }}><ArrowRightLeft size={19} aria-hidden="true" /></span>
            <span className="flex-1">{labels.transfer}<span className="block text-[0.8rem] font-normal" style={{ color: MUTED }}>{t('To any account', 'An ein beliebiges Konto')}</span></span><ChevronRight size={18} aria-hidden="true" />
          </PracticeTap>
          <PracticeTap id="standing" label={labels.standing} className="flex items-center gap-3 px-2 rounded-xl text-left text-[1.02rem] border-b" style={{ borderColor: LINE }}>
            <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#E8EEF5', color: accent }}><Repeat size={19} aria-hidden="true" /></span><span className="flex-1">{labels.standing}</span><ChevronRight size={18} aria-hidden="true" />
          </PracticeTap>
          <PracticeTap id="own-transfer" label={labels.ownTransfer} className="flex items-center gap-3 px-2 rounded-xl text-left text-[1.02rem]">
            <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#E8EEF5', color: accent }}><PiggyBank size={19} aria-hidden="true" /></span><span className="flex-1">{labels.ownTransfer}</span><ChevronRight size={18} aria-hidden="true" />
          </PracticeTap>
        </div>
      </>
    );
  } else if (screen === 'payments') {
    body = (
      <>
        {header(labels.statements, true)}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 flex flex-col sim-fade" style={{ background: '#FFFFFF', color: INK }}>
          <div className="flex items-center justify-between py-1">
            <span className="text-[0.9rem]" style={{ color: MUTED }}>{labels.account}</span>{money(labels.balance, '1.1rem')}
          </div>
          <div aria-hidden="true" className="flex items-center gap-2 my-1 px-3 py-2 rounded-xl text-[0.9rem]" style={{ background: '#F1F2F4', color: MUTED }}><Search size={16} />{t('Search transactions', 'Umsätze durchsuchen')}</div>
          {bookingList(true, 3)}
        </div>
      </>
    );
  } else if (screen === 'recipient') {
    body = (
      <>
        {header(labels.transfer, true)}
        <div className="flex-1 px-3 py-2 flex flex-col gap-1 sim-fade" style={{ background: '#FFFFFF', color: INK }}>
          <div aria-hidden="true" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[0.92rem]" style={{ background: '#F1F2F4', color: MUTED }}><Search size={17} />{t('Name or IBAN', 'Name oder IBAN')}</div>
          <p className="font-bold text-[1rem] pt-2">{labels.whoGets}</p>
          {[
            { id: 'person-anna', name: labels.recipient, iban: labels.ibanValue ?? 'DE00 1111 1111 1111 1111 11' },
            { id: 'person-peter', name: labels.peterFull, iban: 'DE00 2222 2222 2222 2222 22' },
          ].map((p) => (
            <PracticeTap key={p.id} id={p.id} label={p.name} className="flex items-center gap-3 px-1 rounded-xl text-left border-b" style={{ borderColor: LINE }}>
              <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-[0.9rem]" style={{ background: '#E8EEF5', color: accent }}>{initials(p.name)}</span>
              <span className="min-w-0"><span className="block font-semibold text-[1rem]">{p.name}</span><span className="block text-[0.78rem] truncate" style={{ color: MUTED }}>{p.iban}</span></span>
            </PracticeTap>
          ))}
          <PracticeTap id="person-new" label={labels.newRecipient} className="flex items-center gap-3 px-1 rounded-xl text-left">
            <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[1.3rem]" style={{ border: `2px dashed ${brand}`, color: accent }}>+</span>
            <span className="font-semibold text-[1rem]" style={{ color: accent }}>{labels.newRecipient}</span>
          </PracticeTap>
        </div>
      </>
    );
  } else if (screen === 'amount') {
    body = (
      <>
        {header(labels.transfer, true)}
        <div className="flex-1 px-3 py-2 flex flex-col gap-2 sim-fade" style={{ background: '#FFFFFF', color: INK }}>
          <div className="flex items-center gap-3 py-1 border-b" style={{ borderColor: LINE }}>
            <span className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[0.85rem]" style={{ background: '#E8EEF5', color: accent }}>{initials(checkName)}</span>
            <span><span className="block text-[0.78rem]" style={{ color: MUTED }}>{labels.to}</span><span className="font-semibold">{checkName}</span></span>
          </div>
          <p className="font-bold text-[1rem] mt-1">{labels.howMuch}</p>
          <p aria-hidden="true" className="text-center text-[2rem] font-bold py-1 rounded-xl" style={{ background: '#F1F2F4', color: MUTED }}>0,00 €</p>
          <div className="grid grid-cols-2 gap-2">
            {['10,00 €', labels.amount, '60,00 €', '100,00 €'].map((value, i) => (
              <PracticeTap key={value} id={i === 1 ? 'amount-right' : `amount-${i}`} label={value} className="rounded-full text-[1.05rem] font-bold" style={{ border: `1px solid ${LINE}`, background: '#FFFFFF', color: accent }}>{value}</PracticeTap>
            ))}
          </div>
          <p className="text-[0.85rem]" style={{ color: MUTED }}>{labels.purposeHint}</p>
        </div>
      </>
    );
  } else if (screen === 'approve') {
    // Like a separate approval app: its own header, the order details, approve or reject.
    body = (
      <>
        <div className="flex items-center gap-2 px-3 py-2 shrink-0" style={{ background: brand, color: onBrand }}>
          <ShieldCheck size={22} aria-hidden="true" /><span className="font-bold text-[1rem] flex-1">{t('Approval app', 'Freigabe-App')}</span>
          <span className="flex items-center gap-1 text-[0.75rem]"><Lock size={13} aria-hidden="true" />{labels.fictional}</span>
        </div>
        <div className="flex-1 flex flex-col gap-2 p-4 sim-fade" style={{ background: '#FFFFFF', color: INK }}>
          <Smartphone size={44} style={{ color: accent }} aria-hidden="true" className="self-center" />
          <h3 className="text-[1.15rem] font-bold text-center">{labels.approveTitle}</h3>
          <p className="text-[0.9rem] text-center" style={{ color: MUTED }}>{labels.approveText}</p>
          <Row label={labels.to} value={labels.recipient} />
          <Row label={labels.amountLabel} value={labels.amount} strong />
          <div className="mt-auto flex flex-col gap-2 pt-2">
            <PracticeTap id="approve-ok" label={labels.approveButton} pointer={labels.rejectable ? 'above-left' : 'above-right'} className="w-full rounded-full font-bold text-[1.05rem]" style={{ background: brand, color: onBrand }}>{labels.approveButton}</PracticeTap>
            {labels.rejectable && <PracticeTap id="approve-no" label={labels.rejectButton} pointer="above-right" className="w-full rounded-full font-bold text-[1.05rem]" style={{ border: `2px solid ${brand}`, color: accent }}>{labels.rejectButton}</PracticeTap>}
          </div>
        </div>
      </>
    );
  } else {
    // Check the transfer before confirming.
    body = (
      <>
        {header(labels.checkTitle, true)}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 flex flex-col gap-0.5 sim-fade" style={{ background: '#FFFFFF', color: INK }}>
          <p className="text-center text-[2rem] font-bold py-2">{labels.amount}</p>
          <Row label={labels.to} value={checkName} />
          <Row label="IBAN" value={labels.ibanValue ?? 'DE00 1111 1111 1111 1111 11'} />
          {labels.nameBad ? (
            <p className="flex items-start gap-2 p-2 my-1 rounded-xl text-[0.95rem] font-bold" style={{ background: '#FDECEA', color: MINUS }}><TriangleAlert size={22} className="shrink-0" aria-hidden="true" />{labels.nameBad}</p>
          ) : labels.nameCheck ? (
            <p className="flex items-center gap-2 py-1 text-[0.92rem]" style={{ color: PLUS }}><CheckCircle2 size={20} aria-hidden="true" /><strong>{labels.nameCheck}:</strong> {labels.nameOk}</p>
          ) : null}
          {labels.extraOneLabel && <Row label={labels.extraOneLabel} value={labels.extraOneValue} />}
          {labels.extraTwoLabel && <Row label={labels.extraTwoLabel} value={labels.extraTwoValue} />}
          <Row label={labels.purpose} value={labels.purposeText} />
          <Row label={t('From', 'Von')} value={labels.account} />
          <div className="mt-auto flex flex-col gap-2 pt-3">
            {primaryButton('confirm', labels.confirm)}
            {secondaryButton('cancel', labels.cancel)}
          </div>
        </div>
      </>
    );
  }

  const darkTop = screen === 'push-notice' && !isDone;
  const brandTop = !isDone && (screen === 'approve' || (screen === 'overview' && ['vr', 'db', 'pb'].includes(layout)));
  if (brandTop) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <StatusBar background={brand} color={onBrand} />
        {body}
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <StatusBar background={darkTop ? '#2B3A4A' : screen === 'approve' && !isDone ? brand : layout === 'action' && screen === 'overview' && !isDone ? '#F6F6F6' : '#FFFFFF'} color={darkTop || (screen === 'approve' && !isDone) ? '#FFFFFF' : INK} />
      {body}
    </div>
  );
};
