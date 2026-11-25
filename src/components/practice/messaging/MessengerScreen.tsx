import React, { useContext, useEffect, useState } from 'react';
import {
  Archive, ArrowLeft, ArrowUp, AtSign, AudioLines, Ban, Bell, Calendar, Camera, Check, CheckCheck, ChevronLeft, ChevronRight, CircleCheck, CircleDashed, CirclePlus, Compass, Copy, Crop,
  FileText, Flag, Forward, Hash, House, Inbox, Info, Image as ImageIcon, LockKeyhole, MapPin, Menu as MenuIcon, MessageCircle, MessageSquareDot, MessageSquarePlus, Mic, MicOff, MoreHorizontal, MoreVertical, Newspaper, Paperclip, Pencil, Phone, PhoneOff,
  Play, Plus, Reply, Search, Send, Smile, SquarePen, Store, Trash2, User, UserPlus, Users, Video, Volume2, Wallet, X,
} from 'lucide-react';
import { PracticeContext, PracticeTap } from '../PracticeTap';
import { Avatar, FlowersPhoto, PHOTOS, PhoneKeyboard, StatusBar, clockTime, BackGlyph } from '../PhoneParts';
import { playReceived } from '../../../utils/feedback';
import type { PracticeScreenProps } from '../practiceScreens';
import { APP_STYLES, appStyle, blockFlow, viewId, type AppId, type AppStyle, type BlockFlow, type ComposerSlot } from './apps';

const iconBtn = 'flex items-center justify-center rounded-full shrink-0';
type L = Record<string, string>;

const NAV_ICONS = { chat: MessageCircle, updates: CircleDashed, people: Users, phone: Phone, story: Play, bell: Bell, menu: MenuIcon, home: House, news: Newspaper, calendar: Calendar, more: MoreHorizontal, discover: Compass, user: User, wallet: Wallet };

const People: React.FC<{ app: AppStyle; name: string; color: string; size?: number; children?: React.ReactNode }> = ({ app, name, color, size = 48, children }) => (
  app.avatarSquare ? (
    <span aria-hidden="true" className="shrink-0 flex items-center justify-center font-bold text-white rounded-md" style={{ width: size, height: size, background: color, fontSize: size * 0.42 }}>
      {children ?? name.charAt(0)}
    </span>
  ) : <Avatar name={name} color={color} size={size}>{children}</Avatar>
);

const BottomNav: React.FC<{ app: AppStyle; lang: string; active?: number }> = ({ app, lang, active = 0 }) => (
  <div aria-hidden="true" className="flex shrink-0 pt-1.5 pb-1 border-t" style={{ borderColor: app.border, background: app.dark ? '#1E1F22' : app.bg === '#EDEDED' ? '#F7F7F7' : '#FFFFFF', color: app.subText }}>
    {app.bottomNav.map((item, i) => {
      const Glyph = NAV_ICONS[item.icon];
      const on = i === active;
      return (
        <span key={item.en} className="flex-1 min-w-0 flex flex-col items-center text-[0.68rem] leading-tight" style={on ? { color: app.dark ? '#FFFFFF' : app.accent === '#25D366' ? '#111B21' : app.accent, fontWeight: 700 } : undefined}>
          <span className="px-3 py-0.5 rounded-full" style={on && app.fab === 'chat-plus' && !app.dark ? { background: '#D9FDD3' } : undefined}>
            <Glyph size={20} fill={on && item.icon === 'chat' ? 'currentColor' : 'none'} />
          </span>
          <span className="truncate max-w-full tracking-[-0.03em]">{lang === 'de' ? item.de : item.en}</span>
        </span>
      );
    })}
  </div>
);

/** The part above the chats: this is where the apps differ most. */
const ListTop: React.FC<{ id: AppId; app: AppStyle; labels: L }> = ({ id, app, labels }) => {
  const search = (extra?: React.CSSProperties) => <PracticeTap id="search" label={labels.search} className={iconBtn} style={extra}><Search size={22} aria-hidden="true" /></PracticeTap>;
  const menu = <PracticeTap id="menu" label={labels.menu} className={iconBtn}><MoreVertical size={22} aria-hidden="true" /></PracticeTap>;
  const chips = (items: string[], onColor: string, onText: string) => (
    <div aria-hidden="true" className="flex gap-1.5 px-2 pb-1.5 overflow-hidden">
      {items.map((chip, i) => (
        <span key={chip} className="px-3 py-1 rounded-full text-[0.82rem] whitespace-nowrap" style={i === 0 ? { background: onColor, color: onText, fontWeight: 700 } : { background: app.dark ? '#1E1F22' : '#F0F2F5', color: app.subText }}>{chip}</span>
      ))}
    </div>
  );

  if (app.iosCompose) {
    const title = id === 'whatsapp' ? labels.chatsTitle : id === 'telegram' ? labels.chatsTitle : labels.chatsTitle;
    return (
      <div style={{ background: '#FFFFFF', color: '#000000' }}>
        <div className="flex items-center px-2">
          <span aria-hidden="true" className="flex-1 text-[1rem]" style={{ color: id === 'whatsapp' ? '#000000' : app.accent }}>{labels.edit}</span>
          {id === 'whatsapp' && <span aria-hidden="true" className="w-11 h-11 flex items-center justify-center"><Camera size={22} /></span>}
          <PracticeTap id="new-chat" label={labels.newChat} pointer="below-right" className={iconBtn} style={{ color: id === 'whatsapp' ? '#000000' : app.accent, background: id === 'whatsapp' ? '#25D366' : undefined, width: id === 'whatsapp' ? 34 : undefined, minWidth: id === 'whatsapp' ? 34 : undefined, height: id === 'whatsapp' ? 34 : undefined, minHeight: id === 'whatsapp' ? 34 : undefined, margin: id === 'whatsapp' ? 5 : undefined }}>
            {id === 'whatsapp' ? <Plus size={20} aria-hidden="true" /> : <SquarePen size={22} aria-hidden="true" />}
          </PracticeTap>
        </div>
        <h3 className="px-3 text-[1.9rem] font-bold leading-tight">{title}</h3>
        <div className="mx-2 my-1.5"><PracticeTap id="search" label={labels.search} className="w-full rounded-xl flex items-center gap-2 px-3 text-left text-[0.95rem]" style={{ background: '#EFEFF0', color: '#8A8A8E' }}><Search size={18} aria-hidden="true" />{labels.search}</PracticeTap></div>
        {id === 'whatsapp' && chips(labels.chipsWa.split('|'), '#D9FDD3', '#0B6B3A')}
      </div>
    );
  }

  switch (id) {
    case 'whatsapp':
      return (
        <div style={{ background: '#FFFFFF' }}>
          <div className="flex items-center px-1">
            <h3 className="flex-1 pl-2 text-[1.45rem] font-bold" style={{ color: '#1DAA61' }}>WhatsApp</h3>
            <span aria-hidden="true" className="w-11 h-11 flex items-center justify-center" style={{ color: '#111B21' }}><Camera size={22} /></span>
            {menu}
          </div>
          <div className="mx-2 mb-2">{<PracticeTap id="search" label={labels.search} className="w-full rounded-full flex items-center gap-2 px-3 text-left text-[0.95rem]" style={{ background: '#F0F2F5', color: '#667781' }}><Search size={18} aria-hidden="true" />{labels.search}</PracticeTap>}</div>
          {chips(labels.chipsWa.split('|'), '#D9FDD3', '#0B6B3A')}
        </div>
      );
    case 'signal':
      return (
        <div className="flex items-center gap-1 px-2 py-1" style={{ background: '#FFFFFF', color: '#1B1B1D' }}>
          <Avatar name={labels.you} color="#6D8AA8" size={32}><User size={17} aria-hidden="true" /></Avatar>
          <h3 className="flex-1 pl-2 text-[1.3rem] font-bold">Signal</h3>
          {search()}
          {menu}
        </div>
      );
    case 'telegram':
      return (
        <div style={{ background: '#517DA2', color: '#FFFFFF' }}>
          <div className="flex items-center gap-1 px-1">
            <h3 className="flex-1 pl-2 text-[1.3rem] font-bold">Telegram</h3>
            {search()}
          </div>
          <div aria-hidden="true" className="flex gap-5 px-4 text-[0.9rem] font-bold">
            {labels.tabsTg.split('|').map((tab, i) => <span key={tab} className="pb-1.5" style={i === 0 ? { borderBottom: '3px solid #FFFFFF' } : { opacity: 0.75 }}>{tab}</span>)}
          </div>
        </div>
      );
    case 'messenger':
      return (
        <div style={{ background: '#FFFFFF', color: '#050505' }}>
          <div className="flex items-center gap-1 px-1">
            <PracticeTap id="menu" label={labels.menu} className={iconBtn}><MenuIcon size={24} aria-hidden="true" /></PracticeTap>
            <h3 className="flex-1 text-[1.5rem] font-bold" style={{ color: '#0A7CFF' }}>messenger</h3>
            <PracticeTap id="new-chat" label={labels.newChat} className={iconBtn}><Pencil size={22} aria-hidden="true" /></PracticeTap>
          </div>
          <div className="mx-2 mb-2"><PracticeTap id="search" label={labels.search} className="w-full rounded-full flex items-center gap-2 px-3 text-left text-[0.95rem]" style={{ background: '#F0F0F0', color: '#65676B' }}><Search size={18} aria-hidden="true" />{labels.search}</PracticeTap></div>
          <div aria-hidden="true" className="flex gap-3 px-3 pb-2 overflow-hidden text-[0.72rem] text-center" style={{ color: '#65676B' }}>
            <span><span className="w-12 h-12 rounded-full flex items-center justify-center mb-0.5" style={{ background: '#F0F0F0', color: '#050505' }}><Plus size={22} /></span>{labels.createStory}</span>
            {[['Anna', '#C0689B'], ['Peter', '#7E9B5D'], ['Eva', '#D08A4E'], ['Karl', '#6D8AA8']].map(([n, c]) => (
              <span key={n} className="relative">
                <Avatar name={n} color={c} size={48} />
                <span className="absolute right-0 bottom-4 w-3.5 h-3.5 rounded-full" style={{ background: '#31A24C', border: '2px solid #FFFFFF' }} />
                {n}
              </span>
            ))}
          </div>
        </div>
      );
    case 'imessage':
      return (
        <div className="px-2 pb-2" style={{ background: '#FFFFFF', color: '#000000' }}>
          <div className="flex items-center justify-between">
            <span aria-hidden="true" className="px-2 text-[1.05rem]" style={{ color: '#007AFF' }}>{labels.edit}</span>
            <PracticeTap id="new-chat" label={labels.newChat} className={iconBtn} style={{ color: '#007AFF' }}><SquarePen size={24} aria-hidden="true" /></PracticeTap>
          </div>
          <h3 className="px-2 text-[2rem] font-bold leading-tight">{labels.messagesTitle}</h3>
          <PracticeTap id="search" label={labels.search} className="w-full rounded-xl flex items-center gap-2 px-2 mt-1 text-left text-[1rem]" style={{ background: '#E9E9EB', color: '#6C6C70' }}><Search size={17} aria-hidden="true" />{labels.search}</PracticeTap>
        </div>
      );
    case 'sms':
      return (
        <div className="p-2" style={{ background: '#F8FAFD' }}>
          <PracticeTap id="search" label={labels.search} className="w-full rounded-full flex items-center gap-3 px-3 text-left text-[1rem]" style={{ background: '#E9EEF6', color: '#444746' }}>
            <MenuIcon size={20} aria-hidden="true" />
            <span className="flex-1">{labels.searchConversations}</span>
            <Avatar name={labels.you} color="#0B57D0" size={30}><User size={16} aria-hidden="true" /></Avatar>
          </PracticeTap>
        </div>
      );
    case 'threema':
      return (
        <div style={{ background: '#1F1F1F', color: '#FFFFFF' }}>
          <div className="flex items-center gap-1 px-2">
            <h3 className="flex-1 flex items-center gap-2 text-[1.2rem] font-bold"><LockKeyhole size={18} aria-hidden="true" style={{ color: '#05A63F' }} /> Threema</h3>
            {search()}
            {menu}
          </div>
          <div aria-hidden="true" className="flex text-[0.85rem] font-bold text-center">
            {labels.tabsThreema.split('|').map((tab, i) => <span key={tab} className="flex-1 pb-1.5" style={i === 1 ? { borderBottom: '3px solid #05A63F' } : { opacity: 0.7 }}>{tab}</span>)}
          </div>
        </div>
      );
    case 'viber':
      return (
        <div className="flex items-center gap-1 px-2" style={{ background: '#7360F2', color: '#FFFFFF' }}>
          <h3 className="flex-1 text-[1.3rem] font-bold">Viber</h3>
          {search()}
          <span aria-hidden="true" className="w-11 h-11 flex items-center justify-center"><Camera size={22} /></span>
        </div>
      );
    case 'line':
      return (
        <div className="flex items-center gap-1 px-3" style={{ background: '#FFFFFF', color: '#111111' }}>
          <h3 className="flex-1 text-[1.3rem] font-bold">{labels.chatsTitle}</h3>
          {search()}
          <PracticeTap id="new-chat" label={labels.newChat} className={iconBtn}><MessageSquarePlus size={23} aria-hidden="true" /></PracticeTap>
        </div>
      );
    case 'wechat':
      return (
        <div className="flex items-center px-1" style={{ background: '#EDEDED', color: '#111111' }}>
          <span className="w-11" />
          <h3 className="flex-1 text-center text-[1.15rem] font-bold">{labels.wechatTitle}</h3>
          {search()}
          <PracticeTap id="new-chat" label={labels.newChat} className={iconBtn}><CirclePlus size={23} aria-hidden="true" /></PracticeTap>
        </div>
      );
    case 'discord':
      return (
        <div className="flex items-center gap-1 px-3" style={{ background: '#2B2D31', color: '#F2F3F5' }}>
          <h3 className="flex-1 text-[1.2rem] font-bold">{labels.directMessages}</h3>
          {search()}
        </div>
      );
    case 'teams':
    default:
      return (
        <div className="flex items-center gap-1 px-2" style={{ background: '#4B53BC', color: '#FFFFFF' }}>
          <Avatar name={labels.you} color="#2F3585" size={32}><User size={17} aria-hidden="true" /></Avatar>
          <h3 className="flex-1 pl-2 text-[1.2rem] font-bold">{labels.chatTitle}</h3>
          {search()}
          {menu}
        </div>
      );
  }
};

