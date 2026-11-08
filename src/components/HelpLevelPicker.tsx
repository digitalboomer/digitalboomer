import React, { useId } from 'react';
import { Icon } from './Icon';
import { Language } from '../types';
import { HelpLevel, setHelpLevel, useHelpLevel } from '../utils/helpLevel';

const OPTIONS: { id: HelpLevel; icon: string; en: [string, string]; de: [string, string] }[] = [
  {
    id: 'none',
    icon: 'task_alt',
    en: ['No help', 'You only see the task and try it yourself. You can still ask for a tip.'],
    de: ['Keine Hilfe', 'Sie sehen nur die Aufgabe und probieren es selbst. Einen Tipp können Sie trotzdem anfordern.'],
  },
  {
    id: 'tips',
    icon: 'lightbulb',
    en: ['Tips', 'You get instructions, and a hint if you tap the wrong spot.'],
    de: ['Tipps', 'Sie bekommen eine Anleitung und einen Hinweis, wenn Sie falsch tippen.'],
  },
  {
    id: 'full',
    icon: 'verified_user',
    en: ['Complete help', 'Everything is explained, and each step shows you where to tap.'],
    de: ['Volle Hilfe', 'Alles wird erklärt, und jeder Schritt zeigt Ihnen, wohin Sie tippen.'],
  },
];

/** Choose how much help you want. `compact` is the small version used during a lesson. */
export const HelpLevelPicker: React.FC<{ lang: Language; compact?: boolean }> = ({ lang, compact }) => {
  const isEn = lang === 'en';
  const level = useHelpLevel();
  const name = useId();

  return (
    <fieldset className="space-y-2 min-w-0">
      <legend className={`font-bold text-[#17324D] ${compact ? 'text-base mb-1' : 'text-xl mb-2'}`}>
        {isEn ? 'How much help would you like?' : 'Wie viel Hilfe möchten Sie?'}
      </legend>
      <div className={compact ? 'flex flex-wrap gap-2' : 'grid grid-cols-1 gap-2'}>
        {OPTIONS.map((option) => {
          const [label, text] = isEn ? option.en : option.de;
          const selected = level === option.id;
          return (
            <label
              key={option.id}
              className={`cursor-pointer rounded-xl border-2 flex items-start gap-3 text-[#202B36] dark:text-slate-100 hover:bg-[#EAF2F8] dark:hover:bg-slate-800 focus-within:ring-[3px] focus-within:ring-[#17324D] focus-within:ring-offset-2 ${
                compact ? 'px-3 py-2 min-h-[48px] items-center' : 'p-3 min-h-[56px]'
              } ${selected ? 'border-[#176B68] border-[3px] bg-[#E3F1F0] dark:bg-slate-800' : 'border-[#667382] bg-[#FFFFFF] dark:bg-slate-900'}`}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={selected}
                onChange={() => setHelpLevel(option.id)}
                className="sr-only"
              />
              <Icon name={selected ? 'check_circle' : option.icon} className={`text-2xl shrink-0 ${selected ? 'text-[#176B68]' : 'text-[#17324D]'}`} />
              <span className="min-w-0">
                <span className="block font-bold">{label}{selected && <span className="sr-only">{isEn ? ', selected' : ', ausgewählt'}</span>}</span>
                {!compact && <span className="block text-base">{text}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
