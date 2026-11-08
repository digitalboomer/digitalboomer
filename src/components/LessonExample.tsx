import React from 'react';
import { CheckCircle2, Hand, Mic, Phone, PhoneOff, Play, ShieldAlert, Sparkles, TriangleAlert, User, Volume2 } from 'lucide-react';
import { IMAGES } from '../assets/images';
import aiPhoneBack from '../assets/images/ai_example_phone_back.jpg';
import { PictureQuiz } from './PictureQuiz';
import { ScamExample } from './ScamExample';
import type { Language } from '../types';

const Marker: React.FC<{ n: number; x: number; y: number }> = ({ n, x, y }) => (
  <span aria-hidden="true" className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center font-bold text-base" style={{ left: `${x}%`, top: `${y}%`, background: '#17324D', color: '#FFFFFF', border: '3px solid #FFFFFF' }}>{n}</span>
);

const Box: React.FC<{ caption: string; children: React.ReactNode }> = ({ caption, children }) => (
  <figure className="my-4 space-y-2">
    {children}
    <figcaption className="text-base text-[#202B36]">{caption}</figcaption>
  </figure>
);

/** Drawn scenes keep their own colours in every theme, like the simulated phones. */
const Scene: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="phone-sim">{children}</div>;

const Notes: React.FC<{ items: string[] }> = ({ items }) => (
  <ol className="space-y-1 text-base text-[#202B36]">
    {items.map((item, i) => (
      <li key={item} className="flex items-start gap-2"><span aria-hidden="true" className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: '#17324D', color: '#FFFFFF' }}>{i + 1}</span>{item}</li>
    ))}
  </ol>
);

const Chat: React.FC<{ good: boolean; label: string; question: string; answer: string }> = ({ good, label, question, answer }) => (
  <div className="flex-1 min-w-0 rounded-2xl border-2 p-3 space-y-2" style={{ borderColor: good ? '#176B68' : '#667382', background: good ? '#E3F1F0' : '#FFFFFF', color: '#202B36' }}>
    <p className="font-bold flex items-center gap-2">{good ? <CheckCircle2 size={22} style={{ color: '#176B68' }} aria-hidden="true" /> : <TriangleAlert size={22} aria-hidden="true" />}{label}</p>
    <p className="px-3 py-2 rounded-xl" style={{ background: '#17324D', color: '#FFFFFF' }}>{question}</p>
    <p className="px-3 py-2 rounded-xl flex gap-2" style={{ background: '#FFFFFF', border: '1px solid #E5E9ED' }}><Sparkles size={18} className="shrink-0 mt-1" style={{ color: '#176B68' }} aria-hidden="true" />{answer}</p>
  </div>
);

