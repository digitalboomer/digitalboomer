/**
 * Contacting the team: links that open a new email, and the contact form.
 * The form is saved in Supabase (table contact_messages). Setup: docs/contact-form-setup.md.
 */
import { supabase } from './auth';

export const TEAM_EMAIL = 'digitalboomer.team@gmail.com';

/** The ready-made start of a new email to the team. */
export function emailDraft(isEn: boolean) {
  return {
    subject: isEn ? 'Question about Digital Boomer' : 'Frage zu Digital Boomer',
    body: isEn ? 'Hello Digital Boomer team,\n\nmy question is about: \n\n' : 'Hallo Digital Boomer Team,\n\nmeine Frage betrifft: \n\n',
  };
}

/** Webmail pages that open straight on a new, filled-in email. They open in a new tab. */
export function composeLinks(isEn: boolean) {
  const { subject, body } = emailDraft(isEn);
  const q = encodeURIComponent;
  return {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${q(TEAM_EMAIL)}&su=${q(subject)}&body=${q(body)}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${q(TEAM_EMAIL)}&subject=${q(subject)}&body=${q(body)}`,
    // An email program on the device (Apple Mail, Outlook, Thunderbird). Does nothing when none is set up.
    program: `mailto:${TEAM_EMAIL}?subject=${q(subject)}&body=${q(body)}`,
  };
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
  if (!supabase) return false;
  try {
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
