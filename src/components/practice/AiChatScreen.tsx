import React, { useContext } from 'react';
import { Bot, Menu, Mic, Plus, Send, User } from 'lucide-react';
import { PracticeContext, PracticeTap } from './PracticeTap';
import { PhoneKeyboard, StatusBar } from './PhoneParts';
import type { PracticeScreenProps } from './practiceScreens';

const iconBtn = 'flex items-center justify-center rounded-full shrink-0';

/** A made-up AI chat with one pre-written answer. It does not use real AI. */
export const AiChatScreen: React.FC<PracticeScreenProps> = ({ screen, isDone, labels, lang }) => {
  const { typed } = useContext(PracticeContext);
  const typing = screen === 'typing';
  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ background: '#FFFFFF', color: '#1F1F1F' }}>
      <StatusBar background="#FFFFFF" color="#1F1F1F" />
      <div className="flex items-center gap-1 px-1 shrink-0 border-b" style={{ borderColor: '#ECECEC' }}>
        <PracticeTap id="menu" label={labels.menu} className={iconBtn}><Menu size={23} aria-hidden="true" /></PracticeTap>
        <h3 className="flex-1 text-center text-[1.05rem] font-bold">{labels.appTitle}</h3>
        <span aria-hidden="true" className="w-11" />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-end gap-3 p-3">
        {!isDone && !typed && <p className="self-center text-center text-[1.2rem] font-bold">{labels.greeting}</p>}
        {isDone && (
          <>
            <p className="self-end max-w-[85%] px-3 py-2 rounded-2xl text-[1rem] break-words" style={{ background: '#F0F0F0' }}>{typed || labels.suggest1}</p>
            <div className="flex items-start gap-2 sim-fade">
              <span aria-hidden="true" className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#176B68', color: '#FFFFFF' }}><Bot size={18} /></span>
              <p className="text-[1rem] leading-snug">{labels.answer}</p>
            </div>
            <p className="text-[0.85rem] flex items-center gap-1" style={{ color: '#5F6368' }}><User size={14} aria-hidden="true" />{labels.answerNote}</p>
          </>
        )}
      </div>
      {!isDone && (
        <div className="flex items-center gap-1 p-1.5 shrink-0">
          <PracticeTap id="attach" label={labels.attach} className={iconBtn}><Plus size={24} aria-hidden="true" /></PracticeTap>
          <PracticeTap id="message-field" label={labels.field} className="flex-1 min-w-0 px-3 rounded-3xl text-left text-[1rem] truncate" style={{ background: '#F4F4F4', color: typed ? '#1F1F1F' : '#6B6B6B' }}>{typed || labels.field}</PracticeTap>
          {typed ? (
            <PracticeTap id="send" label={labels.send} pointer="above-right" className={`${iconBtn} w-11 h-11`} style={{ background: '#176B68', color: '#FFFFFF' }}><Send size={20} aria-hidden="true" /></PracticeTap>
          ) : (
            <PracticeTap id="microphone" label={labels.microphone} className={iconBtn}><Mic size={22} aria-hidden="true" /></PracticeTap>
          )}
        </div>
      )}
      {typing && <PhoneKeyboard lang={lang} suggestions={[labels.suggest1, labels.suggest2, labels.suggest3]} spaceLabel={labels.space} deleteLabel={labels.deleteKey} shiftLabel={labels.shift} />}
    </div>
  );
};
