import React from 'react';
import { Icon } from './Icon';
import { Language } from '../types';
import { useDialogFocus } from '../utils/useDialogFocus';

/** Asks before leaving an unfinished lesson. "Stay" comes first, so it is the safe choice. */
export const LeaveLessonDialog: React.FC<{ isOpen: boolean; onStay: () => void; onLeave: () => void; lang: Language }> = ({ isOpen, onStay, onLeave, lang }) => {
  const dialogRef = useDialogFocus<HTMLDivElement>(isOpen, onStay);
  if (!isOpen) return null;
  const isEn = lang === 'en';

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-title"
      aria-describedby="leave-text"
      onClick={(event) => {
        if (event.target === event.currentTarget) onStay();
      }}
      className="fixed inset-0 z-50 overflow-y-auto flex p-4 pb-[76px] bg-black/60"
    >
      <div className="m-auto w-full max-w-lg bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#17324D] p-6 space-y-4">
        <h2 id="leave-title" className="text-2xl font-bold text-[#17324D] flex items-start gap-3">
          <Icon name="info" className="text-3xl shrink-0" />
          {isEn ? 'You are leaving an unfinished lesson' : 'Sie verlassen eine nicht abgeschlossene Lektion'}
        </h2>
        <p id="leave-text" className="text-[#202B36] dark:text-slate-100">
          {isEn
            ? 'That is no problem. Your place is saved, and you can continue later under "My progress".'
            : 'Das ist kein Problem. Ihre Stelle ist gespeichert, und Sie können später unter „Mein Fortschritt“ weitermachen.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={onStay} className="flex-1 inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl bg-[#17324D] hover:bg-[#0F2438] active:bg-[#0A1A2A] text-white font-bold text-base">
            {isEn ? 'Stay in the lesson' : 'In der Lektion bleiben'}
          </button>
          <button onClick={onLeave} className="flex-1 inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl border-2 border-[#17324D] text-[#17324D] font-bold text-base hover:bg-[#EAF2F8]">
            {isEn ? 'Leave the lesson' : 'Lektion verlassen'}
          </button>
        </div>
      </div>
    </div>
  );
};