interface ListRow { id: string; name: string; last: string; unread: number; avatar: React.ReactNode }

/**
 * The chat list. `top` puts one more line at the top (a stranger's message, or a requests inbox);
 * `topBar` replaces the app's own top part (the selection bar after pressing and holding);
 * `selected` marks a line as chosen.
 */
const ChatList: React.FC<{ id: AppId; app: AppStyle; labels: L; lang: string; top?: ListRow; topBar?: React.ReactNode; selected?: string }> = ({ id, app, labels, lang, top, topBar, selected }) => {
  const time = clockTime();
  const chats = [
    ...(top ? [{ ...top, when: time, color: '#8A8D91' }] : []),
    { id: 'chat-family', name: labels.family, last: labels.familyLast, when: time, unread: 2, color: '#6D8AA8', avatar: <Users size={24} aria-hidden="true" /> },
    { id: 'chat-anna', name: labels.anna, last: labels.annaLast, when: labels.yesterday, unread: 0, color: '#C0689B' },
    { id: 'chat-club', name: labels.club, last: labels.clubLast, when: labels.yesterday, unread: 0, color: '#7E9B5D' },
  ];
  const unreadColor = id === 'whatsapp' ? '#1DAA61' : app.accent;

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ background: app.bg, color: app.text }}>
      {topBar ?? <ListTop id={id} app={app} labels={labels} />}
      {id === 'discord' && (
        <div aria-hidden="true" className="absolute left-0" />
      )}
      <div className={`flex-1 min-h-0 overflow-hidden flex flex-col ${id === 'wechat' ? '' : 'gap-1 p-1'} relative`} style={id === 'wechat' ? { background: '#FFFFFF' } : undefined}>
        {chats.map((chat, index) => (
          <PracticeTap
            key={chat.id}
            id={chat.id}
            label={chat.name}
            className={`flex items-center gap-3 w-full text-left ${id === 'wechat' ? 'px-3 py-2' : 'px-2 py-1.5 rounded-xl'}`}
            style={{ color: app.text, borderBottom: id === 'wechat' || id === 'imessage' ? `1px solid ${app.border}` : undefined, background: selected === chat.id ? (app.dark ? '#3F4147' : '#D3E3FD') : undefined }}
          >
            {app.ios && <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full shrink-0 -mr-1" style={{ background: chat.unread ? '#007AFF' : 'transparent' }} />}
            {selected === chat.id
              ? <span aria-hidden="true" className="shrink-0 w-[50px] h-[50px] rounded-full flex items-center justify-center" style={{ background: app.accent, color: app.accentText }}><Check size={26} /></span>
              : <People app={app} name={chat.name} color={app.ios ? '#A2A5AD' : chat.color} size={id === 'wechat' ? 46 : 50}>{chat.avatar}</People>}
            <span className="min-w-0 flex-1">
              <span className="flex justify-between gap-2 items-baseline">
                <span className="font-bold text-[1.03rem] truncate">{chat.name}</span>
                <span className="text-[0.76rem] shrink-0 flex items-center gap-0.5" style={{ color: chat.unread && !app.ios ? unreadColor : app.subText }}>
                  {chat.when}
                  {app.ios && <ChevronRight size={14} aria-hidden="true" />}
                </span>
              </span>
              <span className="flex justify-between gap-2 items-center">
                <span className="text-[0.93rem] truncate flex items-center gap-1" style={{ color: app.subText }}>
                  {id === 'threema' && (
                    <span aria-hidden="true" className="flex gap-0.5 shrink-0">
                      {/* Verification level: a stranger has one red dot (unverified); the others are green, by how well they are checked. */}
                      {[0, 1, 2].map((dot) => <span key={dot} className="w-1.5 h-1.5 rounded-full" style={{ background: chat.id === 'chat-stranger' ? (dot === 0 ? '#E53935' : '#CFCFCF') : dot <= (2 - (index - (top ? 1 : 0))) ? '#05A63F' : '#CFCFCF' }} />)}
                    </span>
                  )}
                  <span className="truncate">{chat.last}</span>
                </span>
                {chat.unread > 0 && !app.ios && (
                  <span className={`min-w-[1.3rem] h-[1.3rem] px-1 text-[0.75rem] font-bold flex items-center justify-center shrink-0 ${id === 'wechat' ? 'rounded-md' : 'rounded-full'}`} style={{ background: id === 'wechat' ? '#FA5151' : app.accent, color: id === 'wechat' ? '#FFFFFF' : app.accentText }}>
                    {chat.unread}
                  </span>
                )}
              </span>
            </span>
          </PracticeTap>
        ))}
        {app.fab !== 'none' && (
          <PracticeTap
            id="new-chat"
            label={labels.newChat}
            className={`absolute right-3 bottom-3 flex items-center justify-center gap-2 font-bold text-[0.95rem] h-14 ${app.fab === 'start-chat' ? 'px-4 rounded-2xl' : app.dark ? 'w-14 rounded-full' : 'w-14 rounded-2xl'}`}
            style={app.fab === 'start-chat' ? { background: '#C2E7FF', color: '#001D35' } : { background: app.accent, color: app.accentText }}
          >
            {app.fab === 'pencil' ? <Pencil size={23} aria-hidden="true" /> : app.fab === 'chat-plus' ? <MessageSquarePlus size={25} aria-hidden="true" /> : <MessageCircle size={21} aria-hidden="true" />}
            {app.fab === 'start-chat' && labels.startChat}
          </PracticeTap>
        )}
      </div>
      {app.bottomNav.length > 0 && <BottomNav app={app} lang={lang} active={app.navActive ?? (id === 'line' ? 1 : id === 'discord' ? 1 : id === 'teams' ? 1 : 0)} />}
    </div>
  );
};

/**
 * The bar at the top of a chat. `person`: a single person, not a group. `titleTap`: the picture and
 * name can be tapped (they open the person's details), with this practice id.
 */
