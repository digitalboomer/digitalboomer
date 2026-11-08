/**
 * What is different in each messaging app: colours, chat list, message style and
 * the buttons around the text field. Built from how the apps generally look,
 * not copied from screenshots. Apps change with updates, so check them now and then.
 */
export const APP_IDS = ['whatsapp', 'signal', 'telegram', 'messenger', 'imessage', 'sms', 'threema', 'viber', 'line', 'wechat', 'discord', 'teams'] as const;
export type AppId = (typeof APP_IDS)[number];

/** A button around the text field. `attach` adds photos, `action` is send or microphone. */
export type ComposerSlot = 'attach' | 'camera' | 'emoji' | 'mic' | 'field' | 'action';

export interface AppStyle {
  ios: boolean;
  dark: boolean;
  accent: string;
  accentText: string;
  /** Screen colours */
  bg: string;
  text: string;
  subText: string;
  border: string;
  chatHeaderBg: string;
  chatHeaderText: string;
  wallpaper: string;
  bubbleOut: string;
  bubbleOutText: string;
  bubbleIn: string;
  bubbleInText: string;
  metaOut: string;
  /** Message look */
  bubble: 'tail' | 'round' | 'square' | 'flat' | 'teams';
  showAvatarInChat: boolean;
  avatarSquare: boolean;
  /** Text field and its buttons */
  composerBg: string;
  fieldBg: string;
  before: ComposerSlot[];
  inField: ComposerSlot[];
  after: ComposerSlot[];
  /** A row of buttons under the text field instead of beside it (Viber). */
  below?: ComposerSlot[];
  attachIcon: 'paperclip' | 'plus' | 'image';
  /** The app shows a menu (Gallery, Camera, ...) before the photos. */
  hasMenu: boolean;
  /** 'full': big photo preview before sending. 'inline': photo sits in the message field. */
  preview: 'full' | 'inline';
  sendIcon: 'plane' | 'arrow';
  /** How the app shows that a message arrived */
  status: 'ticks-blue' | 'ticks-accent' | 'circle' | 'text';
  hasVideoCall: boolean;
  bottomNav: { en: string; de: string; icon: 'chat' | 'updates' | 'people' | 'phone' | 'story' | 'bell' | 'menu' | 'home' | 'news' | 'calendar' | 'more' | 'discover' | 'user' | 'wallet' }[];
  /** The button for a new chat */
  fab: 'chat-plus' | 'pencil' | 'plus' | 'start-chat' | 'none';
  /** iPhone look: chevrons, menus as lists, the phone's own bars. */
  iosChrome?: boolean;
  /** On iPhone the new chat button sits at the top right instead of floating. */
  iosCompose?: boolean;
  /** Which tab of the bottom bar is the chat list. */
  navActive?: number;
}

const white = { dark: false, bg: '#FFFFFF', text: '#111B21', subText: '#54656F', border: '#E9EDEF' };