/** Picture examples inside text lessons. Real pictures are our own AI-generated images; the rest are drawn. */
export const LessonExample: React.FC<{ id: string; lang: Language; onDone?: () => void }> = ({ id, lang, onDone }) => {
  const t = (en: string, de: string) => (lang === 'en' ? en : de);

  if (id.startsWith('scam:')) return <ScamExample key={id} id={id.slice(5)} lang={lang} onDone={onDone} />;

  switch (id) {
    case 'picture-quiz':
      return <PictureQuiz lang={lang} onDone={onDone} />;
    case 'photo-phone':
      return (
        <Box caption={t('A real example: this picture was made by AI for this website, before we retouched it.', 'Ein echtes Beispiel: Dieses Bild wurde von einer KI für diese Website erstellt, bevor wir es nachbearbeitet haben.')}>
          <Scene>
          <div className="relative rounded-2xl overflow-hidden">
            <img src={aiPhoneBack} alt={t('AI-generated photo of a smiling older woman. The screen of her phone faces away from her.', 'KI-erzeugtes Foto einer lächelnden älteren Frau. Der Bildschirm ihres Handys zeigt von ihr weg.')} className="w-full block" />
            <Marker n={1} x={77} y={55} />
            <Marker n={2} x={60} y={68} />
          </div>
          </Scene>
          <Notes items={[
            t('The screen faces us, not her. She could not see it.', 'Der Bildschirm zeigt zu uns, nicht zu ihr. Sie könnte ihn gar nicht sehen.'),
            t('Her finger taps the back of the phone, where there is nothing to tap.', 'Ihr Finger tippt auf die Rückseite des Handys, wo es nichts zu tippen gibt.'),
          ]} />
        </Box>
      );
    case 'photo-icons':
      return (
        <Box caption={t('A second real example, also made by AI and shown enlarged. At first glance it looks like a normal phone.', 'Ein zweites echtes Beispiel, ebenfalls von einer KI und hier vergrößert. Auf den ersten Blick sieht es wie ein normales Handy aus.')}>
          <Scene>
          <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
            <img src={IMAGES.topicSocialMedia} alt={t('AI-generated photo of hands holding a phone with app icons. Some icons appear twice and their names are misspelled.', 'KI-erzeugtes Foto von Händen, die ein Handy mit App-Symbolen halten. Einige Symbole erscheinen doppelt, und ihre Namen sind falsch geschrieben.')} className="absolute block max-w-none" style={{ width: '250%', left: '-75%', top: '-33.5%' }} />
            <Marker n={1} x={56} y={47} />
            <Marker n={2} x={20} y={56} />
          </div>
          </Scene>
          <Notes items={[
            t('The same app symbol appears twice.', 'Dasselbe App-Symbol erscheint doppelt.'),
            t('The small words under the symbols are misspelled or make no sense. Writing inside AI pictures is often wrong.', 'Die kleinen Wörter unter den Symbolen sind falsch geschrieben oder ergeben keinen Sinn. Schrift in KI-Bildern ist oft falsch.'),
          ]} />
        </Box>
      );
    case 'fake-call':
      return (
        <Box caption={t('Drawn example of a fake call. The voice can sound exactly like your grandchild.', 'Gezeichnetes Beispiel eines falschen Anrufs. Die Stimme kann genau wie Ihr Enkelkind klingen.')}>
          <Scene>
          <div className="max-w-sm mx-auto rounded-3xl p-5 text-center space-y-3" style={{ background: '#17324D', color: '#FFFFFF' }}>
            <p className="text-base">{t('Unknown number', 'Unbekannte Nummer')}</p>
            <span className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ background: '#667382' }}><User size={44} aria-hidden="true" /></span>
            <p className="px-3 py-2 rounded-2xl text-lg" style={{ background: '#FFFFFF', color: '#202B36' }}>{t('"Grandma, it is me! I had an accident. I need 5,000 euros today. Please do not tell anyone!"', '„Oma, ich bin es! Ich hatte einen Unfall. Ich brauche heute 5.000 Euro. Sag es bitte niemandem!“')}</p>
            <div className="flex justify-center gap-10" aria-hidden="true">
              <span className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#B3261E' }}><PhoneOff size={26} /></span>
              <span className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#176B68' }}><Phone size={26} /></span>
            </div>
          </div>
          </Scene>
          <Notes items={[
            t('Unknown number, even though it is "family".', 'Unbekannte Nummer, obwohl es „Familie“ ist.'),
            t('Urgent money and a demand for secrecy are the warning signs. Hang up and call back on the number you know.', 'Dringend Geld und Geheimhaltung sind die Warnzeichen. Legen Sie auf und rufen Sie unter der bekannten Nummer zurück.'),
          ]} />
        </Box>
      );
    case 'fake-video':
      return (
        <Box caption={t('Drawn example of a fake video advert. Real faces and voices can be faked by AI.', 'Gezeichnetes Beispiel einer falschen Video-Werbung. Echte Gesichter und Stimmen lassen sich mit KI fälschen.')}>
          <Scene>
          <div className="relative rounded-2xl overflow-hidden" style={{ background: '#202B36', color: '#FFFFFF' }}>
            <div className="h-52 flex flex-col items-center justify-center gap-2 p-4 text-center">
              <span className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#667382' }}><User size={36} aria-hidden="true" /></span>
              <p className="text-xl font-bold">{t('"I made 10,000 euros in a week. You can too!"', '„Ich habe in einer Woche 10.000 Euro verdient. Das können Sie auch!“')}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2" style={{ background: 'rgba(0,0,0,0.5)' }}><Play size={18} aria-hidden="true" /><span className="flex-1 h-1.5 rounded-full" style={{ background: '#667382' }} /><Volume2 size={18} aria-hidden="true" /></div>
            <Marker n={1} x={50} y={12} />
            <Marker n={2} x={88} y={60} />
          </div>
          </Scene>
          <Notes items={[
            t('Do the lips match the words? Do eyes blink normally? In fakes, these are often slightly off.', 'Passen die Lippen zu den Worten? Blinken die Augen normal? Bei Fälschungen stimmt das oft nicht ganz.'),
            t('Quick money from a famous person is almost always a scam, however real it looks.', 'Schnelles Geld von einem Prominenten ist fast immer Betrug, egal wie echt es aussieht.'),
          ]} />
        </Box>
      );
    case 'family-word':
      return (
        <Box caption={t('Example of the family password in use.', 'Beispiel für den Einsatz des Familien-Passworts.')}>
          <Scene>
          <div className="max-w-md mx-auto space-y-2">
            <p className="px-3 py-2 rounded-2xl mr-10" style={{ background: '#EAF2F8', color: '#202B36' }}>{t('Caller: "It is me, I need money right now!"', 'Anrufer: „Ich bin es, ich brauche sofort Geld!“')}</p>
            <p className="px-3 py-2 rounded-2xl ml-10" style={{ background: '#E3F1F0', color: '#202B36' }}>{t('You: "What is our family word?"', 'Sie: „Wie lautet unser Familienwort?“')}</p>
            <p className="px-3 py-2 rounded-2xl mr-10" style={{ background: '#EAF2F8', color: '#202B36' }}>{t('Caller: "Uh... I forgot!" (Hang up.)', 'Anrufer: „Äh ... vergessen!“ (Legen Sie auf.)')}</p>
          </div>
          </Scene>
        </Box>
      );
    case 'good-question':
      return (
        <Box caption={t('The same wish, asked in two ways.', 'Derselbe Wunsch, auf zwei Arten gefragt.')}>
          <Scene>
          <div className="flex flex-col sm:flex-row gap-3">
            <Chat good={false} label={t('Too general', 'Zu allgemein')} question={t('Write a letter.', 'Schreibe einen Brief.')} answer={t('To whom, and about what? I wrote a general letter.', 'An wen und worüber? Ich habe einen allgemeinen Brief geschrieben.')} />
            <Chat good label={t('Much better', 'Viel besser')} question={t('Write a short, friendly letter to my landlord. The heating has been broken since Monday.', 'Schreibe einen kurzen, freundlichen Brief an meinen Vermieter. Die Heizung ist seit Montag kaputt.')} answer={t('Dear landlord, since Monday the heating in my flat has not worked...', 'Sehr geehrter Vermieter, seit Montag funktioniert die Heizung in meiner Wohnung nicht...')} />
          </div>
          </Scene>
        </Box>
      );
    case 'private-chat':
      return (
        <Box caption={t('You get the same help without personal data.', 'Sie bekommen dieselbe Hilfe ohne persönliche Daten.')}>
          <Scene>
          <div className="flex flex-col sm:flex-row gap-3">
            <Chat good={false} label={t('Too much information', 'Zu viel verraten')} question={t('My name is Karl Beispiel, IBAN DE00 1234... My bank says...', 'Ich heiße Karl Beispiel, IBAN DE00 1234... Meine Bank schreibt...')} answer={t('Please do not share this in a chat.', 'Bitte teilen Sie das nicht in einem Chat.')} />
            <Chat good label={t('Safe', 'Sicher')} question={t('What does "direct debit" mean on a bank statement?', 'Was bedeutet „Lastschrift“ auf einem Kontoauszug?')} answer={t('A direct debit means a company collects money from your account...', 'Eine Lastschrift bedeutet, dass eine Firma Geld von Ihrem Konto einzieht...')} />
          </div>
          </Scene>
        </Box>
      );
    case 'voice':
      return (
        <Box caption={t('Drawn example of asking your phone.', 'Gezeichnetes Beispiel: Sie fragen Ihr Handy.')}>
          <Scene>
          <div className="max-w-sm mx-auto rounded-3xl p-5 text-center space-y-3" style={{ background: '#EAF2F8', color: '#202B36' }}>
            <span className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: '#176B68', color: '#FFFFFF' }}><Mic size={32} aria-hidden="true" /></span>
            <p className="text-lg font-bold">{t('"Remind me to take my tablets at 8."', '„Erinnere mich um 8 Uhr an meine Tabletten.“')}</p>
            <p className="flex items-center justify-center gap-2"><CheckCircle2 size={22} style={{ color: '#176B68' }} aria-hidden="true" />{t('Reminder set for 8:00', 'Erinnerung für 8:00 Uhr gestellt')}</p>
          </div>
          </Scene>
        </Box>
      );
    case 'translate':
      return (
        <Box caption={t('Example: AI translates quickly, but check important things.', 'Beispiel: KI übersetzt schnell, aber prüfen Sie Wichtiges.')}>
          <Scene>
          <div className="flex flex-col sm:flex-row gap-3">
            <p className="flex-1 p-3 rounded-2xl" style={{ background: '#FFFFFF', border: '2px solid #667382', color: '#202B36' }}><strong className="block">Italiano</strong>Il treno parte alle otto.</p>
            <p className="flex-1 p-3 rounded-2xl" style={{ background: '#E3F1F0', border: '2px solid #176B68', color: '#202B36' }}><strong className="block">{t('English', 'Deutsch')}</strong>{t('The train leaves at eight.', 'Der Zug fährt um acht Uhr ab.')}</p>
          </div>
          </Scene>
        </Box>
      );
    case 'health':
      return (
        <Box caption={t('Fine to ask, and better left to your doctor.', 'Das dürfen Sie fragen, und das gehört zum Arzt.')}>
          <Scene>
          <div className="flex flex-col sm:flex-row gap-3" style={{ color: '#202B36' }}>
            <p className="flex-1 p-3 rounded-2xl flex gap-2" style={{ background: '#E3F1F0', border: '2px solid #176B68' }}><CheckCircle2 size={22} className="shrink-0" style={{ color: '#176B68' }} aria-hidden="true" />{t('"What does the word cholesterol mean?"', '„Was bedeutet das Wort Cholesterin?“')}</p>
            <p className="flex-1 p-3 rounded-2xl flex gap-2" style={{ background: '#FDECEA', border: '2px solid #B3261E' }}><ShieldAlert size={22} className="shrink-0" style={{ color: '#B3261E' }} aria-hidden="true" />{t('"Should I stop taking my heart tablets?" Ask your doctor.', '„Soll ich meine Herztabletten absetzen?“ Fragen Sie Ihre Ärztin oder Ihren Arzt.')}</p>
          </div>
          </Scene>
        </Box>
      );
    case 'ai-everyday':
      return (
        <Box caption={t('Places where you may already use AI.', 'Hier nutzen Sie KI vielleicht schon.')}>
          <Scene>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center" style={{ color: '#202B36' }}>
            {[t('Spam filter', 'Spam-Filter'), t('Route planning', 'Routenplanung'), t('Video captions', 'Video-Untertitel'), t('Photo sorting', 'Foto-Sortierung')].map((name) => (
              <li key={name} className="p-3 rounded-2xl flex flex-col items-center gap-1 font-bold" style={{ background: '#EAF2F8' }}><Hand size={26} style={{ color: '#176B68' }} aria-hidden="true" />{name}</li>
            ))}
          </ul>
          </Scene>
        </Box>
      );
    default:
      return null;
  }
};