const ChatHeader: React.FC<{ id: AppId; app: AppStyle; labels: L; interactive: boolean; title: string; subtitle?: string; person?: boolean; titleTap?: string }> = ({ id, app, labels, interactive, title, subtitle, person, titleTap }) => {
  const color = app.chatHeaderText;
  const face = (size: number) => person ? <User size={size} aria-hidden="true" /> : <Users size={size} aria-hidden="true" />;
  const tappable = (content: React.ReactNode, className: string) => titleTap
    ? <PracticeTap id={titleTap} label={title} pointer="below" className={className} style={{ color: 'inherit' }}>{content}</PracticeTap>
    : <div className={className}>{content}</div>;
  const back = interactive ? <PracticeTap id="back" label={labels.back} className={iconBtn}>{app.ios || app.iosChrome || id === 'wechat' ? <ChevronLeft size={28} aria-hidden="true" /> : <BackGlyph size={23} />}</PracticeTap> : <span className="w-3" />;
  const video = interactive && app.hasVideoCall && <PracticeTap id="video-call" label={labels.videoCall} className={iconBtn}><Video size={23} aria-hidden="true" /></PracticeTap>;
  const voice = interactive && <PracticeTap id="voice-call" label={labels.voiceCall} className={iconBtn}><Phone size={20} aria-hidden="true" /></PracticeTap>;

  if (app.ios) {
    return (
      <div className="flex items-center px-1 py-1 shrink-0 border-b" style={{ background: app.chatHeaderBg, color, borderColor: app.border }}>
        <span style={{ color: '#007AFF' }}>{back}</span>
        {tappable(<>
          <Avatar name={title} color="#A2A5AD" size={36}>{face(19)}</Avatar>
          <span className="text-[0.78rem] truncate flex items-center">{title}<ChevronRight size={12} aria-hidden="true" /></span>
        </>, 'flex-1 flex flex-col items-center min-w-0')}
        <span className="w-11 flex justify-center" style={{ color: '#007AFF' }}>{interactive && <PracticeTap id="voice-call" label={labels.voiceCall} className={iconBtn}><Video size={23} aria-hidden="true" /></PracticeTap>}</span>
      </div>
    );
  }
  if (id === 'wechat') {
    return (
      <div className="flex items-center px-1 shrink-0 border-b" style={{ background: app.chatHeaderBg, color, borderColor: app.border }}>
        {back}
        <h3 className="flex-1 text-center text-[1.1rem] font-bold truncate">{title}</h3>
        {interactive ? <PracticeTap id="menu" label={labels.menu} className={iconBtn}><MoreHorizontal size={23} aria-hidden="true" /></PracticeTap> : <span className="w-11" />}
      </div>
    );
  }
  if (id === 'discord') {
    return (
      <div className="flex items-center gap-1 px-1 shrink-0 border-b" style={{ background: app.chatHeaderBg, color, borderColor: app.border }}>
        {back}
        {tappable(<>
          {person ? <AtSign size={20} aria-hidden="true" style={{ color: app.subText }} /> : <Hash size={20} aria-hidden="true" style={{ color: app.subText }} />}
          <h3 className="text-[1.05rem] font-bold truncate">{title}</h3>
        </>, 'flex-1 min-w-0 flex items-center gap-1 text-left')}
        {voice}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 px-1 py-0.5 shrink-0" style={{ background: app.chatHeaderBg, color, boxShadow: '0 1px 2px rgba(0,0,0,0.12)', zIndex: 1 }}>
      <span style={id === 'messenger' ? { color: app.accent } : undefined}>{back}</span>
      {tappable(<>
        <Avatar name={title} color={person ? '#8A8D91' : '#6D8AA8'} size={36}>{face(19)}</Avatar>
        <span className="flex-1 min-w-0 pl-1 block">
          <span className="block text-[1.03rem] font-bold truncate leading-tight">{title}</span>
          <span className="block text-[0.74rem] truncate leading-tight" style={{ opacity: 0.85 }}>{subtitle ?? labels.members}</span>
        </span>
      </>, 'flex-1 min-w-0 flex items-center gap-1 text-left')}
      <span className="flex" style={id === 'messenger' ? { color: app.accent } : undefined}>
        {voice}
        {video}
      </span>
    </div>
  );
};

const Meta: React.FC<{ app: AppStyle; time: string; stage?: number; onOut?: boolean }> = ({ app, time, stage, onOut }) => {
  let mark: React.ReactNode = null;
  if (onOut && stage !== undefined) {
    if (app.status === 'ticks-blue' || app.status === 'ticks-accent') {
      const read = app.status === 'ticks-blue' ? '#53BDEB' : app.metaOut;
      const plain = app.status === 'ticks-blue' ? '#667781' : app.metaOut;
      mark = stage === 0 ? <Check size={15} style={{ color: plain }} /> : <CheckCheck size={15} style={{ color: stage >= 2 ? read : plain }} />;
    } else if (app.status === 'circle') {
      mark = <CircleCheck size={13} fill={stage >= 2 ? 'currentColor' : 'none'} style={{ color: app.metaOut }} />;
    }
  }
  return (
    <span className="flex justify-end items-center gap-1 text-[0.7rem] mt-0.5" style={{ color: onOut ? app.metaOut : app.subText }}>
      {time}
      {mark}
    </span>
  );
};

const bubbleCorners = (app: AppStyle, out: boolean) => {
  if (app.bubble === 'tail') return out ? 'rounded-xl rounded-tr-none' : 'rounded-xl rounded-tl-none';
  if (app.bubble === 'square' || app.bubble === 'teams') return 'rounded-md';
  return 'rounded-[1.1rem]';
};

/** One message, in the style of the app. */
const Message: React.FC<{ app: AppStyle; out?: boolean; sender?: string; color?: string; time: string; stage?: number; animate?: boolean; children: React.ReactNode }> = ({ app, out, sender, color = '#C0689B', time, stage, animate, children }) => {
  if (app.bubble === 'flat') {
    return (
      <div className={`flex items-start gap-2 ${animate ? 'sim-fade' : ''}`}>
        <Avatar name={out ? 'S' : sender ?? ''} color={out ? '#5865F2' : color} size={36}>{out ? <User size={18} aria-hidden="true" /> : undefined}</Avatar>
        <div className="min-w-0">
          <p className="text-[0.92rem] font-bold" style={{ color: '#F2F3F5' }}>{out ? 'Sie / You' : sender} <span className="font-normal text-[0.72rem]" style={{ color: app.subText }}>{time}</span></p>
          <div className="text-[1rem] leading-snug break-words" style={{ color: app.bubbleInText }}>{children}</div>
        </div>
      </div>
    );
  }
  const body = (
    <div
      className={`max-w-full px-2.5 py-1.5 ${bubbleCorners(app, !!out)}`}
      style={{ background: out ? app.bubbleOut : app.bubbleIn, color: out ? app.bubbleOutText : app.bubbleInText, boxShadow: app.bubbleIn === '#FFFFFF' && app.bubble !== 'square' ? '0 1px 1px rgba(0,0,0,0.13)' : undefined }}
    >
      {sender && !out && (!app.showAvatarInChat || app.bubble === 'teams') && <p className="text-[0.8rem] font-bold" style={{ color }}>{sender}</p>}
      <div className="text-[1rem] leading-snug break-words">{children}</div>
      {app.bubble !== 'round' && <Meta app={app} time={time} stage={stage} onOut={out} />}
      {app.bubble === 'round' && out && app.status === 'circle' && <Meta app={app} time={time} stage={stage} onOut />}
    </div>
  );
  return (
    <div className={`flex items-end gap-1.5 max-w-[86%] ${out ? 'self-end flex-row-reverse' : 'self-start'} ${animate ? 'sim-fade' : ''}`}>
      {app.showAvatarInChat && !out && <People app={app} name={sender ?? ''} color={color} size={30} />}
      {app.showAvatarInChat && out && app.avatarSquare && <People app={app} name="S" color="#576B95" size={30}><User size={16} aria-hidden="true" /></People>}
      <div className="min-w-0">
        {sender && !out && app.showAvatarInChat && app.bubble !== 'teams' && <p className="text-[0.74rem] pl-1" style={{ color: app.dark ? app.subText : app.wallpaper === '#8CABD9' ? '#FFFFFF' : app.subText }}>{sender}</p>}
        {body}
      </div>
    </div>
  );
};

const SendGlyph: React.FC<{ app: AppStyle }> = ({ app }) =>
  app.sendIcon === 'arrow' ? <ArrowUp size={22} strokeWidth={2.6} aria-hidden="true" /> : <Send size={20} aria-hidden="true" />;

/** The text field and the buttons around it. Every app arranges these differently. */
const Composer: React.FC<{ id: AppId; app: AppStyle; labels: L; typing: boolean; inlinePhoto?: boolean; holdMic?: boolean }> = ({ id, app, labels, typing, inlinePhoto, holdMic }) => {
  const { typed } = useContext(PracticeContext);
  const hasContent = typed.length > 0 || !!inlinePhoto;
  const iconColor = app.dark ? '#B5BAC1' : app.ios ? '#6C6C70' : id === 'messenger' || id === 'line' || id === 'viber' ? app.accent : app.subText;

  const micButton = (round: boolean) => (
    <PracticeTap
      id="microphone"
      label={labels.microphone}
      hold={holdMic}
      className={`${iconBtn} ${round ? 'w-11 h-11' : ''}`}
      style={round ? { background: id === 'discord' ? '#1E1F22' : app.accent, color: id === 'discord' ? '#B5BAC1' : app.accentText } : { color: iconColor }}
    >
      <Mic size={21} aria-hidden="true" />
    </PracticeTap>
  );

  const slot = (name: ComposerSlot): React.ReactNode => {
    switch (name) {
      case 'attach':
        if (typed && app.inField.includes('attach')) return null;
        return (
          <PracticeTap key="attach" id="attach" label={labels.attach} pointer={app.before.includes('attach') ? 'above-left' : 'above-right'} className={iconBtn} style={{ color: id === 'discord' ? '#FFFFFF' : app.ios ? '#6C6C70' : app.attachIcon === 'plus' ? app.accent : iconColor, background: id === 'discord' ? '#1E1F22' : app.ios ? '#E9E9EB' : undefined }}>
            {app.attachIcon === 'paperclip' ? <Paperclip size={23} aria-hidden="true" /> : app.attachIcon === 'image' ? <ImageIcon size={24} aria-hidden="true" /> : <Plus size={25} aria-hidden="true" />}
          </PracticeTap>
        );
      case 'camera':
        if (typed) return null;
        return <PracticeTap key="camera" id="camera" label={labels.camera} className={iconBtn} style={{ color: iconColor }}><Camera size={23} aria-hidden="true" /></PracticeTap>;
      case 'emoji':
        return <PracticeTap key="emoji" id="emoji" label={labels.emoji} className={iconBtn} style={{ color: iconColor }}><Smile size={23} aria-hidden="true" /></PracticeTap>;
      case 'mic':
        if (hasContent && app.before.includes('mic') && id === 'messenger') return null;
        return <React.Fragment key="mic">{micButton(false)}</React.Fragment>;
      case 'field':
        return (
          <PracticeTap
            key="field"
            id="message-field"
            label={labels.field || labels.messageWord}
            className="flex-1 min-w-0 px-2 text-left text-[1rem] truncate"
            style={{ color: typed ? (app.dark ? '#F2F3F5' : '#111B21') : app.dark ? '#949BA4' : '#667781' }}
          >
            {inlinePhoto ? (
              <span className="flex items-center gap-2 py-1">
                <span className="w-12 h-12 rounded-lg overflow-hidden block shrink-0"><FlowersPhoto /></span>
                <span>{labels.captionShort}</span>
              </span>
            ) : typed ? (
              <span>{typed}{typing && <span aria-hidden="true" className="inline-block w-[2px] h-[1.05em] align-text-bottom ml-px" style={{ background: app.accent }} />}</span>
            ) : labels.field}
          </PracticeTap>
        );
      case 'action':
      default:
        if (hasContent) {
          return (
            <PracticeTap key="send" id="send" label={labels.send} pointer="above-right" className={`${iconBtn} ${id === 'wechat' ? 'px-3 rounded-md' : 'w-11 h-11'}`} style={{ background: id === 'telegram' ? 'transparent' : app.accent, color: id === 'telegram' ? app.accent : app.accentText }}>
              {id === 'wechat' ? labels.send : <SendGlyph app={app} />}
            </PracticeTap>
          );
        }
        if (id === 'wechat') return null;
        if (id === 'messenger' || id === 'line') {
          return id === 'messenger'
            ? <PracticeTap key="like" id="like" label={labels.like} className={iconBtn} style={{ color: app.accent, fontSize: '1.3rem' }}><Smile size={25} aria-hidden="true" /></PracticeTap>
            : <React.Fragment key="m">{micButton(false)}</React.Fragment>;
        }
        if (app.ios || id === 'telegram' || id === 'teams') return <React.Fragment key="m">{micButton(false)}</React.Fragment>;
        return <React.Fragment key="m">{micButton(true)}</React.Fragment>;
    }
  };

  const fieldBox = (
    <div
      className={`flex-1 min-w-0 flex items-center gap-0 ${id === 'wechat' || id === 'threema' ? 'rounded-md' : id === 'telegram' || id === 'teams' ? '' : 'rounded-3xl'}`}
      style={{ background: app.fieldBg, border: app.ios ? `1px solid ${app.border}` : id === 'teams' ? '1px solid #D1D1D1' : undefined, boxShadow: id === 'whatsapp' ? '0 1px 1px rgba(0,0,0,0.13)' : undefined, minHeight: 44 }}
    >
      {app.inField.map(slot)}
    </div>
  );

  return (
    <div className="shrink-0" style={{ background: app.composerBg, borderTop: app.composerBg === '#FFFFFF' || app.composerBg === '#F7F7F7' ? `1px solid ${app.border}` : undefined }}>
      <div className="flex items-center gap-1 p-1.5">
        {app.before.map(slot)}
        {fieldBox}
        {app.after.map(slot)}
      </div>
      {app.below && <div className="flex items-center justify-around px-2 pb-1">{app.below.map(slot)}{!hasContent && null}</div>}
    </div>
  );
};

/** The open chat. After sending, it shows the message arriving and a reply coming in. */
const Chat: React.FC<{ id: AppId; app: AppStyle; labels: L; screen: string; isDone: boolean; kind?: string; lang: string }> = ({ id, app, labels, screen, isDone, kind, lang }) => {
  const { typed, fields, freeRoam } = useContext(PracticeContext);
  const typing = screen === 'typing' || screen === 'reply-typing' ;
  const time = clockTime();
  const [stage, setStage] = useState(0); // 0 sent, 1 delivered, 2 read, 3 reply is being written, 4 reply there
  const answers = isDone && kind !== 'call' && kind !== 'group' && kind !== 'delete';

  useEffect(() => {
    if (!isDone) return;
    const timers = [
      window.setTimeout(() => setStage(1), 700),
      window.setTimeout(() => setStage(2), 1500),
      window.setTimeout(() => setStage(3), 2300),
      window.setTimeout(() => {
        setStage(4);
        if (answers) playReceived();
      }, 4200),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [isDone, answers]);

  const statusLabel = stage >= 2 ? labels.statusRead : stage === 1 ? labels.statusDelivered : labels.statusSent;
  const canHold = screen === 'hold';
  const replying = screen === 'reply-typing' || (isDone && kind === 'reply');
  const title = kind === 'group' && isDone ? fields.groupName || labels.defaultGroup : labels.family;

  const peterText = labels.bubbleTwo;
  const annaMsg = <Message app={app} sender={labels.anna} color="#C0689B" time={time}>{labels.bubbleOne}</Message>;
  const peterMsg = (
    <Message app={app} sender={labels.peter} color="#7E9B5D" time={time}>{peterText}</Message>
  );

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ background: app.wallpaper, color: app.text }}>
      <ChatHeader id={id} app={app} labels={labels} interactive={!isDone || !!freeRoam} title={title} subtitle={stage === 3 && answers ? labels.isTyping : undefined} />
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-end gap-1.5 p-2.5">
        {kind === 'group' && isDone ? (
          <span className="self-center text-center px-3 py-1 rounded-lg text-[0.85rem] sim-fade" style={{ background: app.dark ? '#1E1F22' : '#FFFFFFCC', color: app.subText }}>{labels.groupCreated}</span>
        ) : (
          <>
            <span className="self-center px-3 py-0.5 rounded-lg text-[0.74rem] mb-1" style={{ background: app.bubble === 'tail' ? '#FFFFFFCC' : 'transparent', color: app.wallpaper === '#8CABD9' ? '#FFFFFF' : app.subText }}>
              {labels.today}
            </span>
            {annaMsg}
            {canHold || screen === 'hold-own' ? (
              <PracticeTap id="bubble-peter" label={`${labels.peter}: ${peterText}`} hold pointer="below" className={`self-start text-left rounded-2xl`}>
                {peterMsg}
              </PracticeTap>
            ) : peterMsg}
            {/* "Delete a message": the message that went to the wrong chat */}
            {kind === 'delete' && !isDone && (screen === 'hold-own' ? (
              <PracticeTap id="bubble-own" label={`${labels.you}: ${labels.wrongMessage}`} hold pointer="below" className="self-end text-left rounded-2xl">
                <Message app={app} out time={time} stage={1}>{labels.wrongMessage}</Message>
              </PracticeTap>
            ) : <Message app={app} out time={time} stage={1}>{labels.wrongMessage}</Message>)}
            {kind === 'delete' && isDone && (
              <Message app={app} out time={time} animate>
                <span className="flex items-center gap-1.5 italic" style={{ opacity: 0.85 }}><Ban size={16} aria-hidden="true" />{labels.deletedNote}</span>
              </Message>
            )}
          </>
        )}
        {isDone && kind === 'photo' && (
          <Message app={app} out time={time} stage={stage} animate><span className="block w-40 h-28 rounded-lg overflow-hidden"><FlowersPhoto /></span></Message>
        )}
        {isDone && kind === 'message' && <Message app={app} out time={time} stage={stage} animate>{typed || labels.defaultMessage}</Message>}
        {isDone && kind === 'reply' && (
          <Message app={app} out time={time} stage={stage} animate>
            <span className="block mb-1 px-2 py-1 text-[0.82rem] rounded" style={{ background: app.dark ? '#1E1F22' : 'rgba(0,0,0,0.07)', borderLeft: `3px solid ${app.accent === '#0A7CFF' || app.bubbleOutText === '#FFFFFF' ? '#FFFFFF' : app.accent}` }}>
              <span className="font-bold">{labels.peter}: </span>{peterText}
            </span>
            {typed || labels.defaultMessage}
          </Message>
        )}
        {isDone && kind === 'voice' && (
          <Message app={app} out time={time} stage={stage} animate>
            <span className="flex items-center gap-2"><Play size={20} fill="currentColor" aria-hidden="true" /><AudioLines size={32} aria-hidden="true" /><span className="text-[0.85rem]">0:07</span></span>
          </Message>
        )}
        {isDone && kind === 'call' && (
          <span className="self-center flex items-center gap-2 px-3 py-1.5 rounded-xl text-[0.9rem] sim-fade" style={{ background: app.dark ? '#1E1F22' : '#FFFFFF', color: app.text, boxShadow: '0 1px 1px rgba(0,0,0,0.13)' }}>
            <Video size={18} aria-hidden="true" /> {labels.callEnded}
          </span>
        )}
        {answers && app.status === 'text' && <span className="self-end text-[0.74rem]" style={{ color: app.wallpaper === '#8CABD9' ? '#FFFFFF' : app.subText }}>{statusLabel}</span>}
        {answers && stage === 3 && (
          <span className="sim-typing self-start px-3 py-2.5 rounded-2xl" style={{ background: app.bubble === 'flat' ? '#1E1F22' : app.bubbleIn }} aria-label={labels.isTyping} role="status">
            <span /><span /><span />
          </span>
        )}
        {answers && stage === 4 && (
          <Message app={app} sender={labels.anna} color="#C0689B" time={time} animate>{kind === 'photo' ? labels.replyPhoto : kind === 'voice' ? labels.replyVoice : labels.replyMessage}</Message>
        )}
      </div>
      {!isDone && replying && (
        <div className="flex items-center gap-2 px-3 py-1 shrink-0 text-[0.85rem]" style={{ background: app.dark ? '#1E1F22' : '#F0F2F5', color: app.text, borderLeft: `4px solid ${app.accent}` }}>
          <Reply size={17} aria-hidden="true" />
          <span className="truncate"><span className="font-bold">{labels.peter}: </span>{peterText}</span>
        </div>
      )}
      {!isDone && <Composer id={id} app={app} labels={labels} typing={typing} inlinePhoto={screen === 'inline'} holdMic={kind === 'voice'} />}
      {typing && <PhoneKeyboard lang={lang} dark={app.dark} suggestions={[labels.suggest1, labels.suggest2, labels.suggest3]} spaceLabel={labels.space} deleteLabel={labels.deleteKey} shiftLabel={labels.shift} />}
    </div>
  );
};

