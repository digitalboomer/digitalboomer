import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { PageId, Language } from '../types';
import { IMAGES, handleLogoError } from '../assets/images';
import { accountsAvailable, friendlyError, resendConfirmation, sendPasswordReset, setNewPassword, signIn, signUp } from '../utils/auth';

export type AuthView = 'anmelden' | 'registrieren' | 'passwort-vergessen' | 'konto-bestaetigt' | 'neues-passwort';

interface AuthScreensProps {
  initialView: AuthView;
  onNavigate: (page: PageId) => void;
  onContinueAsGuest: () => void;
  /** A link from an email did not work, for example because it was old or used already. */
  linkFailed?: boolean;
  lang?: Language;
}

const input = 'w-full px-4 min-h-[48px] rounded-xl border-2 border-[#667382] bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base';
const primary = 'w-full inline-flex items-center justify-center gap-2 min-h-[56px] rounded-xl bg-[#17324D] hover:bg-[#0F2438] active:bg-[#0A1A2A] text-white font-bold text-base disabled:opacity-60';
const link = 'font-bold text-[#17324D] dark:text-white underline min-h-[44px] inline-flex items-center';

/** Real sign-up with email confirmation, sign-in and password reset. Accounts are optional. */
export const AuthScreens: React.FC<AuthScreensProps> = ({ initialView, onNavigate, onContinueAsGuest, linkFailed, lang = 'en' }) => {
  const isEn = lang === 'en';
  const [view, setView] = useState<AuthView>(initialView);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(linkFailed && initialView === 'anmelden' ? (isEn ? 'This email link did not work. It may be old or already used. Please sign in, or ask for a new email.' : 'Dieser E-Mail-Link hat nicht funktioniert. Vielleicht ist er alt oder wurde schon benutzt. Bitte melden Sie sich an, oder fordern Sie eine neue E-Mail an.') : '');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const [resent, setResent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const go = (next: AuthView) => {
    setError('');
    setNeedsConfirmation(false);
    setView(next);
  };

  const run = async (action: () => Promise<string | null>, onSuccess: () => void) => {
    setBusy(true);
    setError('');
    const problem = await action();
    setBusy(false);
    if (problem) {
      setNeedsConfirmation(problem.toLowerCase().includes('not confirmed'));
      setError(friendlyError(problem, isEn));
    } else {
      onSuccess();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError(isEn ? 'Please choose a password with at least 8 characters.' : 'Bitte wählen Sie ein Passwort mit mindestens 8 Zeichen.');
      return;
    }
    run(() => signUp(name.trim(), email.trim(), password, lang), () => setSentTo(email.trim()));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => signIn(email.trim(), password), () => onNavigate('dashboard'));
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => sendPasswordReset(email.trim()), () => setResetSent(true));
  };

  const handleNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError(isEn ? 'Please choose a password with at least 8 characters.' : 'Bitte wählen Sie ein Passwort mit mindestens 8 Zeichen.');
      return;
    }
    if (password !== password2) {
      setError(isEn ? 'The two passwords are not the same. Please type them again.' : 'Die beiden Passwörter sind nicht gleich. Bitte tippen Sie sie noch einmal ein.');
      return;
    }
    run(() => setNewPassword(password), () => setPasswordChanged(true));
  };

  const resend = () => run(() => resendConfirmation(sentTo || email.trim()), () => setResent(true));

  const field = (id: string, label: string, value: string, setValue: (v: string) => void, type: string, autoComplete: string, hint?: string) => (
    <div>
      <label htmlFor={id} className="block text-base font-bold text-[#17324D] dark:text-white mb-1">{label}</label>
      {hint && <p id={`${id}-hint`} className="text-base text-[#202B36] dark:text-slate-300 mb-1">{hint}</p>}
      <div className="relative">
        <input
          id={id}
          type={type === 'password' && showPassword ? 'text' : type}
          required
          autoComplete={autoComplete}
          aria-describedby={hint ? `${id}-hint` : undefined}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={`${input} ${type === 'password' ? 'pr-14' : ''}`}
        />
        {type === 'password' && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-[#17324D] dark:text-white" aria-label={showPassword ? (isEn ? 'Hide password' : 'Passwort verbergen') : (isEn ? 'Show password' : 'Passwort anzeigen')}>
            <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );

  const message = (icon: string, title: string, text: React.ReactNode, actions: React.ReactNode) => (
    <div className="text-center space-y-4" role="status">
      <span className="w-16 h-16 rounded-full bg-[#E3F1F0] dark:bg-slate-800 text-[#176B68] border-2 border-[#176B68] flex items-center justify-center mx-auto"><Icon name={icon} className="text-3xl" /></span>
      <h2 className="text-2xl font-bold text-[#17324D] dark:text-white">{title}</h2>
      <div className="text-[#202B36] dark:text-slate-200 space-y-2">{text}</div>
      <div className="space-y-2">{actions}</div>
    </div>
  );

  const titles: Record<AuthView, [string, string]> = {
    anmelden: [isEn ? 'Sign in' : 'Anmelden', isEn ? 'Sign in to see your progress on every device.' : 'Melden Sie sich an, um Ihren Fortschritt auf jedem Gerät zu sehen.'],
    registrieren: [isEn ? 'Create a free account' : 'Kostenloses Konto erstellen', isEn ? 'You do not need an account to learn. With one, your progress is saved on every device, and your certificate shows your name.' : 'Zum Lernen brauchen Sie kein Konto. Mit einem Konto ist Ihr Fortschritt auf jedem Gerät gespeichert, und Ihre Bestätigung trägt Ihren Namen.'],
    'passwort-vergessen': [isEn ? 'Forgot your password?' : 'Passwort vergessen?', isEn ? 'No problem. We will send you an email with a link to choose a new one.' : 'Kein Problem. Wir schicken Ihnen eine E-Mail mit einem Link, um ein neues zu wählen.'],
    'konto-bestaetigt': [isEn ? 'Your account is ready' : 'Ihr Konto ist bereit', ''],
    'neues-passwort': [isEn ? 'Choose a new password' : 'Neues Passwort wählen', isEn ? 'Choose a password you can remember, with at least 8 characters.' : 'Wählen Sie ein Passwort, das Sie sich merken können, mit mindestens 8 Zeichen.'],
  };
  const [title, subtitle] = titles[view];

  let content: React.ReactNode;
  if (!accountsAvailable) {
    content = (
      <p className="p-4 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#202B36] dark:text-slate-200 flex items-start gap-3">
        <Icon name="info" className="text-2xl text-[#17324D] shrink-0" />
        {isEn
          ? 'Accounts are not switched on yet on this website. You can use everything as a guest; your progress is saved in this browser.'
          : 'Konten sind auf dieser Website noch nicht eingeschaltet. Sie können alles als Gast nutzen; Ihr Fortschritt wird in diesem Browser gespeichert.'}
      </p>
    );
  } else if (view === 'registrieren' && sentTo) {
    content = message('mark_email_read', isEn ? 'Almost done: check your email' : 'Fast geschafft: Schauen Sie in Ihre E-Mails', (
      <>
        <p>{isEn ? <>We have sent an email to <strong>{sentTo}</strong>.</> : <>Wir haben eine E-Mail an <strong>{sentTo}</strong> geschickt.</>}</p>
        <p>{isEn ? 'Open it and click "Confirm my account". Then your account is ready.' : 'Öffnen Sie sie und klicken Sie auf „Konto bestätigen“. Dann ist Ihr Konto bereit.'}</p>
        <p>{isEn ? 'No email after a few minutes? Look in your spam folder too.' : 'Nach ein paar Minuten keine E-Mail? Schauen Sie auch im Spam-Ordner nach.'}</p>
        {resent && <p className="font-bold">{isEn ? 'We sent the email again.' : 'Wir haben die E-Mail noch einmal gesendet.'}</p>}
      </>
    ), (
      <>
        <button type="button" onClick={resend} disabled={busy} className={primary}>{isEn ? 'Send the email again' : 'E-Mail noch einmal senden'}</button>
        <button type="button" onClick={() => go('anmelden')} className={link}>{isEn ? 'Already confirmed? Sign in' : 'Schon bestätigt? Anmelden'}</button>
      </>
    ));
  } else if (view === 'konto-bestaetigt') {
    content = message('verified', isEn ? 'Thank you! Your email address is confirmed.' : 'Danke! Ihre E-Mail-Adresse ist bestätigt.', (
      <p>{isEn ? 'You are now signed in. Your progress is saved to your account from now on.' : 'Sie sind jetzt angemeldet. Ihr Fortschritt wird ab jetzt in Ihrem Konto gespeichert.'}</p>
    ), (
      <button type="button" onClick={() => onNavigate('dashboard')} className={primary}>{isEn ? 'Go to my progress' : 'Zu meinem Fortschritt'}</button>
    ));
  } else if (view === 'neues-passwort' && passwordChanged) {
    content = message('check_circle', isEn ? 'Your new password is saved' : 'Ihr neues Passwort ist gespeichert', (
      <p>{isEn ? 'You are signed in. Next time, use your new password.' : 'Sie sind angemeldet. Nutzen Sie beim nächsten Mal Ihr neues Passwort.'}</p>
    ), (
      <button type="button" onClick={() => onNavigate('dashboard')} className={primary}>{isEn ? 'Go to my progress' : 'Zu meinem Fortschritt'}</button>
    ));
  } else if (view === 'passwort-vergessen' && resetSent) {
    content = message('mark_email_read', isEn ? 'Please check your email' : 'Bitte schauen Sie in Ihre E-Mails', (
      <>
        <p>{isEn ? `If there is an account for ${email}, we have sent it a link. Open the email and click "Choose a new password".` : `Falls es ein Konto für ${email} gibt, haben wir einen Link dorthin geschickt. Öffnen Sie die E-Mail und klicken Sie auf „Neues Passwort wählen“.`}</p>
        <p>{isEn ? 'Look in your spam folder too.' : 'Schauen Sie auch im Spam-Ordner nach.'}</p>
      </>
    ), (
      <button type="button" onClick={() => { setResetSent(false); go('anmelden'); }} className={link}>{isEn ? 'Back to sign in' : 'Zurück zur Anmeldung'}</button>
    ));
  } else if (view === 'registrieren') {
    content = (
      <form onSubmit={handleRegister} className="space-y-4">
        {field('reg-name', isEn ? 'Your name' : 'Ihr Name', name, setName, 'text', 'name', isEn ? 'It appears on your certificate.' : 'Er erscheint auf Ihrer Teilnahmebestätigung.')}
        {field('reg-email', isEn ? 'Your email address' : 'Ihre E-Mail-Adresse', email, setEmail, 'email', 'email')}
        {field('reg-password', isEn ? 'Choose a password' : 'Passwort wählen', password, setPassword, 'password', 'new-password', isEn ? 'At least 8 characters. Do not use the password of your email.' : 'Mindestens 8 Zeichen. Nicht das Passwort Ihrer E-Mail verwenden.')}
        <button type="submit" disabled={busy} className={primary}>{busy ? (isEn ? 'Please wait...' : 'Bitte warten...') : (isEn ? 'Create account' : 'Konto erstellen')}</button>
        <p className="text-center text-[#202B36] dark:text-slate-300">{isEn ? 'Already have an account? ' : 'Schon ein Konto? '}<button type="button" onClick={() => go('anmelden')} className={link}>{isEn ? 'Sign in' : 'Anmelden'}</button></p>
      </form>
    );
  } else if (view === 'passwort-vergessen') {
    content = (
      <form onSubmit={handleReset} className="space-y-4">
        {field('reset-email', isEn ? 'Your email address' : 'Ihre E-Mail-Adresse', email, setEmail, 'email', 'email')}
        <button type="submit" disabled={busy} className={primary}>{busy ? (isEn ? 'Please wait...' : 'Bitte warten...') : (isEn ? 'Send me a link' : 'Link senden')}</button>
        <button type="button" onClick={() => go('anmelden')} className={link}>{isEn ? 'Back to sign in' : 'Zurück zur Anmeldung'}</button>
      </form>
    );
  } else if (view === 'neues-passwort') {
    content = (
      <form onSubmit={handleNewPassword} className="space-y-4">
        {field('new-password', isEn ? 'New password' : 'Neues Passwort', password, setPassword, 'password', 'new-password')}
        {field('new-password-2', isEn ? 'Type it again' : 'Noch einmal eingeben', password2, setPassword2, 'password', 'new-password')}
        <button type="submit" disabled={busy} className={primary}>{busy ? (isEn ? 'Please wait...' : 'Bitte warten...') : (isEn ? 'Save new password' : 'Neues Passwort speichern')}</button>
      </form>
    );
  } else {
    content = (
      <form onSubmit={handleLogin} className="space-y-4">
        {field('login-email', isEn ? 'Your email address' : 'Ihre E-Mail-Adresse', email, setEmail, 'email', 'email')}
        {field('login-password', isEn ? 'Your password' : 'Ihr Passwort', password, setPassword, 'password', 'current-password')}
        <button type="submit" disabled={busy} className={primary}>{busy ? (isEn ? 'Please wait...' : 'Bitte warten...') : (isEn ? 'Sign in' : 'Anmelden')}</button>
        <div className="flex flex-wrap justify-between gap-2">
          <button type="button" onClick={() => go('passwort-vergessen')} className={link}>{isEn ? 'Forgot password?' : 'Passwort vergessen?'}</button>
          <button type="button" onClick={() => go('registrieren')} className={link}>{isEn ? 'Create an account' : 'Konto erstellen'}</button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-10 px-4 sm:px-8 flex items-start justify-center">
      <div className="w-full max-w-md bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 p-6 sm:p-8 space-y-5">
        <div className="text-center space-y-2">
          <img src={IMAGES.logo} alt="" className="h-14 w-auto object-contain max-w-[170px] mx-auto" onError={handleLogoError} />
          <h1 className="text-3xl font-bold text-[#17324D] dark:text-white">{title}</h1>
          {subtitle && <p className="text-[#202B36] dark:text-slate-300">{subtitle}</p>}
        </div>

        {error && (
          <div role="alert" className="p-4 rounded-xl bg-[#FDECEA] border-2 border-[#B3261E] text-[#202B36] flex items-start gap-3">
            <Icon name="error" className="text-2xl text-[#B3261E] shrink-0" />
            <div className="space-y-2">
              <span className="block">{error}</span>
              {needsConfirmation && <button type="button" onClick={resend} className={link}>{isEn ? 'Send the confirmation email again' : 'Bestätigungs-E-Mail erneut senden'}</button>}
              {resent && <span className="block font-bold">{isEn ? 'We sent the email again.' : 'Wir haben die E-Mail noch einmal gesendet.'}</span>}
            </div>
          </div>
        )}

        {content}

        {view !== 'konto-bestaetigt' && view !== 'neues-passwort' && (
          <div className="pt-4 border-t-2 border-[#E5E9ED] dark:border-slate-800 text-center space-y-2">
            <p className="text-[#202B36] dark:text-slate-300">{isEn ? 'Prefer not to have an account? That is fine.' : 'Lieber ohne Konto? Das ist in Ordnung.'}</p>
            <button type="button" onClick={onContinueAsGuest} className="w-full min-h-[48px] rounded-xl border-2 border-[#17324D] text-[#17324D] dark:text-white font-bold text-base hover:bg-[#EAF2F8]">
              {isEn ? 'Continue as a guest' : 'Als Gast weitermachen'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
