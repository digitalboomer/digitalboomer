import React from 'react';
import {Bell, Compass, FileText, Home, Landmark, Lock, MessageCircle, Monitor, Repeat, Send, Settings, Sparkles, User, Users } from 'lucide-react';
import { Avatar } from './PhoneParts';
import { MESSAGING_DESKTOP, SOCIAL_URL } from '../../data/desktopLessons';
import { appStyle, type AppId } from './messaging/apps';

/**
 * The computer version of every phone lesson: the same task, in the app's
 * browser page or program window. The task area keeps the app's own buttons,
 * with the computer's menus around it. A simplified computer view, not a copy.
 */

const Chrome: React.FC<{ url?: string; title: string; dark?: boolean; children: React.ReactNode }> = ({ url, title, dark, children }) => (
  <div className="flex flex-col h-full rounded-lg overflow-hidden" style={{ border: '1px solid #9AA4AE', background: dark ? '#1E1F22' : '#FFFFFF' }}>
    {url ? (
      <div aria-hidden="true" className="shrink-0" style={{ background: '#DEE1E6' }}>
        <div className="flex items-end gap-2 px-3 pt-2">
          <span className="flex gap-1.5 pb-2.5">{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}</span>
          <span className="px-4 py-1.5 rounded-t-lg text-[0.85rem] max-w-[240px] truncate" style={{ background: '#FFFFFF', color: '#111B21' }}>{title}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: '#FFFFFF', borderBottom: '1px solid #DADCE0' }}>
          <div className="flex-1 flex items-center gap-2 px-3 rounded-full h-9 text-[0.95rem]" style={{ background: '#F1F3F4', color: '#111B21' }}><Lock size={15} />{url}</div>
        </div>
      </div>
    ) : (
      <div aria-hidden="true" className="flex items-center gap-2 px-3 h-8 shrink-0 text-[0.85rem]" style={{ background: dark ? '#1E1F22' : '#E9ECEF', color: dark ? '#F2F3F5' : '#111B21' }}>
        <span className="flex gap-1.5">{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}</span>
        <span className="flex-1 text-center font-bold">{title}</span>
        <Monitor size={15} />
      </div>
    )}
    <div className="flex-1 min-h-0 flex">{children}</div>
  </div>
);

const Rail: React.FC<{ items: [React.ElementType, string][]; bg: string; color: string; activeBg: string; width?: number }> = ({ items, bg, color, activeBg, width = 210 }) => (
  <div aria-hidden="true" className="shrink-0 p-3 flex flex-col gap-1" style={{ width, background: bg, color }}>
    {items.map(([Glyph, name], i) => (
      <span key={name} className="flex items-center gap-3 px-3 py-2 rounded-lg text-[0.98rem] truncate" style={i === 0 ? { background: activeBg, fontWeight: 700 } : undefined}><Glyph size={19} />{name}</span>
    ))}
  </div>
);

/** The task area: where the lesson's own screen sits on the computer. */
const Pane: React.FC<{ width?: number; children: React.ReactNode }> = ({ width, children }) => (
  <div className="desk-main flex flex-col min-h-0 overflow-hidden relative" style={{ width, flex: width ? undefined : 1 }}>{children}</div>
);

