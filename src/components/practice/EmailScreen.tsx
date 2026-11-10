import React, { useContext } from 'react';
import {
  ArrowLeft, Archive, ArrowUp, Calendar, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Circle, FileText, Filter, Flag, Folder, Forward, Image as ImageIcon, Mail, Menu, MoreVertical, Paperclip, Pencil, Reply, Search, Send, SquarePen, Star, Trash2, TriangleAlert, User, Video, X,
} from 'lucide-react';
import { PracticeContext, PracticeTap } from './PracticeTap';
import { Avatar, PhoneKeyboard, StatusBar, clockTime, BackGlyph } from './PhoneParts';
import type { PracticeScreenProps } from './practiceScreens';
import { EmailWeb } from './EmailWeb';

const iconBtn = 'flex items-center justify-center rounded-full shrink-0';
type L = Record<string, string>;

/** Which inbox and compose layout a service uses. Portal services share a family look with their own colours. */
type Layout = 'gmail' | 'outlook' | 'apple' | 'portal' | 'yahoo' | 'proton';

const STYLES: Record<string, { layout: Layout; color: string; fg: string; ink: string; bg: string }> = {
  gmail: { layout: 'gmail', color: '#C2E7FF', fg: '#001D35', ink: '#0B57D0', bg: '#FFFFFF' },
  outlook: { layout: 'outlook', color: '#0F6CBD', fg: '#FFFFFF', ink: '#0F6CBD', bg: '#FFFFFF' },
  applemail: { layout: 'apple', color: '#007AFF', fg: '#FFFFFF', ink: '#007AFF', bg: '#FFFFFF' },
  gmx: { layout: 'portal', color: '#1C449B', fg: '#FFFFFF', ink: '#1C449B', bg: '#F2F4F8' },
  webde: { layout: 'portal', color: '#FFD800', fg: '#333333', ink: '#333333', bg: '#F7F7F2' },
  tonline: { layout: 'portal', color: '#E20074', fg: '#FFFFFF', ink: '#E20074', bg: '#F6F6F6' },
  yahoo: { layout: 'yahoo', color: '#6001D2', fg: '#FFFFFF', ink: '#6001D2', bg: '#FFFFFF' },
  proton: { layout: 'proton', color: '#6D4AFF', fg: '#FFFFFF', ink: '#6D4AFF', bg: '#FFFFFF' },
};

/** A short warning like the ones real email apps show. It closes, and the lesson simply continues. */
const AppAlert: React.FC<{ title: string; text: string; okLabel: string; onClose: () => void; ink: string }> = ({ title, text, okLabel, onClose, ink }) => {
  const { platform } = useContext(PracticeContext);
  if (platform === 'iphone') {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center p-8 sim-fade" style={{ background: 'rgba(0,0,0,0.4)' }}>
        <div role="alertdialog" aria-label={title} className="w-full rounded-2xl overflow-hidden text-center" style={{ background: '#F2F2F2', color: '#000000' }}>
          <p className="px-4 pt-4 text-[1.05rem] font-bold leading-snug">{title}</p>
          <p className="px-4 pb-3 text-[0.9rem] leading-snug">{text}</p>
          <button type="button" onClick={(event) => { event.stopPropagation(); onClose(); }} className="w-full min-h-[44px] text-[1.05rem] font-bold" style={{ color: '#007AFF', borderTop: '1px solid #C8C8CC' }}>{okLabel}</button>
        </div>
      </div>
    );
  }
  return (
  <div className="absolute inset-0 z-40 flex items-center justify-center p-5 sim-fade" style={{ background: 'rgba(0,0,0,0.45)' }}>
    <div role="alertdialog" aria-label={title} className="w-full rounded-2xl p-4" style={{ background: '#FFFFFF', color: '#1F1F1F' }}>
      <p className="flex items-start gap-2 text-[1.1rem] font-bold leading-snug"><TriangleAlert size={22} aria-hidden="true" className="shrink-0 mt-0.5" style={{ color: ink }} />{title}</p>
      <p className="mt-1 text-[0.98rem] leading-snug">{text}</p>
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="px-4 min-h-[44px] rounded-xl font-bold text-[1rem]"
          style={{ color: ink }}
        >
          {okLabel}
        </button>
      </div>
    </div>
  </div>
  );
};

interface MailItem { id: string; from: string; subject: string; preview: string; when: string; unread: boolean; color: string }