/** The menu after pressing and holding a message. `own`: your own message, which can also be edited. */
const MessageMenu: React.FC<{ id: AppId; app: AppStyle; labels: L; lang: string; own?: boolean }> = ({ id, app, labels, own }) => {
  const items = [
    { id: 'menu-reply', label: labels.replyWord, Icon: Reply },
    { id: 'menu-forward', label: labels.forwardWord, Icon: Forward },
    { id: 'menu-copy', label: labels.copyWord, Icon: Copy },
    ...(own ? [{ id: 'menu-edit', label: labels.edit, Icon: Pencil }] : []),
    { id: 'menu-delete', label: labels.deleteWord, Icon: Trash2 },
  ];
  const time = clockTime();
  return (
    <div className="flex flex-col flex-1 min-h-0 relative" style={{ background: app.wallpaper }}>
      <ChatHeader id={id} app={app} labels={labels} interactive={false} title={labels.family} />
      <div className="flex-1 min-h-0 flex flex-col justify-end p-2.5 gap-2" style={{ background: 'rgba(0,0,0,0.35)' }}>
        {own
          ? <Message app={app} out time={time} stage={1}>{labels.wrongMessage}</Message>
          : <Message app={app} sender={labels.peter} color="#7E9B5D" time={time}>{labels.bubbleTwo}</Message>}
        <div className={`sim-fade ${own ? 'self-end' : 'self-start'} w-[85%] rounded-2xl overflow-hidden flex flex-col`} style={{ background: app.dark ? '#1E1F22' : '#FFFFFF', color: app.text }}>
          {items.map(({ id: itemId, label, Icon }) => (
            <PracticeTap key={itemId} id={itemId} label={label} className="flex items-center gap-3 px-3 text-left text-[1rem] border-b" style={{ borderColor: app.border }}>
              <Icon size={20} aria-hidden="true" />{label}
            </PracticeTap>
          ))}
        </div>
      </div>
    </div>
  );
};

