import React, { useState } from 'react';
import { linkTo } from '../utils/router';
import { Icon } from '../components/Icon';
import { PageId, Language } from '../types';
import { SECURITY_CHECKLIST_EN, SECURITY_CHECKLIST_DE, TUTORIALS_DE, TUTORIALS_EN } from '../data/content';

interface SecurityScreenProps {
  onNavigate: (page: PageId) => void;
  onSelectTutorial: (tutorialId: string) => void;
  onOpenPhoneSupport?: () => void;
  onOpenSupportModal?: () => void;
  lang?: Language;
}

export const SecurityScreen: React.FC<SecurityScreenProps> = ({
  onNavigate,
  onSelectTutorial,
  onOpenPhoneSupport,
  onOpenSupportModal,
  lang = 'en',
}) => {
  const triggerSupport = onOpenSupportModal || onOpenPhoneSupport || (() => {});
  const [checkedItems, setCheckedItems] = useState<{ [id: string]: boolean }>({});

  const isEn = lang === 'en';
  const checklist = isEn ? SECURITY_CHECKLIST_EN : SECURITY_CHECKLIST_DE;
  const guides = (isEn ? TUTORIALS_EN : TUTORIALS_DE).filter((t) => t.categoryId === 'sicherheit');
  // The lessons in three groups, so the page reads like a short course instead of one long grid.
  const GROUPS: { title: string; text: string; ids: string[] }[] = [
    {
      title: isEn ? 'Recognise scams' : 'Betrug erkennen',
      text: isEn ? 'Emails, text messages, calls and websites that want your money or your data.' : 'E-Mails, SMS, Anrufe und Websites, die an Ihr Geld oder Ihre Daten wollen.',
      ids: ['phishing-erkennen', 'safety-phishing-examples', 'safety-sms-scams', 'safety-account-code', 'safety-phone-scams', 'e-mail-anhaenge-pruefen', 'safety-fake-websites', 'fake-shops-entlarven', 'safety-popups', 'safety-qr'],
    },
    {
      title: isEn ? 'Protect your accounts and devices' : 'Konten und Geräte schützen',
      text: isEn ? 'Passwords, codes and updates: set them up once, and you are much safer.' : 'Passwörter, Codes und Updates: einmal eingerichtet, und Sie sind viel sicherer.',
      ids: ['passwoerter-erstellen', 'safety-2fa', 'safety-updates', 'safety-wifi'],
    },
    {
      title: isEn ? 'If something has happened' : 'Wenn etwas passiert ist',
      text: isEn ? 'Calm plans for a lost phone or a scam. Best read before you need them.' : 'Ruhige Pläne für ein verlorenes Handy oder einen Betrug. Am besten lesen, bevor Sie sie brauchen.',
      ids: ['safety-lost-phone', 'safety-what-if'],
    },
  ];
  const grouped = new Set(GROUPS.flatMap((g) => g.ids));
  const groups = GROUPS.map((g) => ({ ...g, lessons: g.ids.map((id) => guides.find((t) => t.id === id)).filter((t): t is NonNullable<typeof t> => !!t) }));
  const others = guides.filter((t) => !grouped.has(t.id));
  if (others.length) groups[0].lessons.push(...others);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalChecks = checklist.length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const allChecked = checkedCount === totalChecks;

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Breadcrumb & Title */}
        <div>
          <nav className="flex items-center gap-2 text-sm text-[#202B36] dark:text-slate-400 mb-2" aria-label="Breadcrumb">
            <a {...linkTo({ page: 'home' }, () => onNavigate('home'))} className="underline text-[#17324D] min-h-[44px] inline-flex items-center">
              {isEn ? 'Home' : 'Startseite'}
            </a>
            <span>/</span>
            <span className="font-bold text-[#17324D] dark:text-white">
              {isEn ? 'Digital safety' : 'Digitale Sicherheit'}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-teal-300 border border-[#E5E9ED] dark:border-slate-700 text-xs font-bold mb-2">
                <Icon name="verified_user" className="text-base text-[#176B68]" />
                <span>{isEn ? 'Safe and calm on the internet' : 'Sicher und gelassen im Internet'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] dark:text-white">
                {isEn ? 'Digital safety' : 'Digitale Sicherheit'}
              </h1>
              <p className="text-lg text-[#202B36] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
                {isEn
                  ? 'A few simple rules protect you from most scams and harmful programs. You do not need to be an expert. Taking your time and checking calmly is what helps most.'
                  : 'Wenige, einfache Regeln schützen Sie vor den meisten Betrugsversuchen und Schadprogrammen. Sie müssen kein Profi sein. Am meisten hilft es, sich Zeit zu nehmen und in Ruhe zu prüfen.'}
              </p>
            </div>

            <a {...linkTo({ page: 'tutorial-detail', tutorialId: 'safety-phishing-examples' }, () => { onSelectTutorial('safety-phishing-examples'); onNavigate('tutorial-detail'); })} className="link-card px-6 py-3.5 rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-bold text-base flex items-center gap-2 shadow-sm shrink-0 touch-target">
              <span>{isEn ? 'Practise on 5 phishing emails' : 'An 5 Phishing-E-Mails üben'}</span>
              <Icon name="arrow_forward" className="text-xl" />
            </a>
          </div>
        </div>

        {/* All safety guides */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-[#17324D] dark:text-white">
            {isEn ? `All safety lessons (${guides.length})` : `Alle Lektionen zur Sicherheit (${guides.length})`}
          </h2>
          {groups.map((group) => (
          <div key={group.title} className="space-y-3">
          <h3 className="text-xl font-bold text-[#17324D] dark:text-white pt-2">{group.title}</h3>
          <p className="text-base text-[#202B36] dark:text-slate-300 max-w-2xl">{group.text}</p>
          <ul className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {group.lessons.map((guide) => (
              <li key={guide.id}>
                <a {...linkTo({ page: 'tutorial-detail', tutorialId: guide.id }, () => { onSelectTutorial(guide.id); onNavigate('tutorial-detail'); })} className="link-card w-full h-full text-left bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#667382] hover:border-[#176B68] overflow-hidden flex flex-col">
                  <img src={guide.image} alt="" className="w-full h-20 sm:h-32 object-cover" />
                  <span className="p-3 font-bold text-base text-[#17324D] dark:text-white">{guide.title}</span>
                </a>
              </li>
            ))}
          </ul>
          </div>
          ))}
        </section>

        {/* INTERACTIVE 5-POINT CHECKLIST */}
        <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E9ED] dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#176B68] dark:text-teal-400">
                {isEn ? 'Checklist' : 'Checkliste'}
              </span>
              <h2 className="text-2xl font-extrabold text-[#17324D] dark:text-white mt-1">
                {isEn ? 'Before you click a link: 5 questions' : 'Bevor Sie auf einen Link klicken: 5 Fragen'}
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-[#EAF2F8] dark:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold text-[#17324D] dark:text-teal-300 border border-[#E5E9ED] dark:border-slate-700 shrink-0">
              <Icon name="checklist" className="text-[#176B68]" />
              <span>{checkedCount} {isEn ? `of ${totalChecks} checked` : `von ${totalChecks} geprüft`}</span>
            </div>
          </div>

          <p className="text-base text-[#202B36] dark:text-slate-300">
            {isEn
              ? 'Did you get an unexpected email, text message or chat message? Go through these 5 questions one by one, and tick each one you have checked:'
              : 'Haben Sie eine unerwartete E-Mail, SMS oder Chat-Nachricht bekommen? Gehen Sie diese 5 Fragen nacheinander durch, und haken Sie jede ab, die Sie geprüft haben:'}
          </p>

          <div className="space-y-3">
            {checklist.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 select-none ${
                    isChecked
                      ? 'bg-[#EAF2F8] dark:bg-slate-800 border-[#176B68]'
                      : 'bg-[#FFFFFF] dark:bg-slate-900 border-[#667382] dark:border-slate-600 hover:border-[#176B68]'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked
                      ? 'bg-[#176B68] border-[#176B68] text-white'
                      : 'border-[#667382] dark:border-slate-400 bg-[#FFFFFF] dark:bg-slate-850'
                  }`}>
                    {isChecked && <Icon name="check" className="text-xl" />}
                  </div>
                  <div>
                    <span className="block font-bold text-base text-[#17324D] dark:text-white">
                      {item.title}
                    </span>
                    <span className="block text-base text-[#202B36] dark:text-slate-300 mt-1 leading-relaxed">
                      {item.explanation}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {allChecked && (
            <div className="bg-[#EAF2F8] dark:bg-slate-800 p-6 rounded-2xl border-2 border-[#176B68] text-[#17324D] dark:text-white text-center space-y-2 animate-fade-in">
              <Icon name="celebration" className="text-4xl text-[#176B68] block" />
              <h3 className="text-xl font-bold">
                {isEn ? 'Well done! You went through all 5 questions.' : 'Sehr gut! Alle 5 Prüfpunkte beachtet.'}
              </h3>
              <p className="text-sm text-[#202B36] dark:text-slate-200 max-w-lg mx-auto">
                {isEn
                  ? 'If even one answer made you doubt: do not click. Check with the sender on a phone number you already know.'
                  : 'Hat auch nur eine Antwort Zweifel geweckt: Klicken Sie nicht. Fragen Sie beim Absender unter einer Nummer nach, die Sie schon kennen.'}
              </p>
            </div>
          )}
        </div>

        {/* 4 CORE SECURITY PILLARS */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#17324D] dark:text-white mb-6">
            {isEn ? 'Four rules that protect you' : 'Vier Regeln, die Sie schützen'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1 */}
            <div className="bg-[#FFFFFF] dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 hover:border-[#176B68] transition-colors space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] flex items-center justify-center border border-[#E5E9ED] dark:border-slate-700">
                <Icon name="phishing" className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#17324D] dark:text-white">
                {isEn ? '1. Fake emails and messages' : '1. Gefälschte E-Mails und Nachrichten'}
              </h3>
              <p className="text-sm text-[#202B36] dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'Never give your password, PIN or a code because an email or message asks for it. Real companies never ask for them this way.'
                  : 'Geben Sie nie Passwort, PIN oder einen Code heraus, weil eine E-Mail oder Nachricht danach fragt. Echte Firmen fragen nie auf diesem Weg danach.'}
              </p>
              <a {...linkTo({ page: 'tutorial-detail', tutorialId: 'phishing-erkennen' }, () => { onSelectTutorial('phishing-erkennen'); onNavigate('tutorial-detail'); })} className="link-card text-base font-bold text-[#17324D] underline inline-flex items-center gap-1 min-h-[44px]">
                <span>{isEn ? 'Open the lesson on fake emails' : 'Lektion zu falschen E-Mails öffnen'}</span>
                <Icon name="arrow_forward" className="text-base" />
              </a>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#FFFFFF] dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 hover:border-[#176B68] transition-colors space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] flex items-center justify-center border border-[#E5E9ED] dark:border-slate-700">
                <Icon name="key" className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#17324D] dark:text-white">
                {isEn ? '2. Strong passwords you can remember' : '2. Sichere Passwörter, die Sie sich merken'}
              </h3>
              <p className="text-sm text-[#202B36] dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'Turn a sentence you like into a long password. It is easy for you to remember and very hard for others to guess. Use a different one for each account.'
                  : 'Machen Sie aus einem Satz, den Sie mögen, ein langes Passwort. Sie können es sich leicht merken, andere können es kaum erraten. Nehmen Sie für jedes Konto ein anderes.'}
              </p>
              <a {...linkTo({ page: 'tutorial-detail', tutorialId: 'passwoerter-erstellen' }, () => { onSelectTutorial('passwoerter-erstellen'); onNavigate('tutorial-detail'); })} className="link-card text-base font-bold text-[#17324D] underline inline-flex items-center gap-1 min-h-[44px]">
                <span>{isEn ? 'Open the password lesson' : 'Lektion zu Passwörtern öffnen'}</span>
                <Icon name="arrow_forward" className="text-base" />
              </a>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#FFFFFF] dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 hover:border-[#176B68] transition-colors space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] flex items-center justify-center border border-[#E5E9ED] dark:border-slate-700">
                <Icon name="shield" className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#17324D] dark:text-white">
                {isEn ? '3. A second lock for your accounts' : '3. Ein zweites Schloss für Ihre Konten'}
              </h3>
              <p className="text-sm text-[#202B36] dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'With two-step login, a password alone is not enough. Even if someone steals it, they also need the code or approval on your phone.'
                  : 'Mit der Anmeldung in zwei Schritten reicht ein Passwort allein nicht. Selbst wenn jemand es stiehlt, braucht er noch den Code oder die Freigabe auf Ihrem Handy.'}
              </p>
              <a {...linkTo({ page: 'tutorial-detail', tutorialId: 'safety-2fa' }, () => { onSelectTutorial('safety-2fa'); onNavigate('tutorial-detail'); })} className="link-card text-base font-bold text-[#17324D] underline inline-flex items-center gap-1 min-h-[44px]">
                <span>{isEn ? 'Open the two-step login lesson' : 'Lektion zur Anmeldung in zwei Schritten öffnen'}</span>
                <Icon name="arrow_forward" className="text-base" />
              </a>
            </div>

            {/* Pillar 4 */}
            <div className="bg-[#FFFFFF] dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 hover:border-[#176B68] transition-colors space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] flex items-center justify-center border border-[#E5E9ED] dark:border-slate-700">
                <Icon name="shopping_bag" className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#17324D] dark:text-white">
                {isEn ? '4. Shop safely online' : '4. Sicher online einkaufen'}
              </h3>
              <p className="text-sm text-[#202B36] dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'Before you buy from a shop you do not know, look for its address and contact details. Prefer paying on invoice or another way with buyer protection.'
                  : 'Bevor Sie in einem unbekannten Shop kaufen, suchen Sie Adresse und Kontaktdaten. Zahlen Sie lieber auf Rechnung oder auf einem anderen Weg mit Käuferschutz.'}
              </p>
              <a {...linkTo({ page: 'tutorial-detail', tutorialId: 'fake-shops-entlarven' }, () => { onSelectTutorial('fake-shops-entlarven'); onNavigate('tutorial-detail'); })} className="link-card text-base font-bold text-[#17324D] underline inline-flex items-center gap-1 min-h-[44px]">
                <span>{isEn ? 'Open the lesson on fake shops' : 'Lektion zu Fake-Shops öffnen'}</span>
                <Icon name="arrow_forward" className="text-base" />
              </a>
            </div>
          </div>
        </div>

        {/* Emergency Assistance Banner */}
        <div className="bg-[#EAF2F8] dark:bg-slate-900 border-2 border-[#176B68] p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-[#17324D] dark:text-white">
              {isEn ? 'In an emergency: lost card or suspected fraud' : 'Im Ernstfall: Karte verloren oder Betrug vermutet'}
            </h3>
            <p className="text-sm text-[#202B36] dark:text-slate-300 max-w-xl">
              {isEn
                ? 'Did you give away bank details or lose your card? In Germany, call the free blocking hotline 116 116 straight away. It works day and night.'
                : 'Haben Sie versehentlich Bankdaten herausgegeben oder Ihre Karte verloren? Rufen Sie sofort den kostenlosen Sperr-Notruf 116 116 an. Er ist Tag und Nacht erreichbar.'}
            </p>
          </div>
          <button
            onClick={triggerSupport}
            className="px-6 py-3.5 rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-bold text-sm shrink-0 shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Icon name="smart_toy" className="text-teal-300" />
            <span>{isEn ? 'Help assistant & email' : 'Hilfe-Assistent & E-Mail'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