const InboxTop: React.FC<{ layout: Layout; style: (typeof STYLES)[string]; labels: L }> = ({ layout, style, labels }) => {
  const menu = <PracticeTap id="menu" label={labels.menu} className={iconBtn}><Menu size={23} aria-hidden="true" /></PracticeTap>;
  const search = <PracticeTap id="search" label={labels.search} className={iconBtn}><Search size={22} aria-hidden="true" /></PracticeTap>;
  switch (layout) {
    case 'gmail':
      return (
        <>
          <div className="flex items-center gap-1 m-2 px-1 rounded-full shrink-0" style={{ background: '#EDF2FA', color: '#444746' }}>
            {menu}
            <PracticeTap id="search" label={labels.search} className="flex-1 text-left text-[1rem] px-1">{labels.search}</PracticeTap>
            <Avatar name={labels.you} color="#0B57D0" size={32}><User size={17} aria-hidden="true" /></Avatar>
          </div>
          <p className="px-4 py-0.5 text-[0.85rem] shrink-0" style={{ color: '#444746' }}>{labels.primary}</p>
        </>
      );
    case 'outlook':
      return (
        <div className="shrink-0" style={{ background: style.color, color: style.fg }}>
          <div className="flex items-center gap-2 px-2">
            <PracticeTap id="menu" label={labels.folders} pointer="below" className={iconBtn}><Avatar name={labels.you} color="#0A4A85" size={32}><User size={17} aria-hidden="true" /></Avatar></PracticeTap>
            <h3 className="flex-1 text-[1.25rem] font-bold">{labels.inbox}</h3>
            <span aria-hidden="true" className="w-11 h-11 flex items-center justify-center"><Filter size={20} /></span>
          </div>
          <div aria-hidden="true" className="flex gap-5 px-3 text-[0.92rem] font-bold">
            <span className="pb-1" style={{ borderBottom: '3px solid #FFFFFF' }}>{labels.focused}</span>
            <span className="pb-1" style={{ opacity: 0.75 }}>{labels.other}</span>
          </div>
        </div>
      );
    case 'apple':
      return (
        <div className="px-2 shrink-0" style={{ color: '#000000' }}>
          <div className="flex items-center justify-between">
            <PracticeTap id="menu" label={labels.mailboxes} className="flex items-center text-[1rem]" style={{ color: style.ink }}><ChevronLeft size={24} aria-hidden="true" />{labels.mailboxes}</PracticeTap>
            <span aria-hidden="true" className="px-2 text-[1rem]" style={{ color: style.ink }}>{labels.edit}</span>
          </div>
          <h3 className="px-2 text-[2rem] font-bold leading-tight">{labels.inbox}</h3>
          <PracticeTap id="search" label={labels.search} className="w-full rounded-xl flex items-center gap-2 px-2 my-1 text-left text-[1rem]" style={{ background: '#E9E9EB', color: '#6C6C70' }}><Search size={17} aria-hidden="true" />{labels.search}</PracticeTap>
        </div>
      );
    case 'yahoo':
      return (
        <div className="shrink-0">
          <div className="flex items-center gap-1 px-1" style={{ color: style.ink }}>
            {menu}
            <h3 className="flex-1 text-[1.25rem] font-bold">{labels.inbox}</h3>
            {search}
          </div>
          <div aria-hidden="true" className="flex gap-2 px-3 pb-1 text-[0.85rem]">
            {[labels.chipAll, labels.chipUnread, labels.chipStarred].map((chip, i) => (
              <span key={chip} className="px-3 py-0.5 rounded-full" style={i === 0 ? { background: style.color, color: style.fg } : { background: '#F0F0F3', color: '#444' }}>{chip}</span>
            ))}
          </div>
        </div>
      );
    case 'proton':
      return (
        <div className="flex items-center gap-1 px-1 shrink-0" style={{ background: '#1C1B24', color: '#FFFFFF' }}>
          {menu}
          <h3 className="flex-1 text-[1.2rem] font-bold">{labels.inbox}</h3>
          {search}
        </div>
      );
    case 'portal':
    default:
      return (
        <div className="shrink-0" style={{ background: style.color, color: style.fg }}>
          <div className="flex items-center gap-1 px-1">
            {menu}
            <h3 className="flex-1 text-[1.25rem] font-bold">{labels.appTitle}</h3>
            {search}
          </div>
          <div aria-hidden="true" className="flex items-center gap-2 px-3 pb-1 text-[0.92rem] font-bold">
            <Folder size={17} /> {labels.inbox} <ChevronDown size={16} />
          </div>
        </div>
      );
  }
};

const BOTTOM: Partial<Record<Layout, { Icon: React.ElementType; key: string }[]>> = {
  gmail: [{ Icon: Mail, key: 'navMail' }, { Icon: Video, key: 'navMeet' }],
  outlook: [{ Icon: Mail, key: 'navMail' }, { Icon: Search, key: 'search' }, { Icon: Calendar, key: 'navCalendar' }],
  yahoo: [{ Icon: Mail, key: 'inbox' }, { Icon: Star, key: 'chipStarred' }, { Icon: User, key: 'you' }],
};

