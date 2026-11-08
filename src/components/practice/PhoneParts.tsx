import React, { useContext, useEffect, useState } from 'react';
import { ArrowLeft, ArrowUp, BatteryFull, ChevronLeft, Delete, Signal, Wifi } from 'lucide-react';
import { IMAGES } from '../../assets/images';
import { PracticeContext } from './PracticeTap';

/** Parts shared by all simulated phone screens. */

export function clockTime(): string {
  return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

/** The back symbol: a chevron on iPhone, an arrow on Android. */
export const BackGlyph: React.FC<{ size?: number }> = ({ size = 23 }) => {
  const { platform } = useContext(PracticeContext);
  return platform === 'iphone' ? <ChevronLeft size={size + 5} aria-hidden="true" /> : <ArrowLeft size={size} aria-hidden="true" />;
};

/** The bar at the very bottom of the screen: a home bar on iPhone, a short gesture bar on Android. */
export const HomeIndicator: React.FC<{ platform: 'iphone' | 'android' }> = ({ platform }) => (
  <div aria-hidden="true" className="flex justify-center items-center h-5 shrink-0" style={{ background: '#000000' }}>
    <span className="rounded-full" style={{ width: platform === 'iphone' ? '36%' : '22%', height: platform === 'iphone' ? 5 : 4, background: '#FFFFFF', opacity: 0.85 }} />
  </div>
);

export const StatusBar: React.FC<{ background: string; color: string }> = ({ background, color }) => {
  const { platform, computer } = useContext(PracticeContext);
  const [time, setTime] = useState(clockTime);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(clockTime()), 20000);
    return () => window.clearInterval(timer);
  }, []);
  if (computer) return null;
  return (
    <div aria-hidden="true" className={`flex items-center justify-between shrink-0 font-bold relative ${platform === 'iphone' ? 'px-6 h-8 text-[0.85rem]' : 'px-4 h-7 text-[0.8rem]'}`} style={{ background, color }}>
      <span>{time}</span>
      {platform === 'iphone' && <span className="absolute left-1/2 -translate-x-1/2 top-1 w-20 h-5 rounded-full" style={{ background: '#000000' }} />}
      <span className="flex items-center gap-1">
        <Signal size={14} />
        <Wifi size={14} />
        <BatteryFull size={18} />
      </span>
    </div>
  );
};

export const Avatar: React.FC<{ name: string; color: string; size?: number; children?: React.ReactNode }> = ({ name, color, size = 48, children }) => (
  <span
    aria-hidden="true"
    className="shrink-0 rounded-full flex items-center justify-center font-bold text-white"
    style={{ width: size, height: size, background: color, fontSize: size * 0.42 }}
  >
    {children ?? name.charAt(0)}
  </span>
);

/** Drawn pictures and two of the website's own photos, so no real private photos are shown. */
const FlowersScene = () => (
  <svg viewBox="0 0 120 120" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="120" height="120" fill="#BFE3F7" />
    <rect y="72" width="120" height="48" fill="#7CB65C" />
    {[[28, 62, '#E4572E'], [62, 50, '#F6C445'], [94, 66, '#D65DB1']].map(([x, y, color]) => (
      <g key={String(x)}>
        <rect x={Number(x) - 1.5} y={Number(y)} width="3" height={110 - Number(y)} fill="#3E7D32" />
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx={Number(x) + 9 * Math.cos((a * Math.PI) / 180)} cy={Number(y) + 9 * Math.sin((a * Math.PI) / 180)} r="7" fill={String(color)} />
        ))}
        <circle cx={Number(x)} cy={Number(y)} r="5" fill="#FFF3B0" />
      </g>
    ))}
  </svg>
);

const MountainScene = () => (
  <svg viewBox="0 0 120 120" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="120" height="120" fill="#A8D5F2" />
    <polygon points="-10,120 45,35 95,120" fill="#6B7F93" />
    <polygon points="40,120 85,50 135,120" fill="#51667A" />
    <polygon points="45,35 34,52 45,48 56,52" fill="#FFFFFF" />
    <rect y="105" width="120" height="15" fill="#6FA85A" />
  </svg>
);