export const APP_STYLES: Record<AppId, AppStyle> = {
  whatsapp: {
    ...white, ios: false, accent: '#25D366', accentText: '#0B141A', chatHeaderBg: '#FFFFFF', chatHeaderText: '#111B21', wallpaper: '#EFE7DD',
    bubbleOut: '#D9FDD3', bubbleOutText: '#111B21', bubbleIn: '#FFFFFF', bubbleInText: '#111B21', metaOut: '#667781', bubble: 'tail', showAvatarInChat: false, avatarSquare: false,
    composerBg: 'transparent', fieldBg: '#FFFFFF', before: [], inField: ['emoji', 'field', 'attach', 'camera'], after: ['action'], attachIcon: 'paperclip',
    hasMenu: true, preview: 'full', sendIcon: 'plane', status: 'ticks-blue', hasVideoCall: true, fab: 'chat-plus',
    bottomNav: [{ en: 'Chats', de: 'Chats', icon: 'chat' }, { en: 'Updates', de: 'Aktuelles', icon: 'updates' }, { en: 'Communities', de: 'Communitys', icon: 'people' }, { en: 'Calls', de: 'Anrufe', icon: 'phone' }],
  },
  signal: {
    ...white, ios: false, accent: '#2C6BED', accentText: '#FFFFFF', chatHeaderBg: '#FFFFFF', chatHeaderText: '#1B1B1D', wallpaper: '#FFFFFF',
    bubbleOut: '#2C6BED', bubbleOutText: '#FFFFFF', bubbleIn: '#EDEDED', bubbleInText: '#1B1B1D', metaOut: '#E8EEFD', bubble: 'round', showAvatarInChat: true, avatarSquare: false,
    composerBg: '#FFFFFF', fieldBg: '#F0F0F0', before: [], inField: ['field', 'camera'], after: ['attach', 'action'], attachIcon: 'plus',
    hasMenu: false, preview: 'full', sendIcon: 'arrow', status: 'circle', hasVideoCall: true, fab: 'pencil',
    bottomNav: [{ en: 'Chats', de: 'Chats', icon: 'chat' }, { en: 'Calls', de: 'Anrufe', icon: 'phone' }, { en: 'Stories', de: 'Storys', icon: 'story' }],
  },
  telegram: {
    ...white, ios: false, accent: '#3390EC', accentText: '#FFFFFF', chatHeaderBg: '#517DA2', chatHeaderText: '#FFFFFF', wallpaper: '#BFD8B5',
    bubbleOut: '#EFFDDE', bubbleOutText: '#000000', bubbleIn: '#FFFFFF', bubbleInText: '#000000', metaOut: '#4FAE4E', bubble: 'tail', showAvatarInChat: false, avatarSquare: false,
    composerBg: '#FFFFFF', fieldBg: '#FFFFFF', before: ['emoji'], inField: ['field'], after: ['attach', 'action'], attachIcon: 'paperclip',
    hasMenu: false, preview: 'full', sendIcon: 'plane', status: 'ticks-accent', hasVideoCall: false, fab: 'pencil',
    bottomNav: [{ en: 'Chats', de: 'Chats', icon: 'chat' }, { en: 'Contacts', de: 'Kontakte', icon: 'people' }, { en: 'Settings', de: 'Einstellungen', icon: 'more' }, { en: 'Profile', de: 'Profil', icon: 'user' }],
  },
  messenger: {
    ...white, text: '#050505', subText: '#65676B', ios: false, accent: '#0A7CFF', accentText: '#FFFFFF', chatHeaderBg: '#FFFFFF', chatHeaderText: '#050505', wallpaper: '#FFFFFF',
    bubbleOut: '#0A7CFF', bubbleOutText: '#FFFFFF', bubbleIn: '#F0F0F0', bubbleInText: '#050505', metaOut: '#E3EEFF', bubble: 'round', showAvatarInChat: true, avatarSquare: false,
    composerBg: '#FFFFFF', fieldBg: '#F0F0F0', before: ['attach', 'mic'], inField: ['field'], after: ['action'], attachIcon: 'image',
    hasMenu: false, preview: 'inline', sendIcon: 'plane', status: 'circle', hasVideoCall: true, fab: 'none',
    bottomNav: [{ en: 'Chats', de: 'Chats', icon: 'chat' }, { en: 'Stories', de: 'Storys', icon: 'story' }, { en: 'Alerts', de: 'Hinweise', icon: 'bell' }, { en: 'Menu', de: 'Menü', icon: 'menu' }],
  },
  imessage: {
    ...white, text: '#000000', subText: '#8E8E93', border: '#D1D1D6', ios: true, accent: '#007AFF', accentText: '#FFFFFF', chatHeaderBg: '#F2F2F7', chatHeaderText: '#000000', wallpaper: '#FFFFFF',
    bubbleOut: '#007AFF', bubbleOutText: '#FFFFFF', bubbleIn: '#E9E9EB', bubbleInText: '#000000', metaOut: '#E3EEFF', bubble: 'round', showAvatarInChat: false, avatarSquare: false,
    composerBg: '#FFFFFF', fieldBg: '#FFFFFF', before: ['attach'], inField: ['field', 'action'], after: [], attachIcon: 'plus',
    hasMenu: true, preview: 'inline', sendIcon: 'arrow', status: 'text', hasVideoCall: false, fab: 'none', bottomNav: [],
  },
  sms: {
    ...white, bg: '#F8FAFD', text: '#1F1F1F', subText: '#444746', border: '#E3E8EF', ios: false, accent: '#0B57D0', accentText: '#FFFFFF', chatHeaderBg: '#F8FAFD', chatHeaderText: '#1F1F1F', wallpaper: '#F8FAFD',
    bubbleOut: '#D3E3FD', bubbleOutText: '#041E49', bubbleIn: '#E9EEF6', bubbleInText: '#1F1F1F', metaOut: '#444746', bubble: 'round', showAvatarInChat: true, avatarSquare: false,
    composerBg: '#F8FAFD', fieldBg: '#E9EEF6', before: ['attach'], inField: ['field', 'emoji'], after: ['action'], attachIcon: 'plus',
    hasMenu: false, preview: 'inline', sendIcon: 'plane', status: 'text', hasVideoCall: false, fab: 'start-chat', bottomNav: [],
  },
  threema: {
    ...white, ios: false, accent: '#05A63F', accentText: '#FFFFFF', chatHeaderBg: '#1F1F1F', chatHeaderText: '#FFFFFF', wallpaper: '#F2F2F2',
    bubbleOut: '#D6F2DC', bubbleOutText: '#111111', bubbleIn: '#FFFFFF', bubbleInText: '#111111', metaOut: '#5A7A64', bubble: 'square', showAvatarInChat: false, avatarSquare: false,
    composerBg: '#F2F2F2', fieldBg: '#FFFFFF', before: [], inField: ['emoji', 'field', 'attach'], after: ['action'], attachIcon: 'paperclip',
    hasMenu: false, preview: 'full', sendIcon: 'plane', status: 'ticks-accent', hasVideoCall: false, fab: 'chat-plus', bottomNav: [],
  },
  viber: {
    ...white, ios: false, accent: '#7360F2', accentText: '#FFFFFF', chatHeaderBg: '#7360F2', chatHeaderText: '#FFFFFF', wallpaper: '#F4F2FB',
    bubbleOut: '#E6E1FF', bubbleOutText: '#111111', bubbleIn: '#FFFFFF', bubbleInText: '#111111', metaOut: '#6B6780', bubble: 'round', showAvatarInChat: true, avatarSquare: false,
    composerBg: '#FFFFFF', fieldBg: '#FFFFFF', before: [], inField: ['field'], after: ['action'], below: ['emoji', 'attach', 'camera'], attachIcon: 'plus',
    hasMenu: false, preview: 'inline', sendIcon: 'plane', status: 'text', hasVideoCall: true, fab: 'chat-plus',
    bottomNav: [{ en: 'Chats', de: 'Chats', icon: 'chat' }, { en: 'Calls', de: 'Anrufe', icon: 'phone' }, { en: 'Explore', de: 'Entdecken', icon: 'discover' }, { en: 'More', de: 'Mehr', icon: 'more' }],
  },
  line: {
    ...white, ios: false, accent: '#06C755', accentText: '#FFFFFF', chatHeaderBg: '#FFFFFF', chatHeaderText: '#111111', wallpaper: '#8CABD9',
    bubbleOut: '#85E249', bubbleOutText: '#111111', bubbleIn: '#FFFFFF', bubbleInText: '#111111', metaOut: '#2F5A17', bubble: 'round', showAvatarInChat: true, avatarSquare: false,
    composerBg: '#FFFFFF', fieldBg: '#F0F0F0', before: ['attach', 'camera'], inField: ['field'], after: ['action'], attachIcon: 'plus',
    hasMenu: false, preview: 'inline', sendIcon: 'plane', status: 'text', hasVideoCall: false, fab: 'none',
    bottomNav: [{ en: 'Home', de: 'Start', icon: 'home' }, { en: 'Chats', de: 'Chats', icon: 'chat' }, { en: 'VOOM', de: 'VOOM', icon: 'story' }, { en: 'News', de: 'News', icon: 'news' }, { en: 'Wallet', de: 'Wallet', icon: 'wallet' }],
  },
  wechat: {
    ...white, bg: '#EDEDED', text: '#111111', subText: '#808080', border: '#DCDCDC', ios: false, accent: '#07C160', accentText: '#FFFFFF', chatHeaderBg: '#EDEDED', chatHeaderText: '#111111', wallpaper: '#EDEDED',
    bubbleOut: '#95EC69', bubbleOutText: '#111111', bubbleIn: '#FFFFFF', bubbleInText: '#111111', metaOut: '#3F7A2B', bubble: 'square', showAvatarInChat: true, avatarSquare: true,
    composerBg: '#F7F7F7', fieldBg: '#FFFFFF', before: ['mic'], inField: ['field'], after: ['emoji', 'attach', 'action'], attachIcon: 'plus',
    hasMenu: false, preview: 'inline', sendIcon: 'plane', status: 'text', hasVideoCall: false, fab: 'none',
    bottomNav: [{ en: 'Chats', de: 'Chats', icon: 'chat' }, { en: 'Contacts', de: 'Kontakte', icon: 'people' }, { en: 'Discover', de: 'Entdecken', icon: 'discover' }, { en: 'Me', de: 'Ich', icon: 'user' }],
  },
  discord: {
    dark: true, bg: '#2B2D31', text: '#F2F3F5', subText: '#B5BAC1', border: '#1E1F22', ios: false, accent: '#5865F2', accentText: '#FFFFFF', chatHeaderBg: '#313338', chatHeaderText: '#F2F3F5', wallpaper: '#313338',
    bubbleOut: 'transparent', bubbleOutText: '#DBDEE1', bubbleIn: 'transparent', bubbleInText: '#DBDEE1', metaOut: '#949BA4', bubble: 'flat', showAvatarInChat: true, avatarSquare: false,
    composerBg: '#313338', fieldBg: '#1E1F22', before: ['attach'], inField: ['field'], after: ['action'], attachIcon: 'plus',
    hasMenu: false, preview: 'inline', sendIcon: 'plane', status: 'text', hasVideoCall: false, fab: 'chat-plus',
    bottomNav: [{ en: 'Servers', de: 'Server', icon: 'home' }, { en: 'Messages', de: 'Nachrichten', icon: 'chat' }, { en: 'Alerts', de: 'Hinweise', icon: 'bell' }, { en: 'You', de: 'Sie', icon: 'user' }],
  },
  teams: {
    ...white, bg: '#F5F5F5', text: '#242424', subText: '#616161', border: '#E0E0E0', ios: false, accent: '#4B53BC', accentText: '#FFFFFF', chatHeaderBg: '#4B53BC', chatHeaderText: '#FFFFFF', wallpaper: '#F5F5F5',
    bubbleOut: '#E8EBFA', bubbleOutText: '#242424', bubbleIn: '#FFFFFF', bubbleInText: '#242424', metaOut: '#616161', bubble: 'teams', showAvatarInChat: true, avatarSquare: false,
    composerBg: '#FFFFFF', fieldBg: '#FFFFFF', before: ['attach'], inField: ['field'], after: ['action'], attachIcon: 'plus',
    hasMenu: false, preview: 'inline', sendIcon: 'plane', status: 'text', hasVideoCall: true, fab: 'pencil',
    bottomNav: [{ en: 'Activity', de: 'Aktivität', icon: 'bell' }, { en: 'Chat', de: 'Chat', icon: 'chat' }, { en: 'Teams', de: 'Teams', icon: 'people' }, { en: 'Calendar', de: 'Kalender', icon: 'calendar' }, { en: 'More', de: 'Mehr', icon: 'more' }],
  },
};

