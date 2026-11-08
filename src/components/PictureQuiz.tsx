import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Info, RotateCcw } from 'lucide-react';
import { IMAGES } from '../assets/images';
import aiPhoneBack from '../assets/images/ai_example_phone_back.jpg';
import dog from '../assets/images/quiz_real_dog.jpg';
import cafe from '../assets/images/quiz_real_cafe.jpg';
import stairs from '../assets/images/quiz_real_stairs.jpg';
import ceiling from '../assets/images/quiz_real_ceiling.jpg';
import cycling from '../assets/images/quiz_real_cycling.jpg';
import type { Language } from '../types';

interface Round {
  image: string;
  isAi: boolean;
  alt: [string, string];
  why: [string, string];
  credit?: string;
}

/**
 * Real photos: CC0, from Wikimedia Commons. AI pictures: generated in Google AI
 * Studio for the first version of this website. Clues were checked by looking at
 * each picture. Alt texts describe the scene without giving away the answer.
 */
const ROUNDS: Round[] = [
  { image: dog, isAi: false, alt: ['A dog sits on a mountain meadow above the clouds.', 'Ein Hund sitzt auf einer Bergwiese über den Wolken.'], why: ['Real. The patches of snow, dry bushes and uneven ground are irregular, and the dog is not posing.', 'Echt. Die Schneeflecken, trockenen Büsche und der unebene Boden sind unregelmäßig, und der Hund posiert nicht.'], credit: 'Nitika kafley' },
  { image: IMAGES.seniorManLaptop, isAi: true, alt: ['A smiling older man works on a laptop at a wooden table.', 'Ein lächelnder älterer Mann arbeitet an einem Laptop an einem Holztisch.'], why: ['Made by AI. Look at the lid of the laptop: the gold logo is a shape that means nothing. Everything else looks very convincing.', 'Von einer KI. Schauen Sie auf den Laptop-Deckel: Das goldene Logo ist eine Form ohne Bedeutung. Alles andere wirkt sehr überzeugend.'] },
  { image: cafe, isAi: false, alt: ['The front of a small café at a railway station.', 'Die Vorderseite eines kleinen Cafés an einem Bahnhof.'], why: ['Real. The signs are spelled correctly and make sense: "Café Local", "Chatham" and the prices on the posters. Even so, correct writing alone is no proof, because AI is getting better at it.', 'Echt. Die Schilder sind richtig geschrieben und ergeben Sinn: „Café Local“, „Chatham“ und die Preise auf den Plakaten. Richtige Schrift allein ist aber kein Beweis, denn KI wird darin besser.'], credit: 'Sunolafjagtenben-hur' },
  { image: aiPhoneBack, isAi: true, alt: ['A smiling older woman in a cardigan holds a phone.', 'Eine lächelnde ältere Frau in einer Strickjacke hält ein Handy.'], why: ['Made by AI. The screen of the phone faces away from her, and her finger taps the back. She could not use it like that.', 'Von einer KI. Der Bildschirm des Handys zeigt von ihr weg, und ihr Finger tippt auf die Rückseite. So könnte sie es nicht benutzen.'] },
  { image: ceiling, isAi: false, alt: ['A roof with a sign pointing to the toilets, and trees behind it.', 'Ein Dach mit einem Schild zu den Toiletten, dahinter Bäume.'], why: ['Real. It is simply an ordinary, slightly dull photo with a correctly spelled sign. Real photos are often not perfect or pretty.', 'Echt. Es ist einfach ein gewöhnliches, etwas langweiliges Foto mit richtig geschriebenem Schild. Echte Fotos sind oft nicht perfekt oder hübsch.'], credit: 'John Robert McPherson' },
  { image: IMAGES.topicSocialMedia, isAi: true, alt: ['Older hands hold a phone showing app symbols.', 'Ältere Hände halten ein Handy mit App-Symbolen.'], why: ['Made by AI. Some app symbols appear twice, and the small names under them are misspelled.', 'Von einer KI. Einige App-Symbole erscheinen doppelt, und die kleinen Namen darunter sind falsch geschrieben.'] },
  { image: stairs, isAi: false, alt: ['Stone steps with a white railing lead down to houses with red roofs.', 'Steinstufen mit weißem Geländer führen hinunter zu Häusern mit roten Dächern.'], why: ['Real. The shadow of the railing falls correctly across the steps, and the plants grow unevenly, as they do in real life.', 'Echt. Der Schatten des Geländers fällt richtig über die Stufen, und die Pflanzen wachsen unregelmäßig, wie im echten Leben.'], credit: 'Bambizoe' },
  { image: IMAGES.topicBankingPhone, isAi: true, alt: ['Hands hold a phone showing a banking app.', 'Hände halten ein Handy mit einer Banking-App.'], why: ['Made by AI, and this one is hard. The bank "SafeBank" is invented, but there is hardly a visible mistake, and even the amounts add up. We only know because we know where the picture came from.', 'Von einer KI, und dieses Bild ist schwer. Die Bank „SafeBank“ ist erfunden, aber es gibt kaum sichtbare Fehler, und selbst die Beträge stimmen. Wir wissen es nur, weil wir wissen, woher das Bild stammt.'] },
  { image: cycling, isAi: false, alt: ['Cyclists start a race under a big arch, with many spectators.', 'Radfahrer starten unter einem großen Bogen ein Rennen, mit vielen Zuschauern.'], why: ['Real. The banner reads correctly, and there is a real event behind it that you could look up: the 2019 championships in Brno. Checking a fact like that is often the best test.', 'Echt. Das Banner ist richtig geschrieben, und dahinter steckt ein echtes Ereignis, das man nachschlagen kann: die Meisterschaft 2019 in Brünn. So etwas zu prüfen, ist oft der beste Test.'], credit: 'Lexware Mountainbike Team' },
  { image: IMAGES.topicWhatsappPhone, isAi: true, alt: ['An older woman looks at a chat on a phone in her living room.', 'Eine ältere Frau schaut in ihrem Wohnzimmer auf einen Chat am Handy.'], why: ['Made by AI. App symbols float at the bottom of the chat, where they do not belong. The hand also looks waxy and too smooth at the edges.', 'Von einer KI. Unten im Chat schweben App-Symbole, wo sie nicht hingehören. Auch die Hand wirkt wächsern und an den Rändern zu glatt.'] },
  { image: IMAGES.topicEmailLaptop, isAi: true, alt: ['A laptop on a table shows an email program.', 'Ein Laptop auf einem Tisch zeigt ein E-Mail-Programm.'], why: ['Made by AI. "ProMail" is invented, and the emails are strangely numbered "1. Unread". The rest is hard to tell from a photo.', 'Von einer KI. „ProMail“ ist erfunden, und die E-Mails sind seltsam nummeriert: „1. Unread“. Der Rest ist von einem Foto kaum zu unterscheiden.'] },
  { image: IMAGES.topicAiRobot, isAi: true, alt: ['A small white robot waves next to a tablet.', 'Ein kleiner weißer Roboter winkt neben einem Tablet.'], why: ['Made by AI. The toy "Buddy" does not exist, and the room is unnaturally tidy, a bit like an advert. AI pictures often look too perfect.', 'Von einer KI. Das Spielzeug „Buddy“ gibt es nicht, und der Raum ist unnatürlich ordentlich, ein wenig wie Werbung. KI-Bilder wirken oft zu perfekt.'] },
];

