/// <reference types="vite/client" />
/**
 * The AI help assistant: sends the conversation to the Supabase Edge Function
 * "help-chat" (supabase/functions/help-chat), which asks Google Gemini.
 * The Gemini key lives only there. Setup: docs/ai-help-setup.md.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * True once the team has set VITE_AI_HELP=on (in .env.production), after the function and its
 * Gemini key are set up and tested. Until then the help window honestly offers only pre-written answers.
 */
export const aiHelpConfigured = Boolean(url && anonKey && import.meta.env.VITE_AI_HELP === 'on');

export interface HelpTurn {
  role: 'user' | 'assistant';
  text: string;
}

export interface HelpLessonHint {
  id: string;
  title: string;
  /** The lesson's steps as text, for the best matches, so the AI answers like our lessons. */
  text?: string;
}

export type HelpChatResult =
  | { ok: true; answer: string; lessonIds: string[] }
  | { ok: false; reason: 'limit' | 'unavailable' };

/** `current`: where the person is on the site (lesson and step), so the AI can help with that step. */
export async function askHelpAssistant(messages: HelpTurn[], lang: string, lessons: HelpLessonHint[], current: string): Promise<HelpChatResult> {
  if (!url || !anonKey) return { ok: false, reason: 'unavailable' };
  try {
    const response = await fetch(`${url}/functions/v1/help-chat`, {
      method: 'POST',
      // The publishable key is not a token, so the function runs with "Verify JWT" off (docs/ai-help-setup.md).
      headers: { apikey: anonKey, 'content-type': 'application/json' },
      body: JSON.stringify({ messages, lang, lessons, current }),
      signal: AbortSignal.timeout(70000), // up to three models are tried, 20 seconds each
    });
    if (response.status === 429) return { ok: false, reason: 'limit' };
    if (!response.ok) return { ok: false, reason: 'unavailable' };
    const data = await response.json();
    if (typeof data?.answer !== 'string' || !data.answer.trim()) return { ok: false, reason: 'unavailable' };
    return { ok: true, answer: data.answer, lessonIds: Array.isArray(data.lessonIds) ? data.lessonIds.filter((id: unknown) => typeof id === 'string') : [] };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}
