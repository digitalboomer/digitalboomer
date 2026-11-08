import React, { useMemo } from 'react';
import { Icon } from './Icon';
import { Language } from '../types';
import { useDialogFocus } from '../utils/useDialogFocus';

interface CelebrationDialogProps {
  isOpen: boolean;
  lessonTitle: string;
  isPractice: boolean;
  completedCount: number;
  nextTitle?: string;
  onNext: () => void;
  onProgress: () => void;
  onClose: () => void;
  lang?: Language;
}

const COLOURS = ['#176B68', '#17324D', '#E0A800', '#5BB5B0', '#7FA8CC'];

/** One slow fall, under five seconds, with no flashing. Switched off for reduced motion in index.css. */
const Confetti: React.FC = () => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        duration: 2.6 + Math.random() * 1.2,
        size: 8 + Math.random() * 7,
        round: i % 4 === 0,
        colour: COLOURS[i % COLOURS.length],
      })),
    []
  );
  return (
    <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none z-[60]">
      {pieces.map((piece, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.round ? piece.size : piece.size * 0.6,
            borderRadius: piece.round ? '50%' : 2,
            background: piece.colour,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

/** Opens when the learner finishes a lesson, and says which one. */
export const CelebrationDialog: React.FC<CelebrationDialogProps> = ({
  isOpen, lessonTitle, isPractice, completedCount, nextTitle, onNext, onProgress, onClose, lang = 'en',
}) => {
  const dialogRef = useDialogFocus<HTMLDivElement>(isOpen, onClose);
  if (!isOpen) return null;

  const isEn = lang === 'en';
  const countText = isEn
    ? `You have now finished ${completedCount} ${completedCount === 1 ? 'lesson' : 'lessons'}.`
    : `Sie haben jetzt ${completedCount} ${completedCount === 1 ? 'Lektion' : 'Lektionen'} abgeschlossen.`;
  const repeatText = isPractice
    ? (isEn ? 'This was practice, so nothing real happened. You can repeat it as often as you like.' : 'Das war eine Übung, es ist also nichts Echtes passiert. Sie können sie so oft wiederholen, wie Sie möchten.')
    : (isEn ? 'You can open this lesson again whenever you like.' : 'Sie können diese Lektion jederzeit wieder öffnen.');
  const outline = 'w-full inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl border-2 border-[#17324D] text-[#17324D] font-bold text-base hover:bg-[#EAF2F8] active:bg-[#E5E9ED]';

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
      aria-describedby="celebration-lesson"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto flex p-4 pb-[76px] bg-black/60"
    >
      <Confetti />
      <div className="celebration-card m-auto w-full max-w-lg bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-4 border-[#176B68] p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span aria-hidden="true" className="celebration-badge shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-[#176B68] text-white">
            <Icon name="check" className="text-4xl sm:text-5xl" />
          </span>
          {/* First in the window, so focus starts on the safe choice and it stays visible on small screens. */}
          <button onClick={onClose} className="inline-flex items-center gap-2 px-3 min-h-[48px] rounded-xl border-2 border-[#17324D] text-[#17324D] font-bold text-base hover:bg-[#EAF2F8] active:bg-[#E5E9ED]">
            <Icon name="close" className="text-xl" />
            {isEn ? 'Close' : 'Schließen'}
          </button>
        </div>
        <h2 id="celebration-title" className="text-3xl font-bold text-[#17324D]">
          {isEn ? 'Well done!' : 'Geschafft!'}
        </h2>
        <div id="celebration-lesson" className="space-y-3">
          <p className="p-3 rounded-xl bg-[#E3F1F0] dark:bg-slate-800 border-2 border-[#176B68] text-[#202B36] dark:text-slate-100">
            {isEn ? 'You finished this lesson:' : 'Sie haben diese Lektion abgeschlossen:'}
            <strong className="block">{lessonTitle}</strong>
          </p>
          <p className="text-[#202B36] dark:text-slate-100"><strong>{countText}</strong> {repeatText}</p>
        </div>
        <div className="space-y-2">
          {nextTitle && (
            <button onClick={onNext} className="w-full text-left inline-flex items-center justify-between gap-3 px-5 py-2 min-h-[56px] rounded-xl bg-[#17324D] hover:bg-[#0F2438] active:bg-[#0A1A2A] text-white font-bold text-base">
              <span className="min-w-0">{isEn ? `Next lesson: ${nextTitle}` : `Nächste Lektion: ${nextTitle}`}</span>
              <Icon name="arrow_forward" className="text-xl" />
            </button>
          )}
          <button onClick={onProgress} className={outline}>
            <Icon name="task_alt" className="text-xl" />
            {isEn ? 'See my progress' : 'Meinen Fortschritt ansehen'}
          </button>
        </div>
      </div>
    </div>
  );
};
