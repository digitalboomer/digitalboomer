import React, { useState } from 'react';
import { linkTo } from '../utils/router';
import { Icon } from '../components/Icon';
import { formProblem } from '../utils/formCheck';
import { PageId, Language } from '../types';
import { FAQS_EN, FAQS_DE, TUTORIALS_EN, TUTORIALS_DE } from '../data/content';
import { TEAM_EMAIL, sendContactMessage } from '../utils/contact';

interface AboutHelpScreenProps {
  onNavigate: (page: PageId) => void;
  onOpenPhoneSupport?: () => void;
  onOpenSupportModal?: () => void;
  lang?: Language;
}

export const AboutHelpScreen: React.FC<AboutHelpScreenProps> = ({
  onNavigate,
  onOpenPhoneSupport,
  onOpenSupportModal,
  lang = 'en',
}) => {
  const triggerSupport = onOpenSupportModal || onOpenPhoneSupport || (() => {});
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const isEn = lang === 'en';
  const faqs = isEn ? FAQS_EN : FAQS_DE;

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactTopic, setContactTopic] = useState('General Question');
  const [contactMessage, setContactMessage] = useState('');
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const [formError, setFormError] = useState('');
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sendState === 'sending') return;
    const problem = formProblem(e.currentTarget, isEn);
    setFormError(problem);
    if (problem) return;
    setSendState('sending');
    const sent = await sendContactMessage({
      name: contactName.trim(),
      email: contactEmail.trim(),
      topic: contactTopic,
      message: contactMessage.trim(),
      lang,
    });
    setSendState(sent ? 'sent' : 'failed');
  };

  const fieldClass = 'w-full px-4 py-3 min-h-[48px] rounded-xl border-2 border-[#667382] bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#17324D] focus-visible:ring-offset-2';

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Breadcrumb & Title */}
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#202B36] dark:text-slate-400 mb-2">
            <a {...linkTo({ page: 'home' }, () => onNavigate('home'))} className="underline text-[#17324D] min-h-[44px] inline-flex items-center">
              {isEn ? 'Home' : 'Startseite'}
            </a>
            <span>/</span>
            <span className="font-bold text-[#17324D] dark:text-white">
              {isEn ? 'About us' : 'Über uns'}
            </span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] dark:text-white">
            {isEn ? 'About us and common questions' : 'Über uns und häufige Fragen'}
          </h1>
          <p className="text-lg text-[#202B36] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {isEn
              ? 'No one is too old for the digital world. Here you find who we are, answers to common questions, and how to write to us.'
              : 'Niemand ist zu alt für die digitale Welt. Hier erfahren Sie, wer wir sind, finden Antworten auf häufige Fragen und können uns schreiben.'}
          </p>
        </div>

        {/* 1. ABOUT US MISSION */}
        <section className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] border border-[#E5E9ED] dark:border-slate-700 flex items-center justify-center">
              <Icon name="school" className="text-3xl" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#176B68] dark:text-teal-400">
                {isEn ? 'Our aim' : 'Unser Ziel'}
              </span>
              <h2 className="text-2xl font-extrabold text-[#17324D] dark:text-white">
                {isEn ? 'Everyone should be able to take part in digital life' : 'Alle sollen am digitalen Leben teilhaben können'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#202B36] dark:text-slate-200 leading-relaxed text-base">
            <p>
              {isEn
                ? 'Digital Boomer is a user-centered student project in the course BIS5152 Human-Centered AI Interface Design. Our objective is to show that accessible design and patient guidance help older adults use modern digital technology with confidence.'
                : 'Digital Boomer ist ein nutzerzentriertes Studierendenprojekt im Kurs BIS5152 Human-Centered AI Interface Design. Unser Ziel ist es zu zeigen, dass barrierefreies Design und geduldige Anleitung ältere Menschen im digitalen Alltag stärken.'}
            </p>
            <p>
              {isEn
                ? 'We avoid talking down to anyone, and we avoid clichés about age. Older people have already mastered many changes in their lives. Digital devices are simply the next tool.'
                : 'Wir verzichten bewusst auf herablassende Sprache oder klischeehafte Darstellungen. Ältere Generationen haben in ihrem Leben bereits unzählige Umbrüche gemeistert. Die digitale Welt ist lediglich das nächste Werkzeug.'}
            </p>
          </div>

          <div className="pt-4 border-t border-[#E5E9ED] dark:border-slate-800 flex flex-wrap gap-3 text-base font-bold text-[#17324D] dark:text-slate-200">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAF2F8] dark:bg-slate-800 border border-[#E5E9ED] dark:border-slate-700">
              {isEn ? 'Designed to support WCAG 2.2 AA, testing still to come' : 'Auf WCAG 2.2 AA ausgerichtet, Prüfung folgt noch'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAF2F8] dark:bg-slate-800 border border-[#E5E9ED] dark:border-slate-700">
              <Icon name="check_circle" className="text-lg" />{isEn ? 'Free and without advertising' : 'Kostenlos und ohne Werbung'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAF2F8] dark:bg-slate-800 border border-[#E5E9ED] dark:border-slate-700">
              <Icon name="check_circle" className="text-lg" />{isEn ? 'Calm, respectful language' : 'Ruhige, respektvolle Sprache („Sie“-Form)'}
            </span>
          </div>
        </section>

        {/* 2. FAQ ACCORDION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-[#17324D] dark:text-white">
              {isEn ? 'Common questions' : 'Häufige Fragen'}
            </h2>
            <span className="text-xs text-[#202B36] dark:text-slate-400 font-semibold">
              {isEn ? 'Click a question to see the answer.' : 'Klicken Sie auf eine Frage, um die Antwort zu sehen.'}
            </span>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 transition-all shadow-sm ${
                    isOpen ? 'border-[#176B68]' : 'border-[#E5E9ED] dark:border-slate-800'
                  }`}
                >
                  <h3>
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#17324D] dark:text-white hover:bg-[#EAF2F8]/50 dark:hover:bg-slate-800 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <Icon name="expand_more" className={`text-2xl text-[#176B68] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </h3>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-[#202B36] dark:text-slate-300 text-base leading-relaxed border-t border-[#E5E9ED] dark:border-slate-800 bg-[#EAF2F8]/20 dark:bg-slate-800/20 animate-fade-in space-y-3">
                      <p>{faq.answer}</p>
                      {(() => {
                        const lesson = faq.lessonId ? (isEn ? TUTORIALS_EN : TUTORIALS_DE).find((t) => t.id === faq.lessonId) : undefined;
                        return lesson ? (
                          <a {...linkTo({ page: 'tutorial-detail', tutorialId: lesson.id })} className="inline-flex items-center gap-2 min-h-[44px] font-bold text-[#17324D] dark:text-white underline">
                            {isEn ? 'Open the lesson' : 'Zur Lektion'}: {lesson.title}
                            <Icon name="arrow_forward" className="text-xl" />
                          </a>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. ACCESSIBLE CONTACT FORM */}
        <section className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] border border-[#E5E9ED] dark:border-slate-700 flex items-center justify-center">
              <Icon name="mail" className="text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#17324D] dark:text-white">
                {isEn ? 'Do you have a question or a suggestion?' : 'Haben Sie eine Frage oder Anregung?'}
              </h2>
              <p className="text-base text-[#202B36] dark:text-slate-300">
                {isEn
                  ? 'Write to us here. Your message goes to the Digital Boomer team, and we answer by email.'
                  : 'Schreiben Sie uns hier. Ihre Nachricht geht an das Digital Boomer Team, und wir antworten per E-Mail.'}
              </p>
            </div>
          </div>

          {sendState === 'sent' ? (
            <div role="status" className="p-8 text-center bg-[#E3F1F0] dark:bg-slate-800 rounded-2xl border-2 border-[#176B68] space-y-3 animate-fade-in">
              <Icon name="check_circle" className="text-5xl text-[#176B68]" />
              <h3 className="text-2xl font-bold text-[#17324D] dark:text-white">
                {isEn ? 'Thank you! Your message has been sent.' : 'Vielen Dank! Ihre Nachricht wurde gesendet.'}
              </h3>
              <p className="text-[#202B36] dark:text-slate-300 max-w-md mx-auto">
                {isEn
                  ? `We will answer you at ${contactEmail}, usually within a few days.`
                  : `Wir antworten Ihnen an ${contactEmail}, meist innerhalb weniger Tage.`}
              </p>
              <button
                onClick={() => {
                  setSendState('idle');
                  setContactMessage('');
                }}
                className="mt-4 px-6 min-h-[48px] rounded-xl bg-[#17324D] hover:bg-[#0F2438] active:bg-[#0A1A2A] text-white text-base font-bold"
              >
                {isEn ? 'Send another message' : 'Weitere Nachricht schreiben'}
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={handleContactSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-bold text-[#17324D] dark:text-white mb-1">
                    {isEn ? 'Your name' : 'Ihr Name'} <span className="font-normal">{isEn ? '(required)' : '(Pflichtfeld)'}</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder={isEn ? 'e.g. Anna Example' : 'z. B. Anna Beispiel'}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    autoComplete="name"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-bold text-[#17324D] dark:text-white mb-1">
                    {isEn ? 'Your email address' : 'Ihre E-Mail-Adresse'} <span className="font-normal">{isEn ? '(required)' : '(Pflichtfeld)'}</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder={isEn ? 'name@example.com' : 'name@anbieter.de'}
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    autoComplete="email"
                    className={fieldClass}
                  />
                  <p className="text-sm text-[#202B36] dark:text-slate-300 mt-1">
                    {isEn ? 'We need it to answer you.' : 'Die brauchen wir, um Ihnen zu antworten.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-topic" className="block text-sm font-bold text-[#17324D] dark:text-white mb-1">
                    {isEn ? 'Topic' : 'Thema'}
                  </label>
                  <select
                    id="contact-topic"
                    value={contactTopic}
                    onChange={(e) => setContactTopic(e.target.value)}
                    className={fieldClass}
                  >
                    <option value="General Question">{isEn ? 'General question about using the site' : 'Allgemeine Frage zur Bedienung'}</option>
                    <option value="Help with a tutorial">{isEn ? 'Help with a specific lesson' : 'Hilfe bei einer bestimmten Lektion'}</option>
                    <option value="Topic suggestion">{isEn ? 'Suggestion for a new topic' : 'Vorschlag für neues Thema'}</option>
                    <option value="Accessibility note">{isEn ? 'Accessibility feedback' : 'Hinweis zur Barrierefreiheit'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-msg" className="block text-sm font-bold text-[#17324D] dark:text-white mb-1">
                  {isEn ? 'Your message' : 'Ihre Nachricht'} <span className="font-normal">{isEn ? '(required)' : '(Pflichtfeld)'}</span>
                </label>
                <textarea
                  id="contact-msg"
                  rows={4}
                  required
                  placeholder={isEn ? 'How can we help you?' : 'Wie können wir Ihnen weiterhelfen?'}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <p className="text-sm text-[#202B36] dark:text-slate-300">
                {isEn
                  ? 'We only use your name and email address to answer you. Please do not write passwords, bank details or other private data. '
                  : 'Wir nutzen Ihren Namen und Ihre E-Mail-Adresse nur, um Ihnen zu antworten. Bitte schreiben Sie keine Passwörter, Bankdaten oder andere private Daten. '}
                <a {...linkTo({ page: 'datenschutz' }, () => onNavigate('datenschutz'))} className="underline font-bold text-[#17324D] dark:text-white inline-flex items-center">
                  {isEn ? 'Privacy' : 'Datenschutz'}
                </a>
              </p>

              {sendState === 'failed' && (
                <div role="alert" className="p-4 rounded-xl bg-[#FDECEA] border-2 border-[#B3261E] text-[#202B36] flex items-start gap-3">
                  <Icon name="error" className="text-2xl text-[#B3261E] shrink-0" />
                  <p>
                    {isEn
                      ? 'The message could not be sent. Your text is still here. Please try again, or write to us directly at '
                      : 'Die Nachricht konnte nicht gesendet werden. Ihr Text ist noch da. Bitte versuchen Sie es noch einmal, oder schreiben Sie uns direkt an '}
                    <a href={`mailto:${TEAM_EMAIL}`} className="underline font-bold text-[#17324D]">{TEAM_EMAIL}</a>.
                  </p>
                </div>
              )}

              {formError && (
                <p role="alert" className="flex items-start gap-2 p-3 rounded-xl bg-[#FDECEA] border-2 border-[#B3261E] text-[#202B36] text-base">
                  <Icon name="error" className="text-xl text-[#B3261E] shrink-0 mt-0.5" />{formError}
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={triggerSupport}
                  className="text-[#17324D] font-bold text-base underline flex items-center gap-1.5 min-h-[44px] text-left"
                >
                  <Icon name="smart_toy" className="text-lg text-[#176B68]" />
                  <span>{isEn ? 'Need help now? Open the help assistant (pre-written answers)' : 'Jetzt Hilfe nötig? Zum Hilfe-Assistenten (vorgefertigte Antworten)'}</span>
                </button>

                <button
                  type="submit"
                  disabled={sendState === 'sending'}
                  className="px-8 min-h-[56px] rounded-xl bg-[#17324D] hover:bg-[#0F2438] active:bg-[#0A1A2A] disabled:opacity-70 text-white font-bold text-base transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <Icon name={sendState === 'sending' ? 'progress_activity' : 'send'} className={`text-xl ${sendState === 'sending' ? 'motion-safe:animate-spin' : ''}`} />
                  {sendState === 'sending' ? (isEn ? 'Sending…' : 'Wird gesendet…') : (isEn ? 'Send message' : 'Nachricht senden')}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};
