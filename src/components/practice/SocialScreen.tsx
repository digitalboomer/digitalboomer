import React, { useContext } from 'react';
import {
  ArrowBigDown, ArrowBigUp, ArrowLeft, Bell, Bookmark, Briefcase, CheckCircle2, ChevronRight, Compass, Film, Heart, Link2, House, Mail, MessageCircle, MoreHorizontal, Music, Pin, Play, Plus, Repeat2, Search, Send, Share2, ThumbsUp, User, Users,
} from 'lucide-react';
import { PracticeContext, PracticeTap } from './PracticeTap';
import { Avatar, FlowersPhoto, PhoneKeyboard, StatusBar, BackGlyph } from './PhoneParts';
import type { PracticeScreenProps } from './practiceScreens';

const iconBtn = 'flex items-center justify-center rounded-full shrink-0';
type L = Record<string, string>;

const STYLES: Record<string, { bg: string; fg: string; accent: string; muted: string; border: string; searchAtBottom: boolean }> = {
  facebook: { bg: '#F0F2F5', fg: '#050505', accent: '#0866FF', muted: '#65676B', border: '#E4E6EB', searchAtBottom: false },
  instagram: { bg: '#FFFFFF', fg: '#000000', accent: '#FF3040', muted: '#737373', border: '#EFEFEF', searchAtBottom: true },
  youtube: { bg: '#FFFFFF', fg: '#0F0F0F', accent: '#FF0000', muted: '#606060', border: '#E5E5E5', searchAtBottom: false },
  tiktok: { bg: '#000000', fg: '#FFFFFF', accent: '#FE2C55', muted: '#C8C8C8', border: '#333333', searchAtBottom: false },
  x: { bg: '#FFFFFF', fg: '#0F1419', accent: '#F91880', muted: '#536471', border: '#EFF3F4', searchAtBottom: true },
  linkedin: { bg: '#F4F2EE', fg: '#191919', accent: '#0A66C2', muted: '#666666', border: '#E0DFDC', searchAtBottom: false },
  pinterest: { bg: '#FFFFFF', fg: '#111111', accent: '#E60023', muted: '#767676', border: '#EFEFEF', searchAtBottom: true },
  threads: { bg: '#FFFFFF', fg: '#000000', accent: '#FF3040', muted: '#999999', border: '#EDEDED', searchAtBottom: true },
  reddit: { bg: '#F6F7F8', fg: '#1C1C1C', accent: '#FF4500', muted: '#576F76', border: '#E5EBEE', searchAtBottom: false },
};

type Style = (typeof STYLES)[string];

const Bottom: React.FC<{ s: Style; labels: L; icons: React.ElementType[] }> = ({ s, labels, icons }) => (
  <div className="flex items-center justify-around shrink-0 border-t" style={{ borderColor: s.border, color: s.fg, background: s.bg === '#F0F2F5' || s.bg === '#F4F2EE' || s.bg === '#F6F7F8' ? '#FFFFFF' : s.bg }}>
    {icons.map((Glyph, i) =>
      Glyph === Search && s.searchAtBottom ? (
        <PracticeTap key={i} id="search" label={labels.search} pointer="above-left" className={iconBtn}><Search size={24} aria-hidden="true" /></PracticeTap>
      ) : Glyph === Plus ? (
        <PracticeTap key={i} id="new-post" label={labels.newPost} pointer="above-left" className={iconBtn}><Plus size={26} aria-hidden="true" /></PracticeTap>
      ) : Glyph === Mail || Glyph === Send ? (
        <PracticeTap key={i} id="inbox" label={labels.inboxWord} pointer="above-left" className={iconBtn}><Glyph size={23} aria-hidden="true" /></PracticeTap>
      ) : (
        <span key={i} aria-hidden="true" className="w-11 h-11 flex items-center justify-center"><Glyph size={23} fill={i === 0 ? 'currentColor' : 'none'} /></span>
      ),
    )}
  </div>
);