export const DesktopShell: React.FC<{ screenId: string; appId?: string; screen: string; labels: Record<string, string>; lang: string; children: React.ReactNode }> = ({ screenId, appId, screen, labels, lang, children }) => {
  const de = lang === 'de';

  if (screenId === 'messenger') {
    const id = (appId ?? 'whatsapp') as AppId;
    const app = appStyle(id, 'android');
    const info = MESSAGING_DESKTOP[id] ?? MESSAGING_DESKTOP.whatsapp;
    const chats: [string, string, string][] = [[labels.family, labels.familyLast, '#6D8AA8'], [labels.anna, labels.annaLast, '#C0689B'], [labels.club, labels.clubLast, '#7E9B5D']];
    const list = screen === 'list';
    return (
      <Chrome url={info.url} title={info.window} dark={app.dark}>
        <div aria-hidden="true" className="w-14 shrink-0 flex flex-col items-center gap-4 py-4" style={{ background: app.dark ? '#1E1F22' : '#F0F2F5', color: app.subText }}>
          <MessageCircle size={22} style={{ color: app.accent }} /><Users size={22} /><Bell size={22} /><span className="flex-1" /><Settings size={22} />
        </div>
        {list ? (
          <>
            <Pane width={380}>{children}</Pane>
            <div aria-hidden="true" className="flex-1 flex flex-col items-center justify-center gap-2 text-center p-8" style={{ background: app.dark ? '#313338' : '#F7F8F8', color: app.subText }}>
              <Monitor size={56} />
              <p className="text-[1.1rem]">{de ? 'Wählen Sie links einen Chat.' : 'Choose a chat on the left.'}</p>
            </div>
          </>
        ) : (
          <>
            <div aria-hidden="true" className="w-[300px] shrink-0 flex flex-col" style={{ background: app.dark ? '#2B2D31' : '#FFFFFF', color: app.text, borderRight: `1px solid ${app.border}` }}>
              <span className="px-3 py-2 text-[1.3rem] font-bold">{labels.chatsTitle}</span>
              {chats.map(([name, last, colour], i) => (
                <span key={name} className="flex items-center gap-3 px-3 py-2" style={i === 0 ? { background: app.dark ? '#404249' : '#F0F2F5' } : undefined}>
                  <Avatar name={name} color={colour} size={42} />
                  <span className="min-w-0"><span className="block font-bold truncate">{name}</span><span className="block text-[0.9rem] truncate" style={{ color: app.subText }}>{last}</span></span>
                </span>
              ))}
            </div>
            <Pane>{children}</Pane>
          </>
        )}
      </Chrome>
    );
  }

  // Email draws its own website or program window (EmailWeb).
  if (screenId === 'email') return <>{children}</>;
  if (screenId === 'social') {
    const url = SOCIAL_URL[appId ?? 'facebook'];
    return (
      <Chrome url={url} title={labels.appTitle}>
        <Rail items={[[Home, de ? 'Startseite' : 'Home'], [Compass, de ? 'Entdecken' : 'Explore'], [Bell, de ? 'Benachrichtigungen' : 'Notifications'], [MessageCircle, labels.inboxWord ?? (de ? 'Nachrichten' : 'Messages')], [User, labels.you]]} bg="#FFFFFF" color="#1C1E21" activeBg="#F0F2F5" />
        <div className="flex-1 flex justify-center" style={{ background: '#F0F2F5' }}>
          <Pane width={460}>{children}</Pane>
        </div>
      </Chrome>
    );
  }

  if (screenId === 'banking') {
    return (
      <Chrome url="banking.uebungsbank.example" title={labels.bankName}>
        <Rail items={[[Landmark, labels.navHome ?? (de ? 'Übersicht' : 'Overview')], [Send, labels.transfer], [Repeat, labels.standing], [FileText, labels.statements], [Settings, labels.navMore ?? (de ? 'Mehr' : 'More')]]} bg="#F2F5F8" color="#111B21" activeBg="#FFFFFF" />
        <div className="flex-1 flex justify-center" style={{ background: '#E9EEF3' }}>
          <Pane width={460}>{children}</Pane>
        </div>
      </Chrome>
    );
  }

  // Chatbots on the computer run in the browser.
  return (
    <Chrome url="chat.uebungs-ki.example" title={labels.appTitle ?? (de ? 'Übungs-Chatbot' : 'Practice chatbot')}>
      <Rail items={[[Sparkles, de ? 'Neuer Chat' : 'New chat'], [MessageCircle, de ? 'Frühere Chats' : 'Earlier chats']]} bg="#F7F7F8" color="#202123" activeBg="#ECECF1" />
      <div className="flex-1 flex justify-center" style={{ background: '#FFFFFF' }}>
        <Pane width={600}>{children}</Pane>
      </div>
    </Chrome>
  );
};
