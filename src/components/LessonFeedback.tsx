import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import type { Language } from '../types';
import { useChosenDevice } from '../utils/phoneType';
import { LessonRating, sendLessonFeedback } from '../utils/lessonFeedback';

type SendState = 'idle' | 'empty' | 'sending' | 'saved' | 'failed';

/**
 * "Was this lesson easy?" in the celebration window. One tap sends the answer (anonymous);
 * a comment is optional and is saved as a second row with the same answer (see docs/lesson-feedback-setup.md).
 */
export const LessonFeedback: React.FC<{ lessonId: string; isPractice: boolean; lang: Language }> = ({ lessonId, isPractice, lang }) => {
  const isEn = lang === 'en';
  const chosenDevice = useChosenDevice();
  // The device matters only for practice lessons, which look different on iPhone, Android and computer.
  const device = isPractice ? chosenDevice ?? '' : '';
  const [rating, setRating] = useState<LessonRating | null>(null);
  const [ratingState, setRatingState] = useState<SendState>('idle');
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [commentState, setCommentState] = useState<SendState>('idle');

  // The tapped button and the comment form disappear, so focus moves to the message that replaces them
  // (otherwise it would fall out of the window).
  const statusRef = useRef<HTMLDivElement>(null);
  const thanksRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (rating) statusRef.current?.focus(); }, [rating]);
  useEffect(() => { if (commentState === 'saved') thanksRef.current?.focus(); }, [commentState]);

  const answers: { id: LessonRating; icon: string; label: string }[] = [
    { id: 'easy', icon: 'sentiment_satisfied', label: isEn ? 'Easy' : 'Leicht' },
    { id: 'okay', icon: 'sentiment_neutral', label: isEn ? 'Okay' : 'Es ging' },
    { id: 'hard', icon: 'sentiment_dissatisfied', label: isEn ? 'Hard' : 'Schwer' },
  ];

  const rate = async (answer: LessonRating) => {
    setRating(answer);
    setRatingState('sending');
    const saved = await sendLessonFeedback({ lessonId, rating: answer, comment: '', lang, device });
    setRatingState(saved ? 'saved' : 'failed');
  };

  const sendComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!rating) return;
    if (!comment.trim()) {
      setCommentState('empty');
      return;
    }
    setCommentState('sending');
    const saved = await sendLessonFeedback({ lessonId, rating, comment, lang, device });
    setCommentState(saved ? 'saved' : 'failed');
  };

  const chosen = answers.find((a) => a.id === rating);
  const outline = 'inline-flex items-center justify-center gap-2 px-4 min-h-[48px] rounded-xl border-2 border-[#17324D] text-[#17324D] dark:text-white dark:border-white font-bold text-base hover:bg-[#EAF2F8] active:bg-[#E5E9ED] dark:hover:bg-slate-800';
  const successBox = 'flex items-start gap-2 p-3 rounded-xl bg-[#E3F1F0] dark:bg-slate-800 border-2 border-[#176B68] text-[#202B36] dark:text-slate-100';

  return (
    <section aria-labelledby="lesson-feedback-title" className="pt-4 border-t-2 border-[#E5E9ED] dark:border-slate-700 space-y-3">
      <h3 id="lesson-feedback-title" className="text-xl font-bold text-[#17324D]">
        {isEn ? 'Was this lesson easy?' : 'War diese Lektion leicht?'}
      </h3>

      {!rating ? (
        <>
          <p className="text-base text-[#202B36] dark:text-slate-100">
            {isEn ? 'Your answer helps us improve the lessons. It is anonymous.' : 'Ihre Antwort hilft uns, die Lektionen zu verbessern. Sie ist anonym.'}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {answers.map((answer) => (
              <button
                key={answer.id}
                type="button"
                onClick={() => void rate(answer.id)}
                className="flex flex-col items-center justify-center gap-1 px-2 py-2 min-h-[72px] rounded-xl border-2 border-[#176B68] bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-slate-100 font-bold text-base hover:bg-[#E3F1F0] active:bg-[#CFE6E4] dark:hover:bg-slate-700"
              >
                <Icon name={answer.icon} className="text-3xl text-[#176B68] dark:text-teal-300" />
                {answer.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div ref={statusRef} tabIndex={-1} role="status" className="space-y-3 focus:outline-none">
          {ratingState === 'sending' && (
            <p className="flex items-center gap-2 text-[#202B36] dark:text-slate-100">
              <Icon name="progress_activity" className="text-xl animate-spin motion-reduce:animate-none" />
              {isEn ? 'Sending your answer…' : 'Ihre Antwort wird gesendet …'}
            </p>
          )}
          {ratingState === 'saved' && (
            <p className={successBox}>
              <Icon name="check_circle" className="text-xl text-[#176B68] dark:text-teal-300 shrink-0 mt-1" />
              <span>
                <strong>{isEn ? 'Thank you!' : 'Vielen Dank!'}</strong>{' '}
                {isEn ? `Your answer "${chosen?.label}" was saved.` : `Ihre Antwort „${chosen?.label}“ wurde gespeichert.`}
              </span>
            </p>
          )}
          {ratingState === 'failed' && (
            <p className="flex items-start gap-2 p-3 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 border-2 border-[#17324D] dark:border-slate-500 text-[#202B36] dark:text-slate-100">
              <Icon name="info" className="text-xl text-[#17324D] dark:text-white shrink-0 mt-1" />
              <span>
                <strong>{isEn ? 'Thank you!' : 'Vielen Dank!'}</strong>{' '}
                {isEn ? 'Your answer could not be saved just now. That is not a problem: your lesson is still finished.' : 'Ihre Antwort konnte gerade nicht gespeichert werden. Das ist nicht schlimm: Ihre Lektion ist trotzdem abgeschlossen.'}
              </span>
            </p>
          )}
        </div>
      )}

      {ratingState === 'saved' && !commentOpen && (
        <button type="button" onClick={() => setCommentOpen(true)} className={outline}>
          <Icon name="comment" className="text-xl" />
          {isEn ? 'Add a comment (optional)' : 'Einen Kommentar schreiben (freiwillig)'}
        </button>
      )}

      {ratingState === 'saved' && commentOpen && commentState !== 'saved' && (
        <form onSubmit={(event) => void sendComment(event)} className="space-y-2">
          <label htmlFor="lesson-feedback-comment" className="block font-bold text-[#17324D] dark:text-white">
            {isEn ? 'What could we do better?' : 'Was können wir besser machen?'}
          </label>
          <p id="lesson-feedback-hint" className="text-base text-[#202B36] dark:text-slate-100">
            {isEn ? 'Please do not write your name, email address or other personal information.' : 'Bitte schreiben Sie nicht Ihren Namen, Ihre E-Mail-Adresse oder andere persönliche Angaben.'}
          </p>
          <textarea
            id="lesson-feedback-comment"
            aria-describedby="lesson-feedback-hint"
            rows={3}
            maxLength={500}
            autoFocus
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className="w-full px-4 py-3 min-h-[48px] rounded-xl border-2 border-[#667382] bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-white text-base focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#17324D] focus-visible:ring-offset-2"
          />
          {(commentState === 'failed' || commentState === 'empty') && (
            <p role="status" className="flex items-start gap-2 text-[#202B36] dark:text-slate-100">
              <Icon name="info" className="text-xl shrink-0 mt-1" />
              {commentState === 'empty'
                ? (isEn ? 'Please write a few words first. You can also just close the window.' : 'Bitte schreiben Sie zuerst ein paar Worte. Sie können das Fenster auch einfach schließen.')
                : (isEn ? 'Your comment could not be sent just now. You can try again.' : 'Ihr Kommentar konnte gerade nicht gesendet werden. Sie können es noch einmal versuchen.')}
            </p>
          )}
          <button
            type="submit"
            disabled={commentState === 'sending'}
            className="inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl bg-[#176B68] hover:bg-[#0F514F] active:bg-[#0A3D3B] text-white font-bold text-base disabled:opacity-70"
          >
            <Icon name="send" className="text-xl" />
            {isEn ? 'Send comment' : 'Kommentar senden'}
          </button>
        </form>
      )}

      {commentState === 'saved' && (
        <p ref={thanksRef} tabIndex={-1} role="status" className={`${successBox} focus:outline-none`}>
          <Icon name="check_circle" className="text-xl text-[#176B68] dark:text-teal-300 shrink-0 mt-1" />
          {isEn ? 'Thank you for your comment. Our team will read it.' : 'Vielen Dank für Ihren Kommentar. Unser Team wird ihn lesen.'}
        </p>
      )}
    </section>
  );
};
