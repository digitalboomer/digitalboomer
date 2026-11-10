import React, { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Check } from 'lucide-react';

interface PracticeContextValue {
  targetId?: string;
  showMe: boolean;
  tapHereLabel: string;
  /** The spot that was just tapped correctly, shown for a moment. */
  correctId?: string;
  onTap: (id: string) => void;
  /** What the learner typed in the field of this step. */
  typed: string;
  setTyped: React.Dispatch<React.SetStateAction<string>>;
  /** Everything typed in this lesson, by field (e.g. to, subject, main). */
  fields: Record<string, string>;
  /** The step's target only works after typing, and nothing is typed yet. */
  needsText: boolean;
  /** The wrong spot tapped last, so a screen can react (e.g. a warning from the app). */
  lastWrongId?: string;
  clearWrong: () => void;
  /** Free roam: no task, every screen stays usable. */
  freeRoam?: boolean;
  /** The learner's phone. Screens follow its look. */
  platform?: 'iphone' | 'android';
  /** The lesson is shown on a simulated computer. */
  computer?: boolean;
}

export const PracticeContext = createContext<PracticeContextValue>({
  showMe: false,
  tapHereLabel: '',
  onTap: () => {},
  typed: '',
  setTyped: () => {},
  fields: {},
  needsText: false,
  clearWrong: () => {},
});

interface PracticeTapProps {
  /** Must match `targetId` or a key of `hints` in the lesson content. */
  id: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  /** Where the "Tap here" pointer of "Show me" appears, so it stays inside the phone. */
  pointer?: 'below' | 'below-right' | 'above-right' | 'above-left';
  /** Press and hold, as on a real phone. A second short tap also counts, so nobody gets stuck. */
  hold?: boolean;
  children: React.ReactNode;
}

const HOLD_MS = 500;

/**
 * Anything the learner can tap on a simulated screen. It marks itself when it
 * is the correct target, and it reports every tap to the practice shell.
 */
export const PracticeTap: React.FC<PracticeTapProps> = ({ id, label, className = '', style, pointer = 'below', hold, children }) => {
  const { targetId, showMe, tapHereLabel, correctId, onTap, needsText } = useContext(PracticeContext);
  const isTarget = id === targetId && !needsText;
  const isCorrect = id === correctId;
  const holdTimer = useRef<number | undefined>(undefined);
  const didHold = useRef(false);
  const shortTaps = useRef(0);
  const tipRef = useRef<HTMLSpanElement>(null);
  const [flipped, setFlipped] = useState(false);
  const showTip = isTarget && showMe && !isCorrect;

  // Keep "Tap here" inside the screen: slide it sideways, or put it on the other side of the button when there is no room.
  useLayoutEffect(() => {
    const tip = tipRef.current;
    if (!showTip || !tip) {
      setFlipped(false);
      return;
    }
    tip.style.transform = '';
    let box = tip.parentElement?.parentElement ?? null;
    while (box && box !== document.body) {
      const css = getComputedStyle(box);
      if (/hidden|auto|scroll|clip/.test(css.overflowX + css.overflowY)) break;
      box = box.parentElement;
    }
    if (!box || box === document.body) return;
    // The clipping box, but never wider than the simulated screen itself.
    const clip = box.getBoundingClientRect();
    const screen = tip.closest('.phone-sim')?.getBoundingClientRect() ?? clip;
    const area = { left: Math.max(clip.left, screen.left), right: Math.min(clip.right, screen.right), top: Math.max(clip.top, screen.top), bottom: Math.min(clip.bottom, screen.bottom) };
    const own = tip.getBoundingClientRect();
    const button = tip.parentElement!.getBoundingClientRect();
    const scale = own.width / (tip.offsetWidth || own.width) || 1; // the computer screen is drawn scaled
    const gap = 6 * scale;
    let dx = 0;
    if (own.right > area.right - gap) dx = area.right - gap - own.right;
    if (own.left + dx < area.left + gap) dx = area.left + gap - own.left;
    tip.style.transform = dx ? `translateX(${dx / scale}px)` : ''; // transform, not margin: it also moves a label anchored on the right
    const below = pointer.startsWith('below');
    const room = own.height + 12 * scale;
    if (!flipped) {
      if (below && own.bottom > area.bottom - gap && button.top - room >= area.top) setFlipped(true);
      if (!below && own.top < area.top + gap && button.bottom + room <= area.bottom) setFlipped(true);
    }
  }, [showTip, pointer, flipped]);

  const shownPointer = flipped
    ? ({ below: 'above', 'below-right': 'above-right', 'above-right': 'below-right', 'above-left': 'below-left' } as const)[pointer]
    : pointer;
  const pointerPlace = {
    below: 'top-full mt-3 left-1/2 -translate-x-1/2',
    above: 'bottom-full mb-3 left-1/2 -translate-x-1/2',
    'below-right': 'top-full mt-3 right-0',
    'below-left': 'top-full mt-3 left-0',
    'above-right': 'bottom-full mb-3 right-0',
    'above-left': 'bottom-full mb-3 left-0',
  }[shownPointer];

  const startHold = () => {
    didHold.current = false;
    holdTimer.current = window.setTimeout(() => {
      didHold.current = true;
      onTap(id);
    }, HOLD_MS);
  };
  const endHold = () => window.clearTimeout(holdTimer.current);

  return (
    <button
      type="button"
      aria-label={label}
      data-practice-id={id}
      onPointerDown={hold ? startHold : undefined}
      onPointerUp={hold ? endHold : undefined}
      onPointerLeave={hold ? endHold : undefined}
      onContextMenu={hold ? (event) => event.preventDefault() : undefined}
      onClick={(event) => {
        event.stopPropagation(); // otherwise the screen counts it as a tap on empty space
        if (!hold) {
          onTap(id);
        } else if (didHold.current) {
          didHold.current = false;
        } else if (event.detail === 0 || shortTaps.current >= 1) {
          onTap(id); // keyboard users, and anyone who finds holding difficult
        } else {
          shortTaps.current += 1;
          onTap(`${id}:short`);
        }
      }}
      style={hold ? { ...style, touchAction: 'none', WebkitTouchCallout: 'none' } : style}
      className={`${className.includes('absolute') ? '' : 'relative'} min-w-[44px] min-h-[44px] ${isTarget && showMe && !isCorrect ? 'practice-target practice-show-me' : ''} ${isCorrect ? 'practice-correct is-pressed' : ''} ${className}`}
    >
      {children}
      {isCorrect && (
        <span aria-hidden="true" className="absolute -top-2 -right-2 z-30 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#176B68', color: '#FFFFFF', border: '2px solid #FFFFFF' }}>
          <Check size={16} strokeWidth={3} />
        </span>
      )}
      {showTip && (
        <span
          ref={tipRef}
          aria-hidden="true"
          className={`absolute z-20 flex items-center gap-1 px-3 py-2 rounded-xl text-[1rem] font-bold whitespace-nowrap ${pointerPlace}`}
          style={{ background: '#17324D', color: '#FFFFFF' }}
        >
          {shownPointer.startsWith('below') ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
          {tapHereLabel}
        </span>
      )}
    </button>
  );
};
