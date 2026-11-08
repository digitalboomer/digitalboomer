/**
 * All apps and services we teach, with their logos. Logos come from the
 * simple-icons package. They remain trademarks of their owners and are only
 * used to name the service. Services without a logo there get a name tile.
 */
import {
  siCommerzbank, siDeutschebank, siDiscord, siFacebook, siGmail, siGmx, siGooglemessages, siImessage, siInstagram, siLine,
  siMessenger, siN26, siPinterest, siProtonmail, siReddit, siSignal, siSparkasse, siTelegram, siThreads, siThreema, siTiktok,
  siViber, siWebdotde, siWechat, siWhatsapp, siX, siYoutube,
} from 'simple-icons';
import type { PageId } from '../types';

export type ServiceGroup = 'messaging' | 'email' | 'social' | 'banking';

export interface Service {
  id: string;
  name: string;
  group: ServiceGroup;
  /** Tile colour and the colour of the logo or letter on it. */
  color: string;
  fg: string;
  logoPath?: string;
  aboutEn: string;
  aboutDe: string;
}

const s = (
  id: string, name: string, group: ServiceGroup, color: string, fg: string, logoPath: string | undefined, aboutEn: string, aboutDe: string,
): Service => ({ id, name, group, color, fg, logoPath, aboutEn, aboutDe });

const W = '#FFFFFF';
const B = '#000000';