/** A question in the middle of the screen, as phones show before deleting or blocking. */
const PhoneDialog: React.FC<{ id: AppId; app: AppStyle; labels: L; title: string; subtitle?: string; behind: React.ReactNode; children: React.ReactNode }> = ({ id, app, labels, title, subtitle, behind, children }) => (
  <div className="flex flex-col flex-1 min-h-0 relative" style={{ background: app.wallpaper }}>
    <ChatHeader id={id} app={app} labels={labels} interactive={false} title={title} subtitle={subtitle} />
    <div className="flex-1 min-h-0 flex flex-col justify-end p-2.5 gap-2 relative">
      {behind}
      <div className="absolute inset-0 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
        <div className="sim-fade w-full rounded-2xl p-3 flex flex-col gap-1" style={{ background: app.dark ? '#2B2D31' : '#FFFFFF', color: app.text, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
          {children}
        </div>
      </div>
    </div>
  </div>
);

const dialogOption = 'w-full px-2 text-left text-[1rem] font-bold rounded-lg';

/** "Delete message?": for everyone, only for me, or cancel. */
const DeleteConfirm: React.FC<{ id: AppId; app: AppStyle; labels: L }> = ({ id, app, labels }) => (
  <PhoneDialog id={id} app={app} labels={labels} title={labels.family} behind={<Message app={app} out time={clockTime()} stage={1}>{labels.wrongMessage}</Message>}>
    <p className="text-[1.05rem] font-bold px-2 pb-1">{labels.deleteQuestion}</p>
    <PracticeTap id="delete-everyone" label={labels.deleteEveryone} pointer="below-right" className={dialogOption} style={{ color: app.text }}>{labels.deleteEveryone}</PracticeTap>
    <PracticeTap id="delete-me" label={labels.deleteMe} className={dialogOption} style={{ color: app.text }}>{labels.deleteMe}</PracticeTap>
    <PracticeTap id="delete-cancel" label={labels.cancelWord} className={dialogOption} style={{ color: app.subText }}>{labels.cancelWord}</PracticeTap>
  </PhoneDialog>
);

/*
 * Blocking a stranger (lessons from data/blockLessons.ts). Every app does it differently, so `flow`
 * decides where the stranger appears, where "Block" is and what the app asks. Texts come from the
 * lesson's `bk*` labels.
 */
const strangerRow = (labels: L): ListRow => ({ id: 'chat-stranger', name: labels.strangerNumber, last: labels.strangerLast, unread: 2, avatar: <User size={24} aria-hidden="true" /> });
const BAR_FLOWS: BlockFlow[] = ['wa-android', 'wa-iphone', 'telegram', 'viber', 'line'];
const PANEL_FLOWS: BlockFlow[] = ['signal', 'messenger', 'discord'];
const HEADER_FLOWS: BlockFlow[] = ['apple', 'threema', 'discord'];

/** A simple list screen with its own title, as requests inboxes look. */
const SubList: React.FC<{ app: AppStyle; labels: L; title: string }> = ({ app, labels, title }) => (
  <div className="flex flex-col flex-1 min-h-0" style={{ background: app.bg, color: app.text }}>
    <div className="flex items-center gap-1 px-1 shrink-0 border-b" style={{ borderColor: app.border, background: app.dark ? '#2B2D31' : app.bg }}>
      <span aria-hidden="true" className="w-11 h-11 flex items-center justify-center">{app.iosChrome ? <ChevronLeft size={26} /> : <ArrowLeft size={22} />}</span>
      <h3 className="flex-1 text-[1.15rem] font-bold truncate">{title}</h3>
    </div>
    <div className="p-1">
      <PracticeTap id="chat-stranger" label={labels.strangerNumber} className="flex items-center gap-3 w-full text-left px-2 py-1.5 rounded-xl" style={{ color: app.text }}>
        <Avatar name={labels.strangerNumber} color="#8A8D91" size={50}><User size={24} aria-hidden="true" /></Avatar>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-[1.03rem] truncate">{labels.strangerNumber}</span>
          <span className="block text-[0.93rem] truncate" style={{ color: app.subText }}>{labels.strangerLast}</span>
        </span>
      </PracticeTap>
    </div>
  </div>
);

/** A button in a bar or panel under or above a stranger's messages. */
const BarButton: React.FC<{ app: AppStyle; id: string; label: string; danger?: boolean; filled?: boolean; icon?: React.ReactNode }> = ({ app, id, label, danger, filled, icon }) => (
  <PracticeTap
    id={id}
    label={label}
    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg font-bold text-[0.95rem] px-1"
    style={filled ? { background: app.accent, color: app.accentText } : { border: `1px solid ${app.dark ? '#4E5058' : app.border}`, color: danger ? (app.dark ? '#FF7B72' : '#C62828') : app.text }}
  >
    {icon}{label}
  </PracticeTap>
);

/** The stranger's chat, with the app's own way of offering "Block". After blocking (`done`), a note says so. */
const BlockChat: React.FC<{ flow: BlockFlow; id: AppId; app: AppStyle; labels: L; done?: boolean; overlay?: React.ReactNode }> = ({ flow, id, app, labels: allLabels, done, overlay }) => {
  const time = clockTime();
  const light = app.dark ? '#2B2D31' : '#FFFFFF';
  const danger = app.dark ? '#FF7B72' : '#C62828';
  // Some apps name the chat in the text field ("Message Family"): here it is the stranger's chat.
  const labels: L = { ...allLabels, field: allLabels.field ? allLabels.field.replace(allLabels.family, allLabels.strangerNumber) : allLabels.field };
  const bar = !done && !overlay && BAR_FLOWS.includes(flow);
  const panel = !done && !overlay && PANEL_FLOWS.includes(flow);
  return (
    <div className="flex flex-col flex-1 min-h-0 relative" style={{ background: app.wallpaper, color: app.text }}>
      <ChatHeader id={id} app={app} labels={labels} interactive={!done && !overlay} person title={labels.strangerNumber} subtitle={labels.notInContacts}
        titleTap={!done && !overlay && HEADER_FLOWS.includes(flow) ? 'bk-header' : undefined} />
      {bar && (
        <div className="shrink-0 px-3 py-2 flex flex-col gap-1.5 text-[0.9rem]" style={{ background: light, color: app.text, borderBottom: `1px solid ${app.border}` }}>
          {labels.bkBanner && <span>{labels.bkBanner}</span>}
          <span className="flex gap-2">
            {flow === 'line' && <BarButton app={app} id="add-contact" label={labels.bkAdd} icon={<UserPlus size={17} aria-hidden="true" />} />}
            <BarButton app={app} id="block-start" label={labels.bkBlock} danger icon={<Ban size={17} aria-hidden="true" />} />
            {flow !== 'line' && <BarButton app={app} id="add-contact" label={labels.bkAdd} icon={<UserPlus size={17} aria-hidden="true" />} />}
            {flow === 'line' && <BarButton app={app} id="bk-third" label={labels.bkThird} icon={<Flag size={17} aria-hidden="true" />} />}
          </span>
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-end gap-1.5 p-2.5">
        <Message app={app} sender={labels.strangerNumber} color="#8A8D91" time={time}>{labels.strangerOne}</Message>
        <Message app={app} sender={labels.strangerNumber} color="#8A8D91" time={time}>{labels.strangerTwo}</Message>
        {flow === 'apple' && !done && (
          <p className="self-center text-center text-[0.8rem] px-2" style={{ color: app.subText }}>
            {labels.bkBanner}{' '}
            <PracticeTap id="bk-report-spam" label={labels.bkReportSpam} className="inline-flex min-h-0 min-w-0 font-bold" style={{ color: '#007AFF' }}>{labels.bkReportSpam}</PracticeTap>
          </p>
        )}
        {done && (
          <span className="self-center flex items-center gap-2 px-3 py-1.5 rounded-xl text-[0.9rem] sim-fade" style={{ background: light, color: app.text, boxShadow: '0 1px 1px rgba(0,0,0,0.13)' }}>
            <Ban size={17} aria-hidden="true" style={{ color: danger }} />{labels.blockedNote}
          </span>
        )}
      </div>
      {panel && (
        <div className="shrink-0 px-3 pt-2 pb-3 flex flex-col gap-2 text-[0.88rem]" style={{ background: light, color: app.text, borderTop: `1px solid ${app.border}` }}>
          <span className="text-center" style={{ color: app.subText }}>{labels.bkBanner}</span>
          <span className="flex gap-2">
            {flow !== 'discord' && <BarButton app={app} id="block-start" label={labels.bkBlock} danger />}
            <BarButton app={app} id="bk-third" label={labels.bkThird} />
            <BarButton app={app} id="bk-accept" label={labels.bkAccept} filled />
          </span>
        </div>
      )}
      {done
        ? <p className="shrink-0 text-center text-[0.85rem] px-3 py-2" style={{ background: light, color: app.subText }}>{labels.blockedFooter}</p>
        : !panel && !overlay && <Composer id={id} app={app} labels={labels} typing={false} />}
      {overlay}
    </div>
  );
};

/** A window over the stranger's chat: a question in the middle, or choices at the bottom. */
const BlockOverlay: React.FC<{ app: AppStyle; bottom?: boolean; children: React.ReactNode }> = ({ app, bottom, children }) => (
  <div className={`absolute inset-0 flex justify-center p-3 ${bottom ? 'items-end' : 'items-center'}`} style={{ background: 'rgba(0,0,0,0.45)', zIndex: 5 }}>
    <div className={`sim-fade w-full p-3 flex flex-col gap-1 ${bottom && app.iosChrome ? 'rounded-2xl' : 'rounded-2xl'}`} style={{ background: app.dark ? '#2B2D31' : '#FFFFFF', color: app.text, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
      {children}
    </div>
  </div>
);

const sheetOption = 'w-full px-2 text-[1rem] font-bold rounded-lg';

const BlockScreens: React.FC<{ flow: BlockFlow; screen: string; isDone: boolean; id: AppId; app: AppStyle; labels: L; lang: string }> = ({ flow, screen, isDone, id, app, labels, lang }) => {
  const danger = app.dark ? '#FF7B72' : '#C62828';
  if (isDone) return <BlockChat flow={flow} id={id} app={app} labels={labels} done />;

  switch (screen) {
    case 'bk-list': {
      if (flow === 'messenger') return <ChatList id={id} app={app} labels={labels} lang={lang} />;
      if (flow === 'line' || flow === 'discord') {
        return <ChatList id={id} app={app} labels={labels} lang={lang} top={{ id: 'bk-requests-row', name: labels.bkRequests, last: labels.strangerNumber, unread: 1, avatar: <Inbox size={24} aria-hidden="true" /> }} />;
      }
      return <ChatList id={id} app={app} labels={labels} lang={lang} top={strangerRow(labels)} />;
    }

    case 'bk-hold': {
      // Google Messages: after pressing and holding, a bar with Archive, Delete and Block replaces the top.
      const bar = (
        <div className="flex items-center gap-1 px-1 py-1 shrink-0" style={{ background: '#F8FAFD', color: '#1F1F1F' }}>
          <span aria-hidden="true" className="w-11 h-11 flex items-center justify-center"><X size={22} /></span>
          <span className="flex-1 text-[1.15rem] font-bold">1</span>
          <PracticeTap id="bk-archive" label={labels.bkArchive} className={iconBtn}><Archive size={22} aria-hidden="true" /></PracticeTap>
          <PracticeTap id="bk-delete" label={labels.bkDelete} className={iconBtn}><Trash2 size={22} aria-hidden="true" /></PracticeTap>
          <PracticeTap id="bk-block" label={labels.bkBlock} pointer="below-right" className={iconBtn}><Ban size={22} aria-hidden="true" /></PracticeTap>
          <span aria-hidden="true" className="w-9 h-11 flex items-center justify-center"><MoreVertical size={22} /></span>
        </div>
      );
      return <ChatList id={id} app={app} labels={labels} lang={lang} top={strangerRow(labels)} topBar={bar} selected="chat-stranger" />;
    }

    case 'bk-drawer': {
      // Messenger: the menu with the three lines. "Message requests" is the third line.
      const item = (itemId: string, label: string, Icon: typeof MessageCircle, badge?: number, on?: boolean) => (
        <PracticeTap key={label} id={itemId} label={label} className="w-full flex items-center gap-3 px-3 rounded-xl text-left text-[1rem] font-bold" style={{ background: on ? '#F0F0F0' : undefined, color: '#050505' }}>
          <span aria-hidden="true" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#E4E6EB' }}><Icon size={19} /></span>
          <span className="flex-1">{label}</span>
          {badge ? <span className="min-w-[1.3rem] h-[1.3rem] px-1 rounded-full text-[0.75rem] flex items-center justify-center" style={{ background: '#0A7CFF', color: '#FFFFFF' }}>{badge}</span> : null}
        </PracticeTap>
      );
      return (
        <div className="flex flex-1 min-h-0 relative">
          <div className="absolute inset-0 flex flex-col"><ChatList id={id} app={app} labels={labels} lang={lang} /></div>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
          <div className="sim-fade relative w-[82%] h-full flex flex-col gap-1 p-2" style={{ background: '#FFFFFF' }}>
            <p className="px-3 py-2 text-[1.3rem] font-bold" style={{ color: '#050505' }}>messenger</p>
            {item('bk-chats-row', labels.bkChats, MessageCircle, 0, true)}
            {item('bk-other-item', labels.bkMarketplace, Store)}
            {item('bk-requests-row', labels.bkRequests, MessageSquareDot, 1)}
            {item('bk-archive', labels.bkArchived, Archive)}
          </div>
        </div>
      );
    }

    case 'bk-requests':
      return <SubList app={app} labels={labels} title={labels.bkRequestsTitle ?? labels.bkRequests} />;

    case 'bk-chat':
      return <BlockChat flow={flow} id={id} app={app} labels={labels} />;

    case 'bk-pop':
      // iPhone Messages: tapping the icon at the top shows round buttons; "Info" opens the details.
      return (
        <BlockChat flow={flow} id={id} app={app} labels={labels} overlay={
          <div className="absolute left-0 right-0 top-[3.6rem] flex justify-center" style={{ zIndex: 5 }}>
            <div className="sim-fade flex gap-3 px-4 py-2.5 rounded-2xl" style={{ background: '#FFFFFF', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>
              {[['voice-call', labels.bkCall, Phone], ['video-call', labels.bkFaceTime, Video], ['bk-info', labels.bkInfo, Info]].map(([tapId, label, Icon]) => {
                const Glyph = Icon as typeof Phone;
                return (
                  <PracticeTap key={tapId as string} id={tapId as string} label={label as string} pointer={tapId === 'bk-info' ? 'below-right' : undefined} className="flex flex-col items-center gap-0.5 rounded-xl px-1 text-[0.75rem]" style={{ color: '#007AFF' }}>
                    <span aria-hidden="true" className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: '#E9E9EB' }}><Glyph size={20} /></span>
                    {label as string}
                  </PracticeTap>
                );
              })}
            </div>
          </div>
        } />
      );

    case 'bk-details':
    case 'bk-moremenu': {
      const menuOpen = screen === 'bk-moremenu';
      if (flow === 'apple') {
        return (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden" style={{ background: '#F2F2F7', color: '#000000' }}>
            <div className="flex items-center px-1 shrink-0"><span aria-hidden="true" className="w-11 h-11 flex items-center justify-center" style={{ color: '#007AFF' }}><ChevronLeft size={26} /></span></div>
            <div className="flex flex-col items-center gap-1 pb-3">
              <Avatar name={labels.strangerNumber} color="#A2A5AD" size={72}><User size={36} aria-hidden="true" /></Avatar>
              <span className="text-[1.3rem] font-bold">{labels.strangerNumber}</span>
            </div>
            <div className="mx-3 rounded-xl overflow-hidden flex flex-col" style={{ background: '#FFFFFF' }}>
              <PracticeTap id="bk-row" label={labels.bkRow1} className="w-full px-3 text-left text-[1rem] border-b" style={{ color: '#007AFF', borderColor: '#E5E5EA' }}>{labels.bkRow1}</PracticeTap>
              <span aria-hidden="true" className="px-3 py-2.5 text-[1rem]" style={{ color: '#007AFF' }}>{labels.bkRow2}</span>
            </div>
            <div className="mx-3 mt-3 rounded-xl overflow-hidden" style={{ background: '#FFFFFF' }}>
              <PracticeTap id="bk-block" label={labels.bkBlockContact} pointer="above-left" className="w-full px-3 text-left text-[1rem]" style={{ color: '#FF3B30' }}>{labels.bkBlockContact}</PracticeTap>
            </div>
          </div>
        );
      }
      const isDiscord = flow === 'discord';
      const menu = menuOpen && (
        <div className="absolute right-2 top-12 sim-fade w-[70%] rounded-xl overflow-hidden flex flex-col" style={{ background: isDiscord ? '#2B2D31' : '#FFFFFF', color: isDiscord ? '#F2F3F5' : '#111111', boxShadow: '0 4px 16px rgba(0,0,0,0.35)', zIndex: 5 }}>
          {isDiscord
            ? <PracticeTap id="bk-third" label={labels.bkReportUser} className="w-full px-3 text-left text-[0.98rem] font-bold" style={{ color: '#F2F3F5' }}>{labels.bkReportUser}</PracticeTap>
            : <>
                <PracticeTap id="bk-other-item" label={labels.bkEdit} className="w-full px-3 text-left text-[0.98rem]" style={{ color: '#111111' }}>{labels.bkEdit}</PracticeTap>
                <PracticeTap id="bk-share" label={labels.bkShare} className="w-full px-3 text-left text-[0.98rem]" style={{ color: '#111111' }}>{labels.bkShare}</PracticeTap>
              </>}
          <PracticeTap id="bk-block" label={labels.bkBlockContact} pointer="below-right" className="w-full px-3 text-left text-[0.98rem] font-bold" style={{ color: isDiscord ? '#FF7B72' : '#111111' }}>{labels.bkBlockContact}</PracticeTap>
        </div>
      );
      if (isDiscord) {
        // Discord: the profile, with "..." at the top right.
        return (
          <div className="flex flex-col flex-1 min-h-0 relative" style={{ background: '#232428', color: '#F2F3F5' }}>
            <div className="h-20 shrink-0 relative" style={{ background: '#5865F2' }}>
              <PracticeTap id="bk-more" label={labels.bkMore} pointer="below-right" className={`${iconBtn} absolute right-2 top-2`} style={{ background: 'rgba(0,0,0,0.35)', color: '#FFFFFF' }}><MoreHorizontal size={22} aria-hidden="true" /></PracticeTap>
            </div>
            <div className="px-4 -mt-9">
              <span className="inline-block rounded-full p-1" style={{ background: '#232428' }}><Avatar name={labels.strangerNumber} color="#8A8D91" size={72}><User size={36} aria-hidden="true" /></Avatar></span>
              <p className="text-[1.3rem] font-bold">{labels.strangerNumber}</p>
              <p className="text-[0.9rem]" style={{ color: '#B5BAC1' }}>{labels.bkBanner}</p>
            </div>
            {menu}
          </div>
        );
      }
      // Threema: the contact details, with the three dots at the top right.
      return (
        <div className="flex flex-col flex-1 min-h-0 relative" style={{ background: '#FFFFFF', color: '#111111' }}>
          <div className="flex items-center gap-1 px-1 shrink-0" style={{ background: '#1F1F1F', color: '#FFFFFF' }}>
            <span aria-hidden="true" className="w-11 h-11 flex items-center justify-center"><ArrowLeft size={22} /></span>
            <h3 className="flex-1 text-[1.1rem] font-bold truncate">{labels.strangerNumber}</h3>
            <PracticeTap id="bk-more" label={labels.bkMore} pointer="below-right" className={iconBtn} style={{ color: '#FFFFFF' }}><MoreVertical size={22} aria-hidden="true" /></PracticeTap>
          </div>
          <div className="flex flex-col items-center gap-1 py-4">
            <Avatar name={labels.strangerNumber} color="#8A8D91" size={80}><User size={40} aria-hidden="true" /></Avatar>
            <span className="text-[1.2rem] font-bold">{labels.strangerNumber}</span>
          </div>
          <div className="px-4 flex flex-col gap-2 text-[0.95rem]">
            <span>{labels.bkId}</span>
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="flex gap-0.5">{[0, 1, 2].map((dot) => <span key={dot} className="w-2 h-2 rounded-full" style={{ background: dot === 0 ? '#E53935' : '#CFCFCF' }} />)}</span>
              {labels.bkLevel}
            </span>
          </div>
          {menu}
        </div>
      );
    }

    case 'bk-sheet': {
      // Choices: "Block and report" or "Block" (WhatsApp on iPhone, Signal, Viber), or what to block (Messenger).
      const isMessenger = flow === 'messenger';
      const centred = flow === 'signal';
      return (
        <BlockChat flow={flow} id={id} app={app} labels={labels} overlay={
          <BlockOverlay app={app} bottom={!centred}>
            {labels.bkTitle && <p className={`text-[1.05rem] font-bold px-2 ${app.iosChrome ? 'text-center' : ''}`}>{labels.bkTitle}</p>}
            {labels.bkBody && !isMessenger && <p className={`text-[0.92rem] px-2 pb-1 ${app.iosChrome ? 'text-center' : ''}`} style={{ color: app.subText }}>{labels.bkBody}</p>}
            {isMessenger ? (
              <>
                <PracticeTap id="block-report" label={labels.bkOpt1} pointer="above-left" className="w-full px-2 py-1 text-left rounded-lg" style={{ color: app.text }}>
                  <span className="block text-[1rem] font-bold">{labels.bkOpt1}</span>
                  <span className="block text-[0.85rem]" style={{ color: app.subText }}>{labels.bkOpt1Info}</span>
                </PracticeTap>
                <PracticeTap id="bk-fb" label={labels.bkOpt2} className="w-full px-2 py-1 text-left rounded-lg" style={{ color: app.text }}>
                  <span className="block text-[1rem] font-bold">{labels.bkOpt2}</span>
                  <span className="block text-[0.85rem]" style={{ color: app.subText }}>{labels.bkOpt2Info}</span>
                </PracticeTap>
              </>
            ) : (
              <>
                <PracticeTap id="block-report" label={labels.bkOpt1} pointer="above-left" className={`${sheetOption} ${app.iosChrome ? 'text-center' : 'text-left'}`} style={{ color: danger }}>{labels.bkOpt1}</PracticeTap>
                <PracticeTap id="bk-block-only" label={labels.bkOpt2} className={`${sheetOption} ${app.iosChrome ? 'text-center' : 'text-left'}`} style={{ color: danger }}>{labels.bkOpt2}</PracticeTap>
              </>
            )}
            <PracticeTap id="block-cancel" label={labels.cancelWord} className={`${sheetOption} ${app.iosChrome ? 'text-center' : 'text-left'}`} style={{ color: app.iosChrome ? '#007AFF' : app.subText }}>{labels.cancelWord}</PracticeTap>
          </BlockOverlay>
        } />
      );
    }

    case 'bk-dialog':
    case 'bk-dialog2': {
      // A question with a box to tick for reporting (WhatsApp on Android, Telegram, Google Messages).
      const ticked = screen === 'bk-dialog2';
      const box = (on: boolean) => (
        <span aria-hidden="true" className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={on ? { background: app.accent, color: app.accentText } : { border: `2px solid ${app.subText}` }}>
          {on && <Check size={16} />}
        </span>
      );
      const okColour = flow === 'telegram' ? '#E53935' : flow === 'wa-android' ? '#1DAA61' : app.accent;
      return (
        <BlockChat flow={flow} id={id} app={app} labels={labels} overlay={
          <BlockOverlay app={app}>
            <p className="text-[1.05rem] font-bold px-2">{labels.bkTitle}</p>
            <p className="text-[0.92rem] px-2 pb-1" style={{ color: app.subText }}>{labels.bkBody}</p>
            <PracticeTap id="report-check" label={labels.bkCheck} pointer="above-left" className="w-full flex items-center gap-2 px-2 text-left text-[0.98rem] rounded-lg" style={{ color: app.text }}>
              {box(ticked)}{labels.bkCheck}
            </PracticeTap>
            {labels.bkCheck2 && (
              <PracticeTap id="bk-delete-check" label={labels.bkCheck2} className="w-full flex items-center gap-2 px-2 text-left text-[0.98rem] rounded-lg" style={{ color: app.text }}>
                {box(false)}{labels.bkCheck2}
              </PracticeTap>
            )}
            <span className="flex justify-end gap-2 pt-1">
              <PracticeTap id="block-cancel" label={labels.cancelWord} className="px-3 rounded-lg font-bold text-[1rem]" style={{ color: app.subText }}>{labels.cancelWord}</PracticeTap>
              <PracticeTap id="block-ok" label={labels.bkOk} pointer="above-right" className="px-3 rounded-lg font-bold text-[1rem]" style={{ color: okColour }}>{labels.bkOk}</PracticeTap>
            </span>
          </BlockOverlay>
        } />
      );
    }

    case 'bk-confirm': {
      // The last question: Messenger (blue), iPhone (red choice at the bottom), LINE (green), Discord (red).
      if (flow === 'apple') {
        return (
          <div className="flex flex-col flex-1 min-h-0 relative" style={{ background: '#F2F2F7' }}>
            <div className="absolute inset-0 flex flex-col justify-end p-2 gap-2" style={{ background: 'rgba(0,0,0,0.35)', zIndex: 5 }}>
              <div className="sim-fade rounded-2xl overflow-hidden flex flex-col" style={{ background: '#FFFFFF' }}>
                <p className="text-center text-[0.85rem] px-3 py-2.5 border-b" style={{ color: '#8E8E93', borderColor: '#E5E5EA' }}>{labels.bkBody}</p>
                <PracticeTap id="block-ok" label={labels.bkOk} pointer="above-right" className="w-full text-center text-[1.05rem]" style={{ color: '#FF3B30' }}>{labels.bkOk}</PracticeTap>
              </div>
              <PracticeTap id="block-cancel" label={labels.cancelWord} className="sim-fade w-full rounded-2xl text-center text-[1.05rem] font-bold" style={{ background: '#FFFFFF', color: '#007AFF' }}>{labels.cancelWord}</PracticeTap>
            </div>
          </div>
        );
      }
      const okStyle = flow === 'messenger' ? { background: '#0A7CFF', color: '#FFFFFF' } : flow === 'line' ? { background: '#06C755', color: '#FFFFFF' } : { background: '#DA373C', color: '#FFFFFF' };
      return (
        <BlockChat flow={flow} id={id} app={app} labels={labels} overlay={
          <BlockOverlay app={app} bottom={flow === 'messenger'}>
            <p className="text-[1.05rem] font-bold px-2">{labels.bkTitle}</p>
            <p className="text-[0.92rem] px-2 pb-1" style={{ color: app.subText }}>{labels.bkConfirmBody}</p>
            <span className={`flex gap-2 pt-1 ${flow === 'messenger' ? 'flex-col' : 'justify-end'}`}>
              {flow === 'messenger'
                ? <>
                    <PracticeTap id="block-ok" label={labels.bkOk} pointer="above-right" className="w-full rounded-lg font-bold text-[1rem]" style={okStyle}>{labels.bkOk}</PracticeTap>
                    <PracticeTap id="block-cancel" label={labels.cancelWord} className="w-full rounded-lg font-bold text-[1rem]" style={{ background: '#E4E6EB', color: '#050505' }}>{labels.cancelWord}</PracticeTap>
                  </>
                : <>
                    <PracticeTap id="block-cancel" label={labels.cancelWord} className="px-3 rounded-lg font-bold text-[1rem]" style={{ color: app.subText }}>{labels.cancelWord}</PracticeTap>
                    <PracticeTap id="block-ok" label={labels.bkOk} pointer="above-right" className="px-4 rounded-lg font-bold text-[1rem]" style={okStyle}>{labels.bkOk}</PracticeTap>
                  </>}
            </span>
          </BlockOverlay>
        } />
      );
    }

    default:
      return <BlockChat flow={flow} id={id} app={app} labels={labels} />;
  }
};

/** While a voice message is being recorded. */
const Recording: React.FC<{ id: AppId; app: AppStyle; labels: L }> = ({ id, app, labels }) => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const tick = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(tick);
  }, []);
  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ background: app.wallpaper, color: app.text }}>
      <ChatHeader id={id} app={app} labels={labels} interactive={false} title={labels.family} />
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-2 p-3 text-center">
        <Mic size={44} aria-hidden="true" style={{ color: '#EA0038' }} />
        <p role="status" className="text-[1.2rem] font-bold" style={{ color: app.wallpaper === '#8CABD9' || app.dark ? '#FFFFFF' : '#111B21' }}>0:{String(seconds).padStart(2, '0')}</p>
        <p className="text-[0.9rem]" style={{ color: app.wallpaper === '#8CABD9' || app.dark ? '#FFFFFF' : '#111B21' }}>{labels.recordingNote}</p>
      </div>
      <div className="flex items-center justify-between p-2 shrink-0" style={{ background: app.dark ? '#1E1F22' : '#FFFFFF' }}>
        <PracticeTap id="rec-delete" label={labels.deleteWord} className={iconBtn} style={{ color: '#667781' }}><Trash2 size={24} aria-hidden="true" /></PracticeTap>
        <PracticeTap id="send" label={labels.send} pointer="above-right" className={`${iconBtn} w-12 h-12`} style={{ background: app.accent, color: app.accentText }}><SendGlyph app={app} /></PracticeTap>
      </div>
    </div>
  );
};