/** Real or made by AI? One picture at a time, no time limit, and every answer is explained. */
export const PictureQuiz: React.FC<{ lang: Language; onDone?: () => void }> = ({ lang, onDone }) => {
  const en = lang === 'en';
  const pick = (pair: [string, string]) => (en ? pair[0] : pair[1]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const finished = index >= ROUNDS.length;

  useEffect(() => {
    if (finished) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);
  const button = 'inline-flex items-center justify-center gap-2 px-5 min-h-[56px] rounded-xl font-bold text-base';

  const restart = () => {
    setIndex(0);
    setAnswer(null);
    setScore(0);
  };

  if (finished) {
    const text = en
      ? `You recognised ${score} of ${ROUNDS.length} pictures.`
      : `Sie haben ${score} von ${ROUNDS.length} Bildern richtig erkannt.`;
    return (
      <div className="my-4 p-5 rounded-2xl border-2 border-[#176B68] bg-[#E3F1F0] dark:bg-slate-800 text-[#202B36] dark:text-slate-100 space-y-3">
        <h3 className="text-2xl font-bold text-[#17324D] flex items-center gap-2"><CheckCircle2 size={32} className="text-[#176B68]" aria-hidden="true" />{text}</h3>
        <p>{en ? 'However many it was: even experts are often wrong. What matters is the habit of checking where a picture comes from, especially when it involves money or fear.' : 'Wie viele es auch waren: Selbst Fachleute irren sich oft. Wichtig ist die Gewohnheit zu prüfen, woher ein Bild stammt, besonders wenn es um Geld oder Angst geht.'}</p>
        <button onClick={restart} className={`${button} border-2 border-[#17324D] text-[#17324D] hover:bg-[#EAF2F8]`}>
          <RotateCcw size={20} aria-hidden="true" />{en ? 'Try again' : 'Noch einmal'}
        </button>
      </div>
    );
  }

  const round = ROUNDS[index];
  const choose = (isAi: boolean) => {
    if (answer !== null) return;
    setAnswer(isAi);
    if (isAi === round.isAi) setScore((value) => value + 1);
    window.setTimeout(() => resultRef.current?.scrollIntoView({ block: 'nearest' }), 50);
  };
  const correct = answer === round.isAi;

  return (
    <div className="my-4 space-y-3 text-[#202B36] dark:text-slate-100">
      <p className="font-bold text-[#17324D]" aria-live="polite">
        {en ? `Picture ${index + 1} of ${ROUNDS.length}` : `Bild ${index + 1} von ${ROUNDS.length}`}
      </p>
      <img src={round.image} alt={pick(round.alt)} className="w-full max-h-[60vh] object-contain rounded-2xl bg-[#E5E9ED]" />
      {answer === null ? (
        <>
          <p className="text-xl font-bold">{en ? 'Is this a real photo, or made by AI?' : 'Ist das ein echtes Foto, oder von einer KI?'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button onClick={() => choose(false)} className={`${button} bg-[#176B68] hover:bg-[#0F514F] active:bg-[#0A3D3B] text-white`}>{en ? 'Real photo' : 'Echtes Foto'}</button>
            <button onClick={() => choose(true)} className={`${button} bg-[#17324D] hover:bg-[#0F2438] active:bg-[#0A1A2A] text-white`}>{en ? 'Made by AI' : 'Von einer KI'}</button>
          </div>
        </>
      ) : (
        <div ref={resultRef} aria-live="polite" className="space-y-3 scroll-mb-28">
          <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-[#17324D] bg-[#EAF2F8] dark:bg-slate-800">
            {correct ? <CheckCircle2 size={28} className="shrink-0 text-[#176B68]" aria-hidden="true" /> : <Info size={28} className="shrink-0 text-[#17324D]" aria-hidden="true" />}
            <div>
              <strong className="block">{correct ? (en ? 'Right!' : 'Richtig!') : (en ? 'Not this time. That is completely normal.' : 'Diesmal nicht. Das ist ganz normal.')}</strong>
              {pick(round.why)}
              {round.credit && <span className="block mt-1 text-base">{en ? 'Photo' : 'Foto'}: {round.credit}, CC0, Wikimedia Commons</span>}
            </div>
          </div>
          <button
            onClick={() => {
              setIndex(index + 1);
              setAnswer(null);
            }}
            className={`${button} bg-[#17324D] hover:bg-[#0F2438] active:bg-[#0A1A2A] text-white`}
          >
            {index + 1 === ROUNDS.length ? (en ? 'See my result' : 'Mein Ergebnis ansehen') : (en ? 'Next picture' : 'Nächstes Bild')}
          </button>
        </div>
      )}
    </div>
  );
};