const SunsetScene = () => (
  <svg viewBox="0 0 120 120" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="sim-sunset" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5B5EA6" />
        <stop offset="0.6" stopColor="#F28C5A" />
        <stop offset="1" stopColor="#FBD786" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" fill="url(#sim-sunset)" />
    <circle cx="60" cy="74" r="18" fill="#FFE29A" />
    <rect y="84" width="120" height="36" fill="#2F4858" />
  </svg>
);

const CakeScene = () => (
  <svg viewBox="0 0 120 120" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="120" height="120" fill="#FFF0D9" />
    <ellipse cx="60" cy="95" rx="44" ry="8" fill="#E8D5B5" />
    <rect x="28" y="56" width="64" height="38" rx="5" fill="#C98A5B" />
    <rect x="28" y="52" width="64" height="14" rx="6" fill="#FFFFFF" />
    {[42, 60, 78].map((x) => (
      <g key={x}>
        <rect x={x - 2} y="36" width="4" height="16" fill="#E4572E" />
        <circle cx={x} cy="32" r="3.5" fill="#F6C445" />
      </g>
    ))}
  </svg>
);

export const PHOTOS: { id: string; labelKey: string; render: () => React.ReactNode }[] = [
  { id: 'photo-flowers', labelKey: 'photoFlowers', render: () => <FlowersScene /> },
  { id: 'photo-woman', labelKey: 'photoWoman', render: () => <img src={IMAGES.heroSeniorWoman} alt="" className="w-full h-full object-cover" /> },
  { id: 'photo-cake', labelKey: 'photoCake', render: () => <CakeScene /> },
  { id: 'photo-mountain', labelKey: 'photoMountain', render: () => <MountainScene /> },
  { id: 'photo-man', labelKey: 'photoMan', render: () => <img src={IMAGES.seniorManLaptop} alt="" className="w-full h-full object-cover" /> },
  { id: 'photo-sun', labelKey: 'photoSun', render: () => <SunsetScene /> },
];

export const FlowersPhoto = FlowersScene;

const ROWS: Record<string, string[]> = {
  en: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'],
  de: ['qwertzuiop', 'asdfghjkl', 'yxcvbnm'],
};

interface PhoneKeyboardProps {
  suggestions: string[];
  spaceLabel: string;
  deleteLabel: string;
  shiftLabel: string;
  lang: string;
  dark?: boolean;
}

/** A working on-screen keyboard. Letters are about as small as on a real phone, on purpose. */
export const PhoneKeyboard: React.FC<PhoneKeyboardProps> = ({ suggestions, spaceLabel, deleteLabel, shiftLabel, lang, dark }) => {
  const { typed, setTyped, needsText, showMe, platform, computer } = useContext(PracticeContext);
  const ios = platform === 'iphone';
  const [shiftOn, setShiftOn] = useState(false);
  const capital = shiftOn || typed.length === 0;
  const keyBg = dark ? '#4E5058' : '#FFFFFF';
  const keyText = dark ? '#F2F3F5' : '#111B21';
  const sideKey = dark ? '#2B2D31' : '#ADB3BC';

  const addText = (text: string) => {
    setTyped((prev) => (prev + text).slice(0, 80));
    setShiftOn(false);
  };

  // The real keyboard works here as well.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (event.ctrlKey || event.metaKey || event.altKey || target?.closest('input,textarea,select,[role=dialog]')) return;
      if (event.key === 'Backspace') {
        event.preventDefault();
        setTyped((prev) => prev.slice(0, -1));
      } else if (event.key.length === 1 && /[\p{L}\p{N} .,!?'-]/u.test(event.key) && (event.key !== ' ' || target?.tagName !== 'BUTTON')) {
        event.preventDefault();
        setTyped((prev) => (prev + event.key).slice(0, 80));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setTyped]);

  const stop = (fn: () => void) => (event: React.MouseEvent) => {
    event.stopPropagation();
    fn();
  };

  if (computer) {
    return (
      <div data-practice-id="keyboard" role="group" aria-label={lang === 'de' ? 'Schreibhilfe' : 'Typing help'} className={`shrink-0 flex flex-wrap items-center gap-2 p-2 ${needsText && showMe ? 'practice-target practice-show-me' : ''}`} style={{ background: '#EEF1F4', borderTop: '1px solid #D5DAE0' }}>
        <span className="text-[0.9rem]" style={{ color: '#3B4A54' }}>{lang === 'de' ? 'Tastatur, oder:' : 'Keyboard, or:'}</span>
        {suggestions.map((word) => (
          <button key={word} type="button" onClick={stop(() => addText(typed && !typed.endsWith(' ') ? ` ${word}` : word))} className="px-3 min-h-[40px] rounded-lg text-[0.95rem] font-bold" style={{ background: '#FFFFFF', color: '#111B21', border: '1px solid #C8D0D8' }}>{word}</button>
        ))}
        <button type="button" aria-label={deleteLabel} onClick={stop(() => setTyped((prev) => prev.slice(0, -1)))} className="px-3 min-h-[40px] rounded-lg" style={{ background: '#FFFFFF', color: '#111B21', border: '1px solid #C8D0D8' }}><Delete size={18} aria-hidden="true" /></button>
      </div>
    );
  }

  const key = `flex-1 min-w-0 h-11 flex items-center justify-center text-[1rem] active:brightness-75 ${ios ? 'rounded-[6px] shadow-[0_1px_0_rgba(0,0,0,0.3)]' : 'rounded-md'}`;

  return (
    <div
      data-practice-id="keyboard"
      className={`sim-fade shrink-0 p-1 ${needsText && showMe ? 'practice-target practice-show-me' : ''}`}
      style={{ background: dark ? '#1E1F22' : ios ? '#D1D3D9' : '#E8EAED', borderRadius: 0 }}
      role="group"
      aria-label={lang === 'de' ? 'Tastatur' : 'Keyboard'}
    >
      <div className="flex gap-1 mb-1">
        {suggestions.map((word) => (
          <button
            key={word}
            type="button"
            onClick={stop(() => addText(typed && !typed.endsWith(' ') ? ` ${word}` : word))}
            className="flex-1 min-w-0 min-h-[40px] px-1 rounded-md text-[0.9rem] leading-tight active:brightness-75"
            style={{ background: dark ? '#2B2D31' : '#F1F3F4', color: keyText }}
          >
            {word}
          </button>
        ))}
      </div>
      {ROWS[lang === 'de' ? 'de' : 'en'].map((row, rowIndex) => (
        <div key={row} className="flex gap-[3px] mb-1 justify-center">
          {rowIndex === 2 && (
            <button type="button" aria-label={shiftLabel} aria-pressed={shiftOn} onClick={stop(() => setShiftOn(!shiftOn))} className={key} style={{ background: shiftOn ? keyBg : sideKey, color: keyText, flexGrow: 1.4 }}>
              <ArrowUp size={18} aria-hidden="true" />
            </button>
          )}
          {row.split('').map((letter) => {
            const shown = capital ? letter.toUpperCase() : letter;
            return (
              <button key={letter} type="button" onClick={stop(() => addText(shown))} className={key} style={{ background: keyBg, color: keyText, maxWidth: '2.2rem' }}>
                {shown}
              </button>
            );
          })}
          {rowIndex === 2 && (
            <button type="button" aria-label={deleteLabel} onClick={stop(() => setTyped((prev) => prev.slice(0, -1)))} className={key} style={{ background: sideKey, color: keyText, flexGrow: 1.4 }}>
              <Delete size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      ))}
      <div className="flex gap-1">
        <button type="button" onClick={stop(() => addText(','))} className={key} style={{ background: sideKey, color: keyText }}>,</button>
        <button type="button" onClick={stop(() => addText(' '))} className={key} style={{ background: keyBg, color: keyText, flexGrow: 6 }}>
          {spaceLabel}
        </button>
        <button type="button" onClick={stop(() => addText('.'))} className={key} style={{ background: sideKey, color: keyText }}>.</button>
      </div>
    </div>
  );
};