/** Starting a new chat: the screen with "New group" at the top. */
const NewChat: React.FC<{ app: AppStyle; labels: L }> = ({ app, labels }) => (
  <div className="flex flex-col flex-1 min-h-0 sim-fade" style={{ background: app.dark ? '#2B2D31' : '#FFFFFF', color: app.text }}>
    <div className="flex items-center gap-1 px-1 py-1 shrink-0" style={{ background: app.chatHeaderBg, color: app.chatHeaderText }}>
      <PracticeTap id="back" label={labels.back} className={iconBtn}><BackGlyph size={23} /></PracticeTap>
      <h3 className="flex-1 text-[1.1rem] font-bold">{labels.newChat}</h3>
    </div>
    <div className="flex flex-col gap-1 p-1">
      <PracticeTap id="new-group" label={labels.newGroup} className="flex items-center gap-3 px-2 py-1.5 rounded-xl text-left text-[1.05rem] font-bold">
        <span className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: app.accent, color: app.accentText }}><Users size={22} aria-hidden="true" /></span>{labels.newGroup}
      </PracticeTap>
      <PracticeTap id="new-contact" label={labels.newContact} className="flex items-center gap-3 px-2 py-1.5 rounded-xl text-left text-[1.05rem] font-bold">
        <span className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: app.accent, color: app.accentText }}><UserPlus size={22} aria-hidden="true" /></span>{labels.newContact}
      </PracticeTap>
      {[[labels.anna, '#C0689B'], [labels.peter, '#7E9B5D']].map(([name, color]) => (
        <div key={name} className="flex items-center gap-3 px-2 py-1.5 text-[1.05rem]"><Avatar name={name} color={color} size={44} />{name}</div>
      ))}
    </div>
  </div>
);