/** The home feed. Here the services differ most, so each has its own arrangement. */
const Feed: React.FC<{ id: string; s: Style; labels: L; liked: boolean }> = ({ id, s, labels, liked }) => {
  const search = <PracticeTap id="search" label={labels.search} className={iconBtn}><Search size={23} aria-hidden="true" /></PracticeTap>;
  const create = <PracticeTap id="new-post" label={labels.newPost} className={iconBtn}><Plus size={25} aria-hidden="true" /></PracticeTap>;
  const photo = (h = 'flex-1 min-h-[6rem]') => <div className={`${h} overflow-hidden`}><FlowersPhoto /></div>;
  const person = (size = 38) => <PracticeTap id="profile" label={labels.openProfile} pointer="below" className={iconBtn}><Avatar name={labels.anna} color="#C0689B" size={size} /></PracticeTap>;
  const inboxTop = (Glyph: React.ElementType = MessageCircle) => <PracticeTap id="inbox" label={labels.inboxWord} pointer="below-right" className={iconBtn}><Glyph size={23} aria-hidden="true" /></PracticeTap>;
  const likeColor = liked ? s.accent : 'currentColor';
  const heart = (size = 26) => <PracticeTap id="like" label={labels.like} className={iconBtn} style={{ color: likeColor }}><Heart size={size} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" /></PracticeTap>;
  const bubble = (size = 25) => <PracticeTap id="comment" label={labels.comment} className={iconBtn}><MessageCircle size={size} aria-hidden="true" /></PracticeTap>;
  const wordBtn = (tapId: string, label: string, Glyph: React.ElementType, active = false) => (
    <PracticeTap id={tapId} label={label} className="flex-1 px-1 rounded-lg flex items-center justify-center gap-1 text-[0.9rem] font-bold" style={{ color: active ? s.accent : s.muted }}>
      <Glyph size={20} fill={active ? 'currentColor' : 'none'} aria-hidden="true" />{label}
    </PracticeTap>
  );

  switch (id) {
    case 'facebook':
      return (
        <>
          <div className="flex items-center px-2 shrink-0" style={{ background: '#FFFFFF' }}>
            <h3 className="flex-1 text-[1.5rem] font-bold" style={{ color: s.accent }}>facebook</h3>
            {create}{search}{inboxTop()}
          </div>
          <div className="flex items-center gap-2 p-2 shrink-0" style={{ background: '#FFFFFF', borderTop: `1px solid ${s.border}` }}>
            <Avatar name={labels.you} color="#6D8AA8" size={36}><User size={19} aria-hidden="true" /></Avatar>
            <span className="flex-1 px-3 py-1.5 rounded-full text-[0.95rem] truncate" style={{ border: `1px solid ${s.border}`, color: s.muted }}>{labels.whatsNew}</span>
          </div>
          <div className="flex-1 min-h-0 flex flex-col mt-1.5" style={{ background: '#FFFFFF' }}>
            <div className="flex items-center gap-2 p-2 shrink-0">{person()}<span className="text-[0.95rem] leading-tight"><strong className="block">{labels.anna}</strong><span style={{ color: s.muted }}>{labels.postAge}</span></span></div>
            <p className="px-2 pb-1.5 text-[0.98rem] shrink-0">{labels.postText}</p>
            {photo()}
            <div className="flex shrink-0 border-t" style={{ borderColor: s.border }}>
              {wordBtn('like', labels.like, ThumbsUp, liked)}{wordBtn('comment', labels.comment, MessageCircle)}{wordBtn('share', labels.shareWord, Share2)}
            </div>
          </div>
          <Bottom s={s} labels={labels} icons={[House, Film, Users, Bell, User]} />
        </>
      );
    case 'instagram':
      return (
        <>
          <div className="flex items-center px-1 shrink-0">
            {create}
            <h3 className="flex-1 text-center text-[1.3rem] font-bold">Instagram</h3>
            <span aria-hidden="true" className="w-11 h-11 flex items-center justify-center"><Heart size={24} /></span>
          </div>
          <div aria-hidden="true" className="flex gap-3 px-2 pb-2 shrink-0 text-[0.7rem] text-center">
            {[[labels.you, '#6D8AA8'], ['Anna', '#C0689B'], ['Peter', '#7E9B5D'], ['Eva', '#D08A4E']].map(([n, c]) => (
              <span key={n}><span className="block p-[2px] rounded-full" style={{ background: 'linear-gradient(45deg,#FEDA75,#D62976,#4F5BD5)' }}><span className="block p-[2px] rounded-full" style={{ background: '#FFFFFF' }}><Avatar name={n} color={c} size={44} /></span></span>{n}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 px-2 py-1 shrink-0 border-t" style={{ borderColor: s.border }}>{person(30)}<strong className="text-[0.9rem]">anna.beispiel</strong></div>
          {photo()}
          <div className="flex items-center shrink-0">
            {heart()}{bubble()}
            <PracticeTap id="share" label={labels.shareWord} className={iconBtn}><Send size={23} aria-hidden="true" /></PracticeTap>
          </div>
          <p className="px-2 pb-1 text-[0.9rem] truncate shrink-0"><strong>anna.beispiel</strong> {labels.postText}</p>
          <Bottom s={s} labels={labels} icons={[House, Film, Send, Search, User]} />
        </>
      );
    case 'youtube':
      return (
        <>
          <div className="flex items-center px-2 shrink-0">
            <span aria-hidden="true" className="w-8 h-6 rounded-md flex items-center justify-center mr-1" style={{ background: s.accent, color: '#FFFFFF' }}><Play size={14} fill="currentColor" /></span>
            <h3 className="flex-1 text-[1.2rem] font-bold">YouTube</h3>
            {inboxTop()}{search}
          </div>
          <div aria-hidden="true" className="flex gap-1.5 px-2 pb-2 overflow-hidden shrink-0 text-[0.82rem]">
            {labels.chipsYt.split('|').map((c, i) => <span key={c} className="px-3 py-1 rounded-lg whitespace-nowrap" style={i === 0 ? { background: '#0F0F0F', color: '#FFFFFF' } : { background: '#F2F2F2' }}>{c}</span>)}
          </div>
          <div className="relative h-44 shrink-0">{photo('h-full')}<span aria-hidden="true" className="absolute right-2 bottom-2 px-1.5 rounded text-[0.75rem]" style={{ background: 'rgba(0,0,0,0.8)', color: '#FFFFFF' }}>4:12</span></div>
          <div className="flex gap-2 p-2 shrink-0">{person(36)}<span className="text-[0.98rem] leading-tight min-w-0"><strong className="block">{labels.postText}</strong><span className="text-[0.8rem]" style={{ color: s.muted }}>{labels.anna} · {labels.postAge}</span></span></div>
          <div className="flex gap-2 px-2 shrink-0">
            <PracticeTap id="like" label={labels.like} className="px-3 rounded-full flex items-center gap-1 text-[0.9rem] font-bold" style={{ background: '#F2F2F2', color: liked ? s.accent : s.fg }}><ThumbsUp size={19} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" />{labels.like}</PracticeTap>
            <PracticeTap id="comment" label={labels.comment} className="px-3 rounded-full flex items-center gap-1 text-[0.9rem] font-bold" style={{ background: '#F2F2F2' }}><MessageCircle size={19} aria-hidden="true" />{labels.comment}</PracticeTap>
            <PracticeTap id="share" label={labels.shareWord} className="px-3 rounded-full flex items-center gap-1 text-[0.9rem] font-bold" style={{ background: '#F2F2F2' }}><Share2 size={18} aria-hidden="true" />{labels.shareWord}</PracticeTap>
          </div>
          <div className="flex-1 min-h-0" />
          <Bottom s={s} labels={labels} icons={[House, Film, Plus, Compass, User]} />
        </>
      );
    case 'tiktok':
      return (
        <>
          <div className="flex-1 min-h-0 relative">
            <div className="absolute inset-0 opacity-90"><FlowersPhoto /></div>
            <div className="absolute top-0 left-0 right-0 flex items-center px-2" style={{ color: '#FFFFFF', textShadow: '0 1px 3px #000' }}>
              <span aria-hidden="true" className="flex-1 flex justify-center gap-4 text-[1rem] font-bold pl-10"><span style={{ opacity: 0.75 }}>{labels.following}</span><span style={{ borderBottom: '2px solid #FFFFFF' }}>{labels.forYou}</span></span>
              <span style={{ color: '#FFFFFF' }}>{search}</span>
            </div>
            <div className="absolute right-1 bottom-4 flex flex-col items-center gap-2" style={{ color: '#FFFFFF', filter: 'drop-shadow(0 1px 2px #000)' }}>
              {person(42)}
              <PracticeTap id="like" label={labels.like} pointer="above-right" className={iconBtn} style={{ color: liked ? s.accent : '#FFFFFF' }}><Heart size={32} fill="currentColor" aria-hidden="true" /></PracticeTap>
              <PracticeTap id="comment" label={labels.comment} pointer="above-right" className={iconBtn}><MessageCircle size={31} fill="currentColor" aria-hidden="true" /></PracticeTap>
              <span aria-hidden="true" className="w-11 h-9 flex justify-center"><Bookmark size={28} fill="currentColor" /></span>
              <PracticeTap id="share" label={labels.shareWord} pointer="above-right" className={iconBtn}><Share2 size={28} aria-hidden="true" /></PracticeTap>
            </div>
            <div className="absolute left-3 right-16 bottom-3 text-[0.95rem]" style={{ color: '#FFFFFF', textShadow: '0 1px 3px #000' }}>
              <strong className="block">@anna.beispiel</strong>{labels.postText}
              <span className="flex items-center gap-1 text-[0.8rem] mt-0.5"><Music size={13} aria-hidden="true" />{labels.originalSound}</span>
            </div>
          </div>
          <Bottom s={s} labels={labels} icons={[House, Users, Plus, Mail, User]} />
        </>
      );
    case 'x':
      return (
        <>
          <div className="flex items-center justify-center shrink-0 h-11"><h3 className="text-[1.5rem] font-bold">𝕏</h3></div>
          <div aria-hidden="true" className="flex text-center text-[0.95rem] font-bold border-b shrink-0" style={{ borderColor: s.border }}>
            <span className="flex-1 pb-1.5"><span className="pb-1.5" style={{ borderBottom: '3px solid #1D9BF0' }}>{labels.forYou}</span></span>
            <span className="flex-1 pb-1.5" style={{ color: s.muted }}>{labels.following}</span>
          </div>
          <div className="flex gap-2 p-2 flex-1 min-h-0 relative">
            {person(40)}
            <div className="flex-1 min-w-0 flex flex-col">
              <p className="text-[0.95rem] truncate"><strong>{labels.anna}</strong> <span style={{ color: s.muted }}>@anna · 2h</span></p>
              <p className="text-[1rem] pb-1.5">{labels.postText}</p>
              <div className="flex-1 min-h-[6rem] rounded-2xl overflow-hidden" style={{ border: `1px solid ${s.border}` }}><FlowersPhoto /></div>
              <div className="flex items-center justify-between" style={{ color: s.muted }}>
                <PracticeTap id="comment" label={labels.comment} className={iconBtn}><MessageCircle size={21} aria-hidden="true" /></PracticeTap>
                <PracticeTap id="repost" label={labels.repostWord} className={iconBtn}><Repeat2 size={22} aria-hidden="true" /></PracticeTap>
                <PracticeTap id="like" label={labels.like} className={iconBtn} style={{ color: liked ? s.accent : s.muted }}><Heart size={21} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" /></PracticeTap>
                <PracticeTap id="share" label={labels.shareWord} className={iconBtn}><Share2 size={20} aria-hidden="true" /></PracticeTap>
              </div>
            </div>
            <PracticeTap id="new-post" label={labels.newPost} className="absolute right-3 bottom-14 w-13 h-13 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#1D9BF0', color: '#FFFFFF' }}><Plus size={25} aria-hidden="true" /></PracticeTap>
          </div>
          <Bottom s={s} labels={labels} icons={[House, Search, Users, Bell, Mail]} />
        </>
      );
    case 'linkedin':
      return (
        <>
          <div className="flex items-center gap-2 px-2 py-1.5 shrink-0" style={{ background: '#FFFFFF' }}>
            <Avatar name={labels.you} color="#6D8AA8" size={32}><User size={17} aria-hidden="true" /></Avatar>
            <PracticeTap id="search" label={labels.search} className="flex-1 rounded-md flex items-center gap-2 px-2 text-left text-[0.95rem]" style={{ background: '#EDF3F8', color: s.muted }}><Search size={18} aria-hidden="true" />{labels.search}</PracticeTap>
            {inboxTop()}
          </div>
          <div className="flex-1 min-h-0 flex flex-col mt-2" style={{ background: '#FFFFFF' }}>
            <div className="flex items-center gap-2 p-2 shrink-0">{person(44)}<span className="text-[0.9rem] leading-tight min-w-0"><strong className="block">{labels.anna}</strong><span style={{ color: s.muted }}>{labels.jobTitle} · {labels.postAge}</span></span></div>
            <p className="px-2 pb-1.5 text-[0.98rem] shrink-0">{labels.postText}</p>
            {photo()}
            <div className="flex shrink-0 border-t" style={{ borderColor: s.border }}>
              {wordBtn('like', labels.like, ThumbsUp, liked)}{wordBtn('comment', labels.comment, MessageCircle)}{wordBtn('repost', labels.repostWord, Repeat2)}{wordBtn('share', labels.send, Send)}
            </div>
          </div>
          <Bottom s={s} labels={labels} icons={[House, Users, Plus, Bell, Briefcase]} />
        </>
      );
    case 'pinterest':
      return (
        <>
          <div aria-hidden="true" className="flex justify-center gap-4 py-2 text-[1rem] font-bold shrink-0"><span style={{ borderBottom: '3px solid #111' }}>{labels.forYou}</span><span style={{ color: s.muted }}>{labels.chipGarden}</span></div>
          <div className="flex-1 min-h-0 grid grid-cols-2 gap-2 px-2 overflow-hidden">
            <div className="flex flex-col gap-1 min-h-0">
              <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden"><FlowersPhoto />
                <PracticeTap id="like" label={labels.like} pointer="below" className="absolute right-1.5 top-1.5 px-3 rounded-full font-bold text-[0.92rem] flex items-center gap-1" style={{ background: liked ? '#111' : s.accent, color: '#FFFFFF' }}>{liked ? <Pin size={15} fill="currentColor" aria-hidden="true" /> : null}{labels.like}</PracticeTap>
              </div>
              <p className="text-[0.85rem] truncate shrink-0">{labels.postText}</p>
              <div className="flex items-center gap-1 shrink-0">{person(24)}<PracticeTap id="comment" label={labels.comment} className={iconBtn}><MessageCircle size={21} aria-hidden="true" /></PracticeTap><PracticeTap id="share" label={labels.shareWord} className={iconBtn}><Share2 size={20} aria-hidden="true" /></PracticeTap></div>
            </div>
            <div aria-hidden="true" className="flex flex-col gap-2 min-h-0">
              <div className="h-32 rounded-2xl" style={{ background: 'linear-gradient(160deg,#F8D7B8,#C98A5B)' }} />
              <div className="flex-1 rounded-2xl" style={{ background: 'linear-gradient(160deg,#BFE3F7,#6B7F93)' }} />
            </div>
          </div>
          <Bottom s={s} labels={labels} icons={[House, Search, Plus, Mail, User]} />
        </>
      );
    case 'threads':
      return (
        <>
          <div className="flex items-center h-11 px-2 shrink-0"><span className="w-11" /><h3 className="flex-1 text-center text-[1.5rem] font-bold">@</h3>{inboxTop(Send)}</div>
          <div className="flex items-center gap-2 px-3 pb-2 shrink-0 border-b" style={{ borderColor: s.border }}>
            <Avatar name={labels.you} color="#6D8AA8" size={34}><User size={18} aria-hidden="true" /></Avatar>
            <span className="flex-1 text-left text-[0.98rem]" style={{ color: s.muted }}>{labels.whatsNew}</span>
          </div>
          <div className="flex gap-2 p-3 flex-1 min-h-0">
            <div className="flex flex-col items-center">{person(38)}<span aria-hidden="true" className="flex-1 w-0.5 my-1" style={{ background: s.border }} /></div>
            <div className="flex-1 min-w-0 flex flex-col">
              <p className="text-[0.95rem]"><strong>anna.beispiel</strong> <span style={{ color: s.muted }}>2h</span></p>
              <p className="text-[1rem] pb-1.5">{labels.postText}</p>
              <div className="flex-1 min-h-[6rem] rounded-xl overflow-hidden"><FlowersPhoto /></div>
              <div className="flex items-center">{heart(22)}{bubble(22)}<PracticeTap id="repost" label={labels.repostWord} className={iconBtn}><Repeat2 size={22} aria-hidden="true" /></PracticeTap><PracticeTap id="share" label={labels.shareWord} className={iconBtn}><Send size={21} aria-hidden="true" /></PracticeTap></div>
            </div>
          </div>
          <Bottom s={s} labels={labels} icons={[House, Search, Plus, Heart, User]} />
        </>
      );
    case 'reddit':
    default:
      return (
        <>
          <div className="flex items-center gap-1 px-2 shrink-0" style={{ background: '#FFFFFF' }}>
            <h3 className="flex-1 text-[1.25rem] font-bold" style={{ color: s.accent }}>reddit</h3>
            {search}
            <Avatar name={labels.you} color="#6D8AA8" size={30}><User size={16} aria-hidden="true" /></Avatar>
          </div>
          <div className="flex-1 min-h-0 flex flex-col mt-1.5 p-2" style={{ background: '#FFFFFF' }}>
            <p className="text-[0.82rem] shrink-0 flex items-center gap-1"><PracticeTap id="profile" label={labels.openProfile} pointer="below" className="rounded-lg font-bold text-left">r/{labels.chipGarden}</PracticeTap> <span style={{ color: s.muted }}>· {labels.postAge}</span></p>
            <p className="text-[1.05rem] font-bold py-1 shrink-0">{labels.postText}</p>
            <div className="flex-1 min-h-[6rem] rounded-xl overflow-hidden"><FlowersPhoto /></div>
            <div className="flex items-center gap-2 pt-1 shrink-0">
              <span className="flex items-center rounded-full" style={{ background: liked ? s.accent : '#EAEDEF', color: liked ? '#FFFFFF' : s.fg }}>
                <PracticeTap id="like" label={labels.like} className={iconBtn}><ArrowBigUp size={24} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" /></PracticeTap>
                <span className="text-[0.85rem] font-bold">{liked ? 13 : 12}</span>
                <PracticeTap id="downvote" label={labels.downWord} className={iconBtn}><ArrowBigDown size={24} aria-hidden="true" /></PracticeTap>
              </span>
              <PracticeTap id="comment" label={labels.comment} className="px-3 rounded-full flex items-center gap-1 text-[0.85rem] font-bold" style={{ background: '#EAEDEF' }}><MessageCircle size={18} aria-hidden="true" />{labels.comment}</PracticeTap>
              <PracticeTap id="share" label={labels.shareWord} className="px-3 rounded-full flex items-center gap-1 text-[0.85rem] font-bold" style={{ background: '#EAEDEF' }}><Share2 size={17} aria-hidden="true" />{labels.shareWord}</PracticeTap>
            </div>
          </div>
          <Bottom s={s} labels={labels} icons={[House, Compass, Plus, Mail, Bell]} />
        </>
      );
  }
};

export const SocialScreen: React.FC<PracticeScreenProps> = ({ screen, isDone, appId, kind, labels, lang }) => {
  const { typed, fields, freeRoam } = useContext(PracticeContext);
  const id = appId ?? 'facebook';
  const s = STYLES[id] ?? STYLES.facebook;
  const dark = s.bg === '#000000';
  const typedSomething = typed || fields.main;

  const inputRow = (placeholder: string, sendLabel: string, icon: React.ReactNode) => (
    <div className="flex items-center gap-2 p-1.5 shrink-0" style={{ background: dark ? '#000' : '#FFF' }}>
      <p className="flex-1 min-w-0 px-3 py-2 rounded-3xl text-[1rem] truncate" style={{ background: dark ? '#262626' : '#F0F2F5', color: typed ? s.fg : s.muted }}>{typed || placeholder}</p>
      {typed ? (
        <PracticeTap id="send" label={sendLabel} pointer="above-right" className={`${iconBtn} w-11 h-11`} style={{ background: s.accent, color: '#FFFFFF' }}>{icon}</PracticeTap>
      ) : <span className="w-11 h-11" />}
    </div>
  );
  const keyboard = (one: string, two: string, three: string) => (
    <PhoneKeyboard lang={lang} dark={dark} suggestions={[one, two, three]} spaceLabel={labels.space} deleteLabel={labels.deleteKey} shiftLabel={labels.shift} />
  );
  const simpleHeader = (title: string) => (
    <div className="flex items-center gap-1 px-1 py-1 shrink-0 border-b" style={{ borderColor: s.border }}>
      <PracticeTap id="back" label={labels.back} className={iconBtn}><BackGlyph size={24} /></PracticeTap>
      <h3 className="flex-1 text-[1.1rem] font-bold truncate">{title}</h3>
    </div>
  );
  const row = (tapId: string, title: string, note?: string, colour?: string) => (
    <PracticeTap key={tapId} id={tapId} label={title} className="flex items-center gap-3 p-2 rounded-xl text-left w-full">
      {colour && <Avatar name={title} color={colour} size={42} />}
      <span className="flex-1 min-w-0"><span className="block font-bold text-[1rem]">{title}</span>{note && <span className="block text-[0.88rem] truncate" style={{ color: s.muted }}>{note}</span>}</span>
      <ChevronRight size={20} aria-hidden="true" />
    </PracticeTap>
  );
  const photoPost = id === 'instagram' || id === 'tiktok' || id === 'pinterest' || id === 'youtube';
  const barColor = s.bg === '#F0F2F5' || s.bg === '#F4F2EE' || s.bg === '#F6F7F8' ? '#FFFFFF' : s.bg;

  let body: React.ReactNode;
  if (screen === 'results' || (isDone && kind === 'search')) {
    body = (
      <>
        <div className="flex items-center gap-1 px-1 py-1 shrink-0 border-b" style={{ borderColor: s.border }}>
          <PracticeTap id="back" label={labels.back} className={iconBtn}><BackGlyph size={24} /></PracticeTap>
          <p className="flex-1 min-w-0 text-[1rem] truncate font-bold">{typedSomething || labels.defaultSearch}</p>
        </div>
        <div className="flex flex-col gap-2 p-2 flex-1 min-h-0 overflow-hidden sim-fade">
          {[labels.resultOne, labels.resultTwo, labels.resultThree].map((name, i) => (
            <PracticeTap key={name} id={i === 0 ? 'result-one' : `result-other-${i}`} label={name} className="flex items-center gap-3 p-2 rounded-xl text-left w-full">
              <span className="w-14 h-14 rounded-lg overflow-hidden block shrink-0"><FlowersPhoto /></span>
              <span className="text-[1rem] font-bold min-w-0">{name}</span>
            </PracticeTap>
          ))}
          {isDone && <p className="mt-auto text-[0.9rem]" style={{ color: s.muted }}>{labels.noRealPost}</p>}
        </div>
      </>
    );
  } else if (isDone && kind && kind !== 'like') {
    body = (
      <div className="flex-1 p-4 flex flex-col items-center text-center gap-3 sim-fade">
        <CheckCircle2 size={64} style={{ color: '#176B68' }} aria-hidden="true" />
        <h3 className="text-[1.3rem] font-bold">{labels.doneTitle}</h3>
        {(kind === 'post' || kind === 'message') && (
          <div className="w-full text-left flex items-start gap-2 p-2 rounded-xl" style={{ background: dark ? '#262626' : '#F0F2F5' }}>
            <Avatar name={labels.you} color="#6D8AA8" size={30}><User size={16} aria-hidden="true" /></Avatar>
            <p className="text-[0.98rem] break-words min-w-0"><span className="font-bold">{labels.you} </span>{typedSomething || labels.suggestP2}</p>
          </div>
        )}
        {kind === 'post' && photoPost && <div className="w-full h-36 rounded-xl overflow-hidden"><FlowersPhoto /></div>}
        {labels.doneText && <p className="text-[1rem]">{labels.doneText}</p>}
        <p className="text-[0.9rem]">{labels.noRealAction}</p>
      </div>
    );
  } else if (isDone) {
    body = (
      <>
        <div className="flex items-center gap-2 p-2 shrink-0 border-b" style={{ borderColor: s.border }}>
          {freeRoam && <PracticeTap id="back" label={labels.back} className={iconBtn}><BackGlyph size={24} /></PracticeTap>}
          <Avatar name={labels.anna} color="#C0689B" size={36} />
          <p className="text-[0.95rem] min-w-0"><span className="font-bold">{labels.anna}: </span>{labels.postText}</p>
        </div>
        <div className="h-40 shrink-0 overflow-hidden"><FlowersPhoto /></div>
        <div className="flex items-start gap-2 p-2 sim-fade">
          <Avatar name={labels.you} color="#6D8AA8" size={30}><User size={16} aria-hidden="true" /></Avatar>
          <p className="px-2 py-1 rounded-xl text-[0.95rem] break-words min-w-0" style={{ background: dark ? '#262626' : '#F0F2F5' }}><span className="font-bold">{labels.you} </span>{typed || labels.defaultComment}</p>
        </div>
      </>
    );
  } else if (screen === 'search') {
    body = (
      <>
        <div className="flex items-center gap-1 px-1 py-1 shrink-0 border-b" style={{ borderColor: s.border }}>
          <PracticeTap id="back" label={labels.back} className={iconBtn}><BackGlyph size={24} /></PracticeTap>
          <h3 className="flex-1 text-[1.1rem] font-bold">{labels.search}</h3>
        </div>
        <div className="flex-1 min-h-0" />
        {inputRow(labels.searchField, labels.search, <Search size={21} aria-hidden="true" />)}
        {keyboard(labels.suggestS1, labels.suggestS2, labels.suggestS3)}
      </>
    );
  } else if (screen === 'comment') {
    body = (
      <>
        <div className="flex items-center gap-2 p-2 shrink-0 border-b" style={{ borderColor: s.border }}>
          {freeRoam && <PracticeTap id="back" label={labels.back} className={iconBtn}><BackGlyph size={24} /></PracticeTap>}
          <Avatar name={labels.anna} color="#C0689B" size={36} />
          <p className="text-[0.95rem] min-w-0 truncate"><span className="font-bold">{labels.anna}: </span>{labels.postText}</p>
        </div>
        <div className="flex-1 min-h-0" />
        {inputRow(labels.commentField, labels.send, <Send size={21} aria-hidden="true" />)}
        {keyboard(labels.suggestC1, labels.suggestC2, labels.suggestC3)}
      </>
    );
  } else if (screen === 'post-write') {
    body = (
      <>
        <div className="flex items-center gap-1 px-1 py-1 shrink-0 border-b" style={{ borderColor: s.border }}>
          <PracticeTap id="back" label={labels.back} className={iconBtn}><BackGlyph size={24} /></PracticeTap>
          <h3 className="flex-1 text-[1.1rem] font-bold truncate">{labels.newPost}</h3>
          <PracticeTap id="send" label={labels.publish} pointer="below-right" className="px-4 rounded-full font-bold text-[0.98rem]" style={{ background: typed ? s.accent : s.border, color: typed ? '#FFFFFF' : s.muted }}>{labels.publish}</PracticeTap>
        </div>
        <div className="flex-1 min-h-0 flex items-start gap-2 p-3 overflow-hidden">
          <Avatar name={labels.you} color="#6D8AA8" size={36}><User size={19} aria-hidden="true" /></Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[1.02rem] break-words" style={{ color: typed ? s.fg : s.muted }}>{typed || labels.writePost}</p>
            {photoPost && <div className="mt-2 h-24 w-32 rounded-xl overflow-hidden"><FlowersPhoto /></div>}
          </div>
        </div>
        {keyboard(labels.suggestP1, labels.suggestP2, labels.suggestP3)}
      </>
    );
  } else if (screen === 'post-gallery') {
    body = (
      <>
        {simpleHeader(labels.choosePhoto)}
        <div className="flex-1 min-h-0 grid grid-cols-2 gap-2 p-2 content-start sim-fade">
          <PracticeTap id="post-photo-flowers" label={labels.flowers} pointer="below" className="h-36 rounded-xl overflow-hidden block"><FlowersPhoto /></PracticeTap>
          <PracticeTap id="post-photo-2" label={labels.sunset} className="h-36 rounded-xl" style={{ background: 'linear-gradient(160deg,#F8D7B8,#C98A5B)' }}><span className="sr-only">{labels.sunset}</span></PracticeTap>
          <PracticeTap id="post-photo-3" label={labels.sea} className="h-36 rounded-xl" style={{ background: 'linear-gradient(160deg,#BFE3F7,#6B7F93)' }}><span className="sr-only">{labels.sea}</span></PracticeTap>
        </div>
      </>
    );
  } else if (screen === 'post-community') {
    body = (
      <>
        {simpleHeader(labels.chooseCommunity)}
        <div className="flex flex-col gap-2 p-2 sim-fade">
          {row('community-garden', labels.gardenCommunity)}
          {row('community-recipes', labels.recipeCommunity)}
        </div>
      </>
    );
  } else if (screen === 'inbox') {
    body = (
      <>
        {simpleHeader(labels.inboxWord)}
        <div className="flex flex-col gap-1 p-2 sim-fade">
          {row('dm-anna', labels.anna, labels.annaMessage, '#C0689B')}
          {row('dm-peter', labels.peter, labels.peterMessage, '#7E9B5D')}
        </div>
      </>
    );
  } else if (screen === 'dm') {
    body = (
      <>
        {simpleHeader(labels.anna)}
        <div className="flex-1 min-h-0 p-3 flex flex-col gap-2 sim-fade">
          <p className="self-start max-w-[80%] px-3 py-2 rounded-2xl text-[1rem]" style={{ background: dark ? '#262626' : '#F0F2F5' }}>{labels.annaMessage}</p>
        </div>
        {inputRow(labels.writeMessage, labels.send, <Send size={21} aria-hidden="true" />)}
        {keyboard(labels.suggestM1, labels.suggestM2, labels.suggestM3)}
      </>
    );
  } else if (screen === 'share-sheet') {
    body = (
      <>
        {simpleHeader(labels.sendTo)}
        <div className="flex flex-col gap-1 p-2 sim-fade">
          {row('share-peter', labels.peter, undefined, '#7E9B5D')}
          {row('share-anna', labels.anna, undefined, '#C0689B')}
          {row('share-link', labels.copyLink)}
        </div>
      </>
    );
  } else if (screen === 'share-picked') {
    body = (
      <>
        {simpleHeader(labels.sendTo)}
        <div className="flex-1 min-h-0 flex flex-col gap-3 p-3 sim-fade">
          <p className="flex items-center gap-2 font-bold text-[1rem]"><Avatar name={labels.peter} color="#7E9B5D" size={36} />{labels.peter}<CheckCircle2 size={20} style={{ color: '#176B68' }} aria-hidden="true" /></p>
          <div className="h-40 rounded-xl overflow-hidden"><FlowersPhoto /></div>
          <p className="text-[0.95rem]">{labels.postText}</p>
          <PracticeTap id="send" label={labels.send} pointer="above-right" className="mt-auto rounded-xl font-bold text-[1.05rem] p-3" style={{ background: s.accent, color: '#FFFFFF' }}>{labels.send}</PracticeTap>
        </div>
      </>
    );
  } else if (screen === 'profile') {
    body = (
      <>
        <div className="flex items-center gap-1 px-1 py-1 shrink-0 border-b" style={{ borderColor: s.border }}>
          <PracticeTap id="back" label={labels.back} className={iconBtn}><BackGlyph size={24} /></PracticeTap>
          <h3 className="flex-1 text-[1.1rem] font-bold truncate">{labels.profileLabel}</h3>
          <PracticeTap id="profile-more" label={labels.moreOptions} pointer="below-right" className={iconBtn}><MoreHorizontal size={24} aria-hidden="true" /></PracticeTap>
        </div>
        <div className="flex-1 min-h-0 flex flex-col items-center gap-2 p-4 sim-fade">
          <Avatar name={labels.anna} color="#C0689B" size={80} />
          <p className="text-[1.2rem] font-bold">{labels.profileLabel}</p>
          <p className="text-[0.9rem]" style={{ color: s.muted }}>{labels.profileStats}</p>
          <PracticeTap id="follow" label={labels.followWord} pointer="below" className="w-full rounded-xl font-bold text-[1.05rem] p-2" style={{ background: s.accent, color: '#FFFFFF' }}>{labels.followWord}</PracticeTap>
          <div className="w-full flex-1 min-h-[6rem] rounded-xl overflow-hidden mt-2"><FlowersPhoto /></div>
        </div>
      </>
    );
  } else if (screen === 'profile-menu') {
    body = (
      <>
        {simpleHeader(labels.moreOptions)}
        <div className="flex flex-col gap-1 p-2 sim-fade">
          {row('block-user', labels.blockWord)}
          {row('report-user', labels.reportWord)}
          {row('menu-cancel', labels.cancelWord)}
        </div>
      </>
    );
  } else if (screen === 'block-confirm') {
    body = (
      <>
        {simpleHeader(labels.blockWord)}
        <div className="flex-1 min-h-0 flex flex-col gap-3 p-4 sim-fade">
          <p className="text-[1.05rem]">{labels.blockSure}</p>
          <PracticeTap id="block-yes" label={labels.blockWord} pointer="above-right" className="mt-auto rounded-xl font-bold text-[1.05rem] p-3" style={{ background: s.accent, color: '#FFFFFF' }}>{labels.blockWord}</PracticeTap>
          <PracticeTap id="back" label={labels.cancelWord} className="rounded-xl font-bold text-[1.05rem] p-2" style={{ border: `2px solid ${s.fg}` }}>{labels.cancelWord}</PracticeTap>
        </div>
      </>
    );
  } else {
    body = <Feed id={id} s={s} labels={labels} liked={screen === 'liked'} />;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ background: s.bg, color: s.fg }}>
      <StatusBar background={barColor} color={s.fg} />
      {body}
    </div>
  );
};