export const SERVICES: Service[] = [
  s('whatsapp', 'WhatsApp', 'messaging', '#25D366', W, siWhatsapp.path, 'The most used messaging app in Germany.', 'Die meistgenutzte Nachrichten-App in Deutschland.'),
  s('signal', 'Signal', 'messaging', '#3B45FD', W, siSignal.path, 'Known for protecting your privacy.', 'Bekannt für guten Datenschutz.'),
  s('telegram', 'Telegram', 'messaging', '#26A5E4', W, siTelegram.path, 'Popular for chats and large groups.', 'Beliebt für Chats und große Gruppen.'),
  s('messenger', 'Messenger', 'messaging', '#0866FF', W, siMessenger.path, 'The messaging app that belongs to Facebook.', 'Die Nachrichten-App, die zu Facebook gehört.'),
  s('imessage', 'iMessage', 'messaging', '#34DA50', W, siImessage.path, 'The messages app on every iPhone.', 'Die Nachrichten-App auf jedem iPhone.'),
  s('sms', 'SMS', 'messaging', '#1A73E8', W, siGooglemessages.path, 'Normal text messages, on every phone.', 'Normale Textnachrichten, auf jedem Handy.'),
  s('threema', 'Threema', 'messaging', '#3FE669', B, siThreema.path, 'A paid app from Switzerland, focused on privacy.', 'Eine kostenpflichtige App aus der Schweiz mit Fokus auf Datenschutz.'),
  s('viber', 'Viber', 'messaging', '#7360F2', W, siViber.path, 'Free messages and calls, popular in many countries.', 'Kostenlose Nachrichten und Anrufe, in vielen Ländern beliebt.'),
  s('line', 'LINE', 'messaging', '#00C300', W, siLine.path, 'Popular in Japan and other Asian countries.', 'Beliebt in Japan und anderen asiatischen Ländern.'),
  s('wechat', 'WeChat', 'messaging', '#07C160', W, siWechat.path, 'The main messaging app in China.', 'Die wichtigste Nachrichten-App in China.'),
  s('discord', 'Discord', 'messaging', '#5865F2', W, siDiscord.path, 'Chat rooms for groups and shared hobbies.', 'Chat-Räume für Gruppen und gemeinsame Hobbys.'),
  s('teams', 'Teams', 'messaging', '#4B53BC', W, undefined, 'Microsoft\'s app for chats and video meetings.', 'Die App von Microsoft für Chats und Video-Treffen.'),

  s('gmail', 'Gmail', 'email', '#EA4335', W, siGmail.path, 'The email service from Google.', 'Der E-Mail-Dienst von Google.'),
  s('outlook', 'Outlook', 'email', '#0F6CBD', W, undefined, 'The email service from Microsoft.', 'Der E-Mail-Dienst von Microsoft.'),
  s('applemail', 'Apple Mail', 'email', '#1B7FF0', W, undefined, 'The email app on every iPhone.', 'Die E-Mail-App auf jedem iPhone.'),
  s('gmx', 'GMX', 'email', '#1C449B', W, siGmx.path, 'A popular German email service.', 'Ein beliebter deutscher E-Mail-Dienst.'),
  s('webde', 'WEB.DE', 'email', '#FFD800', B, siWebdotde.path, 'A popular German email service.', 'Ein beliebter deutscher E-Mail-Dienst.'),
  s('tonline', 't-online', 'email', '#E20074', W, undefined, 'Email from Deutsche Telekom.', 'E-Mail von der Deutschen Telekom.'),
  s('yahoo', 'Yahoo Mail', 'email', '#6001D2', W, undefined, 'An international email service.', 'Ein internationaler E-Mail-Dienst.'),
  s('proton', 'Proton Mail', 'email', '#6D4AFF', W, siProtonmail.path, 'Email with a focus on privacy.', 'E-Mail mit Fokus auf Datenschutz.'),

  s('facebook', 'Facebook', 'social', '#0866FF', W, siFacebook.path, 'Stay in touch with family, friends and groups.', 'Kontakt zu Familie, Freunden und Gruppen.'),
  s('instagram', 'Instagram', 'social', '#FF0069', W, siInstagram.path, 'Share and look at photos and short videos.', 'Fotos und kurze Videos teilen und ansehen.'),
  s('youtube', 'YouTube', 'social', '#FF0000', W, siYoutube.path, 'Watch videos about almost anything.', 'Videos zu fast jedem Thema ansehen.'),
  s('tiktok', 'TikTok', 'social', '#000000', W, siTiktok.path, 'Very short videos, one after the other.', 'Sehr kurze Videos, eines nach dem anderen.'),
  s('x', 'X', 'social', '#000000', W, siX.path, 'Short messages and news. It used to be called Twitter.', 'Kurznachrichten und Neuigkeiten. Hieß früher Twitter.'),
  s('linkedin', 'LinkedIn', 'social', '#0A66C2', W, undefined, 'A network for work and former colleagues.', 'Ein Netzwerk für Beruf und frühere Kollegen.'),
  s('pinterest', 'Pinterest', 'social', '#BD081C', W, siPinterest.path, 'Collect ideas for garden, cooking and crafts.', 'Ideen für Garten, Kochen und Basteln sammeln.'),
  s('threads', 'Threads', 'social', '#000000', W, siThreads.path, 'Short messages, connected to Instagram.', 'Kurznachrichten, verbunden mit Instagram.'),
  s('reddit', 'Reddit', 'social', '#FF4500', W, siReddit.path, 'Discussion groups on every topic.', 'Diskussionsgruppen zu jedem Thema.'),

  s('sparkasse', 'Sparkasse', 'banking', '#FF0000', W, siSparkasse.path, 'Often approves payments with the S-pushTAN app.', 'Gibt Zahlungen oft mit der S-pushTAN-App frei.'),
  s('volksbank', 'Volksbank Raiffeisenbank', 'banking', '#0066B3', W, undefined, 'Often approves payments with the VR SecureGo plus app.', 'Gibt Zahlungen oft mit der App VR SecureGo plus frei.'),
  s('deutschebank', 'Deutsche Bank', 'banking', '#0018A8', W, siDeutschebank.path, 'Often approves payments with photoTAN.', 'Gibt Zahlungen oft mit photoTAN frei.'),
  s('commerzbank', 'Commerzbank', 'banking', '#FFCC33', B, siCommerzbank.path, 'Often approves payments with photoTAN.', 'Gibt Zahlungen oft mit photoTAN frei.'),
  s('ing', 'ING', 'banking', '#FF6200', W, undefined, 'A bank without branches, used through its app.', 'Eine Bank ohne Filialen, die Sie über ihre App nutzen.'),
  s('dkb', 'DKB', 'banking', '#148DEA', W, undefined, 'A bank without branches, used through its app.', 'Eine Bank ohne Filialen, die Sie über ihre App nutzen.'),
  s('postbank', 'Postbank', 'banking', '#FFCC00', B, undefined, 'Has branches, often together with the post office.', 'Hat Filialen, oft zusammen mit der Post.'),
  s('n26', 'N26', 'banking', '#48AC98', W, siN26.path, 'A bank that works only through the phone app.', 'Eine Bank, die nur über die Handy-App funktioniert.'),
];

export const GROUP_PAGE: Record<ServiceGroup, PageId> = {
  messaging: 'nachrichten-apps',
  email: 'email-apps',
  social: 'social-apps',
  banking: 'bank-apps',
};

/** Lesson category of each service group. */
export const GROUP_CATEGORY: Record<ServiceGroup, string> = {
  messaging: 'messaging',
  email: 'email',
  social: 'social-media',
  banking: 'banking',
};

export const groupOfCategory = (categoryId: string): ServiceGroup | undefined =>
  (Object.keys(GROUP_CATEGORY) as ServiceGroup[]).find((group) => GROUP_CATEGORY[group] === categoryId);

export const serviceById = (id?: string) => SERVICES.find((service) => service.id === id);