/** Choosing who is in the new group. */
const PickPeople: React.FC<{ app: AppStyle; labels: L; picked: string[] }> = ({ app, labels, picked }) => {
  const people = [
    { id: 'pick-anna', name: labels.anna, color: '#C0689B' },
    { id: 'pick-peter', name: labels.peter, color: '#7E9B5D' },
    { id: 'pick-eva', name: labels.eva, color: '#D08A4E' },
  ];
  return (
    <div className="flex flex-col flex-1 min-h-0 sim-fade" style={{ background: app.dark ? '#2B2D31' : '#FFFFFF', color: app.text }}>
      <div className="flex items-center gap-1 px-1 py-1 shrink-0" style={{ background: app.chatHeaderBg, color: app.chatHeaderText }}>
        <PracticeTap id="back" label={labels.back} className={iconBtn}><BackGlyph size={23} /></PracticeTap>
        <h3 className="flex-1 text-[1.1rem] font-bold">{labels.newGroup}</h3>
      </div>
      <p className="px-3 py-1 text-[0.9rem] shrink-0" style={{ color: app.subText }}>{labels.addPeople}</p>
      <div className="flex-1 min-h-0 flex flex-col gap-1 p-1 relative">
        {people.map((person) => {
          const on = picked.includes(person.id);
          return (
            <PracticeTap key={person.id} id={person.id} label={person.name} className="flex items-center gap-3 px-2 py-1.5 rounded-xl text-left text-[1.05rem] w-full">
              <Avatar name={person.name} color={person.color} size={44} />
              <span className="flex-1">{person.name}</span>
              <span className="w-7 h-7 rounded-full flex items-center justify-center" style={on ? { background: app.accent, color: app.accentText } : { border: `2px solid ${app.subText}` }}>{on && <Check size={17} aria-hidden="true" />}</span>
            </PracticeTap>
          );
        })}
        {picked.length >= 2 && (
          <PracticeTap id="pick-next" label={labels.nextWord} pointer="above-right" className="absolute right-3 bottom-3 h-14 px-5 rounded-2xl flex items-center gap-2 font-bold text-[1rem] sim-fade" style={{ background: app.accent, color: app.accentText }}>
            {labels.nextWord}<ChevronRight size={20} aria-hidden="true" />
          </PracticeTap>
        )}
      </div>
    </div>
  );
};

/** Giving the new group a name. */
const GroupName: React.FC<{ app: AppStyle; labels: L; lang: string }> = ({ app, labels, lang }) => {
  const { typed } = useContext(PracticeContext);
  return (
    <div className="flex flex-col flex-1 min-h-0 sim-fade" style={{ background: app.dark ? '#2B2D31' : '#FFFFFF', color: app.text }}>
      <div className="flex items-center gap-1 px-1 py-1 shrink-0" style={{ background: app.chatHeaderBg, color: app.chatHeaderText }}>
        <PracticeTap id="back" label={labels.back} className={iconBtn}><BackGlyph size={23} /></PracticeTap>
        <h3 className="flex-1 text-[1.1rem] font-bold">{labels.newGroup}</h3>
      </div>
      <div className="p-3 flex-1 min-h-0">
        <p className="text-[0.9rem] mb-1" style={{ color: app.subText }}>{labels.groupNameLabel}</p>
        <p className="py-2 text-[1.1rem] border-b-2" style={{ borderColor: app.accent }}>
          {typed || <span style={{ color: app.subText }}>{labels.groupNameHint}</span>}
          {typed && <span aria-hidden="true" className="inline-block w-[2px] h-[1.05em] align-text-bottom ml-px" style={{ background: app.accent }} />}
        </p>
        <p className="mt-3 text-[0.9rem]" style={{ color: app.subText }}>{labels.groupMembers}</p>
        {typed && (
          <div className="flex justify-end mt-2">
            <PracticeTap id="send" label={labels.createWord} pointer="above-right" className="h-12 px-5 rounded-2xl flex items-center gap-2 font-bold text-[1rem] sim-fade" style={{ background: app.accent, color: app.accentText }}>
              <Check size={20} aria-hidden="true" />{labels.createWord}
            </PracticeTap>
          </div>
        )}
      </div>
      <PhoneKeyboard lang={lang} dark={app.dark} suggestions={[labels.suggestG1, labels.suggestG2, labels.suggestG3]} spaceLabel={labels.space} deleteLabel={labels.deleteKey} shiftLabel={labels.shift} />
    </div>
  );
};

