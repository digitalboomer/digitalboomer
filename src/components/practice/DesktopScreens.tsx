import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {ArrowRightLeft, Bell, CheckCircle2, ChevronDown, FileText, Heart, Home, Landmark, Lock, LogOut, MessageCircle, Monitor, Paperclip, PenSquare, Repeat, Search, Send, Share2, Smartphone, ThumbsUp, User, Users } from 'lucide-react';
import { PracticeContext, PracticeTap } from './PracticeTap';
import { Avatar, FlowersPhoto } from './PhoneParts';
import { appStyle, type AppId } from './messaging/apps';
import type { PracticeScreenProps } from './practiceScreens';
import { EmailWeb } from './EmailWeb';

/** The simulated computer is drawn at this size and scaled to fit the page. */
const W = 960;
const H = 580;

/**
 * Scales the computer screen to the available width. On large screens it also fits the height of
 * the browser window (below the sticky header), so the whole simulated computer is visible without scrolling.
 */
export const DesktopStage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const update = () => {
    const element = outer.current;
    if (!element) return;
    let next = Math.min(1, element.clientWidth / W);
    if (window.innerWidth >= 1024) {
      const frame = (element.closest('[role=group]') as HTMLElement | null) ?? element;
      const header = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
      // Room above the stage inside the frame (the "practice, not real" line and the current step), the frame's padding below, and a small gap.
      const above = element.getBoundingClientRect().top - frame.getBoundingClientRect().top;
      const room = window.innerHeight - header - above - 8 - 24;
      next = Math.min(element.clientWidth / W, room / H, 1.25);
    }
    next = Math.max(0.3, Math.round(next * 1000) / 1000);
    setScale(next);
  };
  // The text above the stage changes from step to step, so measure after every render.
  useLayoutEffect(update);
  useLayoutEffect(() => {
    const element = outer.current;
    if (!element) return;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);
  return (
    <div ref={outer} className="w-full">
      {scale < 0.7 && window.innerWidth < 1024 && (
        <p className="m-2 p-3 rounded-lg text-[1rem] font-bold" style={{ background: '#EAF2F8', color: '#17324D' }}>
          {document.documentElement.lang === 'de'
            ? 'Diese Übung zeigt einen Computer-Bildschirm. Am Computer oder Tablet ist sie leichter zu sehen. Drehen Sie das Handy quer, dann wird sie größer.'
            : 'This practice shows a computer screen. It is easier to see on a computer or tablet. Turn your phone sideways to make it bigger.'}
        </p>
      )}
      <div style={{ height: H * scale, width: W * scale }} className="mx-auto">
        <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left' }} className="flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

/** Typing on the computer: the real keyboard works, and the buttons type a word for anyone without one. */
export const TypingHelper: React.FC<{ words: string[]; deleteLabel: string; lang: string }> = ({ words, deleteLabel, lang }) => {
  const { typed, setTyped, needsText, showMe } = useContext(PracticeContext);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (event.ctrlKey || event.metaKey || event.altKey || target?.closest('input,textarea,select,[role=dialog]')) return;
      if (event.key === 'Backspace') {
        event.preventDefault();
        setTyped((prev) => prev.slice(0, -1));
      } else if (event.key.length === 1 && /[\p{L}\p{N} .,!?'-]/u.test(event.key) && (event.key !== ' ' || target?.tagName !== 'BUTTON')) {
        event.preventDefault();
        setTyped((prev) => (prev + event.key).slice(0, 80));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setTyped]);
  const add = (word: string) => setTyped((prev) => (prev && !prev.endsWith(' ') ? `${prev} ${word}` : prev + word).slice(0, 80));
  return (
    <div data-practice-id="keyboard" role="group" aria-label={lang === 'de' ? 'Schreibhilfe' : 'Typing help'} className={`flex flex-wrap items-center gap-2 p-2 ${needsText && showMe ? 'practice-target practice-show-me' : ''}`} style={{ background: '#EEF1F4', borderTop: '1px solid #D5DAE0' }}>
      <span className="text-[0.95rem]" style={{ color: '#3B4A54' }}>{lang === 'de' ? 'Tippen Sie auf der Tastatur, oder wählen Sie:' : 'Type on your keyboard, or choose:'}</span>
      {words.map((word) => (
        <button key={word} type="button" onClick={(event) => { event.stopPropagation(); add(word); }} className="px-3 min-h-[40px] rounded-lg text-[0.95rem] font-bold" style={{ background: '#FFFFFF', color: '#111B21', border: '1px solid #C8D0D8' }}>
          {word}
        </button>
      ))}
      <button type="button" aria-label={deleteLabel} onClick={(event) => { event.stopPropagation(); setTyped((prev) => prev.slice(0, -1)); }} className="px-3 min-h-[40px] rounded-lg text-[0.95rem]" style={{ background: '#FFFFFF', color: '#111B21', border: '1px solid #C8D0D8' }}>⌫</button>
    </div>
  );
};

export const Cursor: React.FC = () => <span aria-hidden="true" className="inline-block w-[2px] h-[1.1em] align-text-bottom ml-px" style={{ background: '#111B21' }} />;

/** A browser window with tabs and an address bar. The lock can be clicked, like in a real browser. */
export const Browser: React.FC<{ url: string; tab: string; labels: Record<string, string>; checked?: boolean; children: React.ReactNode }> = ({ url, tab, labels, checked, children }) => (
  <div className="flex flex-col h-full rounded-lg overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #9AA4AE', color: '#111B21' }}>
    <div className="flex items-end gap-2 px-3 pt-2 shrink-0" style={{ background: '#DEE1E6' }} aria-hidden="true">
      <span className="flex gap-1.5 pb-2.5">{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}</span>
      <span className="px-4 py-1.5 rounded-t-lg text-[0.85rem] max-w-[240px] truncate" style={{ background: '#FFFFFF' }}>{tab}</span>
    </div>
    <div className="flex items-center gap-2 px-3 py-1.5 shrink-0 relative" style={{ background: '#FFFFFF', borderBottom: '1px solid #DADCE0' }}>
      <div className="flex-1 flex items-center gap-2 px-2 rounded-full min-h-[40px]" style={{ background: '#F1F3F4' }}>
        <PracticeTap id="address-lock" label={labels.lockLabel} pointer="below" className="rounded-full flex items-center justify-center" style={{ color: '#3B4A54' }}><Lock size={17} aria-hidden="true" /></PracticeTap>
        <span className="text-[0.95rem] truncate">{url}</span>
      </div>
      {checked && (
        <div className="absolute left-3 top-full mt-1 z-20 w-80 p-3 rounded-lg shadow-lg text-[0.9rem] sim-fade" style={{ background: '#FFFFFF', border: '1px solid #DADCE0' }}>
          <p className="flex items-center gap-2 font-bold"><Lock size={16} aria-hidden="true" />{labels.lockSecure}</p>
          <p className="mt-1">{url}</p>
        </div>
      )}
    </div>
    <div className="flex-1 min-h-0 flex flex-col">{children}</div>
  </div>
);

/** A program window on the computer, for apps that are installed. */
export const AppWindow: React.FC<{ title: string; bar: string; barText: string; children: React.ReactNode }> = ({ title, bar, barText, children }) => (
  <div className="flex flex-col h-full rounded-lg overflow-hidden" style={{ border: '1px solid #9AA4AE' }}>
    <div aria-hidden="true" className="flex items-center gap-2 px-3 h-8 shrink-0 text-[0.85rem]" style={{ background: bar, color: barText }}>
      <span className="flex gap-1.5">{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}</span>
      <span className="flex-1 text-center font-bold">{title}</span>
      <Monitor size={15} />
    </div>
    <div className="flex-1 min-h-0 flex">{children}</div>
  </div>
);

const Done: React.FC<{ title: string; text: string; note: string }> = ({ title, text, note }) => (
  <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center sim-fade" style={{ background: '#FFFFFF', color: '#111B21' }}>
    <CheckCircle2 size={64} style={{ color: '#176B68' }} aria-hidden="true" />
    <h3 className="text-[1.5rem] font-bold">{title}</h3>
    {text && <p className="text-[1.1rem] max-w-lg">{text}</p>}
    <p className="text-[1rem]">{note}</p>
  </div>
);

/** Messaging app on the computer: link it to the phone, then chat in two columns. */
export const DesktopMessenger: React.FC<PracticeScreenProps> = ({ screen, isDone, appId, labels, lang }) => {
  const { typed } = useContext(PracticeContext);
  const id = (appId ?? 'whatsapp') as AppId;
  const app = appStyle(id, 'android');
  const dark = app.dark;
  const panel = dark ? '#2B2D31' : '#FFFFFF';
  const listBg = dark ? '#2B2D31' : '#FFFFFF';
  const sent = isDone || screen === 'desk-done';
  const chats = [
    { tap: 'chat-family', name: labels.family, last: labels.familyLast, colour: '#6D8AA8' },
    { tap: 'chat-anna', name: labels.anna, last: labels.annaLast, colour: '#C0689B' },
    { tap: 'chat-club', name: labels.club, last: labels.clubLast, colour: '#7E9B5D' },
  ];
  const open = screen !== 'desk-list' && screen !== 'desk-link';

  let content: React.ReactNode;
  if (screen === 'desk-link' && !isDone) {
    content = (
      <div className="flex-1 flex items-center justify-center gap-10 p-8" style={{ background: dark ? '#313338' : '#F0F2F5', color: dark ? '#F2F3F5' : '#111B21' }}>
        <div className="max-w-md space-y-3">
          <h3 className="text-[1.6rem] font-bold">{labels.linkTitle}</h3>
          <p className="text-[1.05rem] whitespace-pre-line">{labels.linkHow}</p>
          <PracticeTap id="scanned" label={labels.linkButton} pointer="below" className="px-5 rounded-xl font-bold text-[1.05rem]" style={{ background: app.accent, color: app.accentText }}>{labels.linkButton}</PracticeTap>
        </div>
        {labels.linkMode !== 'login' ? (
          <div aria-hidden="true" className="w-56 h-56 p-3 rounded-xl grid grid-cols-7 gap-1" style={{ background: '#FFFFFF', border: '1px solid #C8D0D8' }}>
            {Array.from({ length: 49 }, (_, i) => <span key={i} style={{ background: (i * 7 + (i % 5) * 3) % 4 === 0 || [0, 1, 7, 8, 5, 6, 12, 13, 35, 36, 42, 43].includes(i) ? '#111B21' : '#FFFFFF' }} />)}
          </div>
        ) : (
          <div aria-hidden="true" className="w-56 h-56 rounded-xl flex flex-col items-center justify-center gap-3" style={{ background: '#FFFFFF', border: '1px solid #C8D0D8', color: '#111B21' }}>
            <User size={64} /><span className="text-[1rem] font-bold">{labels.signInTitle}</span>
          </div>
        )}
      </div>
    );
  } else {
    content = (
      <>
        <div className="w-[300px] shrink-0 flex flex-col" style={{ background: listBg, color: app.text, borderRight: `1px solid ${app.border}` }}>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[1.3rem] font-bold">{labels.chatsTitle}</span>
            <span aria-hidden="true"><PenSquare size={20} /></span>
          </div>
          <div aria-hidden="true" className="mx-3 mb-2 flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.9rem]" style={{ background: dark ? '#1E1F22' : '#F0F2F5', color: app.subText }}><Search size={16} />{labels.search}</div>
          {chats.map((chat) => (
            <PracticeTap key={chat.tap} id={chat.tap} label={chat.name} className="flex items-center gap-3 px-3 py-2 text-left w-full" style={{ background: open && chat.tap === 'chat-anna' ? (dark ? '#404249' : '#F0F2F5') : undefined }}>
              <Avatar name={chat.name} color={chat.colour} size={44} />
              <span className="min-w-0"><span className="block font-bold text-[1rem] truncate">{chat.name}</span><span className="block text-[0.9rem] truncate" style={{ color: app.subText }}>{chat.last}</span></span>
            </PracticeTap>
          ))}
        </div>
        <div className="flex-1 min-w-0 flex flex-col" style={{ background: app.wallpaper, color: app.text }}>
          {!open ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center p-8" style={{ color: app.subText }}>
              <Monitor size={56} aria-hidden="true" />
              <p className="text-[1.1rem]">{labels.selectChat}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-4 py-2 shrink-0" style={{ background: app.chatHeaderBg, color: app.chatHeaderText }}>
                <Avatar name={labels.anna} color="#C0689B" size={38} /><span className="font-bold text-[1.05rem]">{labels.anna}</span>
              </div>
              <div className="flex-1 min-h-0 p-4 flex flex-col gap-2">
                <p className="self-start max-w-[70%] px-3 py-2 rounded-xl text-[1rem]" style={{ background: app.bubbleIn, color: app.bubbleInText }}>{labels.annaLast}</p>
                {sent && <p className="self-end max-w-[70%] px-3 py-2 rounded-xl text-[1rem] sim-fade" style={{ background: app.bubbleOut, color: app.bubbleOutText }}>{typed || labels.suggest1}</p>}
              </div>
              {!sent && (
                <div className="shrink-0" style={{ background: panel }}>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <span aria-hidden="true" style={{ color: app.subText }}><Paperclip size={20} /></span>
                    {screen === 'desk-chat' ? (
                      <PracticeTap id="message-field" label={labels.field || labels.messageWord} pointer="above-left" className="flex-1 text-left px-3 rounded-lg text-[1rem]" style={{ background: dark ? '#383A40' : '#F0F2F5', color: app.subText }}>{labels.field || labels.messageWord}</PracticeTap>
                    ) : (
                      <p className="flex-1 min-h-[44px] flex items-center px-3 rounded-lg text-[1rem]" style={{ background: dark ? '#383A40' : '#F0F2F5', color: app.text, border: `2px solid ${app.accent}` }}>{typed}<Cursor /></p>
                    )}
                    {screen === 'desk-typing' && typed && <PracticeTap id="send" label={labels.send} pointer="above-right" className="rounded-full flex items-center justify-center" style={{ background: app.accent, color: app.accentText }}><Send size={20} aria-hidden="true" /></PracticeTap>}
                  </div>
                  {screen === 'desk-typing' && <TypingHelper words={[labels.suggest1, labels.suggest2, labels.suggest3]} deleteLabel={labels.deleteKey} lang={lang} />}
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  }

  return labels.deskUrl ? (
    <Browser url={labels.deskUrl} tab={labels.deskWindow} labels={labels}><div className="flex-1 min-h-0 flex">{content}</div></Browser>
  ) : (
    <AppWindow title={labels.deskWindow} bar={dark ? '#1E1F22' : '#E9ECEF'} barText={dark ? '#F2F3F5' : '#111B21'}>{content}</AppWindow>
  );
};

/** Email in the browser (or the Mail program on a Mac): each service's own layout, see EmailWeb. */
export const DesktopEmail: React.FC<PracticeScreenProps> = (props) => <EmailWeb {...props} />;

/** A social network in the browser: menu on the left, the feed in the middle. */
export const DesktopSocial: React.FC<PracticeScreenProps> = ({ screen, isDone, labels, lang }) => {
  const { typed } = useContext(PracticeContext);
  const accent = labels.brandColor ?? '#0866FF';
  const liked = screen === 'web-liked' || screen === 'web-comment';
  const body = isDone ? (
    <Done title={labels.doneDesk} text={`${labels.you}: ${typed || labels.defaultComment}`} note={labels.noRealAction ?? labels.noRealPost} />
  ) : (
    <div className="flex-1 min-h-0 flex" style={{ background: '#F0F2F5', color: '#1C1E21' }}>
      <div className="w-[220px] shrink-0 p-3 flex flex-col gap-1" aria-hidden="true">
        {[[Home, labels.navHome], [Users, labels.navFriends], [Bell, labels.navAlerts], [MessageCircle, labels.inboxWord], [User, labels.you]].map(([Glyph, name], i) => {
          const G = Glyph as React.ElementType;
          return <span key={String(name)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-[1rem]" style={i === 0 ? { background: '#FFFFFF', fontWeight: 700 } : undefined}><G size={20} />{name as string}</span>;
        })}
      </div>
      <div className="flex-1 min-w-0 p-4 overflow-hidden">
        <div className="max-w-[520px] mx-auto rounded-xl overflow-hidden" style={{ background: '#FFFFFF' }}>
          <div className="flex items-center gap-2 p-3"><Avatar name={labels.anna} color="#C0689B" size={40} /><span><strong className="block">{labels.anna}</strong><span className="text-[0.85rem]" style={{ color: '#65676B' }}>{labels.postAge}</span></span></div>
          <p className="px-3 pb-2 text-[1rem]">{labels.postText}</p>
          <div className="h-48 overflow-hidden"><FlowersPhoto /></div>
          <div className="flex gap-2 p-2" style={{ borderTop: '1px solid #E4E6EB' }}>
            <PracticeTap id="like" label={labels.like} pointer="below" className="flex-1 flex items-center justify-center gap-2 rounded-lg font-bold text-[1rem]" style={{ color: liked ? accent : '#65676B' }}>{labels.likeIcon === 'heart' ? <Heart size={20} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" /> : <ThumbsUp size={20} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" />}{labels.like}</PracticeTap>
            <PracticeTap id="comment" label={labels.comment} pointer="below" className="flex-1 flex items-center justify-center gap-2 rounded-lg font-bold text-[1rem]" style={{ color: '#65676B' }}><MessageCircle size={20} aria-hidden="true" />{labels.comment}</PracticeTap>
            <span aria-hidden="true" className="flex-1 flex items-center justify-center gap-2 font-bold text-[1rem]" style={{ color: '#65676B' }}><Share2 size={20} />{labels.shareWord}</span>
          </div>
          {screen === 'web-comment' && (
            <div className="p-3 flex items-center gap-2" style={{ borderTop: '1px solid #E4E6EB' }}>
              <Avatar name={labels.you} color="#6D8AA8" size={32}><User size={17} aria-hidden="true" /></Avatar>
              <p className="flex-1 min-h-[44px] flex items-center px-3 rounded-full text-[1rem]" style={{ background: '#F0F2F5', border: `2px solid ${accent}` }}>{typed}<Cursor /></p>
              {typed && <PracticeTap id="send" label={labels.send} pointer="above-right" className="rounded-full flex items-center justify-center" style={{ background: accent, color: '#FFFFFF' }}><Send size={18} aria-hidden="true" /></PracticeTap>}
            </div>
          )}
        </div>
        {screen === 'web-comment' && <div className="max-w-[520px] mx-auto mt-2"><TypingHelper words={[labels.suggestC1, labels.suggestC2, labels.suggestC3]} deleteLabel={labels.deleteKey} lang={lang} /></div>}
      </div>
    </div>
  );
  return <Browser url={labels.deskUrl} tab={labels.deskWindow} labels={labels}>{body}</Browser>;
};

/** Online banking in the browser, with a neutral practice bank and no login fields. */
export const DesktopBank: React.FC<PracticeScreenProps> = ({ screen, isDone, labels }) => {
  const brand = labels.brandColor ?? '#14457A';
  const onBrand = labels.brandText ?? '#FFFFFF';
  const ink = onBrand === '#FFFFFF' ? brand : '#14457A';
  const row = (label: string, value: string) => <div className="flex justify-between gap-3 py-2 text-[1rem]" style={{ borderBottom: '1px solid #E5E9ED' }}><span style={{ color: '#54656F' }}>{label}</span><strong>{value}</strong></div>;
  const button = (tap: string, text: string, filled = true) => <PracticeTap id={tap} label={text} pointer="below" className="px-6 rounded-xl font-bold text-[1.05rem]" style={filled ? { background: brand, color: onBrand } : { border: `2px solid ${ink}`, color: ink }}>{text}</PracticeTap>;

  let main: React.ReactNode;
  if (screen === 'web-bank' || screen === 'web-bank-ok') {
    main = (
      <div className="space-y-4">
        <h3 className="text-[1.4rem] font-bold">{labels.welcomeDesk}</h3>
        <div className="p-4 rounded-xl" style={{ border: '1px solid #DCE2E8' }}>
          <p style={{ color: '#54656F' }}>{labels.account} · DE00 0000 0000 0000 0000 00</p>
          <p className="text-[2rem] font-bold">{labels.balance}</p>
        </div>
        {row(labels.bookingOne, '-48,20 €')}{row(labels.bookingTwo, '-12,99 €')}
      </div>
    );
  } else if (screen === 'web-recipient') {
    main = (
      <div className="space-y-3 max-w-lg">
        <h3 className="text-[1.4rem] font-bold">{labels.transfer}</h3>
        <p className="font-bold">{labels.whoGets}</p>
        {[['person-anna', labels.recipient], ['person-peter', labels.peterFull], ['person-new', labels.newRecipient]].map(([tap, name]) => (
          <PracticeTap key={tap} id={tap} label={name} className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-[1.05rem]" style={{ border: '1px solid #C8D0D8' }}><User size={20} aria-hidden="true" />{name}</PracticeTap>
        ))}
      </div>
    );
  } else if (screen === 'web-amount') {
    main = (
      <div className="space-y-3 max-w-lg">
        <h3 className="text-[1.4rem] font-bold">{labels.transfer}</h3>
        {row(labels.to, labels.recipient)}
        <p className="font-bold">{labels.howMuch}</p>
        <div className="grid grid-cols-2 gap-2">
          {['10,00 €', labels.amount, '60,00 €', '100,00 €'].map((value, i) => <PracticeTap key={value} id={i === 1 ? 'amount-right' : `amount-${i}`} label={value} className="p-3 rounded-xl font-bold text-[1.1rem]" style={{ border: '1px solid #C8D0D8', color: ink }}>{value}</PracticeTap>)}
        </div>
      </div>
    );
  } else if (screen === 'web-check') {
    main = (
      <div className="space-y-2 max-w-lg">
        <h3 className="text-[1.4rem] font-bold">{labels.checkTitle}</h3>
        {row(labels.to, labels.recipient)}{row('IBAN', 'DE00 1111 1111 1111 1111 11')}
        <p className="flex items-center gap-2 py-1" style={{ color: '#176B68' }}><CheckCircle2 size={20} aria-hidden="true" /><strong>{labels.nameCheck}:</strong> {labels.nameOk}</p>
        {row(labels.amountLabel, labels.amount)}{row(labels.purpose, labels.purposeText)}
        <div className="flex gap-3 pt-3">{button('confirm', labels.confirm)}{button('cancel', labels.cancel, false)}</div>
      </div>
    );
  } else if (screen === 'web-approve') {
    main = (
      <div className="flex items-center gap-8">
        <div className="max-w-sm space-y-2">
          <h3 className="text-[1.4rem] font-bold">{labels.approveTitle}</h3>
          <p className="text-[1.05rem]">{labels.approveDesk}</p>
        </div>
        <div className="w-56 rounded-[28px] p-2" style={{ background: '#202B36' }}>
          <div className="rounded-[22px] p-4 flex flex-col items-center gap-2 text-center" style={{ background: '#FFFFFF' }}>
            <Smartphone size={36} style={{ color: ink }} aria-hidden="true" />
            <p className="font-bold">{labels.approveTitle}</p>
            {row(labels.amountLabel, labels.amount)}
            <PracticeTap id="approve-ok" label={labels.approveButton} pointer="above-right" className="w-full rounded-xl font-bold" style={{ background: brand, color: onBrand }}>{labels.approveButton}</PracticeTap>
          </div>
        </div>
      </div>
    );
  } else {
    main = (
      <div className="space-y-3 max-w-lg">
        <p className="flex items-center gap-2 text-[1.3rem] font-bold"><CheckCircle2 size={28} style={{ color: '#176B68' }} aria-hidden="true" />{labels.doneTitle}</p>
        {row(labels.to, labels.recipient)}{row(labels.amountLabel, labels.amount)}{row(labels.newBalance, labels.balanceAfter)}
        <p className="text-[1.05rem] pt-2">{labels.logoutHint}</p>
      </div>
    );
  }

  const body = isDone ? (
    <Done title={labels.loggedOut} text={labels.loggedOutText} note={labels.noRealMoney} />
  ) : (
    <div className="flex-1 min-h-0 flex flex-col" style={{ color: '#111B21' }}>
      <div className="flex items-center gap-3 px-5 py-2 shrink-0" style={{ background: brand, color: onBrand }}>
        <Landmark size={24} aria-hidden="true" /><span className="flex-1 font-bold text-[1.15rem]">{labels.bankName}</span>
        <span className="flex items-center gap-1 text-[0.85rem]"><Lock size={14} aria-hidden="true" />{labels.fictional}</span>
        <PracticeTap id="logout" label={labels.logout} pointer="below-right" className="flex items-center gap-2 px-3 rounded-lg font-bold text-[0.95rem]" style={{ background: 'rgba(255,255,255,0.18)', color: onBrand }}><LogOut size={18} aria-hidden="true" />{labels.logout}</PracticeTap>
      </div>
      <div className="flex-1 min-h-0 flex">
        <div className="w-[220px] shrink-0 p-3 flex flex-col gap-1" style={{ background: '#F2F5F8' }}>
          <span aria-hidden="true" className="flex items-center gap-3 px-3 py-2 rounded-lg font-bold" style={{ background: '#FFFFFF' }}><Home size={19} />{labels.navHome}</span>
          <PracticeTap id="transfer" label={labels.transfer} pointer="below" className="flex items-center gap-3 px-3 rounded-lg text-left font-bold text-[1rem]" style={{ color: ink }}><ArrowRightLeft size={19} aria-hidden="true" />{labels.transfer}</PracticeTap>
          <span aria-hidden="true" className="flex items-center gap-3 px-3 py-2"><Repeat size={19} />{labels.standing}</span>
          <span aria-hidden="true" className="flex items-center gap-3 px-3 py-2"><FileText size={19} />{labels.statements}</span>
          <span aria-hidden="true" className="flex items-center gap-3 px-3 py-2"><ChevronDown size={19} />{labels.navMore}</span>
        </div>
        <div className="flex-1 min-w-0 p-6" style={{ background: '#FFFFFF' }}>{main}</div>
      </div>
    </div>
  );
  return <Browser url={labels.deskUrl} tab={labels.bankName} labels={labels} checked={screen === 'web-bank-ok'}>{body}</Browser>;
};

export const DESKTOP_SIZE = { W, H };
