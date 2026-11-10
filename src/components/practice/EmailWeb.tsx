import React, { useContext } from 'react';
import {
  Archive, ArrowLeft, ArchiveRestore, Calendar, CheckCircle2, Video, File, FileText, Flag, Forward, HelpCircle, Image as ImageIcon, Inbox as InboxIcon,
  LayoutGrid, Mail, Menu, MoreHorizontal, MoreVertical, Paperclip, Pencil, RefreshCw, Reply, ReplyAll, Search, Send, Settings, SquarePen, Star, Trash2,
  TriangleAlert, User, Users, X,
} from 'lucide-react';
import { PracticeContext, PracticeTap } from './PracticeTap';
import { Avatar, clockTime } from './PhoneParts';
import { AppWindow, Browser, Cursor, TypingHelper } from './DesktopScreens';
import { EMAIL_URL } from '../../data/desktopLessons';
import { READING_PANE } from '../../data/emailDesktop';
import type { PracticeScreenProps } from './practiceScreens';

/**
 * Email on the computer: each service's website (Apple Mail: the Mac program), with its own
 * arrangement of the compose button, folders, list, reading pane and writing window.
 * Built from how these websites are generally organised, in simplified form, not copied.
 * The same screen and button ids as the phone lessons, so every email lesson also works here.
 */

type Look = {
  page: string;
  top: string; topFg: string; mark: string; markColor: string;
  side: string; sideFg: string; active: string; activeFg: string;
  btn: string; btnFg: string; btnShape: string;
  send: string; sendFg: string;
  composeIn: 'float' | 'pane' | 'main' | 'window';
  sendAt: 'bottom-left' | 'top-left' | 'bottom-right';
  replyAt: 'below' | 'header' | 'bar' | 'toolbar';
  starAt: 'header' | 'bar' | 'ribbon' | 'toolbar';
  searchAt: 'top' | 'list' | 'toolbar';
};

const LOOKS: Record<string, Look> = {
  gmail: { page: '#F6F8FC', top: '#F6F8FC', topFg: '#1F1F1F', mark: 'Gmail', markColor: '#5F6368', side: '#F6F8FC', sideFg: '#1F1F1F', active: '#D3E3FD', activeFg: '#001D35', btn: '#C2E7FF', btnFg: '#001D35', btnShape: 'rounded-2xl', send: '#0B57D0', sendFg: '#FFFFFF', composeIn: 'float', sendAt: 'bottom-left', replyAt: 'below', starAt: 'header', searchAt: 'top' },
  outlook: { page: '#F5F5F5', top: '#0F6CBD', topFg: '#FFFFFF', mark: 'Outlook', markColor: '#FFFFFF', side: '#F5F5F5', sideFg: '#242424', active: '#CFE4FA', activeFg: '#242424', btn: '#0F6CBD', btnFg: '#FFFFFF', btnShape: 'rounded-md', send: '#0F6CBD', sendFg: '#FFFFFF', composeIn: 'pane', sendAt: 'top-left', replyAt: 'header', starAt: 'ribbon', searchAt: 'top' },
  applemail: { page: '#FFFFFF', top: '#ECECEC', topFg: '#1D1D1F', mark: 'Mail', markColor: '#1D1D1F', side: '#E4E4E8', sideFg: '#1D1D1F', active: '#D0D0D6', activeFg: '#1D1D1F', btn: '#007AFF', btnFg: '#FFFFFF', btnShape: 'rounded-md', send: '#007AFF', sendFg: '#FFFFFF', composeIn: 'window', sendAt: 'top-left', replyAt: 'toolbar', starAt: 'toolbar', searchAt: 'toolbar' },
  gmx: { page: '#F2F4F8', top: '#1C449B', topFg: '#FFFFFF', mark: 'GMX', markColor: '#FFFFFF', side: '#FFFFFF', sideFg: '#1F2A44', active: '#E3EAF8', activeFg: '#1C449B', btn: '#2E7D32', btnFg: '#FFFFFF', btnShape: 'rounded-md', send: '#2E7D32', sendFg: '#FFFFFF', composeIn: 'main', sendAt: 'top-left', replyAt: 'bar', starAt: 'bar', searchAt: 'list' },
  webde: { page: '#F4F4EE', top: '#FFD800', topFg: '#333333', mark: 'WEB.DE', markColor: '#333333', side: '#FFFFFF', sideFg: '#333333', active: '#FFF4B0', activeFg: '#333333', btn: '#FFD800', btnFg: '#333333', btnShape: 'rounded-md', send: '#FFD800', sendFg: '#333333', composeIn: 'main', sendAt: 'top-left', replyAt: 'bar', starAt: 'bar', searchAt: 'list' },
  tonline: { page: '#F6F6F6', top: '#E20074', topFg: '#FFFFFF', mark: 't-online', markColor: '#FFFFFF', side: '#FFFFFF', sideFg: '#262626', active: '#FBE3EF', activeFg: '#A1005A', btn: '#E20074', btnFg: '#FFFFFF', btnShape: 'rounded-md', send: '#E20074', sendFg: '#FFFFFF', composeIn: 'main', sendAt: 'top-left', replyAt: 'bar', starAt: 'bar', searchAt: 'top' },
  yahoo: { page: '#FFFFFF', top: '#FFFFFF', topFg: '#232A31', mark: 'yahoo!mail', markColor: '#6001D2', side: '#FFFFFF', sideFg: '#232A31', active: '#EDE3FB', activeFg: '#3F0B8D', btn: '#6001D2', btnFg: '#FFFFFF', btnShape: 'rounded-full', send: '#6001D2', sendFg: '#FFFFFF', composeIn: 'main', sendAt: 'bottom-left', replyAt: 'header', starAt: 'header', searchAt: 'top' },
  proton: { page: '#F7F6FB', top: '#FFFFFF', topFg: '#1B1340', mark: 'Proton Mail', markColor: '#6D4AFF', side: '#F7F6FB', sideFg: '#1B1340', active: '#E7E1FF', activeFg: '#372580', btn: '#6D4AFF', btnFg: '#FFFFFF', btnShape: 'rounded-lg', send: '#6D4AFF', sendFg: '#FFFFFF', composeIn: 'float', sendAt: 'bottom-right', replyAt: 'header', starAt: 'bar', searchAt: 'top' },
};