const IPHONE: Partial<Record<AppId, Partial<AppStyle>>> = {
  // Checked: in 2026 WhatsApp on iPhone shows Updates, Calls, Communities, Chats and "You" at the bottom.
  whatsapp: {
    before: ['attach'], inField: ['field'], after: ['camera', 'action'], attachIcon: 'plus', fab: 'none', iosCompose: true, navActive: 3,
    bottomNav: [{ en: 'Updates', de: 'Aktuelles', icon: 'updates' }, { en: 'Calls', de: 'Anrufe', icon: 'phone' }, { en: 'Communities', de: 'Communitys', icon: 'people' }, { en: 'Chats', de: 'Chats', icon: 'chat' }, { en: 'You', de: 'Du', icon: 'user' }],
  },
  telegram: {
    chatHeaderBg: '#F7F7F7', chatHeaderText: '#000000', before: ['attach'], inField: ['field', 'emoji'], after: ['action'], fab: 'none', iosCompose: true, navActive: 2,
    bottomNav: [{ en: 'Contacts', de: 'Kontakte', icon: 'people' }, { en: 'Calls', de: 'Anrufe', icon: 'phone' }, { en: 'Chats', de: 'Chats', icon: 'chat' }, { en: 'Settings', de: 'Einstellungen', icon: 'more' }],
  },
  signal: { fab: 'none', iosCompose: true },
};

