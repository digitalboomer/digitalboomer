import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { Language } from '../types';
import { useDialogFocus } from '../utils/useDialogFocus';
import { TEAM_EMAIL, composeLinks } from '../utils/contact';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  steps?: string[];
  tip?: string;
  timestamp: string;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  lang = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'email'>('ai');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const dialogRef = useDialogFocus<HTMLDivElement>(isOpen, onClose);

  const isEn = lang === 'en';
  const supportEmail = TEAM_EMAIL;
  const compose = composeLinks(isEn);

  const initialMessages: ChatMessage[] = isEn
    ? [
        {
          id: 'welcome',
          sender: 'ai',
          text: 'Hello! I am the help assistant. I have pre-written answers to common questions about WhatsApp, safety, passwords and online banking. I am not a real AI yet.',
          tip: 'Tip: The questions below work best. You can also type your own.',
          timestamp: 'Just now',
        },
      ]
    : [
        {
          id: 'welcome',
          sender: 'ai',
          text: 'Guten Tag! Ich bin der Hilfe-Assistent. Ich habe vorgefertigte Antworten auf häufige Fragen zu WhatsApp, Sicherheit, Passwörtern und Online-Banking. Ich bin noch keine echte KI.',
          tip: 'Tipp: Die Fragen unten funktionieren am besten. Sie können auch selbst etwas eintippen.',
          timestamp: 'Gerade eben',
        },
      ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Suggested questions tailored for beginners
  const suggestedQuestions = isEn
    ? [
        {
          label: 'How to send a photo on WhatsApp?',
          response: {
            text: 'Sending a photo on WhatsApp is easy and safe. Here are the 4 simple steps:',
            steps: [
              '1. Open WhatsApp and tap on the chat of the person you want to send the photo to.',
              '2. Tap on the small paperclip symbol (or plus sign +) at the bottom next to the text field.',
              '3. Select "Gallery" or "Photos" and tap on the picture you would like to share.',
              '4. Finally, tap the green circle with the small paper plane at the bottom right to send it.',
            ],
            tip: 'You can practice this anytime with a family member!',
          },
        },
        {
          label: 'How do I spot a phishing email?',
          response: {
            text: 'Phishing emails are fake messages designed to steal your passwords. You can easily spot them with these 3 rules:',
            steps: [
              '1. Look at the sender address: Real banks never send emails from strange addresses ending in random letters.',
              '2. Check for false urgency: Scammers threaten that "your account will be locked in 24 hours". Real banks do not do this by email.',
              '3. Impersonal greeting: "Dear customer" instead of your actual name is a common warning sign.',
            ],
            tip: 'Golden rule: Never click on links in unexpected emails. Always open your bank\'s website yourself.',
          },
        },
        {
          label: 'How do I create a strong password?',
          response: {
            text: 'A strong password doesn\'t need to be difficult to remember if you use a "sentence password":',
            steps: [
              '1. Think of a sentence you easily remember, for example: "Every morning I drink 1 hot cup of coffee!"',
              '2. Take the first letter of each word plus the numbers and punctuation: "EmId1hcoc!"',
              '3. This password is super secure, hard for computers to guess, but very easy for you to recall.',
            ],
            tip: 'Write your passwords in a personal notebook kept safely at home.',
          },
        },
        {
          label: 'Is online banking safe on my phone?',
          response: {
            text: 'Yes, modern online banking is very safe if you follow these basic habits:',
            steps: [
              '1. Only use the official banking app from your bank (downloaded directly from Google Play or Apple App Store).',
              '2. Never share your approval codes (pushTAN or SMS-TAN) with anyone, even if someone claiming to be bank staff calls you.',
              '3. Always log out when you finish checking your balance.',
            ],
            tip: 'Banks will never ask for your PIN or TAN over the phone or by email.',
          },
        },
      ]
    : [
        {
          label: 'Wie verschicke ich ein Foto auf WhatsApp?',
          response: {
            text: 'Ein Foto über WhatsApp zu verschicken ist kinderleicht und sicher. So geht es in 4 einfachen Schritten:',
            steps: [
              '1. Öffnen Sie WhatsApp und tippen Sie auf den Chat der Person, der Sie das Bild schicken möchten.',
              '2. Tippen Sie unten neben dem Schreibfeld auf die kleine Büroklammer (oder das Pluszeichen +).',
              '3. Wählen Sie „Galerie“ oder „Fotos“ aus und tippen Sie das gewünschte Foto an.',
              '4. Tippen Sie unten rechts auf den grünen Kreis mit dem kleinen Papierflieger, um das Bild abzusenden.',
            ],
            tip: 'Sie können das ganz in Ruhe mit einem Familienmitglied ausprobieren!',
          },
        },
        {
          label: 'Woran erkenne ich eine Phishing-E-Mail?',
          response: {
            text: 'Phishing-E-Mails sind gefälschte Nachrichten von Betrügern. Mit diesen 3 Merkmalen erkennen Sie die Falle sofort:',
            steps: [
              '1. Absender prüfen: Echte Banken versenden niemals von dubiosen Adressen mit Buchstabensalat.',
              '2. Zeitdruck: Betrüger drohen oft mit „Ihr Konto wird in 24 Stunden gesperrt!“. Echte Banken handeln nie so per E-Mail.',
              '3. Unpersönliche Anrede: „Sehr geehrter Kunde“ statt Ihres echten Namens ist fast immer ein Alarmzeichen.',
            ],
            tip: 'Goldene Regel: Niemals auf Links in unerwarteten E-Mails klicken.',
          },
        },
        {
          label: 'Wie erstelle ich ein sicheres Passwort?',
          response: {
            text: 'Ein sicheres Passwort muss nicht kompliziert sein, wenn Sie die „Satz-Methode“ nutzen:',
            steps: [
              '1. Denken Sie sich einen einfachen Satz aus: „Jeden Morgen trinke ich 1 heiße Tasse Kaffee!“',
              '2. Nehmen Sie von jedem Wort den ersten Buchstaben plus Zahlen und Zeichen: „JMti1hTK!“',
              '3. Dieses Passwort ist extrem sicher gegen Knack-Programme, für Sie aber leicht zu merken.',
            ],
            tip: 'Notieren Sie Passwörter gerne in einem handschriftlichen Notizbuch zu Hause.',
          },
        },
        {
          label: 'Wie sicher ist Online-Banking am Smartphone?',
          response: {
            text: 'Online-Banking am Smartphone ist bei richtiger Anwendung sehr sicher. Beachten Sie diese Grundregeln:',
            steps: [
              '1. Nutzen Sie ausschließlich die offizielle Banking-App Ihrer Hausbank aus dem App Store.',
              '2. Geben Sie niemals TAN-Freigabecodes an fremde Personen weiter – auch nicht, wenn sich jemand als Bankmitarbeiter ausgibt.',
              '3. Melden Sie sich nach jeder Überweisung ordnungsgemäß ab.',
            ],
            tip: 'Ihre Bank wird Sie niemals per E-Mail nach Ihrer Geheimzahl fragen.',
          },
        },
      ];

  // Show a new answer from its beginning, not its end
  useEffect(() => {
    if (messages.length > 1) lastMessageRef.current?.scrollIntoView({ block: 'start' });
  }, [messages]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const handleSendMessage = (textToSend?: string) => {
    const userQuery = textToSend || inputMessage;
    if (!userQuery.trim()) return;

    const newMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userQuery,
      timestamp: isEn ? 'Just now' : 'Gerade eben',
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputMessage('');

    // Scripted: the answer is chosen by matching words in the question, not written by an AI.
    const match = suggestedQuestions.find((sq) =>
      userQuery.toLowerCase().includes(sq.label.toLowerCase().slice(0, 15))
    );

    let reply: ChatMessage;

    if (match) {
      reply = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: match.response.text,
        steps: match.response.steps,
        tip: match.response.tip,
        timestamp: isEn ? 'Just now' : 'Gerade eben',
      };
    } else {
      const queryLower = userQuery.toLowerCase();
      if (queryLower.includes('whatsapp') || queryLower.includes('nachricht') || queryLower.includes('message')) {
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: isEn
            ? 'Here is how to comfortably use WhatsApp step by step:'
            : 'Hier ist die Schritt-für-Schritt Anleitung für Ihre WhatsApp-Frage:',
          steps: isEn
            ? [
                '1. Open the WhatsApp app on your home screen.',
                '2. Tap the chat with your family member or friend.',
                '3. Tap the text box to type, or tap the microphone icon once to send a spoken voice message.',
                '4. Take all the time you need. Messages can be deleted or edited anytime.',
              ]
            : [
                '1. Öffnen Sie WhatsApp auf Ihrem Startbildschirm.',
                '2. Tippen Sie auf den Kontakt Ihrer Wahl.',
                '3. Tippen Sie in das Eingabefeld zum Schreiben oder auf das Mikrofon für eine Sprachnachricht.',
                '4. Nehmen Sie sich Zeit – Sie können Nachrichten jederzeit nachträglich bearbeiten oder löschen.',
              ],
          tip: isEn ? 'Try our interactive WhatsApp tutorial for hands-on practice!' : 'Schauen Sie gerne auch in unsere interaktive WhatsApp-Anleitung hinein!',
          timestamp: isEn ? 'Just now' : 'Gerade eben',
        };
      } else if (queryLower.includes('phishing') || queryLower.includes('betrug') || queryLower.includes('scam') || queryLower.includes('sicher')) {
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: isEn
            ? 'Safety is our top priority. Here is our advice:'
            : 'Sicherheit steht an erster Stelle. Das ist mein Rat für Sie:',
          steps: isEn
            ? [
                '1. Do not click on any suspicious links or buttons.',
                '2. Never provide credit card numbers or passwords in response to an email.',
                '3. When unsure, ask a trusted person for help.',
              ]
            : [
                '1. Klicken Sie nicht auf verdächtige Verlinkungen oder Schaltflächen.',
                '2. Geben Sie niemals Bankdaten oder Passwörter als Antwort auf eine E-Mail preis.',
                '3. Im Zweifel fragen Sie eine Vertrauensperson.',
              ],
          tip: isEn ? 'You can also inspect our interactive Phishing Simulator on this site.' : 'Probieren Sie gerne auch unseren interaktiven Phishing-Detektor auf dieser Plattform aus.',
          timestamp: isEn ? 'Just now' : 'Gerade eben',
        };
      } else {
        // Honest fallback: no matching answer exists, so the assistant says so.
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: isEn
            ? 'I only have pre-written answers, and I do not have one for this question. Please try one of the questions below, or ask a person you trust.'
            : 'Ich habe nur vorgefertigte Antworten und zu dieser Frage leider keine. Probieren Sie bitte eine der Fragen unten, oder fragen Sie eine Vertrauensperson.',
          tip: isEn
            ? 'Remember: You cannot break your device by tapping a menu option!'
            : 'Denken Sie daran: Sie können Ihr Gerät durch Ausprobieren nicht kaputt machen!',
          timestamp: isEn ? 'Just now' : 'Gerade eben',
        };
      }
    }

    setMessages((prev) => [...prev, reply]);
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-3xl h-[92vh] bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-[#E5E9ED] dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header: one slim line, so the answers get the room */}
        <div className="px-4 py-2 bg-[#17324D] text-white flex items-center justify-between gap-3 shrink-0">
          <h2 id="support-modal-title" className="text-xl font-bold text-white min-w-0">
            {isEn ? 'Help' : 'Hilfe'}
          </h2>
          <button onClick={onClose} className="inline-flex items-center gap-2 px-3 rounded-xl text-white font-bold text-base hover:bg-white/15">
            <Icon name="close" className="text-2xl" />
            {isEn ? 'Close' : 'Schließen'}
          </button>
        </div>

        {/* Choose between pre-written answers and email */}
        <div className="flex border-b border-[#E5E9ED] dark:border-slate-800 bg-[#F7F8F5] dark:bg-slate-950 p-1.5 gap-2 shrink-0" role="tablist">
          {([
            ['ai', 'smart_toy', isEn ? 'Help assistant' : 'Hilfe-Assistent'],
            ['email', 'mail', isEn ? 'Email' : 'E-Mail'],
          ] as const).map(([tab, icon, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
              className={`flex-1 px-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 ${
                activeTab === tab ? 'bg-[#17324D] text-white' : 'bg-white dark:bg-slate-900 text-[#17324D] hover:bg-[#EAF2F8] border-2 border-[#667382]'
              }`}
            >
              <Icon name={icon} className="text-xl" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab 1: AI Support Chat Interface */}
        {activeTab === 'ai' && (
          <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-slate-900">
            <p className="px-4 py-1 bg-[#EAF2F8] dark:bg-slate-800 text-sm font-bold text-[#17324D] shrink-0">
              {isEn ? 'Help assistant (pre-written answers). Not real AI yet.' : 'Hilfe-Assistent (vorgefertigte Antworten). Noch keine echte KI.'}
            </p>

            {/* Chat Messages Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3">
              {messages.map((msg, index) => (
                <div
                  ref={index === messages.length - 1 ? lastMessageRef : undefined}
                  key={msg.id}
                  className={`flex flex-col scroll-mt-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-start gap-2.5 max-w-full sm:max-w-[92%]">
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-[#176B68] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <Icon name="smart_toy" className="text-lg" />
                      </div>
                    )}
                    <div
                      className={`p-4 rounded-2xl text-sm sm:text-base leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#17324D] text-white rounded-br-none'
                          : 'bg-[#F7F8F5] dark:bg-slate-800 text-[#202B36] dark:text-slate-100 border border-[#E5E9ED] dark:border-slate-700 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="font-normal">{msg.text}</p>

                      {msg.steps && (
                        <div className="mt-3 space-y-2 pt-2 border-t border-[#E5E9ED] dark:border-slate-700">
                          {msg.steps.map((st, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="font-medium text-[#17324D] dark:text-teal-300">
                                {st}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.tip && (
                        <div className="mt-3 p-2.5 rounded-xl bg-[#E3F1F0] dark:bg-emerald-950/40 text-[#202B36] dark:text-emerald-200 text-sm flex items-center gap-2">
                          <Icon name="lightbulb" className="text-base shrink-0" />
                          <span>{msg.tip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
              ))}

              {/* Suggested questions scroll with the answers, so they never squeeze them */}
              <div className="pt-3 border-t border-[#E5E9ED] dark:border-slate-800">
              <span className="text-base font-bold text-[#202B36] block mb-2">
                {messages.length > 1 ? (isEn ? 'Other common questions:' : 'Weitere häufige Fragen:') : (isEn ? 'Common questions:' : 'Häufige Fragen:')}
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((sq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sq.label)}
                    className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-sm text-[#17324D] border-2 border-[#667382] hover:bg-[#EAF2F8] text-left"
                  >
                    {sq.label}
                  </button>
                ))}
              </div>
            </div>
            </div>

            {/* Chat Input & Send Button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2 sm:p-3 bg-white dark:bg-slate-900 border-t-2 border-[#E5E9ED] dark:border-slate-800 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isEn
                    ? 'Type your question...'
                    : 'Geben Sie Ihre Frage ein...'
                }
                className="flex-1 min-w-0 px-3 py-2 rounded-xl border-2 border-[#667382] bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-sm sm:text-base focus:border-[#176B68] focus:bg-white focus:outline-none transition-colors"
                aria-label={isEn ? 'Question to the help assistant' : 'Frage an den Hilfe-Assistenten'}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-5 sm:px-6 py-3 rounded-xl bg-[#176B68] hover:bg-[#0f514e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-colors cursor-pointer shadow-sm touch-target"
                aria-label={isEn ? 'Send question' : 'Frage absenden'}
              >
                <span>{isEn ? 'Send' : 'Senden'}</span>
                <Icon name="send" className="text-lg" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Email Support Interface */}
        {activeTab === 'email' && (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5 bg-white dark:bg-slate-900">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#176B68] dark:text-teal-400">
                {isEn ? 'Personal Written Assistance' : 'Persönliche schriftliche Beratung'}
              </span>
              <h3 className="text-2xl font-black text-[#17324D] dark:text-white">
                {isEn ? 'Contact the Digital Boomer Team by Email' : 'Schreiben Sie dem Digital Boomer Team'}
              </h3>
              <p className="text-sm sm:text-base text-[#202B36] dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'This is a student project. The team reads every email and answers as soon as it can, usually within a few days.'
                  : 'Dies ist ein studentisches Projekt. Das Team liest jede E-Mail und antwortet so bald wie möglich, meist innerhalb weniger Tage.'}
              </p>
            </div>

            {/* Email Address Highlight Card */}
            <div className="bg-[#EAF2F8] dark:bg-slate-800/90 rounded-2xl p-5 border-2 border-[#176B68]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
                <div className="w-12 h-12 rounded-xl bg-[#176B68] text-white flex items-center justify-center shrink-0">
                  <Icon name="mark_email_read" className="text-2xl" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-extrabold text-[#176B68] dark:text-teal-400 block">
                    {isEn ? 'Our email address:' : 'Unsere E-Mail-Adresse:'}
                  </span>
                  <a
                    href={compose.program}
                    className="text-lg sm:text-xl font-bold text-[#17324D] dark:text-white underline break-all"
                  >
                    {supportEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleCopyEmail}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-700 text-[#17324D] dark:text-white font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title={isEn ? 'Copy email address' : 'E-Mail-Adresse kopieren'}
                >
                  <Icon name={copiedEmail ? 'check' : 'content_copy'} className="text-base" />
                  <span>{copiedEmail ? (isEn ? 'Copied!' : 'Kopiert!') : (isEn ? 'Copy' : 'Kopieren')}</span>
                </button>
              </div>
            </div>

            {/* Write the email: webmail opens in a new tab on a new, filled-in email; the last option uses an email program on the device. */}
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-[#17324D] dark:text-white">
                {isEn ? 'Where do you write your emails?' : 'Wo schreiben Sie Ihre E-Mails?'}
              </h4>
              <a
                href={compose.gmail}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 min-h-[56px] rounded-xl bg-[#17324D] hover:bg-[#0F2438] active:bg-[#0A1A2A] text-white font-bold text-base flex items-center justify-center gap-3 transition-colors cursor-pointer text-center"
              >
                <Icon name="mail" className="text-2xl" />
                <span>{isEn ? 'Write the email in Gmail' : 'E-Mail in Gmail schreiben'}</span>
                <span className="sr-only">{isEn ? '(opens in a new tab)' : '(öffnet in einem neuen Tab)'}</span>
                <Icon name="open_in_new" className="text-xl" />
              </a>
              <a
                href={compose.outlook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 min-h-[48px] rounded-xl bg-[#176B68] hover:bg-[#0F514F] active:bg-[#0A3D3B] text-white font-bold text-base flex items-center justify-center gap-3 transition-colors cursor-pointer text-center"
              >
                <Icon name="mail" className="text-2xl" />
                <span>{isEn ? 'Write the email in Outlook / Hotmail' : 'E-Mail in Outlook / Hotmail schreiben'}</span>
                <span className="sr-only">{isEn ? '(opens in a new tab)' : '(öffnet in einem neuen Tab)'}</span>
                <Icon name="open_in_new" className="text-xl" />
              </a>
              <a
                href={compose.program}
                className="w-full py-3 px-6 min-h-[48px] rounded-xl border-2 border-[#17324D] text-[#17324D] dark:text-white dark:border-white hover:bg-[#EAF2F8] dark:hover:bg-slate-800 font-bold text-base flex items-center justify-center gap-3 transition-colors cursor-pointer text-center"
              >
                <Icon name="mail" className="text-2xl" />
                <span>{isEn ? 'Use the email program on this device' : 'E-Mail-Programm auf diesem Gerät nutzen'}</span>
              </a>

              <p className="text-sm text-[#202B36] dark:text-slate-300">
                {isEn
                  ? 'Gmail and Outlook open in a new tab, with our address, a subject and a greeting already filled in. You may need to sign in first. With GMX, web.de or T-Online: press "Copy" above and paste the address into a new email.'
                  : 'Gmail und Outlook öffnen sich in einem neuen Tab, mit unserer Adresse, einem Betreff und einer Anrede schon ausgefüllt. Eventuell müssen Sie sich zuerst anmelden. Bei GMX, web.de oder T-Online: Drücken Sie oben auf „Kopieren“ und fügen Sie die Adresse in eine neue E-Mail ein.'}
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
