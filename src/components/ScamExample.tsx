import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Mail, MessageSquare, Phone, QrCode, ShieldAlert, ShoppingCart, TriangleAlert, Paperclip } from 'lucide-react';
import type { Language } from '../types';
import { scamExamples } from '../data/safetyLessons';

const ICONS = { email: Mail, sms: MessageSquare, chat: MessageSquare, call: Phone, popup: TriangleAlert, shop: ShoppingCart, qr: QrCode, file: Paperclip };

/**
 * A made-up scam message with numbered warning signs. The learner taps each one.
 * Nothing here is a working link. `.phone-sim` keeps its colours in every theme.
 */
export const ScamExample: React.FC<{ id: string; lang: Language; onDone?: () => void }> = ({ id, lang, onDone }) => {
  const en = lang === 'en';
  const card = useMemo(() => scamExamples(lang)[id], [lang, id]);
  const [seen, setSeen] = useState<number[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const total = card?.signs.length ?? 0;
  const allSeen = seen.length === total && total > 0;

  useEffect(() => {
    if (allSeen) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSeen]);

  if (!card) return null;
  const Glyph = ICONS[card.kind];
  const dark = card.kind === 'popup';

  const tapSign = (n: number) => {
    setOpen(n);
    setSeen((prev) => (prev.includes(n) ? prev : [...prev, n]));
  };

  return (
    <div className="my-4 space-y-3">
      <div className="phone-sim rounded-2xl overflow-hidden" style={{ border: '2px solid #667382', background: dark ? '#7A1410' : '#FFFFFF', color: dark ? '#FFFFFF' : '#202B36' }}>
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2" style={{ background: '#17324D', color: '#FFFFFF' }}>
          <span className="flex items-center gap-2 font-bold text-[1rem] min-w-0"><Glyph size={20} className="shrink-0" aria-hidden="true" />{card.heading}</span>
          <span className="flex items-center gap-1 px-2 rounded-md text-[0.875rem] font-bold shrink-0" style={{ background: '#FDECEA', color: '#B3261E' }}><ShieldAlert size={16} aria-hidden="true" />{en ? 'Scam example' : 'Betrugs-Beispiel'}</span>
        </div>
        <div className="p-3 space-y-2">
          {card.blocks.map((block, i) => {
            const style = block.kind === 'title' ? 'text-[1.1rem] font-bold' : block.kind === 'label' ? 'text-[0.95rem] break-all' : block.kind === 'small' ? 'text-[0.9rem]' : 'text-[1rem]';
            const content = block.kind === 'button' ? (
              <span className="inline-block px-3 py-2 rounded-lg font-bold text-[1rem] break-all" style={{ background: dark ? '#FFFFFF' : '#14457A', color: dark ? '#7A1410' : '#FFFFFF' }}>{block.text}</span>
            ) : (
              <span className={style}>{block.text}</span>
            );
            if (!block.sign) return <div key={i}>{content}</div>;
            const n = block.sign;
            const isSeen = seen.includes(n);
            return (
              <button
                key={i}
                type="button"
                onClick={() => tapSign(n)}
                aria-label={en ? `Warning sign ${n}: ${block.text}` : `Warnzeichen ${n}: ${block.text}`}
                className="w-full text-left flex items-start gap-2 p-1.5 min-h-[44px] rounded-lg"
                style={{ outline: open === n ? '3px solid #17324D' : undefined, background: isSeen ? (dark ? '#9A2A25' : '#EAF2F8') : 'transparent' }}
              >
                <span aria-hidden="true" className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-[0.95rem]" style={{ background: isSeen ? '#176B68' : '#B3261E', color: '#FFFFFF', border: '2px solid #FFFFFF' }}>
                  {isSeen ? <CheckCircle2 size={18} /> : n}
                </span>
                <span className="min-w-0 flex-1 self-center">{content}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="font-bold text-[#17324D]" aria-live="polite">
        {en ? `${seen.length} of ${total} warning signs found` : `${seen.length} von ${total} Warnzeichen gefunden`}
      </p>
      {open !== null && (
        <div aria-live="polite" className="p-4 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 border-2 border-[#17324D] text-[#202B36] dark:text-slate-100">
          <strong className="block">{open}. {card.signs[open - 1].title}</strong>
          {card.signs[open - 1].text}
        </div>
      )}
      {allSeen && (
        <div className="p-4 rounded-xl bg-[#E3F1F0] dark:bg-slate-800 border-2 border-[#176B68] text-[#202B36] dark:text-slate-100 flex items-start gap-3">
          <CheckCircle2 size={28} className="shrink-0 text-[#176B68]" aria-hidden="true" />
          <div><strong className="block">{en ? 'You found them all. What to do:' : 'Sie haben alle gefunden. Das tun Sie:'}</strong>{card.advice}</div>
        </div>
      )}
    </div>
  );
};