/** How an app looks on the chosen phone. iMessage only exists on iPhone; on iPhone, SMS live in the Messages app. */
export function appStyle(id: AppId, platform: 'iphone' | 'android' = 'android'): AppStyle {
  const base = APP_STYLES[id];
  if (platform !== 'iphone') return base;
  if (id === 'sms') return { ...APP_STYLES.imessage, bubbleOut: '#34C759', accent: '#34C759', iosChrome: true };
  return { ...base, ...IPHONE[id], iosChrome: true };
}

/** The app whose screens to draw. On iPhone, SMS look like the Messages app. */
export function viewId(id: AppId, platform: 'iphone' | 'android' = 'android'): AppId {
  return platform === 'iphone' && id === 'sms' ? 'imessage' : id;
}

function info(name: string, fieldEn: string, fieldDe: string, attach: 'plus' | 'paperclip' | 'picture', side: 'left' | 'right' | 'below', noteEn?: string, noteDe?: string) {
  const en = { plus: 'the plus sign', paperclip: 'the paperclip', picture: 'the picture symbol' }[attach];
  const de = { plus: 'das Pluszeichen', paperclip: 'die Büroklammer', picture: 'das Bild-Symbol' }[attach];
  const capEn = en.charAt(0).toUpperCase() + en.slice(1);
  const capDe = de.charAt(0).toUpperCase() + de.slice(1);
  const sideEn = { left: 'to the left of', right: 'next to', below: 'under' }[side];
  const sideDe = { left: 'links neben', right: 'neben', below: 'unter' }[side];
  return {
    name, fieldEn, fieldDe, attachEn: en, attachDe: de,
    attachWhereEn: `${capEn} is ${sideEn} the text field.`,
    attachWhereDe: `${capDe} ist ${sideDe} dem Textfeld.`,
    noteEn, noteDe,
  };
}

