import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { PageId, Language } from '../types';
import { CONTRAST_DOCUMENTATION_EN, CONTRAST_DOCUMENTATION_DE } from '../data/content';

interface AccessibilityPrivacyScreenProps {
  initialTab?: 'barrierefreiheit' | 'datenschutz';
  onNavigate: (page: PageId) => void;
  lang?: Language;
}

export const AccessibilityPrivacyScreen: React.FC<AccessibilityPrivacyScreenProps> = ({
  initialTab = 'barrierefreiheit',
  onNavigate,
  lang = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'barrierefreiheit' | 'datenschutz'>(initialTab);

  const isEn = lang === 'en';
  const contrastData = isEn ? CONTRAST_DOCUMENTATION_EN : CONTRAST_DOCUMENTATION_DE;

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb & Title */}
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#202B36] dark:text-slate-400 mb-2">
            <button onClick={() => onNavigate('home')} className="hover:underline hover:text-[#176B68]">
              {isEn ? 'Home' : 'Startseite'}
            </button>
            <span>/</span>
            <span className="font-bold text-[#17324D] dark:text-white">
              {activeTab === 'barrierefreiheit'
                ? (isEn ? 'Accessibility Statement' : 'Erklärung zur Barrierefreiheit')
                : (isEn ? 'Privacy Policy & Imprint' : 'Datenschutz & Impressum')}
            </span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] dark:text-white">
            {isEn ? 'Legal Transparency & Accessibility' : 'Rechtliches & Zugänglichkeit'}
          </h1>
          <p className="text-lg text-[#202B36] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {isEn
              ? 'Transparency, privacy protection, and barrier-free access for all users are foundational to Digital Boomer.'
              : 'Transparenz, Datenschutz und uneingeschränkte Nutzbarkeit für alle Menschen stehen im Zentrum von Digital Boomer.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E5E9ED] dark:border-slate-800 gap-4" role="tablist">
          <button
            onClick={() => setActiveTab('barrierefreiheit')}
            className={`pb-4 px-2 text-base font-bold transition-colors border-b-2 ${
              activeTab === 'barrierefreiheit'
                ? 'border-[#176B68] text-[#17324D] dark:text-white'
                : 'border-transparent text-[#202B36] dark:text-slate-400 hover:text-[#17324D]'
            }`}
            role="tab"
            aria-selected={activeTab === 'barrierefreiheit'}
          >
            {isEn ? '♿ Accessibility Statement' : '♿ Erklärung zur Barrierefreiheit'}
          </button>
          <button
            onClick={() => setActiveTab('datenschutz')}
            className={`pb-4 px-2 text-base font-bold transition-colors border-b-2 ${
              activeTab === 'datenschutz'
                ? 'border-[#176B68] text-[#17324D] dark:text-white'
                : 'border-transparent text-[#202B36] dark:text-slate-400 hover:text-[#17324D]'
            }`}
            role="tab"
            aria-selected={activeTab === 'datenschutz'}
          >
            {isEn ? '🔒 Privacy Policy & Imprint' : '🔒 Datenschutz & Impressum'}
          </button>
        </div>

        {/* TAB 1: ACCESSIBILITY & CONTRAST REPORT */}
        {activeTab === 'barrierefreiheit' && (
          <div className="space-y-8 animate-fade-in">
            {/* Overview */}
            <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-2xl font-extrabold text-[#17324D] dark:text-white">
                {isEn ? 'Accessibility status: designed to support WCAG 2.2 AA' : 'Stand der Barrierefreiheit: auf WCAG 2.2 AA ausgerichtet'}
              </h2>
              <p className="text-[#202B36] dark:text-slate-300 leading-relaxed text-base">
                {isEn
                  ? 'This prototype is designed to support the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA. It has not been fully tested yet, so we do not claim that it conforms. Our accessibility report will follow.'
                  : 'Dieser Prototyp ist auf die Web Content Accessibility Guidelines (WCAG) 2.2 Stufe AA ausgerichtet. Er ist noch nicht vollständig geprüft, daher behaupten wir keine Konformität. Unser Bericht zur Barrierefreiheit folgt noch.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-[#EAF2F8] dark:bg-slate-800 border border-[#E5E9ED] dark:border-slate-700">
                  <Icon name="keyboard" className="text-2xl text-[#176B68] block mb-1" />
                  <strong className="block text-sm text-[#17324D] dark:text-white">
                    {isEn ? 'Keyboard Use (still being tested)' : 'Tastaturbedienung (wird noch geprüft)'}
                  </strong>
                  <span className="text-xs text-[#202B36] dark:text-slate-400">
                    {isEn ? 'Logical tab sequences & visible focus outlines' : 'Logische Tab-Reihenfolge & deutliche Fokusrahmen'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#EAF2F8] dark:bg-slate-800 border border-[#E5E9ED] dark:border-slate-700">
                  <Icon name="format_size" className="text-2xl text-[#176B68] block mb-1" />
                  <strong className="block text-sm text-[#17324D] dark:text-white">
                    {isEn ? '3-Stage Text Rescaling' : '3-Stufige Schriftgröße'}
                  </strong>
                  <span className="text-xs text-[#202B36] dark:text-slate-400">
                    {isEn ? 'Zoom up to 130% without clipping or breaking layout' : 'Vergrößerung bis zu 130% ohne Layout-Bruch'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#EAF2F8] dark:bg-slate-800 border border-[#E5E9ED] dark:border-slate-700">
                  <Icon name="palette" className="text-2xl text-[#176B68] block mb-1" />
                  <strong className="block text-sm text-[#17324D] dark:text-white">
                    {isEn ? 'Exact 7-Color Palette' : 'Exaktes 7-Farben-System'}
                  </strong>
                  <span className="text-xs text-[#202B36] dark:text-slate-400">
                    {isEn ? 'Colour contrast calculated for the design system' : 'Farbkontraste für das Design-System berechnet'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#EAF2F8] dark:bg-slate-800 border border-[#E5E9ED] dark:border-slate-700">
                  <Icon name="volume_up" className="text-2xl text-[#176B68] block mb-1" />
                  <strong className="block text-sm text-[#17324D] dark:text-white">
                    {isEn ? 'Built-in Text-to-Speech' : 'Integrierte Sprachausgabe'}
                  </strong>
                  <span className="text-xs text-[#202B36] dark:text-slate-400">
                    {isEn ? 'Listen to tutorials with natural speech' : 'Anleitungen per Mausklick vorlesen lassen'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contrast Documentation Table */}
            <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-[#17324D] dark:text-white">
                  {isEn ? 'Calculated Color Contrasts in Design System' : 'Berechnete Farbkontraste im Design-System'}
                </h3>
                <p className="text-sm text-[#202B36] dark:text-slate-400 mt-1">
                  {isEn
                    ? 'These values were calculated with the WCAG contrast formula. They confirm the colour choices, not the finished website.'
                    : 'Diese Werte wurden mit der WCAG-Kontrastformel berechnet. Sie bestätigen die Farbwahl, nicht die fertige Website.'}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#E5E9ED] dark:border-slate-800 bg-[#EAF2F8] dark:bg-slate-800">
                      <th className="py-3 px-4 font-bold text-[#17324D] dark:text-white">{isEn ? 'UI Element' : 'UI-Element'}</th>
                      <th className="py-3 px-4 font-bold text-[#17324D] dark:text-white">{isEn ? 'Foreground (Text)' : 'Vordergrund (Schrift)'}</th>
                      <th className="py-3 px-4 font-bold text-[#17324D] dark:text-white">{isEn ? 'Background' : 'Hintergrund'}</th>
                      <th className="py-3 px-4 font-bold text-[#17324D] dark:text-white">{isEn ? 'Measured Ratio' : 'Gemessenes Verhältnis'}</th>
                      <th className="py-3 px-4 font-bold text-[#17324D] dark:text-white">{isEn ? 'WCAG Status' : 'WCAG Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E9ED] dark:divide-slate-800">
                    {contrastData.map((item, index) => (
                      <tr key={index} className="hover:bg-[#EAF2F8]/30 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-4 font-semibold text-[#17324D] dark:text-white">
                          {item.element}
                        </td>
                        <td className="py-3 px-4 text-[#202B36] dark:text-slate-300">
                          <span className="inline-block w-3.5 h-3.5 rounded-full mr-2 border border-[#E5E9ED] align-middle shadow-xs" style={{ backgroundColor: item.fgHex }}></span>
                          <span className="font-mono text-xs">{item.fgHex}</span> ({item.fgColor})
                        </td>
                        <td className="py-3 px-4 text-[#202B36] dark:text-slate-300">
                          <span className="inline-block w-3.5 h-3.5 rounded-full mr-2 border border-[#E5E9ED] align-middle shadow-xs" style={{ backgroundColor: item.bgHex }}></span>
                          <span className="font-mono text-xs">{item.bgHex}</span> ({item.bgColor})
                        </td>
                        <td className="py-3 px-4 font-bold text-[#17324D] dark:text-white">
                          {item.ratio}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] dark:text-teal-300 font-bold text-xs border border-[#176B68]">
                            {isEn ? (item.status.includes('AAA') ? 'Pass (AAA)' : 'Pass (AA)') : item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRIVACY & IMPRESSUM */}
        {activeTab === 'datenschutz' && (
          <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm space-y-6 animate-fade-in text-[#202B36] dark:text-slate-200 leading-relaxed text-base">
            <div>
              <h2 className="text-2xl font-extrabold text-[#17324D] dark:text-white">
                {isEn ? 'Plain-Language Privacy Policy' : 'Datenschutzerklärung in einfacher Sprache'}
              </h2>
              <p className="text-sm text-[#202B36] dark:text-slate-400 mt-1">
                {isEn ? 'We respect your privacy. No tracking cookies, no selling of data.' : 'Wir respektieren Ihre Privatsphäre. Keine Tracking-Cookies, keine Weitergabe an Dritte.'}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#17324D] dark:text-white">
                {isEn ? '1. What data is collected?' : '1. Welche Daten werden gespeichert?'}
              </h3>
              <p>
                {isEn
                  ? 'As a guest, your learning progress is stored only in your own browser, and nothing is sent to a server. If you create an account (optional), we store your name, your email address, your password in encrypted form, and your progress, so that you can continue on any device. This data is stored with our provider Supabase on servers in the EU. You can ask us to delete your account at any time.'
                  : 'Als Gast wird Ihr Lernfortschritt nur in Ihrem eigenen Browser gespeichert, und es wird nichts an einen Server gesendet. Wenn Sie ein Konto erstellen (freiwillig), speichern wir Ihren Namen, Ihre E-Mail-Adresse, Ihr Passwort in verschlüsselter Form und Ihren Fortschritt, damit Sie auf jedem Gerät weitermachen können. Diese Daten liegen bei unserem Anbieter Supabase auf Servern in der EU. Sie können jederzeit verlangen, dass wir Ihr Konto löschen.'}
              </p>
              <p>
                {isEn
                  ? 'If you write to us with the form on the Help page, we receive your name, your email address, the topic and your message. We use them only to answer you. The message is stored with our provider Supabase on servers in the EU, and only our team can read it. A copy is sent to our team email address (Gmail) through our email provider Brevo, and we answer from there. We delete messages when they are answered and no longer needed.'
                  : 'Wenn Sie uns über das Formular auf der Hilfe-Seite schreiben, erhalten wir Ihren Namen, Ihre E-Mail-Adresse, das Thema und Ihre Nachricht. Wir nutzen sie nur, um Ihnen zu antworten. Die Nachricht wird bei unserem Anbieter Supabase auf Servern in der EU gespeichert, und nur unser Team kann sie lesen. Eine Kopie geht über unseren E-Mail-Anbieter Brevo an die E-Mail-Adresse unseres Teams (Gmail), und wir antworten von dort. Wir löschen Nachrichten, wenn sie beantwortet sind und nicht mehr gebraucht werden.'}
              </p>

              <h3 className="text-lg font-bold text-[#17324D] dark:text-white">
                {isEn ? '2. No advertising, no data sales' : '2. Keine Werbung, kein Verkauf Ihrer Daten'}
              </h3>
              <p>
                {isEn
                  ? 'Digital Boomer is an ad-free educational initiative. Your personal data is never shared with, sold to, or harvested by marketing partners or social networks.'
                  : 'Digital Boomer ist ein werbefreies Hochschulprojekt. Ihre Daten werden niemals an Werbepartner, soziale Netzwerke oder sonstige Firmen weitergegeben oder verkauft.'}
              </p>

              <h3 className="text-lg font-bold text-[#17324D] dark:text-white">
                {isEn ? '3. Project Responsibility & Legal Notice' : '3. Impressum & Projektverantwortung'}
              </h3>
              <div className="bg-[#EAF2F8] dark:bg-slate-800 p-5 rounded-2xl border border-[#E5E9ED] dark:border-slate-700 text-sm text-[#202B36] dark:text-slate-300">
                <p className="font-bold text-[#17324D] dark:text-white">Digital Boomer Academic Project</p>
                <p>{isEn ? 'Course: BIS5152 Human-Centered AI Interface Design' : 'Lehrveranstaltung: BIS5152 Human-Centered AI Interface Design'}</p>
                <p>{isEn ? 'Development: student project team' : 'Entwicklung: studentisches Projektteam'}</p>
                <p>{isEn ? 'This is a student prototype.' : 'Dies ist ein studentischer Prototyp.'}</p>
                <p>
                  {isEn ? 'Contact, also for questions about your data or to delete your account: ' : 'Kontakt, auch für Fragen zu Ihren Daten oder zum Löschen Ihres Kontos: '}
                  <a href="mailto:digitalboomer.team@gmail.com" className="font-bold text-[#17324D] dark:text-white underline">digitalboomer.team@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
