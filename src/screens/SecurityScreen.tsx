import React, { useState } from 'react';
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
          <nav className="flex items-center gap-2 text-xs text-[#202B36] dark:text-slate-400 mb-2" aria-label="Breadcrumb">
            <button onClick={() => onNavigate('home')} className="hover:underline hover:text-[#176B68]">
              {isEn ? 'Home' : 'Startseite'}
            </button>
            <span>/</span>
            <span className="font-bold text-[#17324D] dark:text-white">
              {isEn ? 'Digital Safety' : 'Digitale Sicherheit'}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-teal-300 border border-[#E5E9ED] dark:border-slate-700 text-xs font-bold mb-2">
                <Icon name="verified_user" className="text-base text-[#176B68]" />
                <span>{isEn ? 'Safety Guide Without Fear' : 'Sicherheitsleitfaden ohne Angst'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] dark:text-white">
                {isEn ? 'Navigate the Internet Safely & Confidently' : 'Sicher und gelassen im Internet bewegen'}
              </h1>
              <p className="text-lg text-[#202B36] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
                {isEn
                  ? 'With a few simple rules, you can effectively protect yourself from scams, malware, and identity theft. You don\'t have to be a tech guru – calm judgment and attention are all it takes.'
                  : 'Mit wenigen, einfachen Grundregeln schützen Sie sich wirkungsvoll vor Betrug, Viren und Datenklau. Sie müssen kein Computerprofi sein – gesunder Menschenverstand und Ruhe reichen völlig aus.'}
              </p>
            </div>

            <button
              onClick={() => {
                onSelectTutorial('safety-phishing-examples');
                onNavigate('tutorial-detail');
              }}
              className="px-6 py-3.5 rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-bold text-base flex items-center gap-2 shadow-sm shrink-0 touch-target"
            >
              <span>{isEn ? 'Practise on 5 phishing emails' : 'An 5 Phishing-E-Mails üben'}</span>
              <Icon name="arrow_forward" className="text-xl" />
            </button>
          </div>
        </div>

        {/* All safety guides */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-[#17324D] dark:text-white">
            {isEn ? `All safety guides (${guides.length})` : `Alle Sicherheits-Anleitungen (${guides.length})`}
          </h2>
          <ul className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {guides.map((guide) => (
              <li key={guide.id}>
                <button
                  onClick={() => {
                    onSelectTutorial(guide.id);
                    onNavigate('tutorial-detail');
                  }}
                  className="w-full h-full text-left bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#667382] hover:border-[#176B68] overflow-hidden flex flex-col"
                >
                  <img src={guide.image} alt="" className="w-full h-20 sm:h-32 object-cover" />
                  <span className="p-3 font-bold text-base text-[#17324D] dark:text-white">{guide.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* INTERACTIVE 5-POINT CHECKLIST */}
        <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E9ED] dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#176B68] dark:text-teal-400">
                {isEn ? 'Interactive Checklist' : 'Interaktive Praxis-Hilfe'}
              </span>
              <h2 className="text-2xl font-extrabold text-[#17324D] dark:text-white mt-1">
                {isEn ? 'The 5-Point Checklist: Before You Click Any Link' : 'Die 5-Punkte-Checkliste: Bevor Sie auf einen Link klicken'}
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-[#EAF2F8] dark:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold text-[#17324D] dark:text-teal-300 border border-[#E5E9ED] dark:border-slate-700 shrink-0">
              <Icon name="checklist" className="text-[#176B68]" />
              <span>{checkedCount} {isEn ? `of ${totalChecks} checked` : `von ${totalChecks} geprüft`}</span>
            </div>
          </div>

          <p className="text-base text-[#202B36] dark:text-slate-300">
            {isEn
              ? 'Did you receive an unsolicited email, SMS, or message? Check off these 5 points in sequence:'
              : 'Haben Sie eine unaufgeforderte E-Mail, SMS oder WhatsApp-Nachricht erhalten? Haken Sie die folgenden Punkte nacheinander ab:'}
          </p>

          <div className="space-y-3">
            {checklist.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 select-none ${
                    isChecked
                      ? 'bg-[#EAF2F8] dark:bg-slate-800 border-[#176B68]'
                      : 'bg-[#FFFFFF] dark:bg-slate-900 border-[#E5E9ED] dark:border-slate-800 hover:border-[#176B68]'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked
                      ? 'bg-[#176B68] border-[#176B68] text-white'
                      : 'border-[#E5E9ED] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-850'
                  }`}>
                    {isChecked && <Icon name="check" className="text-xl" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#17324D] dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#202B36] dark:text-slate-300 mt-1 leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {allChecked && (
            <div className="bg-[#EAF2F8] dark:bg-slate-800 p-6 rounded-2xl border-2 border-[#176B68] text-[#17324D] dark:text-white text-center space-y-2 animate-fade-in">
              <Icon name="celebration" className="text-4xl text-[#176B68] block" />
              <h3 className="text-xl font-bold">
                {isEn ? 'Great job! You reviewed all 5 checkpoints.' : 'Sehr gut! Alle 5 Prüfpunkte beachtet.'}
              </h3>
              <p className="text-sm text-[#202B36] dark:text-slate-200 max-w-lg mx-auto">
                {isEn
                  ? 'You carefully examined the message. If even one item raised suspicion: do not click, and verify directly through a known phone number.'
                  : 'Sie haben die Nachricht gründlich analysiert. Wenn auch nur ein Punkt Zweifel geweckt hat: Klicken Sie nicht und rufen Sie den Absender im Zweifel an.'}
              </p>
            </div>
          )}
        </div>

        {/* 4 CORE SECURITY PILLARS */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#17324D] dark:text-white mb-6">
            {isEn ? 'The 4 Golden Pillars of Digital Safety' : 'Die 4 goldenen Säulen für Ihren Schutz'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1 */}
            <div className="bg-[#FFFFFF] dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 hover:border-[#176B68] transition-colors space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] flex items-center justify-center border border-[#E5E9ED] dark:border-slate-700">
                <Icon name="phishing" className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#17324D] dark:text-white">
                {isEn ? '1. Phishing & Counterfeit Emails' : '1. Phishing & gefälschte E-Mails'}
              </h3>
              <p className="text-sm text-[#202B36] dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'Never disclose passwords or PINs upon an email request. Legitimate companies never ask for secret credentials via email.'
                  : 'Niemals Passwörter oder TANs nach Aufforderung per E-Mail herausgeben. Seriöse Firmen fragen Sie niemals nach geheimen Zugangsdaten.'}
              </p>
              <button
                onClick={() => {
                  onSelectTutorial('phishing-erkennen');
                  onNavigate('tutorial-detail');
                }}
                className="text-sm font-bold text-[#176B68] hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>{isEn ? 'Open Phishing Guide' : 'Phishing-Anleitung öffnen'}</span>
                <Icon name="arrow_forward" className="text-base" />
              </button>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#FFFFFF] dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 hover:border-[#176B68] transition-colors space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] flex items-center justify-center border border-[#E5E9ED] dark:border-slate-700">
                <Icon name="key" className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#17324D] dark:text-white">
                {isEn ? '2. Strong Passwords Without Notes' : '2. Sichere Kennwörter ohne Zettel'}
              </h3>
              <p className="text-sm text-[#202B36] dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'Use the sentence technique to generate passwords with 12+ characters in seconds that are simple for you to recall but impossible for computers to guess.'
                  : 'Mit der Merksatz-Methode bauen Sie in Sekunden ein Kennwort aus 12 oder mehr Zeichen, das kein Computer erraten kann.'}
              </p>
              <button
                onClick={() => {
                  onSelectTutorial('passwoerter-erstellen');
                  onNavigate('tutorial-detail');
                }}
                className="text-sm font-bold text-[#176B68] hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>{isEn ? 'Open Password Guide' : 'Passwort-Anleitung öffnen'}</span>
                <Icon name="arrow_forward" className="text-base" />
              </button>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#FFFFFF] dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 hover:border-[#176B68] transition-colors space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] flex items-center justify-center border border-[#E5E9ED] dark:border-slate-700">
                <Icon name="shield" className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#17324D] dark:text-white">
                {isEn ? '3. Two-Factor Authentication (2FA)' : '3. Zwei-Faktor-Authentifizierung (2FA)'}
              </h3>
              <p className="text-sm text-[#202B36] dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'The second lock: Even if somebody manages to steal your password, they cannot access your account without your personal smartphone approval.'
                  : 'Das zweite Schutzschloss: Selbst wenn jemand Ihr Passwort stehlen sollte, kommt er ohne den Code auf Ihrem Smartphone nicht an Ihre Daten.'}
              </p>
              <button
                onClick={() => {
                  onSelectTutorial('online-banking-grundlagen');
                  onNavigate('tutorial-detail');
                }}
                className="text-sm font-bold text-[#176B68] hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>{isEn ? 'View Banking Protection' : 'Banking-Schutz ansehen'}</span>
                <Icon name="arrow_forward" className="text-base" />
              </button>
            </div>

            {/* Pillar 4 */}
            <div className="bg-[#FFFFFF] dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 hover:border-[#176B68] transition-colors space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] flex items-center justify-center border border-[#E5E9ED] dark:border-slate-700">
                <Icon name="shopping_bag" className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#17324D] dark:text-white">
                {isEn ? '4. Spotting Fake Online Stores' : '4. Fake-Shops beim Einkaufen erkennen'}
              </h3>
              <p className="text-sm text-[#202B36] dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'Always review the legal imprint and contact information before buying, and ensure trusted buyer-protected payment methods are offered.'
                  : 'Prüfen Sie vor dem Bezahlen immer das Impressum und achten Sie darauf, ob sichere Bezahlmethoden wie Lastschrift oder Rechnung angeboten werden.'}
              </p>
              <button
                onClick={() => {
                  onSelectTutorial('fake-shops-entlarven');
                  onNavigate('tutorial-detail');
                }}
                className="text-sm font-bold text-[#176B68] hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>{isEn ? 'Open Fake Store Guide' : 'Fake-Shop-Anleitung öffnen'}</span>
                <Icon name="arrow_forward" className="text-base" />
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Assistance Banner */}
        <div className="bg-[#EAF2F8] dark:bg-slate-900 border-2 border-[#176B68] p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-[#17324D] dark:text-white">
              {isEn ? 'Emergency Help: Card Loss or Fraud Suspicion' : 'Im Ernstfall: Schnelle Hilfe bei Kartenverlust oder Verdacht'}
            </h3>
            <p className="text-sm text-[#202B36] dark:text-slate-300 max-w-xl">
              {isEn
                ? 'Did you accidentally enter confidential information? Call the toll-free emergency card blocking hotline immediately.'
                : 'Haben Sie versehentlich Daten herausgegeben? Rufen Sie den bundesweiten Sperr-Notruf unter 116 116 an.'}
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