export function appInfo(id: AppId, platform: 'iphone' | 'android' = 'android') {
  if (platform === 'iphone') {
    if (id === 'whatsapp') return info('WhatsApp', 'Message', 'Nachricht', 'plus', 'left');
    if (id === 'telegram') return info('Telegram', 'Message', 'Nachricht', 'paperclip', 'left');
    if (id === 'sms') return info('SMS', 'Text Message', 'SMS', 'plus', 'left', 'On iPhone, text messages are in the Messages app. Green bubbles are normal SMS.', 'Auf dem iPhone sind SMS in der App „Nachrichten“. Grüne Blasen sind normale SMS.');
  }
  return APP_INFO[id];
}

export const APP_INFO: Record<AppId, ReturnType<typeof info>> = {
  whatsapp: info('WhatsApp', 'Message', 'Nachricht', 'paperclip', 'right', 'On an iPhone you see a plus sign (+) on the left instead. It does the same job.', 'Auf dem iPhone sehen Sie stattdessen links ein Pluszeichen (+). Es hat dieselbe Aufgabe.'),
  signal: info('Signal', 'Signal message', 'Signal-Nachricht', 'plus', 'right', 'Blue bubbles are your own messages. Grey bubbles come from others.', 'Blaue Blasen sind Ihre eigenen Nachrichten. Graue Blasen kommen von anderen.'),
  telegram: info('Telegram', 'Message', 'Nachricht', 'paperclip', 'right'),
  messenger: info('Messenger', 'Aa', 'Aa', 'picture', 'left'),
  imessage: info('iMessage', 'iMessage', 'iMessage', 'plus', 'left', 'Blue bubbles go to other Apple devices. Green bubbles are normal SMS.', 'Blaue Blasen gehen an andere Apple-Geräte. Grüne Blasen sind normale SMS.'),
  sms: info('SMS', 'Text message', 'SMS-Text', 'plus', 'left', 'Depending on your phone contract, a text or photo message can cost money.', 'Je nach Handyvertrag kann eine SMS oder eine Foto-Nachricht Geld kosten.'),
  threema: info('Threema', 'Write a message', 'Nachricht schreiben', 'paperclip', 'right', 'The coloured dots show how sure you can be who a contact really is.', 'Die farbigen Punkte zeigen, wie sicher ist, wer ein Kontakt wirklich ist.'),
  viber: info('Viber', 'Type a message', 'Nachricht eingeben', 'plus', 'below'),
  line: info('LINE', 'Aa', 'Aa', 'plus', 'left'),
  wechat: info('WeChat', '', '', 'plus', 'right'),
  discord: info('Discord', 'Message Family', 'Nachricht an Familie', 'plus', 'left'),
  teams: info('Teams', 'Type a message', 'Nachricht eingeben', 'plus', 'left'),
};
