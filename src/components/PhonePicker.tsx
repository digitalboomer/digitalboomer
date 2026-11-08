import React, { useId } from 'react';
import { Laptop, Smartphone } from 'lucide-react';
import { Icon } from './Icon';
import { Language } from '../types';
import { Device, setDevice, useChosenDevice } from '../utils/phoneType';

/** "Where do you use this app?" iPhone, Android phone or computer. The practice screens follow it. */
export const PhonePicker: React.FC<{ lang: Language; compact?: boolean }> = ({ lang, compact }) => {
  const isEn = lang === 'en';
  const chosen = useChosenDevice();
  const name = useId();
  const options: { id: Device; label: string; text: string; Glyph: React.ElementType }[] = [
    { id: 'iphone', label: 'iPhone', text: isEn ? 'Made by Apple. There is an apple on the back.' : 'Von Apple. Auf der Rückseite ist ein Apfel.', Glyph: Smartphone },
    { id: 'android', label: isEn ? 'Android phone' : 'Android-Handy', text: isEn ? 'For example Samsung, Google Pixel, Xiaomi or Motorola.' : 'Zum Beispiel Samsung, Google Pixel, Xiaomi oder Motorola.', Glyph: Smartphone },
    { id: 'computer', label: isEn ? 'Computer' : 'Computer', text: isEn ? 'A laptop or desktop computer, with Windows or Mac.' : 'Ein Laptop oder Standrechner, mit Windows oder Mac.', Glyph: Laptop },
  ];

  return (
    <fieldset className="space-y-2 min-w-0">
      <legend className={`font-bold text-[#17324D] ${compact ? 'text-base mb-1' : 'text-xl mb-2'}`}>
        {isEn ? 'Where do you use your apps?' : 'Wo nutzen Sie Ihre Apps?'}
      </legend>
      {!compact && !chosen && (
        <p className="text-[#202B36] dark:text-slate-100">
          {isEn ? 'The practice screens then look like yours. You can change this at any time.' : 'Die Übungsbildschirme sehen dann aus wie Ihrer. Sie können das jederzeit ändern.'}
        </p>
      )}
      <div className={compact ? 'flex flex-wrap gap-2' : 'grid grid-cols-1 sm:grid-cols-3 gap-2'}>
        {options.map((option) => {
          const selected = chosen === option.id;
          return (
            <label
              key={option.id}
              className={`cursor-pointer rounded-xl border-2 flex items-start gap-3 text-[#202B36] dark:text-slate-100 hover:bg-[#EAF2F8] dark:hover:bg-slate-800 focus-within:ring-[3px] focus-within:ring-[#17324D] focus-within:ring-offset-2 ${
                compact ? 'px-3 py-2 min-h-[48px] items-center' : 'p-3 min-h-[56px]'
              } ${selected ? 'border-[#176B68] border-[3px] bg-[#E3F1F0] dark:bg-slate-800' : 'border-[#667382] bg-[#FFFFFF] dark:bg-slate-900'}`}
            >
              <input type="radio" name={name} value={option.id} checked={selected} onChange={() => setDevice(option.id)} className="sr-only" />
              {selected ? <Icon name="check_circle" className="text-2xl shrink-0 text-[#176B68]" /> : <option.Glyph size={24} className="shrink-0 text-[#17324D]" aria-hidden="true" />}
              <span className="min-w-0">
                <span className="block font-bold">{option.label}{selected && <span className="sr-only">{isEn ? ', selected' : ', ausgewählt'}</span>}</span>
                {!compact && <span className="block text-base">{option.text}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