/** The menu that opens after the paperclip or plus sign. */
const AttachMenu: React.FC<{ id: AppId; app: AppStyle; labels: L }> = ({ id, app, labels }) => {
  const items = [
    { id: 'gallery', label: app.ios || app.iosChrome ? labels.photosMenu : labels.gallery, Icon: ImageIcon, color: '#7F66FF' },
    { id: 'att-camera', label: labels.camera, Icon: Camera, color: '#FF2E74' },
    { id: 'att-location', label: labels.location, Icon: MapPin, color: '#1FA855' },
    { id: 'att-contact', label: labels.contact, Icon: User, color: '#009DE2' },
    { id: 'att-document', label: labels.document, Icon: FileText, color: '#5157AE' },
    { id: 'att-audio', label: labels.audio, Icon: AudioLines, color: '#F96533' },
  ];
  return (
    <div className="flex flex-col flex-1 min-h-0 relative" style={{ background: app.wallpaper }}>
      <ChatHeader id={id} app={app} labels={labels} interactive={false} title={labels.family} />
      <div className="flex-1" style={{ background: 'rgba(0,0,0,0.3)' }} />
      <div className="sim-fade p-3 rounded-t-3xl shrink-0" style={{ background: '#FFFFFF' }}>
        {app.ios || app.iosChrome ? (
          <div className="flex flex-col gap-1">
            {items.map(({ id: itemId, label, Icon, color }) => (
              <PracticeTap key={itemId} id={itemId} label={label} pointer="below" className="flex items-center gap-3 px-2 rounded-xl text-[1.05rem] text-left" style={{ color: '#000000' }}>
                <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: color, color: '#FFFFFF' }}><Icon size={19} aria-hidden="true" /></span>
                {label}
              </PracticeTap>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-y-3 gap-x-1">
            {items.map(({ id: itemId, label, Icon, color }) => (
              <PracticeTap key={itemId} id={itemId} label={label} pointer="below" className="flex flex-col items-center gap-1 py-1 rounded-xl text-[0.85rem]" style={{ color: '#3B4A54' }}>
                <span className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: color, color: '#FFFFFF' }}><Icon size={26} aria-hidden="true" /></span>
                {label}
              </PracticeTap>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/** The phone's photos. */
const Gallery: React.FC<{ app: AppStyle; labels: L }> = ({ app, labels }) => (
  <div className="flex flex-col flex-1 min-h-0 sim-fade" style={{ background: app.dark ? '#2B2D31' : '#FFFFFF' }}>
    <div className="flex items-center gap-1 px-1 py-1 shrink-0 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)', background: app.chatHeaderBg, color: app.chatHeaderText }}>
      <PracticeTap id="close-gallery" label={labels.close} className={iconBtn}><X size={24} aria-hidden="true" /></PracticeTap>
      <h3 className="flex-1 text-[1.15rem] font-bold">{labels.recents}</h3>
    </div>
    <div className="grid grid-cols-2 gap-3 p-3 overflow-hidden">
      {PHOTOS.map((photo) => (
        <PracticeTap key={photo.id} id={photo.id} label={labels[photo.labelKey]} className="block h-[6.2rem] w-full rounded-lg" style={{ color: '#111B21' }}>
          <span className="block h-full w-full rounded-lg overflow-hidden relative">
            {photo.render()}
            <span className="absolute left-0 right-0 bottom-0 px-1 text-[0.8rem] font-bold truncate" style={{ background: 'rgba(255,255,255,0.88)', color: '#111B21' }}>{labels[photo.labelKey]}</span>
          </span>
        </PracticeTap>
      ))}
    </div>
  </div>
);

/** Full-screen view of the chosen photo, before it is sent. */
const Preview: React.FC<{ app: AppStyle; labels: L }> = ({ app, labels }) => (
  <div className="flex flex-col flex-1 min-h-0 sim-fade" style={{ background: '#0B141A', color: '#FFFFFF' }}>
    <div className="flex items-center justify-between px-1 py-1 shrink-0">
      <PracticeTap id="close-preview" label={labels.close} className={iconBtn}><X size={26} aria-hidden="true" /></PracticeTap>
      <PracticeTap id="crop" label={labels.crop} className={iconBtn}><Crop size={23} aria-hidden="true" /></PracticeTap>
    </div>
    <div role="img" aria-label={labels.photoFlowers} className="flex-1 min-h-0 flex items-center overflow-hidden">
      <div className="w-full h-full"><FlowersPhoto /></div>
    </div>
    <div className="p-2 shrink-0">
      <PracticeTap id="caption-field" label={labels.caption} className="w-full px-3 rounded-3xl flex items-center gap-2 text-left text-[1rem] mb-2" style={{ background: '#2A3942', color: '#D1D7DB' }}>
        <Smile size={20} aria-hidden="true" /> {labels.caption}
      </PracticeTap>
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 rounded-full text-[0.9rem] font-bold" style={{ background: '#2A3942' }}>{labels.family}</span>
        <PracticeTap id="send" label={labels.send} pointer="above-right" className={`${iconBtn} w-14 h-14`} style={{ background: app.accent, color: app.accentText }}>
          <SendGlyph app={app} />
        </PracticeTap>
      </div>
    </div>
  </div>
);

/** A running video call. */
const VideoCall: React.FC<{ app: AppStyle; labels: L }> = ({ app, labels }) => {
  const [seconds, setSeconds] = useState(0);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const connect = window.setTimeout(() => setConnected(true), 2200);
    const tick = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      window.clearTimeout(connect);
      window.clearInterval(tick);
    };
  }, []);
  const clock = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const round = 'w-14 h-14 rounded-full flex items-center justify-center';
  return (
    <div className="flex flex-col flex-1 min-h-0 relative sim-fade" style={{ background: app.accent === '#25D366' ? '#1F2C34' : app.dark ? '#1E1F22' : `color-mix(in srgb, ${app.accent} 35%, #101418)`, color: '#FFFFFF' }}>
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center p-3">
        <Avatar name={labels.family} color="#6D8AA8" size={96}><Users size={48} aria-hidden="true" /></Avatar>
        <h3 className="mt-3 text-[1.4rem] font-bold">{labels.family}</h3>
        <p role="status" className="text-[1rem]">{connected ? `${labels.inCall} ${clock}` : labels.calling}</p>
        <p className="mt-2 text-[0.85rem]">{labels.noRealCall}</p>
      </div>
      <div className="flex justify-around items-center p-3 shrink-0 gap-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <PracticeTap id="speaker" label={labels.speaker} className={round} style={{ background: '#3B4A54' }}><Volume2 size={24} aria-hidden="true" /></PracticeTap>
        <PracticeTap id="flip" label={labels.camera} className={round} style={{ background: '#3B4A54' }}><Camera size={24} aria-hidden="true" /></PracticeTap>
        <PracticeTap id="mute" label={labels.mute} className={round} style={{ background: '#3B4A54' }}><MicOff size={24} aria-hidden="true" /></PracticeTap>
        <PracticeTap id="hangup" label={labels.hangup} pointer="above-right" className={round} style={{ background: '#EA0038', color: '#FFFFFF' }}><PhoneOff size={24} aria-hidden="true" /></PracticeTap>
      </div>
    </div>
  );
};

export const MessengerScreen: React.FC<PracticeScreenProps> = ({ screen, isDone, appId, kind, labels, lang }) => {
  const { platform } = useContext(PracticeContext);
  const id = viewId((appId ?? 'whatsapp') as AppId, platform);
  const app = appStyle((appId ?? 'whatsapp') as AppId, platform);
  const blackScreen = !isDone && (screen === 'preview' || screen === 'call');
  const listBar: Partial<Record<AppId, string>> = { telegram: '#517DA2', threema: '#1F1F1F', viber: '#7360F2', teams: '#4B53BC' };
  const listScreen = screen === 'list' || screen === 'bk-list' || screen === 'bk-drawer';
  const headerColor = !isDone && listScreen ? listBar[id] ?? app.bg : !isDone && screen === 'bk-hold' ? '#F8FAFD' : app.chatHeaderBg;
  const flow = kind === 'block' ? blockFlow((appId ?? 'whatsapp') as AppId, platform) : null;
  const barBg = blackScreen ? (screen === 'call' ? '#1F2C34' : '#0B141A') : headerColor;
  const lightText = blackScreen || app.dark || ['#517DA2', '#1F1F1F', '#7360F2', '#4B53BC'].includes(barBg);

  let body: React.ReactNode;
  if (flow) body = <BlockScreens flow={flow} screen={screen} isDone={!!isDone} id={id} app={app} labels={labels} lang={lang} />;
  else if (isDone) body = <Chat id={id} app={app} labels={labels} screen="done" isDone kind={kind} lang={lang} />;
  else if (screen === 'list') body = <ChatList id={id} app={app} labels={labels} lang={lang} />;
  else if (screen === 'msgmenu-own') body = <MessageMenu id={id} app={app} labels={labels} lang={lang} own />;
  else if (screen === 'delete-confirm') body = <DeleteConfirm id={id} app={app} labels={labels} />;
  else if (screen === 'attach') body = <AttachMenu id={id} app={app} labels={labels} />;
  else if (screen === 'gallery') body = <Gallery app={app} labels={labels} />;
  else if (screen === 'preview') body = <Preview app={app} labels={labels} />;
  else if (screen === 'call') body = <VideoCall app={app} labels={labels} />;
  else if (screen === 'msgmenu') body = <MessageMenu id={id} app={app} labels={labels} lang={lang} />;
  else if (screen === 'recording') body = <Recording id={id} app={app} labels={labels} />;
  else if (screen === 'newchat') body = <NewChat app={app} labels={labels} />;
  else if (screen === 'pick0') body = <PickPeople app={app} labels={labels} picked={[]} />;
  else if (screen === 'pick1') body = <PickPeople app={app} labels={labels} picked={['pick-anna']} />;
  else if (screen === 'pick2') body = <PickPeople app={app} labels={labels} picked={['pick-anna', 'pick-peter']} />;
  else if (screen === 'groupname') body = <GroupName app={app} labels={labels} lang={lang} />;
  else body = <Chat id={id} app={app} labels={labels} screen={screen} isDone={false} kind={kind} lang={lang} />;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <StatusBar background={barBg} color={lightText ? '#FFFFFF' : '#111B21'} />
      {body}
    </div>
  );
};
