/// <reference types="vite/client" />
/**
 * Real accounts with Supabase: sign up with email confirmation, sign in, forgotten
 * password, and progress saved to the account. Accounts are optional: everything
 * works for guests too. Without the two settings below, accounts are switched off
 * and the site says so. Setup: docs/accounts-setup.md.
 *
 * The anon key is meant to be public. Row level security on the database makes
 * sure every user can only read and change their own progress.
 */
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { SavedProgress } from './progress';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null = url && anonKey
  ? createClient(url, anonKey, { auth: { flowType: 'pkce', detectSessionInUrl: false, persistSession: true, autoRefreshToken: true } })
  : null;

export const accountsAvailable = supabase !== null;

/** The address emails link back to: this site, without the page part. */
function siteAddress(): string {
  return `${window.location.origin}${window.location.pathname}`;
}

export type AuthLanding = 'confirmed' | 'recovery' | 'failed' | null;

/**
 * Handles the link from a confirmation or password email. Links with a token
 * work on any device; links with a code only in the browser that asked for them.
 */
export async function handleAuthLink(): Promise<AuthLanding> {
  if (!supabase) return null;
  const params = new URLSearchParams(window.location.search);
  const tokenHash = params.get('token_hash');
  const type = params.get('type');
  const code = params.get('code');
  const failed = params.get('error_description') || params.get('error');
  if (!tokenHash && !code && !failed) return null;

  let landing: AuthLanding = 'failed';
  try {
    if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as 'email' | 'signup' | 'recovery' | 'email_change' });
      if (!error) landing = type === 'recovery' ? 'recovery' : 'confirmed';
    } else if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) landing = params.get('reset') ? 'recovery' : 'confirmed';
    }
  } catch {
    landing = 'failed';
  }
  // Remove the one-time code from the address bar.
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.hash}`);
  return landing;
}

/** A short, kind message for every problem Supabase can report. */
export function friendlyError(message: string, isEn: boolean): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login')) return isEn ? 'The email address or password is not right. Please check both and try again.' : 'E-Mail-Adresse oder Passwort stimmen nicht. Bitte prüfen Sie beides und versuchen Sie es noch einmal.';
  if (m.includes('not confirmed')) return isEn ? 'Please confirm your email address first. Open the email we sent you and click the button in it.' : 'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse. Öffnen Sie die E-Mail, die wir Ihnen geschickt haben, und klicken Sie auf den Knopf darin.';
  if (m.includes('already registered') || m.includes('already been registered')) return isEn ? 'There is already an account with this email address. Please sign in, or use "Forgot password".' : 'Mit dieser E-Mail-Adresse gibt es schon ein Konto. Bitte melden Sie sich an, oder nutzen Sie „Passwort vergessen“.';
  if (m.includes('rate limit') || m.includes('too many') || m.includes('security purposes')) return isEn ? 'We have sent too many emails just now. Please wait a few minutes and try again.' : 'Wir haben gerade zu viele E-Mails gesendet. Bitte warten Sie ein paar Minuten und versuchen Sie es noch einmal.';
  if (m.includes('password')) return isEn ? 'Please choose a longer password, with at least 8 characters.' : 'Bitte wählen Sie ein längeres Passwort, mit mindestens 8 Zeichen.';
  if (m.includes('email')) return isEn ? 'Please check the email address.' : 'Bitte prüfen Sie die E-Mail-Adresse.';
  return isEn ? 'Something went wrong. Please try again in a moment.' : 'Etwas hat nicht geklappt. Bitte versuchen Sie es gleich noch einmal.';
}

export async function signUp(name: string, email: string, password: string, lang: string): Promise<string | null> {
  if (!supabase) return 'not available';
  const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: siteAddress(), data: { name, lang } } });
  if (error) return error.message;
  // An address that already has an account gets no email. Supabase marks this with an empty list of identities.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) return 'already registered';
  return null;
}

export async function resendConfirmation(email: string): Promise<string | null> {
  if (!supabase) return 'not available';
  const { error } = await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: siteAddress() } });
  return error ? error.message : null;
}

export async function signIn(email: string, password: string): Promise<string | null> {
  if (!supabase) return 'not available';
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? error.message : null;
}

export async function signOut(): Promise<void> {
  await supabase?.auth.signOut();
}

export async function sendPasswordReset(email: string): Promise<string | null> {
  if (!supabase) return 'not available';
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${siteAddress()}?reset=1` });
  return error ? error.message : null;
}

export async function setNewPassword(password: string): Promise<string | null> {
  if (!supabase) return 'not available';
  const { error } = await supabase.auth.updateUser({ password });
  return error ? error.message : null;
}

export function onAccountChange(callback: (user: User | null) => void): () => void {
  if (!supabase) return () => {};
  supabase.auth.getSession().then(({ data }) => callback(data.session?.user ?? null));
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session?.user ?? null));
  return () => data.subscription.unsubscribe();
}

/** Progress saved to the account, so it is there on every device. */
export async function loadAccountProgress(userId: string): Promise<SavedProgress | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('progress').select('completed, saved, steps').eq('user_id', userId).maybeSingle();
  if (error || !data) return null;
  return { completedTutorialIds: data.completed ?? [], savedTutorialIds: data.saved ?? [], tutorialSteps: data.steps ?? {} };
}

export async function saveAccountProgress(userId: string, progress: SavedProgress): Promise<void> {
  if (!supabase) return;
  await supabase.from('progress').upsert({
    user_id: userId,
    completed: progress.completedTutorialIds,
    saved: progress.savedTutorialIds,
    steps: progress.tutorialSteps,
    updated_at: new Date().toISOString(),
  });
}