const icon = 'flex items-center justify-center rounded-lg shrink-0';
const COMPOSE_SCREENS = ['new-to', 'new-subject', 'new-body', 'new-attach', 'new-body-att', 'reply', 'forward-to', 'forward-body', 'attach-pick'];

/** The get-started lesson has its own screen names. */
const START_SCREENS: Record<string, string> = { 'web-inbox': 'inbox', 'web-checked': 'inbox', 'web-to': 'new-to', 'web-subject': 'new-subject', 'web-body': 'new-body' };

export const EmailWeb: React.FC<PracticeScreenProps> = ({ screen: givenScreen, isDone, appId, kind, labels, lang }) => {
  const { typed, fields, lastWrongId, clearWrong, freeRoam } = useContext(PracticeContext);
  const de = lang === 'de';
  const service = appId ?? 'gmail';
  const look = LOOKS[service] ?? LOOKS.gmail;
  const pane = READING_PANE[service] ?? true;
  const screen = START_SCREENS[givenScreen] ?? givenScreen;
  const url = EMAIL_URL[service];
  const time = clockTime();

  const composing = !isDone && COMPOSE_SCREENS.includes(screen);
  const isReply = screen === 'reply';
  const isForward = screen === 'forward-to' || screen === 'forward-body';
  const mailOpen = !isDone && (['mail', 'mail-starred', 'mail-menu', 'unsub-confirm', 'trash-mail'].includes(screen) || ((isReply || isForward) && (look.replyAt === 'below' || pane)));
  const folder = screen === 'trash' || screen === 'trash-mail' ? 'trash' : screen === 'starred' ? 'starred' : screen === 'search-results' ? '' : 'inbox';
  const afterDelete = kind === 'restore' && ['inbox-after', 'folders'].includes(screen);
  const starred = screen === 'mail-starred' || (kind === 'star' && screen === 'folders');

  // Which email is open, as on the phone.
  const isClub = kind === 'restore';
  const isPrize = kind === 'spam';
  const isNews = kind === 'unsubscribe';
  const open = {
    id: isClub ? 'mail-club' : isPrize ? 'mail-prize' : isNews ? 'mail-news' : 'mail-anna',
    from: isClub ? labels.club : isPrize ? labels.prizeFrom : isNews ? labels.news : labels.anna,
    subject: isClub ? labels.subjectClub : isPrize ? labels.prizeSubject : isNews ? labels.subjectNews : labels.subjectAnna,
    text: isClub ? labels.bodyClub : isPrize ? labels.prizeBody : isNews ? labels.bodyNews : labels.bodyAnna,
    color: isClub ? '#7E9B5D' : isPrize ? '#8A6D3B' : isNews ? '#6D8AA8' : '#C0689B',
  };

  let mails = [
    { id: 'mail-anna', from: labels.anna, subject: labels.subjectAnna, preview: labels.previewAnna, when: time, unread: true, color: '#C0689B' },
    { id: 'mail-club', from: labels.club, subject: labels.subjectClub, preview: labels.previewClub, when: labels.yesterday, unread: false, color: '#7E9B5D' },
    { id: 'mail-news', from: labels.news, subject: labels.subjectNews, preview: labels.previewNews, when: labels.yesterday, unread: false, color: '#6D8AA8' },
  ].filter((m) => !(afterDelete && m.id === 'mail-club'));
  if (labels.prizeFrom && (kind === 'spam' || freeRoam)) mails.push({ id: 'mail-prize', from: labels.prizeFrom, subject: labels.prizeSubject, preview: labels.prizePreview, when: labels.yesterday, unread: true, color: '#8A6D3B' });
  let listIds: (id: string) => string = (id) => id;
  if (screen === 'trash' || screen === 'trash-mail') {
    mails = [{ id: 'trash-club', from: labels.club, subject: labels.subjectClub, preview: labels.previewClub, when: labels.yesterday, unread: false, color: '#7E9B5D' }];
  } else if (screen === 'starred') {
    mails = [{ id: 'starred-anna', from: labels.anna, subject: labels.subjectAnna, preview: labels.previewAnna, when: time, unread: false, color: '#C0689B' }];
  } else if (screen === 'search-results') {
    mails = [
      { id: 'result-anna', from: labels.anna, subject: labels.subjectAnna, preview: labels.previewAnna, when: time, unread: false, color: '#C0689B' },
      { id: 'result-other', from: labels.club, subject: labels.subjectClub, preview: labels.previewClub, when: labels.yesterday, unread: false, color: '#7E9B5D' },
    ];
  } else if (mailOpen || composing) {
    listIds = () => ''; // the list behind an open email is only for looking at
  }

  const t = (en: string, deText: string) => (de ? deText : en);
  const draftsWord = labels.draftsFolder ?? t('Drafts', 'Entwürfe');

  /* ---------- parts ---------- */

  const composeButton = (extra = '') => (
    <PracticeTap id="compose" label={labels.compose} pointer="below" className={`flex items-center gap-2 px-4 font-bold text-[0.98rem] ${look.btnShape} ${extra}`} style={{ background: look.btn, color: look.btnFg }}>
      <Pencil size={18} aria-hidden="true" />{labels.compose}
    </PracticeTap>
  );

  const searchBox = (wide: boolean) => {
    const typing = screen === 'search-mail';
    const box = 'flex items-center gap-2 px-3 text-[0.95rem] text-left';
    const shape = service === 'outlook' ? 'rounded-md' : service === 'applemail' ? 'rounded-md' : 'rounded-full';
    const bg = service === 'outlook' ? '#FFFFFF' : service === 'gmail' ? '#E9EEF6' : '#F1F2F4';
    if (typing) {
      return (
        <div className={`${box} ${shape} min-h-[40px] ${wide ? 'flex-1 max-w-[520px]' : 'w-56'}`} style={{ background: '#FFFFFF', color: '#1F1F1F', border: `2px solid ${look.send}` }}>
          <span className="flex-1 min-w-0 truncate">{typed}<Cursor /></span>
          {typed ? (
            <PracticeTap id="send" label={labels.searchGo} pointer="below-right" className={icon} style={{ color: look.send }}><Search size={20} aria-hidden="true" /></PracticeTap>
          ) : <Search size={18} aria-hidden="true" style={{ color: '#5F6368' }} />}
        </div>
      );
    }
    return (
      <PracticeTap id="search" label={labels.search} pointer="below" className={`${box} ${shape} ${wide ? 'flex-1 max-w-[520px]' : 'w-56'}`} style={{ background: bg, color: '#5F6368', border: service === 'outlook' ? '1px solid #D1D1D1' : undefined }}>
        <Search size={18} aria-hidden="true" />{labels.searchMail ?? labels.search}
      </PracticeTap>
    );
  };

  const folderList: [string, React.ElementType, string, string | undefined][] = [
    ['inbox', InboxIcon, labels.inboxFolder ?? labels.inbox, 'folder-inbox'],
    ['starred', service === 'outlook' || service === 'applemail' ? Flag : Star, labels.starredFolder, 'folder-starred'],
    ['sent', Send, labels.sentFolder, 'folder-sent'],
    ['drafts', File, draftsWord, undefined],
    ['spam', TriangleAlert, labels.spamFolder, 'folder-spam'],
    ['trash', Trash2, labels.trashFolder, 'folder-trash'],
  ];
  const sidebar = (withCompose: boolean, width = 200) => (
    <div className="shrink-0 flex flex-col gap-0.5 p-2 overflow-hidden" style={{ width, background: look.side, color: look.sideFg, borderRight: service === 'gmail' || service === 'proton' ? undefined : '1px solid #E1E3E6' }}>
      {withCompose && composeButton(service === 'gmx' || service === 'webde' || service === 'tonline' ? 'w-full justify-center mb-2' : 'mb-2 self-start')}
      {service === 'outlook' && <span aria-hidden="true" className="px-3 pt-1 text-[0.8rem] font-bold" style={{ color: '#616161' }}>{t('Folders', 'Ordner')}</span>}
      {service === 'applemail' && <span aria-hidden="true" className="px-3 pt-1 text-[0.8rem] font-bold" style={{ color: '#6E6E73' }}>{t('Mailboxes', 'Postfächer')}</span>}
      {folderList.map(([key, Glyph, name, id]) => {
        const active = folder === key;
        const cls = `flex items-center gap-3 px-3 text-[0.95rem] text-left w-full ${service === 'gmail' || service === 'yahoo' || service === 'proton' ? 'rounded-full' : 'rounded-md'}`;
        const style = active ? { background: look.active, color: look.activeFg, fontWeight: 700 } : undefined;
        const content = (<><Glyph size={18} aria-hidden="true" /><span className="flex-1 truncate">{name}</span>{key === 'inbox' && <span aria-hidden="true" className="text-[0.8rem] font-bold">1</span>}</>);
        return id ? (
          <PracticeTap key={key} id={id} label={name} pointer="below" className={`${cls} !min-h-[36px]`} style={style}>{content}</PracticeTap>
        ) : (
          <span key={key} aria-hidden="true" className={`${cls} min-h-[36px]`} style={style}>{content}</span>
        );
      })}
    </div>
  );

  const list = (narrow: boolean) => (
    <div className="flex flex-col min-h-0 overflow-hidden" style={{ width: narrow ? 300 : undefined, flex: narrow ? undefined : 1, background: '#FFFFFF', borderRight: narrow ? '1px solid #E1E3E6' : undefined }}>
      {look.searchAt === 'list' && <div className="p-2 shrink-0" style={{ borderBottom: '1px solid #E1E3E6' }}>{searchBox(false)}</div>}
      {service === 'outlook' && (
        <div aria-hidden="true" className="flex gap-4 px-3 pt-2 text-[0.9rem] font-bold shrink-0" style={{ color: '#242424' }}>
          <span className="pb-1" style={{ borderBottom: '3px solid #0F6CBD' }}>{labels.focused}</span><span className="pb-1" style={{ color: '#616161' }}>{labels.other}</span>
        </div>
      )}
      {service === 'gmail' && (
        <div aria-hidden="true" className="flex items-center gap-4 px-4 py-1.5 shrink-0" style={{ color: '#444746' }}>
          <span className="w-4 h-4 rounded-sm" style={{ border: '2px solid #444746' }} /><RefreshCw size={16} /><MoreVertical size={16} />
        </div>
      )}
      {screen === 'search-results' && <p className="px-3 py-1.5 text-[0.9rem] font-bold shrink-0" style={{ color: '#444746' }}>{labels.resultsWord}</p>}
      <div className="flex-1 min-h-0 sim-scroll">
        {mails.map((m) => {
          const id = listIds(m.id);
          const selected = (mailOpen || (composing && (isReply || isForward))) && (m.id === open.id || (screen === 'trash-mail' && m.id === 'trash-club'));
          const isStarredRow = (starred && m.id === 'mail-anna') || screen === 'starred';
          const row = narrow ? (
            <>
              <Avatar name={m.from} color={m.color} size={34} />
              <span className="min-w-0 flex-1 leading-snug text-[0.9rem]">
                <span className="flex justify-between gap-2"><span className="truncate" style={{ fontWeight: m.unread ? 700 : 400 }}>{m.from}</span><span className="text-[0.75rem] shrink-0" style={{ color: m.unread && service === 'outlook' ? '#0F6CBD' : '#5F6368' }}>{m.when}</span></span>
                <span className="flex items-center gap-1"><span className="truncate flex-1" style={{ fontWeight: m.unread ? 700 : 400, color: m.unread && service === 'outlook' ? '#0F6CBD' : undefined }}>{m.subject}</span>{isStarredRow && (service === 'outlook' || service === 'applemail' ? <Flag size={14} aria-hidden="true" fill="#C4314B" color="#C4314B" /> : <Star size={14} aria-hidden="true" fill="#E0A800" color="#E0A800" />)}</span>
                <span className="block truncate" style={{ color: '#5F6368' }}>{m.preview}</span>
              </span>
            </>
          ) : (
            <>
              <span aria-hidden="true" style={{ color: isStarredRow ? '#E0A800' : '#747775' }}><Star size={17} fill={isStarredRow ? 'currentColor' : 'none'} /></span>
              <span className="w-44 shrink-0 truncate" style={{ fontWeight: m.unread ? 700 : 400 }}>{m.from}</span>
              <span className="flex-1 min-w-0 truncate"><span style={{ fontWeight: m.unread ? 700 : 400 }}>{m.subject}</span><span style={{ color: '#5F6368' }}> – {m.preview}</span></span>
              <span className="text-[0.8rem] shrink-0" style={{ fontWeight: m.unread ? 700 : 400, color: m.unread ? '#1F1F1F' : '#5F6368' }}>{m.when}</span>
            </>
          );
          const cls = `flex items-center gap-3 w-full text-left px-3 ${narrow ? 'py-2' : 'py-1.5'} text-[0.92rem]`;
          const style = { borderBottom: '1px solid #EEF0F2', background: selected ? look.active : m.unread && !narrow && service === 'gmail' ? '#FFFFFF' : undefined, borderLeft: service === 'outlook' && m.unread ? '3px solid #0F6CBD' : undefined };
          return id ? (
            <PracticeTap key={m.id} id={id} label={`${m.from}: ${m.subject}`} className={cls} style={style}>{row}</PracticeTap>
          ) : (
            <div key={m.id} aria-hidden="true" className={`${cls} min-h-[44px]`} style={style}>{row}</div>
          );
        })}
      </div>
    </div>
  );

  const actionTap = (id: string, label: string, Glyph: React.ElementType, withText = false, extra: React.CSSProperties = {}) => (
    <PracticeTap key={id} id={id} label={label} pointer="below" className={`${icon} gap-1.5 ${withText ? 'px-2 text-[0.9rem] font-bold' : ''}`} style={extra}>
      <Glyph size={19} aria-hidden="true" />{withText && label}
    </PracticeTap>
  );
  const greyIcon = (key: string, Glyph: React.ElementType, text?: string) => (
    <span key={key} aria-hidden="true" className="flex items-center gap-1.5 px-2 min-h-[40px] text-[0.9rem]" style={{ color: '#9AA0A6' }}><Glyph size={19} />{text}</span>
  );

  // The bar above an open email (not Outlook and the Mac, which have their actions at the top of the page or window).
  const mailBar = () => {
    const inTrash = screen === 'trash-mail';
    if (service === 'outlook' || service === 'applemail') return null;
    return (
      <div className="flex items-center gap-1 px-2 py-1 shrink-0" style={{ borderBottom: '1px solid #EEF0F2', color: '#444746' }}>
        {!pane && actionTap('back', labels.back, ArrowLeft)}
        {look.replyAt === 'bar' && !inTrash && <>{actionTap('reply', labels.reply, Reply, true)}{labels.forward && actionTap('forward', labels.forward, Forward, true)}</>}
        {inTrash ? actionTap('move-inbox', labels.moveToInbox, ArchiveRestore, true) : actionTap('archive', labels.archive, Archive)}
        {actionTap('delete', labels.deleteMail, Trash2)}
        {look.starAt === 'bar' && labels.starWord && !inTrash && actionTap('star', labels.starWord, Star, false, starred ? { color: '#E0A800' } : {})}
        <span className="flex-1" />
      </div>
    );
  };

  const replyButtons = (big: boolean, iconOnly = false) => (
    <span className="flex items-center gap-1 shrink-0">
      {[{ id: 'reply', label: labels.reply, Glyph: Reply }, ...(labels.forward ? [{ id: 'forward', label: labels.forward, Glyph: Forward }] : [])].map(({ id, label, Glyph }) => (
        <PracticeTap key={id} id={id} label={label} pointer="below-right" className={`flex items-center gap-1.5 px-3 text-[0.9rem] font-bold ${big ? 'rounded-full' : 'rounded-md'}`} style={big ? { border: '1px solid #747775', color: '#1F1F1F' } : { color: look.send === '#FFD800' ? '#333333' : look.send }}>
          <Glyph size={iconOnly ? 20 : 18} aria-hidden="true" />{!iconOnly && label}
        </PracticeTap>
      ))}
    </span>
  );

  const reader = () => {
    const inTrash = screen === 'trash-mail';
    const StarGlyph = service === 'outlook' || service === 'applemail' ? Flag : Star;
    const unsubInline = service === 'gmail' || service === 'yahoo';
    const replyInline = (isReply || isForward) && look.replyAt === 'below';
    return (
      <div className="flex-1 min-w-0 flex flex-col min-h-0 relative" style={{ background: '#FFFFFF', color: '#1F1F1F' }}>
        {mailBar()}
        <div className="flex-1 min-h-0 sim-scroll px-5 py-3">
          {isNews && !unsubInline && (
            <p className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-md text-[0.9rem]" style={{ background: '#F1F3F4' }}>
              <span className="flex-1">{t('This email is from a mailing list.', 'Diese E-Mail kommt von einer Mailingliste.')}</span>
              <PracticeTap id="unsubscribe" label={labels.unsubscribe} pointer="below-right" className="px-2 rounded-md font-bold underline" style={{ color: look.send === '#FFD800' ? '#333333' : look.send }}>{labels.unsubscribe}</PracticeTap>
            </p>
          )}
          <div className="flex items-start gap-2 mb-2">
            <h3 className="flex-1 text-[1.3rem] font-bold leading-tight">{open.subject}</h3>
            {service === 'gmail' && <span aria-hidden="true" className="px-2 rounded text-[0.75rem]" style={{ background: '#E8EAED' }}>{inTrash ? labels.trashFolder : labels.inbox}</span>}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Avatar name={open.from} color={open.color} size={38} />
            <span className="min-w-0 flex-1 text-[0.9rem] leading-tight">
              <span className="flex items-center gap-2"><strong className="truncate">{open.from}</strong>
                {isNews && unsubInline && <PracticeTap id="unsubscribe" label={labels.unsubscribe} pointer="below" className="px-1 rounded text-[0.85rem] underline shrink-0" style={{ color: '#444746' }}>{labels.unsubscribe}</PracticeTap>}
              </span>
              <span className="block truncate" style={{ color: '#5F6368' }}>{labels.toMe}</span>
            </span>
            <span className="text-[0.8rem] shrink-0" style={{ color: '#5F6368' }}>{time}</span>
            {look.starAt === 'header' && labels.starWord && !inTrash && actionTap('star', labels.starWord, StarGlyph, false, starred ? { color: '#E0A800' } : { color: '#444746' })}
            {look.replyAt === 'header' && !inTrash && replyButtons(false, pane)}
            {service !== 'applemail' && <PracticeTap id="mail-more" label={labels.moreOptions ?? labels.menu} pointer="below-right" className={icon} style={{ color: '#444746' }}>{service === 'outlook' ? <MoreHorizontal size={20} aria-hidden="true" /> : <MoreVertical size={20} aria-hidden="true" />}</PracticeTap>}
          </div>
          <p className="text-[1rem] leading-snug whitespace-pre-line">{open.text}</p>
          {isPrize && <PracticeTap id="prize-link" label={labels.prizeLink} className="mt-2 px-2 rounded-md font-bold underline text-[1rem]" style={{ color: '#0B57D0' }}>{labels.prizeLink}</PracticeTap>}
          {look.replyAt === 'below' && !inTrash && !replyInline && <div className="mt-4">{replyButtons(true)}</div>}
          {replyInline && <div className="mt-3">{composeBox('inline')}</div>}
        </div>
        {screen === 'mail-menu' && (
          <div className={`absolute z-30 ${service === 'applemail' ? 'right-2 top-1' : 'right-4 top-24'} w-60 rounded-lg shadow-xl py-1 sim-fade`} style={{ background: '#FFFFFF', border: '1px solid #DADCE0' }}>
            <PracticeTap id="report-spam" label={labels.reportSpam} pointer="below" className="flex items-center gap-3 px-3 w-full text-left text-[0.95rem]"><TriangleAlert size={18} aria-hidden="true" />{labels.reportSpam}</PracticeTap>
            <PracticeTap id="mark-unread" label={labels.markUnread} className="flex items-center gap-3 px-3 w-full text-left text-[0.95rem]"><Mail size={18} aria-hidden="true" />{labels.markUnread}</PracticeTap>
          </div>
        )}
      </div>
    );
  };

  const emptyPane = (
    <div aria-hidden="true" className="flex-1 flex flex-col items-center justify-center gap-2 text-center p-6" style={{ background: '#FAFAFA', color: '#5F6368' }}>
      <Mail size={44} /><p className="text-[1rem]">{t('Select an email to read it.', 'Wählen Sie eine E-Mail aus, um sie zu lesen.')}</p>
    </div>
  );

  /* ---------- writing ---------- */

  function composeBox(place: 'inline' | 'float' | 'pane' | 'main' | 'window') {
    const toStep = screen === 'new-to' || screen === 'forward-to';
    const subjectStep = screen === 'new-subject';
    const hasFile = screen === 'new-body-att';
    const bodyStep = ['new-body', 'new-attach', 'new-body-att', 'reply', 'forward-body'].includes(screen);
    const recipient = screen === 'forward-body' ? labels.peter : isReply || !toStep ? labels.anna : '';
    const subject = isForward ? `Fwd: ${labels.subjectAnna}` : isReply ? `Re: ${labels.subjectAnna}` : fields.subject ?? '';
    const title = isReply ? labels.reply : isForward ? labels.forward : service === 'gmail' ? t('New Message', 'Neue Nachricht') : labels.compose;
    const row = 'flex items-center gap-2 px-3 py-1.5 text-[0.95rem] shrink-0';
    const line = { borderBottom: '1px solid #E8EAED' };
    const sendButton = service === 'applemail' ? (
      <PracticeTap id="send" label={labels.send} pointer="below" className={icon} style={{ color: bodyStep && typed ? '#007AFF' : '#8E8E93' }}><Send size={22} aria-hidden="true" /></PracticeTap>
    ) : (
      <PracticeTap id="send" label={labels.send} pointer={look.sendAt === 'top-left' ? 'below' : 'above-left'} className={`px-5 font-bold text-[0.95rem] ${service === 'gmail' || service === 'yahoo' ? 'rounded-full' : 'rounded-md'}`} style={{ background: look.send, color: look.sendFg }}>
        {labels.send}
      </PracticeTap>
    );
    const attachButton = (
      <PracticeTap id="attach" label={labels.attachMail} pointer={look.sendAt === 'top-left' || service === 'applemail' ? 'below' : 'above-left'} className={`${icon} gap-1 px-1`} style={{ color: '#444746' }}>
        <Paperclip size={19} aria-hidden="true" />{(service === 'outlook' || service === 'gmx' || service === 'webde' || service === 'tonline') && <span className="text-[0.85rem]">{t('Attach', 'Anhang')}</span>}
      </PracticeTap>
    );
    const topBar = look.sendAt === 'top-left' && service !== 'applemail';
    const suggestions = toStep && typed.length > 0 && (
      <div className="absolute left-10 right-0 top-full z-20 shadow-lg sim-fade" style={{ background: '#FFFFFF', border: '1px solid #DADCE0' }}>
        {[['contact-anna', labels.anna, labels.mailAnna, '#C0689B'], ['contact-peter', labels.peter, labels.mailPeter, '#7E9B5D']].map(([id, name, mail, colour]) => (
          <PracticeTap key={id} id={id} label={`${name}, ${mail}`} pointer="below" className="flex items-center gap-3 px-3 py-1 w-full text-left">
            <Avatar name={name} color={colour} size={30} /><span className="text-[0.9rem] leading-tight"><span className="block font-bold">{name}</span><span className="block" style={{ color: '#5F6368' }}>{mail}</span></span>
          </PracticeTap>
        ))}
      </div>
    );
    const header = place === 'float' || place === 'window' ? (
      <div className="flex items-center gap-2 px-3 py-1.5 shrink-0 rounded-t-xl" style={{ background: service === 'applemail' ? '#ECECEC' : service === 'proton' ? '#FFFFFF' : '#F2F6FC', borderBottom: '1px solid #E1E3E6' }}>
        {service === 'applemail' && sendButton}
        <span className="flex-1 font-bold text-[0.95rem] truncate">{title}</span>
        {service === 'applemail' ? attachButton : <span aria-hidden="true" style={{ color: '#444746' }}><X size={18} /></span>}
      </div>
    ) : null;
    return (
      <div className={`flex flex-col min-h-0 ${place === 'inline' ? 'rounded-xl' : ''} ${place === 'pane' || place === 'main' ? 'flex-1' : ''}`} style={{ background: '#FFFFFF', color: '#1F1F1F', border: place === 'inline' ? '1px solid #DADCE0' : undefined, height: place === 'float' || place === 'window' ? '100%' : undefined }}>
        {header}
        {topBar && (
          <div className="flex items-center gap-2 px-3 py-1.5 shrink-0" style={line}>
            {sendButton}{attachButton}
            <span aria-hidden="true" className="px-2 text-[0.9rem]" style={{ color: '#5F6368' }}>{t('Discard', 'Verwerfen')}</span>
          </div>
        )}
        <div className={`${row} relative`} style={{ ...line, zIndex: 5 }}>
          <span style={{ color: '#5F6368' }}>{labels.toLabel}</span>
          {recipient ? (
            <span className="flex items-center gap-1 px-2 rounded-full text-[0.9rem]" style={{ background: '#E8EAED' }}><Avatar name={recipient} color={recipient === labels.peter ? '#7E9B5D' : '#C0689B'} size={18} />{recipient}</span>
          ) : (
            <span className="flex-1 min-w-0 truncate" style={{ minHeight: '1.4em' }}>{typed}{toStep && <Cursor />}</span>
          )}
          {suggestions}
        </div>
        {(service === 'outlook' || service === 'applemail') && !isReply && <p className={row} style={{ ...line, color: '#5F6368' }}>{labels.ccLabel}</p>}
        <div className={row} style={line}>
          <span style={{ color: '#5F6368' }}>{labels.subjectLabel}</span>
          <span className="flex-1 min-w-0 truncate">{subjectStep ? <>{typed}<Cursor /></> : subject}</span>
        </div>
        {hasFile && <p className={row} style={line}><ImageIcon size={18} aria-hidden="true" style={{ color: look.send === '#FFD800' ? '#333' : look.send }} /><strong className="truncate">{labels.filePhoto}</strong><CheckCircle2 size={18} aria-hidden="true" style={{ color: '#176B68' }} /></p>}
        {subjectStep ? (
          <PracticeTap id="body-field" label={labels.writeHere} pointer="below" className="flex-1 m-2 px-2 text-left text-[0.95rem] rounded-lg items-start !justify-start" style={{ color: '#747775', minHeight: 60 }}>{labels.writeHere}</PracticeTap>
        ) : (
          <p className="flex-1 min-h-[48px] px-3 py-2 text-[0.98rem] break-words overflow-hidden">
            {bodyStep ? (typed || <span style={{ color: '#747775' }}>{labels.writeHere}</span>) : <span style={{ color: '#747775' }}>{labels.writeHere}</span>}
            {bodyStep && <Cursor />}
          </p>
        )}
        {!topBar && service !== 'applemail' && (
          <div className={`flex items-center gap-2 px-3 py-2 shrink-0 ${look.sendAt === 'bottom-right' ? 'flex-row-reverse' : ''}`} style={{ borderTop: '1px solid #F1F3F4' }}>
            {sendButton}{attachButton}
            <span className="flex-1" />
            <span aria-hidden="true" style={{ color: '#5F6368' }}><Trash2 size={18} /></span>
          </div>
        )}
      </div>
    );
  }

  /* ---------- page ---------- */

  let main: React.ReactNode;
  const inlineReply = (isReply || isForward) && look.replyAt === 'below';
  if (isDone) {
    const sentMail = !kind || kind === 'new' || kind === 'reply' || kind === 'forward' || kind === 'attach';
    main = (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6 text-center sim-fade" style={{ background: '#FFFFFF', color: '#1F1F1F' }}>
        <CheckCircle2 size={56} style={{ color: '#176B68' }} aria-hidden="true" />
        <h3 className="text-[1.3rem] font-bold">{labels.doneTitle || labels.sent}</h3>
        {labels.doneText && <p className="text-[1rem]">{labels.doneText}</p>}
        {sentMail && kind !== 'forward' && kind !== 'attach' && (
          <p className="text-[0.95rem] max-w-md break-words"><strong>{labels.toLabel}:</strong> {labels.anna} · <strong>{labels.subjectLabel}:</strong> {kind === 'reply' ? `Re: ${labels.subjectAnna}` : fields.subject || labels.subj1}</p>
        )}
        <p className="text-[0.9rem]">{labels.noRealMail}</p>
      </div>
    );
  } else if (composing && inlineReply) {
    main = reader(); // Gmail: the answer is written right under the email
  } else if (composing && look.composeIn === 'main') {
    main = composeBox('main');
  } else if (composing && look.composeIn === 'pane') {
    main = <>{list(true)}{composeBox('pane')}</>;
  } else {
    // An email is open, or a writing window floats above the page.
    const showMail = composing ? isReply || isForward : mailOpen;
    main = pane ? <>{list(true)}{showMail ? reader() : emptyPane}</> : showMail ? reader() : list(false);
  }

  const floating = composing && !inlineReply && (look.composeIn === 'float' || look.composeIn === 'window') && (
    <div className={`absolute z-30 shadow-2xl sim-fade ${look.composeIn === 'window' ? 'left-1/2 -translate-x-1/2 top-4 w-[520px] rounded-xl' : 'right-4 bottom-0 w-[460px] rounded-t-xl'}`} style={{ height: look.composeIn === 'window' ? 300 : 330, background: '#FFFFFF', border: '1px solid #C8CDD3' }}>
      {composeBox(look.composeIn === 'window' ? 'window' : 'float')}
    </div>
  );

  const dialogs = (
    <>
      {screen === 'unsub-confirm' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center sim-fade" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div role="dialog" aria-label={labels.unsubscribe} className="w-[380px] rounded-xl p-4 space-y-3" style={{ background: '#FFFFFF', color: '#1F1F1F' }}>
            <p className="text-[1.1rem] font-bold">{labels.unsubscribe}</p>
            <p className="text-[1rem]">{labels.unsubSure}</p>
            <div className="flex justify-end gap-2">
              <PracticeTap id="back" label={labels.noKeep} className="px-4 rounded-md font-bold text-[0.95rem]" style={{ color: '#1F1F1F', border: '1px solid #9AA0A6' }}>{labels.noKeep}</PracticeTap>
              <PracticeTap id="unsub-yes" label={labels.unsubYes} pointer="below-right" className="px-4 rounded-md font-bold text-[0.95rem]" style={{ background: look.send, color: look.sendFg }}>{labels.unsubYes}</PracticeTap>
            </div>
          </div>
        </div>
      )}
      {screen === 'attach-pick' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center sim-fade" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div role="dialog" aria-label={labels.chooseFile} className="w-[420px] rounded-xl overflow-hidden" style={{ background: '#FFFFFF', color: '#1F1F1F' }}>
            <p className="px-4 py-2 font-bold text-[1.05rem]" style={{ background: '#F1F3F4' }}>{labels.chooseFile}</p>
            <PracticeTap id="file-photo" label={labels.filePhoto} pointer="below" className="flex items-center gap-3 px-4 w-full text-left text-[0.95rem]"><ImageIcon size={22} aria-hidden="true" style={{ color: '#176B68' }} />{labels.filePhoto}</PracticeTap>
            <PracticeTap id="file-doc" label={labels.fileDoc} className="flex items-center gap-3 px-4 w-full text-left text-[0.95rem]"><FileText size={22} aria-hidden="true" style={{ color: '#B3261E' }} />{labels.fileDoc}</PracticeTap>
          </div>
        </div>
      )}
      {lastWrongId === 'send' && (screen === 'new-to' || screen === 'new-subject') && (
        <div className="absolute inset-0 z-40 flex items-center justify-center sim-fade" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div role="alertdialog" aria-label={screen === 'new-to' ? labels.alertToTitle : labels.alertSubjectTitle} className="w-[400px] rounded-xl p-4" style={{ background: '#FFFFFF', color: '#1F1F1F' }}>
            <p className="flex items-start gap-2 text-[1.1rem] font-bold"><TriangleAlert size={22} aria-hidden="true" className="shrink-0" style={{ color: look.send === '#FFD800' ? '#8A6D00' : look.send }} />{screen === 'new-to' ? labels.alertToTitle : labels.alertSubjectTitle}</p>
            <p className="mt-1 text-[1rem]">{screen === 'new-to' ? labels.alertToText : labels.alertSubjectText}</p>
            <div className="flex justify-end mt-2">
              <button type="button" onClick={(event) => { event.stopPropagation(); clearWrong(); }} className="px-4 min-h-[44px] rounded-md font-bold" style={{ color: look.send === '#FFD800' ? '#333' : look.send }}>{screen === 'new-to' ? labels.okWord : labels.alertSubjectBack}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const typingWords = screen === 'new-to' || screen === 'forward-to' ? (screen === 'forward-to' ? ['Peter', 'Anna'] : ['Anna', 'Peter'])
    : screen === 'new-subject' ? [labels.subj1, labels.subj2, labels.subj3]
      : screen === 'forward-body' ? [labels.suggestF1, labels.suggestF2, labels.suggestF3]
        : screen === 'search-mail' ? [labels.suggestSearch1, labels.suggestSearch2, labels.suggestSearch3]
          : [labels.suggest1, labels.suggest2, labels.suggest3];
  const typing = !isDone && ['new-to', 'new-subject', 'new-body', 'new-body-att', 'reply', 'forward-to', 'forward-body', 'search-mail'].includes(screen);

  /* ---------- the top of the page, per service ---------- */

  let top: React.ReactNode;
  if (service === 'applemail') {
    const onMail = mailOpen && !composing;
    const inTrash = screen === 'trash-mail';
    top = (
      <div className="flex items-center gap-1 px-3 py-1 shrink-0" style={{ background: look.top, color: '#3A3A3C', borderBottom: '1px solid #D1D1D6' }}>
        <span className="w-[190px] shrink-0 font-bold text-[1rem]" style={{ color: '#1D1D1F' }}>{labels.inbox}</span>
        <PracticeTap id="compose" label={labels.compose} pointer="below" className={icon}><SquarePen size={20} aria-hidden="true" /></PracticeTap>
        {onMail ? (inTrash ? actionTap('move-inbox', labels.moveToInbox, ArchiveRestore, true) : actionTap('archive', labels.archive, Archive)) : greyIcon('a', Archive)}
        {onMail ? actionTap('delete', labels.deleteMail, Trash2) : greyIcon('d', Trash2)}
        {onMail && !inTrash ? actionTap('reply', labels.reply, Reply) : greyIcon('r', Reply)}
        {greyIcon('ra', ReplyAll)}
        {onMail && !inTrash && labels.forward ? actionTap('forward', labels.forward, Forward) : greyIcon('f', Forward)}
        {onMail && !inTrash && labels.starWord ? actionTap('star', labels.starWord, Flag, false, starred ? { color: '#FF9500' } : {}) : greyIcon('s', Flag)}
        {onMail ? <PracticeTap id="mail-more" label={labels.moreOptions ?? labels.menu} pointer="below-right" className={icon}><MoreHorizontal size={20} aria-hidden="true" /></PracticeTap> : greyIcon('m', MoreHorizontal)}
        <span className="flex-1" />
        {searchBox(false)}
      </div>
    );
  } else if (service === 'outlook') {
    const onMail = mailOpen && !composing;
    const inTrash = screen === 'trash-mail';
    top = (
      <>
        <div className="flex items-center gap-3 px-3 py-1.5 shrink-0" style={{ background: look.top, color: look.topFg }}>
          <LayoutGrid size={18} aria-hidden="true" /><span className="font-bold text-[1.05rem] w-[150px]">{look.mark}</span>
          {searchBox(true)}
          <span className="flex-1" />
          <span aria-hidden="true" className="flex items-center gap-3"><Calendar size={18} /><Settings size={18} /><Avatar name={labels.you} color="#0A4A85" size={30}><User size={16} /></Avatar></span>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 shrink-0" style={{ background: '#FFFFFF', borderBottom: '1px solid #E1E3E6', color: '#242424' }}>
          <span aria-hidden="true" className="pr-3 text-[0.85rem] font-bold" style={{ borderBottom: '2px solid #0F6CBD' }}>{t('Home', 'Start')}</span>
          <span aria-hidden="true" className="pr-3 text-[0.85rem]">{t('View', 'Ansicht')}</span>
          {composeButton('mr-2')}
          {onMail ? actionTap('delete', labels.deleteMail, Trash2, true) : greyIcon('d', Trash2, labels.deleteMail)}
          {onMail ? (inTrash ? actionTap('move-inbox', labels.moveToInbox, ArchiveRestore, true) : actionTap('archive', labels.archive, Archive, true)) : greyIcon('a', Archive, labels.archive)}
          {onMail && !inTrash && labels.starWord ? actionTap('star', labels.starWord, Flag, true, starred ? { color: '#C4314B' } : {}) : greyIcon('s', Flag, labels.starWord)}
        </div>
      </>
    );
  } else {
    const portal = service === 'gmx' || service === 'webde';
    top = (
      <div className="flex items-center gap-3 px-3 py-1.5 shrink-0" style={{ background: look.top, color: look.topFg, borderBottom: look.top === '#FFFFFF' ? '1px solid #E1E3E6' : undefined }}>
        {(service === 'gmail' || service === 'yahoo') && <span aria-hidden="true"><Menu size={20} /></span>}
        <span className="font-bold text-[1.25rem] w-[160px] shrink-0" style={{ color: look.markColor, fontWeight: service === 'gmail' ? 400 : 700 }}>{look.mark}</span>
        {portal ? (
          <span aria-hidden="true" className="flex gap-4 text-[0.95rem] font-bold"><span style={{ borderBottom: `3px solid ${look.topFg}` }}>{t('Email', 'E-Mail')}</span><span className="font-normal">{t('Contacts', 'Adressbuch')}</span><span className="font-normal">{t('Calendar', 'Kalender')}</span></span>
        ) : searchBox(true)}
        <span className="flex-1" />
        <span aria-hidden="true" className="flex items-center gap-3" style={{ color: look.top === '#FFFFFF' || look.top === '#F6F8FC' ? '#444746' : look.topFg }}>
          {service === 'gmail' && <HelpCircle size={18} />}<Settings size={18} />{service === 'gmail' && <LayoutGrid size={18} />}
          <Avatar name={labels.you} color={look.send === '#FFD800' ? '#555' : look.send === look.top ? '#A1005A' : look.send} size={30}><User size={16} /></Avatar>
        </span>
      </div>
    );
  }

  const leftRail = service === 'outlook' && (
    <div aria-hidden="true" className="w-12 shrink-0 flex flex-col items-center gap-4 py-3" style={{ background: '#EBEBEB', color: '#424242' }}>
      <Mail size={20} style={{ color: '#0F6CBD' }} /><Calendar size={20} /><Users size={20} />
    </div>
  );
  const gmailRail = service === 'gmail' && (
    <div aria-hidden="true" className="w-14 shrink-0 flex flex-col items-center gap-3 py-2 text-[0.7rem]" style={{ background: look.side, color: '#444746' }}>
      <span className="flex flex-col items-center"><span className="px-3 py-0.5 rounded-full" style={{ background: '#D3E3FD' }}><Mail size={18} /></span>{labels.navMail ?? 'Mail'}</span>
      <span className="flex flex-col items-center"><Users size={18} />Chat</span>
      <span className="flex flex-col items-center"><Video size={18} />Meet</span>
    </div>
  );

  const page = (
    <div className="flex-1 min-h-0 flex flex-col relative" style={{ background: look.page, color: '#1F1F1F' }}>
      {top}
      <div className="flex-1 min-h-0 flex">
        {leftRail}{gmailRail}
        {sidebar(service !== 'outlook' && service !== 'applemail', service === 'applemail' ? 190 : service === 'gmail' ? 190 : 200)}
        <div className={`flex-1 min-w-0 flex min-h-0 ${service === 'gmail' || service === 'proton' ? 'm-1.5 rounded-xl overflow-hidden' : ''}`} style={{ background: '#FFFFFF' }}>
          {main}
        </div>
      </div>
      {afterDelete && <p className="absolute left-4 bottom-3 z-20 px-4 py-2 rounded-md text-[0.9rem] sim-fade" style={{ background: '#323232', color: '#FFFFFF' }}>{labels.toastDeleted}</p>}
      {floating}
      {dialogs}
    </div>
  );

  const content = (
    <>
      {page}
      {typing && <TypingHelper words={typingWords} deleteLabel={labels.deleteKey} lang={lang} />}
    </>
  );

  return url ? (
    <Browser url={url} tab={labels.appTitle ?? look.mark} labels={labels} checked={givenScreen === 'web-checked'}>{content}</Browser>
  ) : (
    <AppWindow title="Mail" bar="#E3E3E6" barText="#1D1D1F"><div className="flex-1 min-w-0 flex flex-col">{content}</div></AppWindow>
  );
};
