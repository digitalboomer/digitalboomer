import { GROUP_PAGE, groupOfCategory } from '../data/services';
import type { Route } from './routes';

/** Where a topic leads: the service choice (messaging, email, social, banking) or its own page with all lessons. */
export function categoryRoute(categoryId: string): Route {
  const group = groupOfCategory(categoryId);
  if (group) return { page: GROUP_PAGE[group] };
  if (categoryId === 'sicherheit') return { page: 'sicherheit' };
  if (categoryId === 'ki') return { page: 'ki-alltag' };
  return { page: 'tutorials', category: categoryId };
}

/** A short task line per topic, in the words people search with. */
export function topicTasks(categoryId: string, isEn: boolean): string | undefined {
  const tasks: Record<string, [string, string]> = {
    messaging: ['Send WhatsApp messages, photos and voice messages', 'WhatsApp-Nachrichten, Fotos und Sprachnachrichten senden'],
    'social-media': ['Like, comment and protect your privacy on Facebook and Co.', 'Liken, kommentieren und die Privatsphäre auf Facebook und Co. schützen'],
    email: ['Write emails, send photos and open attachments safely', 'E-Mails schreiben, Fotos senden und Anhänge sicher öffnen'],
    banking: ['Practise online banking: balance, transfers and standing orders', 'Online-Banking üben: Kontostand, Überweisung und Dauerauftrag'],
    sicherheit: ['Recognise phishing, scam calls and fake shops', 'Phishing, Betrugsanrufe und Fake-Shops erkennen'],
    ki: ['Ask ChatGPT and other chatbots, and check their answers', 'ChatGPT und andere Chatbots fragen und ihre Antworten prüfen'],
  };
  const pair = tasks[categoryId];
  return pair ? pair[isEn ? 0 : 1] : undefined;
}