const Inbox: React.FC<{ layout: Layout; style: (typeof STYLES)[string]; labels: L; appId?: string; kind?: string; afterDelete?: boolean }> = ({ layout, style, labels, appId, kind, afterDelete }) => {
  const { freeRoam } = useContext(PracticeContext);
  const time = clockTime();
  const mails: MailItem[] = [
    { id: 'mail-anna', from: labels.anna, subject: labels.subjectAnna, preview: labels.previewAnna, when: time, unread: true, color: '#C0689B' },
    { id: 'mail-club', from: labels.club, subject: labels.subjectClub, preview: labels.previewClub, when: labels.yesterday, unread: false, color: '#7E9B5D' },
    { id: 'mail-news', from: labels.news, subject: labels.subjectNews, preview: labels.previewNews, when: labels.yesterday, unread: false, color: '#6D8AA8' },
  ].filter((m) => !(afterDelete && m.id === 'mail-club'));
  if (labels.prizeFrom && (kind === 'spam' || freeRoam)) {
    mails.push({ id: 'mail-prize', from: labels.prizeFrom, subject: labels.prizeSubject, preview: labels.prizePreview, when: labels.yesterday, unread: true, color: '#8A6D3B' });
  }
  const nav = appId === 'gmx' ? [{ Icon: Mail, key: 'navMail' }, { Icon: Folder, key: 'inbox' }, { Icon: Calendar, key: 'navCalendar' }] : BOTTOM[layout];
  const wideCompose = appId === 'webde';
  const flatRows = appId === 'tonline';
  return (
    <div className="flex-1 flex flex-col min-h-0 relative" style={{ background: style.bg, color: '#1F1F1F' }}>
      <InboxTop layout={layout} style={style} labels={labels} />
      {afterDelete && kind === 'restore' && <p className="px-3 py-1.5 text-[0.92rem] shrink-0 sim-fade" style={{ background: '#323232', color: '#FFFFFF' }}>{labels.toastDeleted}</p>}
      {flatRows && <div aria-hidden="true" className="flex gap-4 px-3 py-1 text-[0.85rem] font-bold shrink-0 border-b" style={{ background: '#FFFFFF', borderColor: '#E0E0E0' }}><span style={{ color: style.ink, borderBottom: `2px solid ${style.ink}` }}>{labels.chipAll}</span><span>{labels.chipUnread}</span><span>{labels.chipStarred}</span></div>}
      <div className={`flex flex-col ${layout === 'portal' && !flatRows ? 'gap-2 p-2' : flatRows ? '' : 'gap-1 p-1'} flex-1 min-h-0 overflow-hidden`}>
        {mails.map((m) => (
          <PracticeTap
            key={m.id}
            id={m.id}
            label={`${m.from}: ${m.subject}`}
            className={`flex items-start gap-2.5 text-left w-full ${layout === 'portal' ? 'p-2 rounded-lg' : 'px-2 py-1.5 rounded-xl'}`}
            style={{
              background: layout === 'portal' ? '#FFFFFF' : undefined,
              borderBottomWidth: flatRows ? 1 : undefined,
              borderBottomColor: flatRows ? '#E0E0E0' : undefined,
              borderLeft: layout === 'outlook' && m.unread ? `3px solid ${style.ink}` : undefined,
              borderBottom: layout === 'apple' ? '1px solid #E5E5EA' : undefined,
              borderRadius: layout === 'apple' ? 0 : undefined,
            }}
          >
            {layout === 'apple' || layout === 'portal' ? (
              <span aria-hidden="true" className="pt-1.5 shrink-0"><Circle size={10} fill={m.unread ? style.ink === '#333333' ? '#E0A800' : style.ink : 'transparent'} stroke="none" /></span>
            ) : (
              <Avatar name={m.from} color={m.color} size={layout === 'outlook' ? 36 : 40} />
            )}
            <span className="min-w-0 flex-1 text-[0.95rem] leading-snug">
              <span className="flex justify-between gap-2">
                <span className="truncate" style={{ fontWeight: m.unread ? 700 : 400 }}>{m.from}</span>
                <span className="text-[0.75rem] shrink-0" style={{ color: m.unread && layout === 'outlook' ? style.ink : '#5F6368' }}>{m.when}</span>
              </span>
              <span className="block truncate" style={{ fontWeight: m.unread ? 700 : 400, color: m.unread && layout === 'outlook' ? style.ink : undefined }}>{m.subject}</span>
              <span className="block truncate" style={{ color: '#5F6368' }}>{m.preview}</span>
            </span>
            {layout === 'gmail' && <span aria-hidden="true" className="self-end pb-0.5" style={{ color: '#747775' }}><Star size={17} /></span>}
          </PracticeTap>
        ))}
      </div>

      {layout === 'apple' ? (
        <div className="flex items-center justify-between px-3 py-1 shrink-0 border-t" style={{ background: '#F9F9F9', borderColor: '#D1D1D6', color: '#6C6C70' }}>
          <span className="w-11" />
          <span className="text-[0.75rem]">{labels.updatedNow}</span>
          <PracticeTap id="compose" label={labels.compose} pointer="above-right" className={iconBtn} style={{ color: style.ink }}><SquarePen size={25} aria-hidden="true" /></PracticeTap>
        </div>
      ) : wideCompose ? (
        <div className="p-2 shrink-0"><PracticeTap id="compose" label={labels.compose} pointer="above-right" className="w-full rounded-lg flex items-center justify-center gap-2 font-bold text-[1.05rem]" style={{ background: style.color, color: style.fg }}><Pencil size={20} aria-hidden="true" />{labels.compose}</PracticeTap></div>
      ) : (
        <>
          <PracticeTap
            id="compose"
            label={labels.compose}
            pointer="above-right"
            className={`absolute right-3 flex items-center justify-center gap-2 font-bold text-[1rem] h-14 ${layout === 'gmail' ? 'px-4 rounded-2xl' : layout === 'outlook' ? 'w-14 rounded-2xl' : layout === 'portal' ? 'w-14 rounded-full' : 'px-4 rounded-full'}`}
            style={{ background: style.color, color: style.fg, bottom: nav ? '4rem' : '0.75rem' }}
          >
            <Pencil size={21} aria-hidden="true" />
            {layout !== 'outlook' && layout !== 'portal' && labels.compose}
          </PracticeTap>
          {nav && (
            <div className="flex shrink-0 pt-1 pb-0.5 border-t" style={{ borderColor: '#E0E0E0', color: '#5F6368', background: '#FFFFFF' }}>
              {nav.map(({ Icon, key }, i) => key === 'search' ? (
                <PracticeTap key={key} id="search" label={labels.search} pointer="above-left" className="flex-1 flex flex-col items-center justify-center text-[0.72rem] rounded-lg"><Icon size={20} aria-hidden="true" /><span className="truncate max-w-full">{labels.searchGo ?? labels.search}</span></PracticeTap>
              ) : (
                <span key={key} aria-hidden="true" className="flex-1 flex flex-col items-center text-[0.72rem]" style={i === 0 ? { color: style.ink, fontWeight: 700 } : undefined}><Icon size={20} />{labels[key]}</span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

/** New email or answer: To, Subject and text, arranged the way each service does it. */
const Compose: React.FC<{ screen: string; layout: Layout; style: (typeof STYLES)[string]; labels: L; lang: string }> = ({ screen, layout, style, labels, lang }) => {
  const { fields, typed, lastWrongId, clearWrong } = useContext(PracticeContext);
  const isReply = screen === 'reply';
  const isForward = screen === 'forward-to' || screen === 'forward-body';
  const hasFile = screen === 'new-body-att';
  const toStep = screen === 'new-to' || screen === 'forward-to';
  const subjectStep = screen === 'new-subject';
  const bodyStep = screen === 'new-body' || screen === 'new-attach' || hasFile || isReply || screen === 'forward-body';
  const recipient = screen === 'forward-body' ? labels.peter : isReply || !toStep ? labels.anna : '';
  const subject = isForward ? `Fwd: ${labels.subjectAnna}` : isReply ? `Re: ${labels.subjectAnna}` : fields.subject ?? '';
  const cursor = <span aria-hidden="true" className="inline-block w-[2px] h-[1.05em] align-text-bottom ml-px" style={{ background: style.ink }} />;

  const sendButton = (
    <PracticeTap
      id="send"
      label={labels.send}
      pointer="below-right"
      className={iconBtn}
      style={layout === 'apple'
        ? { background: bodyStep && typed ? style.ink : '#C7C7CC', color: '#FFFFFF', width: 36, minWidth: 36, height: 36, minHeight: 36, margin: 4 }
        : { color: layout === 'outlook' || layout === 'portal' ? (style.fg) : style.ink }}
    >
      {layout === 'apple' ? <ArrowUp size={20} strokeWidth={3} aria-hidden="true" /> : <Send size={23} aria-hidden="true" />}
    </PracticeTap>
  );
  const coloured = layout === 'outlook' || layout === 'portal';
  const title = isReply ? labels.reply : isForward ? labels.forward : labels.compose;
  const closeLabel = labels.close;

  const header = layout === 'apple' ? (
    <div className="flex items-center justify-between px-2 shrink-0 border-b" style={{ borderColor: '#D1D1D6', color: '#000' }}>
      <PracticeTap id="back" label={labels.cancelWord} className="text-[1rem]" style={{ color: style.ink }}>{labels.cancelWord}</PracticeTap>
      <h3 className="text-[1.05rem] font-bold truncate">{title}</h3>
      {sendButton}
    </div>
  ) : (
    <div className="flex items-center gap-1 px-1 shrink-0" style={coloured ? { background: style.color, color: style.fg } : layout === 'proton' ? { background: '#1C1B24', color: '#FFFFFF' } : { color: '#1F1F1F' }}>
      <PracticeTap id="back" label={closeLabel} className={iconBtn}>{layout === 'gmail' || layout === 'yahoo' ? <BackGlyph size={23} /> : <X size={23} aria-hidden="true" />}</PracticeTap>
      <h3 className="flex-1 text-[1.1rem] font-bold truncate">{title}</h3>
      <PracticeTap id="attach" label={labels.attachMail} className={iconBtn}><Paperclip size={21} aria-hidden="true" /></PracticeTap>
      {layout === 'proton' ? <span style={{ color: '#FFFFFF' }}>{sendButton}</span> : sendButton}
    </div>
  );

  const row = 'px-3 py-1.5 border-b text-[0.98rem] flex items-center gap-2 shrink-0';
  const rowLine = { borderColor: '#E0E0E0' };

  // Person suggestions appear under the To field while typing, as on a real phone.
  const suggestions = toStep && typed.length > 0 && (
    <div className="absolute left-0 right-0 top-full z-20 sim-fade shadow-lg" style={{ background: '#FFFFFF' }}>
      <PracticeTap id="contact-anna" label={`${labels.anna}, ${labels.mailAnna}`} className="flex items-center gap-3 px-3 py-1.5 text-left w-full">
        <Avatar name={labels.anna} color="#C0689B" size={38} />
        <span className="text-[0.95rem] min-w-0 leading-tight"><span className="block font-bold truncate">{labels.anna}</span><span className="block truncate" style={{ color: '#5F6368' }}>{labels.mailAnna}</span></span>
      </PracticeTap>
      <PracticeTap id="contact-peter" label={`${labels.peter}, ${labels.mailPeter}`} className="flex items-center gap-3 px-3 py-1.5 text-left w-full">
        <Avatar name={labels.peter} color="#7E9B5D" size={38} />
        <span className="text-[0.95rem] min-w-0 leading-tight"><span className="block font-bold truncate">{labels.peter}</span><span className="block truncate" style={{ color: '#5F6368' }}>{labels.mailPeter}</span></span>
      </PracticeTap>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 relative" style={{ background: '#FFFFFF', color: '#1F1F1F' }}>
      {header}
      {layout === 'gmail' && <p className={row} style={{ ...rowLine, color: '#444746' }}>{labels.fromLabel}: {labels.myMail}</p>}

      <div className={`${row} relative`} style={{ ...rowLine, zIndex: 5, overflow: 'visible' }}>
        <span style={{ color: '#5F6368' }}>{labels.toLabel}:</span>
        {recipient ? (
          <span className="px-2 py-0.5 rounded-full text-[0.92rem] flex items-center gap-1 truncate" style={{ background: layout === 'apple' ? 'transparent' : '#E8EAED', color: layout === 'apple' ? style.ink : '#1F1F1F' }}>
            {layout !== 'apple' && <Avatar name={labels.anna} color="#C0689B" size={20} />}
            {recipient}
          </span>
        ) : (
          <span className="flex-1 min-w-0 truncate" style={{ minHeight: '1.4em' }}>{typed}{toStep && cursor}</span>
        )}
        {suggestions}
      </div>

      {(layout === 'apple' || layout === 'outlook') && !isReply && <p className={row} style={{ ...rowLine, color: '#5F6368' }}>{labels.ccLabel}:</p>}

      {subjectStep ? (
        <div className={row} style={rowLine}>
          <span style={{ color: '#5F6368' }}>{labels.subjectLabel}:</span>
          <span className="flex-1 min-w-0 truncate" style={{ minHeight: '1.4em' }}>{typed}{cursor}</span>
        </div>
      ) : (
        <div className={row} style={rowLine}>
          <span style={{ color: '#5F6368' }}>{labels.subjectLabel}:</span>
          <span className="flex-1 min-w-0 truncate">{subject}</span>
        </div>
      )}

      {layout === 'apple' && (screen === 'new-attach' || hasFile) && (
        <PracticeTap id="attach" label={labels.attachMail} className={`${row} w-full text-left`} style={{ ...rowLine, color: style.ink }}><Paperclip size={18} aria-hidden="true" />{labels.attachMail}</PracticeTap>
      )}
      {hasFile && <p className={row} style={rowLine}><ImageIcon size={18} aria-hidden="true" style={{ color: style.ink }} /><strong className="truncate">{labels.filePhoto}</strong><CheckCircle2 size={18} aria-hidden="true" style={{ color: '#176B68' }} /></p>}
      {subjectStep ? (
        <PracticeTap id="body-field" label={labels.writeHere} pointer="below" className="mx-2 my-1 px-1 text-left text-[0.98rem] rounded-lg flex-1 min-h-[44px]" style={{ color: '#747775' }}>
          {labels.writeHere}
        </PracticeTap>
      ) : (
        <p className="flex-1 min-h-0 overflow-hidden px-3 py-2 text-[1rem] break-words">
          {bodyStep ? (typed || <span style={{ color: '#747775' }}>{labels.writeHere}</span>) : <span style={{ color: '#747775' }}>{labels.writeHere}</span>}
          {bodyStep && cursor}
        </p>
      )}

      <PhoneKeyboard
        lang={lang}
        suggestions={toStep ? ['Anna', 'Peter', 'Eva'] : subjectStep ? [labels.subj1, labels.subj2, labels.subj3] : screen === 'forward-body' ? [labels.suggestF1, labels.suggestF2, labels.suggestF3] : [labels.suggest1, labels.suggest2, labels.suggest3]}
        spaceLabel={labels.space}
        deleteLabel={labels.deleteKey}
        shiftLabel={labels.shift}
      />

      {lastWrongId === 'send' && toStep && !isForward && (
        <AppAlert title={labels.alertToTitle} text={labels.alertToText} okLabel={labels.okWord} onClose={clearWrong} ink={style.ink} />
      )}
      {lastWrongId === 'send' && subjectStep && (
        <AppAlert title={labels.alertSubjectTitle} text={labels.alertSubjectText} okLabel={labels.alertSubjectBack} onClose={clearWrong} ink={style.ink} />
      )}
    </div>
  );
};

const OpenMail: React.FC<{ layout: Layout; style: (typeof STYLES)[string]; labels: L; kind?: string; starred?: boolean; inTrash?: boolean }> = ({ layout, style, labels, kind, starred, inTrash }) => {
  const iosLike = layout === 'apple';
  const flagged = layout === 'outlook' || layout === 'apple';
  const StarGlyph = flagged ? Flag : Star;
  const isClub = kind === 'restore';
  const isPrize = kind === 'spam';
  const isNews = kind === 'unsubscribe';
  const from = isClub ? labels.club : isPrize ? labels.prizeFrom : isNews ? labels.news : labels.anna;
  const subject = isClub ? labels.subjectClub : isPrize ? labels.prizeSubject : isNews ? labels.subjectNews : labels.subjectAnna;
  const text = isClub ? labels.bodyClub : isPrize ? labels.prizeBody : isNews ? labels.bodyNews : labels.bodyAnna;
  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: '#FFFFFF', color: '#1F1F1F' }}>
      <div className="flex items-center gap-1 px-1 shrink-0" style={layout === 'outlook' || layout === 'portal' ? { background: style.color, color: style.fg } : layout === 'proton' ? { background: '#1C1B24', color: '#FFFFFF' } : { color: iosLike ? style.ink : '#1F1F1F' }}>
        <PracticeTap id="back" label={labels.back} className={iconBtn}>{iosLike ? <ChevronLeft size={27} aria-hidden="true" /> : <BackGlyph size={23} />}</PracticeTap>
        <span className="flex-1" />
        {labels.starWord && <PracticeTap id="star" label={labels.starWord} pointer="below" className={iconBtn} style={starred ? { color: '#E0A800' } : undefined}><StarGlyph size={21} fill={starred ? 'currentColor' : 'none'} aria-hidden="true" /></PracticeTap>}
        <PracticeTap id="archive" label={labels.archive} className={iconBtn}><Archive size={21} aria-hidden="true" /></PracticeTap>
        <PracticeTap id="delete" label={labels.deleteMail} className={iconBtn}><Trash2 size={21} aria-hidden="true" /></PracticeTap>
        <PracticeTap id="mail-more" label={labels.moreOptions ?? labels.menu} pointer="below-right" className={iconBtn}><MoreVertical size={21} aria-hidden="true" /></PracticeTap>
      </div>
      <div className="px-4 pt-2 flex-1 min-h-0 overflow-hidden">
        <h3 className="text-[1.25rem] font-bold leading-tight mb-2">{subject}</h3>
        <div className="flex items-center gap-2 mb-3">
          <Avatar name={from} color="#C0689B" size={38} />
          <span className="text-[0.9rem] leading-tight min-w-0 flex-1"><span className="block font-bold truncate">{from}</span><span className="block truncate" style={{ color: '#5F6368' }}>{labels.toMe}</span></span>
          {isNews && <PracticeTap id="unsubscribe" label={labels.unsubscribe} pointer="below-right" className="px-2 rounded-lg text-[0.9rem] font-bold underline shrink-0" style={{ color: style.ink }}>{labels.unsubscribe}</PracticeTap>}
        </div>
        <p className="text-[1rem] leading-snug whitespace-pre-line">{text}</p>
        {isPrize && <PracticeTap id="prize-link" label={labels.prizeLink} className="mt-3 px-3 rounded-lg font-bold underline text-[1rem]" style={{ color: '#0B57D0' }}>{labels.prizeLink}</PracticeTap>}
      </div>
      {inTrash ? (
        <div className="p-3 shrink-0">
          <PracticeTap id="move-inbox" label={labels.moveToInbox} pointer="above-right" className="w-full rounded-xl font-bold text-[1rem] p-2" style={{ background: style.color, color: style.fg }}>{labels.moveToInbox}</PracticeTap>
        </div>
      ) : (
        <div className="p-3 shrink-0 flex gap-2">
          {[{ id: 'reply', label: labels.reply, Glyph: Reply, pointer: 'above-left' as const }, ...(labels.forward ? [{ id: 'forward', label: labels.forward, Glyph: Forward, pointer: 'above-right' as const }] : [])].map(({ id, label, Glyph, pointer }) => (
            <PracticeTap key={id} id={id} label={label} pointer={pointer} className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 text-[0.95rem] font-bold ${iosLike || layout === 'portal' ? 'rounded-xl' : 'rounded-full'}`} style={iosLike || layout === 'portal' || layout === 'outlook' ? { background: style.color, color: style.fg } : { border: '1px solid #747775' }}>
              <Glyph size={19} aria-hidden="true" /><span className="truncate">{label}</span>
            </PracticeTap>
          ))}
        </div>
      )}
    </div>
  );
};

/** Each email service has its own inbox and compose layout. All content is fictional. */
export const EmailScreen: React.FC<PracticeScreenProps> = (props) => {
  // On the computer: the service's website (or the Mac program), not the phone app in a window.
  return useContext(PracticeContext).computer ? <EmailWeb {...props} /> : <EmailPhone {...props} />;
};

const EmailPhone: React.FC<PracticeScreenProps> = ({ screen, isDone, appId, kind, labels, lang }) => {
  const { fields, typed } = useContext(PracticeContext);
  const style = STYLES[appId ?? 'gmail'] ?? STYLES.gmail;
  const layout = style.layout;
  const barBg = isDone ? '#FFFFFF' : layout === 'outlook' || layout === 'portal' ? style.color : layout === 'proton' ? '#1C1B24' : style.bg;
  const barText = barBg === '#FFFFFF' || barBg === '#FFD800' || barBg === '#C2E7FF' ? '#1F1F1F' : '#FFFFFF';

  const barHeader = (title: string) => (
    <div className="flex items-center gap-1 px-1 shrink-0" style={layout === 'outlook' || layout === 'portal' ? { background: style.color, color: style.fg } : layout === 'proton' ? { background: '#1C1B24', color: '#FFFFFF' } : { color: layout === 'apple' ? style.ink : '#1F1F1F' }}>
      <PracticeTap id="back" label={labels.back} className={iconBtn}>{layout === 'apple' ? <ChevronLeft size={27} aria-hidden="true" /> : <BackGlyph size={23} />}</PracticeTap>
      <h3 className="flex-1 text-[1.15rem] font-bold truncate">{title}</h3>
    </div>
  );
  const listRow = (id: string, title: string, note?: string, Glyph?: React.ElementType) => (
    <PracticeTap key={id} id={id} label={title} className="flex items-center gap-3 p-2 rounded-xl text-left w-full" style={{ borderBottom: '1px solid #E5E5EA', borderRadius: 0 }}>
      {Glyph && <Glyph size={22} aria-hidden="true" style={{ color: style.ink }} />}
      <span className="flex-1 min-w-0 text-[1rem]"><span className="block font-bold truncate">{title}</span>{note && <span className="block text-[0.88rem] truncate" style={{ color: '#5F6368' }}>{note}</span>}</span>
      <ChevronRight size={19} aria-hidden="true" />
    </PracticeTap>
  );
  const page = (title: string, rows: React.ReactNode) => (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: '#FFFFFF', color: '#1F1F1F' }}>
      {barHeader(title)}
      <div className="flex-1 min-h-0 flex flex-col p-2 sim-fade">{rows}</div>
    </div>
  );

  let body: React.ReactNode;
  if (isDone && kind && kind !== 'new' && kind !== 'reply') {
    body = (
      <div className="flex-1 p-4 flex flex-col items-center justify-center text-center gap-3 sim-fade" style={{ background: '#FFFFFF', color: '#1F1F1F' }}>
        <CheckCircle2 size={64} style={{ color: '#176B68' }} aria-hidden="true" />
        <h3 className="text-[1.3rem] font-bold">{labels.doneTitle}</h3>
        {labels.doneText && <p className="text-[1rem]">{labels.doneText}</p>}
        <p className="text-[0.9rem]">{labels.noRealMail}</p>
      </div>
    );
  } else if (isDone) {
    body = (
      <div className="flex-1 p-4 flex flex-col items-center justify-center text-center gap-2 sim-fade" style={{ background: '#FFFFFF', color: '#1F1F1F' }}>
        <CheckCircle2 size={64} style={{ color: '#176B68' }} aria-hidden="true" />
        <h3 className="text-[1.3rem] font-bold">{labels.sent}</h3>
        <div className="w-full text-left text-[0.98rem] rounded-xl p-3" style={{ background: '#F4F5F7' }}>
          <p><strong>{labels.toLabel}:</strong> {labels.anna}</p>
          <p className="break-words"><strong>{labels.subjectLabel}:</strong> {kind === 'new' ? fields.subject || labels.subj1 : `Re: ${labels.subjectAnna}`}</p>
          <p className="break-words mt-1">{(kind === 'new' ? fields.main : typed) || labels.defaultMessage}</p>
        </div>
        <p className="text-[0.9rem]">{labels.noRealMail}</p>
      </div>
    );
  } else if (screen === 'inbox' || screen === 'inbox-after') {
    body = <Inbox layout={layout} style={style} labels={labels} appId={appId} kind={kind} afterDelete={screen === 'inbox-after' && kind === 'restore'} />;
  } else if (screen === 'mail' || screen === 'mail-starred') {
    body = <OpenMail layout={layout} style={style} labels={labels} kind={kind} starred={screen === 'mail-starred'} />;
  } else if (screen === 'trash-mail') {
    body = <OpenMail layout={layout} style={style} labels={labels} kind="restore" inTrash />;
  } else if (screen === 'folders') {
    body = page(labels.folders, [
      listRow('folder-inbox', labels.inboxFolder, undefined, Mail),
      listRow('folder-starred', labels.starredFolder, undefined, Star),
      listRow('folder-sent', labels.sentFolder, undefined, Send),
      listRow('folder-spam', labels.spamFolder, undefined, TriangleAlert),
      listRow('folder-trash', labels.trashFolder, undefined, Trash2),
    ]);
  } else if (screen === 'trash') {
    body = page(labels.trashFolder, listRow('trash-club', labels.club, labels.subjectClub));
  } else if (screen === 'starred') {
    body = page(labels.starredFolder, listRow('starred-anna', labels.anna, labels.subjectAnna));
  } else if (screen === 'mail-menu') {
    body = page(labels.moreOptions, [listRow('report-spam', labels.reportSpam, undefined, TriangleAlert), listRow('mark-unread', labels.markUnread, undefined, Mail)]);
  } else if (screen === 'unsub-confirm') {
    body = page(labels.unsubscribe, (
      <div className="flex-1 flex flex-col gap-3 p-2">
        <p className="text-[1.05rem]">{labels.unsubSure}</p>
        <PracticeTap id="unsub-yes" label={labels.unsubYes} pointer="above-right" className="mt-auto rounded-xl font-bold text-[1.05rem] p-3" style={{ background: style.color, color: style.fg }}>{labels.unsubYes}</PracticeTap>
        <PracticeTap id="back" label={labels.noKeep} className="rounded-xl font-bold text-[1.05rem] p-2" style={{ border: `2px solid ${style.ink}`, color: style.ink }}>{labels.noKeep}</PracticeTap>
      </div>
    ));
  } else if (screen === 'attach-pick') {
    body = page(labels.chooseFile, [listRow('file-photo', labels.filePhoto, undefined, ImageIcon), listRow('file-doc', labels.fileDoc, undefined, FileText)]);
  } else if (screen === 'search-mail') {
    body = (
      <div className="flex-1 flex flex-col min-h-0" style={{ background: '#FFFFFF', color: '#1F1F1F' }}>
        <div className="flex items-center gap-1 px-1 shrink-0 border-b" style={{ borderColor: '#E0E0E0' }}>
          <PracticeTap id="back" label={labels.back} className={iconBtn}><BackGlyph size={23} /></PracticeTap>
          <p className="flex-1 min-w-0 truncate text-[1rem]" style={{ color: typed ? '#1F1F1F' : '#747775' }}>{typed || labels.searchMail}</p>
          {typed && <PracticeTap id="send" label={labels.searchGo} pointer="below-right" className={iconBtn} style={{ color: style.ink }}><Search size={23} aria-hidden="true" /></PracticeTap>}
        </div>
        <div className="flex-1 min-h-0" />
        <PhoneKeyboard lang={lang} suggestions={[labels.suggestSearch1, labels.suggestSearch2, labels.suggestSearch3]} spaceLabel={labels.space} deleteLabel={labels.deleteKey} shiftLabel={labels.shift} />
      </div>
    );
  } else if (screen === 'search-results') {
    body = page(labels.resultsWord, [listRow('result-anna', labels.anna, labels.subjectAnna), listRow('result-other', labels.club, labels.subjectClub)]);
  } else {
    body = <Compose screen={screen} layout={layout} style={style} labels={labels} lang={lang} />;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <StatusBar background={barBg} color={barText} />
      {body}
    </div>
  );
};
