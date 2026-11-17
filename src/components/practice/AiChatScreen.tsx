import React, { useContext, useEffect, useRef, useState } from 'react';
import { Bot, Menu, Mic, Plus, Send, SquarePen } from 'lucide-react';
import { PracticeContext, PracticeTap } from './PracticeTap';
import { PhoneKeyboard, StatusBar } from './PhoneParts';
import type { PracticeScreenProps } from './practiceScreens';

const iconBtn = 'flex items-center justify-center rounded-full shrink-0';
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * A practice chatbot. It does not use real AI: it knows three example questions, each with a
 * pre-written answer and three pre-written follow-up answers, so the learner can try a real
 * back-and-forth conversation. Questions of their own get an honest "practice only" note.
 *
 * Screens: chat (empty, tap the field) → typing (choose or write a question) → answer (read it,
 * tap the field again) → followup (ask a follow-up) → done (the whole conversation).
 */
export const AiChatScreen: React.FC<PracticeScreenProps> = ({ screen, isDone, labels, lang }) => {
  const { typed, setTyped, fields } = useContext(PracticeContext);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [writing, setWriting] = useState(() => !reducedMotion());

  const questions = [labels.q1, labels.q2, labels.q3].filter(Boolean);
  // After a reload the typed question is gone (only the step is saved): then the first example stands in.
  const question = (screen === 'typing' ? typed : fields.question ?? '').trim() || (screen === 'typing' ? '' : labels.q1);
  const known = questions.indexOf(question);
  const topic = known < 0 ? 0 : known;
  const followups = [1, 2, 3].map((k) => labels[`f${topic + 1}_${k}`]).filter(Boolean);
  const followup = (screen === 'followup' && !isDone ? typed : fields.followup ?? typed ?? '').trim() || (isDone ? followups[0] : '');
  const followKnown = followups.indexOf(followup);

  const answer = `${known < 0 ? `${labels.ownQuestion}\n\n` : ''}${labels[`a${topic + 1}`]}`;
  const reply = `${followKnown < 0 ? `${labels.ownFollowup}\n\n` : ''}${labels[`r${topic + 1}_${followKnown < 0 ? 1 : followKnown + 1}`]}`;

  const showAnswer = screen === 'answer' || screen === 'followup' || isDone;
  const showReply = isDone;
  // The newest answer is "written" for a moment, like a real chatbot (not with reduced motion).
  useEffect(() => {
    if (!writing) return;
    const timer = window.setTimeout(() => setWriting(false), 1100);
    return () => window.clearTimeout(timer);
  }, [writing]);
  const newestWriting = writing && (screen === 'answer' || isDone);

  useEffect(() => {
    const box = scrollRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [screen, writing, isDone]);

  const pick = (text: string) => (event: React.MouseEvent) => {
    event.stopPropagation(); // not a tap on empty space
    setTyped(text);
  };

  const userBubble = (text: string) => (
    <p className="self-end max-w-[85%] px-3 py-2 rounded-2xl text-[0.98rem] break-words" style={{ background: '#F0F0F0' }}>{text}</p>
  );
  const botBubble = (text: string, isNewest: boolean) => (
    <div className="flex items-start gap-2">
      <span aria-hidden="true" className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#176B68', color: '#FFFFFF' }}><Bot size={18} /></span>
      {isNewest && newestWriting ? (
        <p className="text-[0.98rem] py-1" style={{ color: '#5F6368' }}>
          <span className="inline-flex gap-1 align-middle mr-2" aria-hidden="true">
            {[0, 1, 2].map((i) => <span key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#5F6368', animationDelay: `${i * 150}ms` }} />)}
          </span>
          {labels.writing}
        </p>
      ) : (
        <p className="text-[0.98rem] leading-snug whitespace-pre-line sim-fade">{text}</p>
      )}
    </div>
  );

  const chips = (items: string[]) => (
    <div className="flex flex-col gap-1.5 px-2 pb-1.5 shrink-0">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={pick(item)}
          className="text-left px-3 min-h-[40px] rounded-xl text-[0.92rem] leading-tight border"
          style={{ background: typed === item ? '#E3F1F0' : '#FFFFFF', borderColor: typed === item ? '#176B68' : '#D7D7D7', color: '#1F1F1F' }}
        >
          {item}
        </button>
      ))}
    </div>
  );

  const typingQuestion = screen === 'typing' && !isDone;
  const typingFollowup = screen === 'followup' && !isDone;
  const inputText = typingQuestion || typingFollowup ? typed : '';
  const placeholder = screen === 'chat' || typingQuestion ? labels.field : labels.followField;

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ background: '#FFFFFF', color: '#1F1F1F' }}>
      <StatusBar background="#FFFFFF" color="#1F1F1F" />
      <div className="flex items-center gap-1 px-1 shrink-0 border-b" style={{ borderColor: '#ECECEC' }}>
        <PracticeTap id="menu" label={labels.menu} className={iconBtn}><Menu size={23} aria-hidden="true" /></PracticeTap>
        <h3 className="flex-1 text-center text-[1.05rem] font-bold">{labels.appTitle}</h3>
        <span aria-hidden="true" className="w-11 h-11 flex items-center justify-center"><SquarePen size={21} /></span>
      </div>

      <div ref={scrollRef} className="flex-1 min-h-0 sim-scroll flex flex-col gap-3 p-3">
        {!showAnswer && !typed && (
          <div className="m-auto text-center space-y-2 px-2">
            <p className="text-[1.25rem] font-bold">{labels.greeting}</p>
            {screen === 'chat' && <p className="text-[0.95rem]" style={{ color: '#5F6368' }}>{labels.startHint}</p>}
          </div>
        )}
        {showAnswer && (
          <>
            {userBubble(question)}
            {botBubble(answer, !showReply)}
          </>
        )}
        {showReply && (
          <>
            {userBubble(followup)}
            {botBubble(reply, true)}
          </>
        )}
      </div>

      {typingQuestion && (
        <>
          <p className="px-3 pb-1 text-[0.85rem] font-bold shrink-0" style={{ color: '#5F6368' }}>{labels.examplesTitle}</p>
          {chips(questions)}
        </>
      )}
      {typingFollowup && (
        <>
          <p className="px-3 pb-1 text-[0.85rem] font-bold shrink-0" style={{ color: '#5F6368' }}>{labels.followTitle}</p>
          {chips(followups)}
        </>
      )}

      {!isDone && (
        <div className="flex items-center gap-1 p-1.5 shrink-0">
          <PracticeTap id="attach" label={labels.attach} className={iconBtn}><Plus size={24} aria-hidden="true" /></PracticeTap>
          <PracticeTap id="message-field" label={placeholder} pointer="above-left" className="flex-1 min-w-0 px-3 rounded-3xl text-left text-[0.98rem] truncate" style={{ background: '#F4F4F4', color: inputText ? '#1F1F1F' : '#6B6B6B' }}>{inputText || placeholder}</PracticeTap>
          {inputText ? (
            <PracticeTap id="send" label={labels.send} pointer="above-right" className={`${iconBtn} w-11 h-11`} style={{ background: '#176B68', color: '#FFFFFF' }}><Send size={20} aria-hidden="true" /></PracticeTap>
          ) : (
            <PracticeTap id="microphone" label={labels.microphone} className={iconBtn}><Mic size={22} aria-hidden="true" /></PracticeTap>
          )}
        </div>
      )}
      <p className="px-3 pb-1.5 text-center text-[0.78rem] leading-tight shrink-0" style={{ color: '#5F6368' }}>{labels.disclaimer}</p>
      {(typingQuestion || typingFollowup) && (
        <PhoneKeyboard lang={lang} suggestions={[labels.wordPlease, labels.wordThanks, '?']} spaceLabel={labels.space} deleteLabel={labels.deleteKey} shiftLabel={labels.shift} />
      )}
    </div>
  );
};
