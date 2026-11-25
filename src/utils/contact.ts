/**
 * Contacting the team: links that open a new email, and the contact form.
 * The form is saved in Supabase (table contact_messages). Setup: docs/contact-form-setup.md.
 */
import { getSupabase } from './auth';

export const TEAM_EMAIL = 'digitalboomer.team@gmail.com';

/** The ready-made start of a new email to the team. */
export function emailDraft(isEn: boolean) {
  return {
    subject: isEn ? 'Question about Digital Boomer' : 'Frage zu Digital Boomer',
    body: isEn ? 'Hello Digital Boomer team,\n\nmy question is about: \n\n' : 'Hallo Digital Boomer Team,\n\nmeine Frage betrifft: \n\n',
  };
}

/**
 * A new, filled-in email: Gmail and Outlook on the web open straight on it (in a new tab);
 * "program" uses an email program on the device (Apple Mail, Outlook, Thunderbird), which does
 * nothing when none is set up. That is why a plain mailto link is never offered on its own.
 */
export function emailLinks(to: string, subject: string, body: string) {
  const q = encodeURIComponent;
  return {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${q(to)}&su=${q(subject)}&body=${q(body)}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${q(to)}&subject=${q(subject)}&body=${q(body)}`,
    program: `mailto:${to}?subject=${q(subject)}&body=${q(body)}`,
  };
}

/**
 * Under the "email program" button: it opens the device's default email app, never Gmail or Outlook
 * in the browser (unless the person set that up), and nothing at all when no email app is set up.
 */
export function emailProgramHint(isEn: boolean): string {
  return isEn
    ? '"Email program on this device" opens the email app your computer or phone is set up with, such as Outlook or Apple Mail. If you use Gmail or Outlook in the browser, choose those buttons instead.'
    : '„E-Mail-Programm auf diesem Gerät“ öffnet die E-Mail-App, die auf Ihrem Computer oder Handy eingestellt ist, zum Beispiel Outlook oder Apple Mail. Wenn Sie Gmail oder Outlook im Browser nutzen, wählen Sie lieber diese Knöpfe.';
}

/** A new email to the team. */
export function composeLinks(isEn: boolean) {
  const { subject, body } = emailDraft(isEn);
  return emailLinks(TEAM_EMAIL, subject, body);
}

export interface ContactMessage {
  name: string;
  email: string;
  topic: string;
  message: string;
  lang: string;
}

/**
 * Saves the contact form in the Supabase table "contact_messages" (servers in the EU).
 * Visitors may only add a message; nobody can read messages through the website.
 * The team reads them in the Supabase dashboard. True when the message was saved.
 */
export async function sendContactMessage(contact: ContactMessage): Promise<boolean> {
  try {
    const supabase = await getSupabase(); // loaded on first use
    if (!supabase) return false;
    const { error } = await supabase.from('contact_messages').insert({
      name: contact.name.slice(0, 200),
      email: contact.email.slice(0, 320),
      topic: contact.topic.slice(0, 100),
      message: contact.message.slice(0, 5000),
      lang: contact.lang.slice(0, 5),
    });
    return !error;
  } catch {
    return false;
  }
}
