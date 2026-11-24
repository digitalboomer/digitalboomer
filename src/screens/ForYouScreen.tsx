import React, { useMemo } from 'react';
import { Icon } from '../components/Icon';
import { linkTo } from '../utils/router';
import { TUTORIALS_DE, TUTORIALS_EN } from '../data/content';
import { cleanName, lessonIdsFromLink } from '../utils/familyLink';
import type { Language, PageId } from '../types';

interface ForYouProps {
  lang: Language;
  /** From the link: lesson ids (comma-separated) and an optional first name. */
  lessonList: string;
  name?: string;
  completedIds: string[];
  savedIds: string[];
  onSaveAll: (ids: string[]) => void;
  onNavigate: (page: PageId) => void;
}

/** What a link from "For families" opens: a calm welcome and the lessons someone picked. */
export const ForYouScreen: React.FC<ForYouProps> = ({ lang, lessonList, name, completedIds, savedIds, onSaveAll, onNavigate }) => {
  const isEn = lang === 'en';
  const lessons = isEn ? TUTORIALS_EN : TUTORIALS_DE;
  const ids = useMemo(() => lessonIdsFromLink(lessonList, lessons), [lessonList, lessons]);
  const picked = ids.map((id) => lessons.find((t) => t.id === id)!);
  const first = cleanName(name);
  const allSaved = ids.length > 0 && ids.every((id) => savedIds.includes(id));

  if (picked.length === 0) {
    return (
      <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#17324D] dark:text-white">{isEn ? 'Welcome to Digital Boomer' : 'Willkommen bei Digital Boomer'}</h1>
          <p className="text-lg text-[#202B36] dark:text-slate-200">{isEn ? 'This link does not contain any lessons. Choose a topic to start with instead.' : 'Dieser Link enthält keine Lektionen. Wählen Sie stattdessen ein Thema zum Anfangen.'}</p>
          <a {...linkTo({ page: 'themen' }, () => onNavigate('themen'))} className="link-card inline-flex items-center gap-2 px-6 min-h-[48px] rounded-xl bg-[#17324D] hover:bg-[#0F2438] text-white font-bold text-base">
            {isEn ? 'Choose a topic' : 'Thema wählen'}<Icon name="arrow_forward" className="text-xl" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 p-6 sm:p-8 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#17324D] dark:text-white">
            {/* The name stays as it is: the live translation must not change it. */}
            {first ? <>{isEn ? 'Hello' : 'Hallo'} <span translate="no">{first}</span>!</> : (isEn ? 'Hello!' : 'Hallo!')}
          </h1>
          <p className="text-lg text-[#202B36] dark:text-slate-200">
            {isEn ? 'Someone in your family picked these lessons for you.' : 'Jemand aus Ihrer Familie hat diese Lektionen für Sie ausgesucht.'}
          </p>
          <ul className="space-y-2 text-base text-[#202B36] dark:text-slate-200">
            {[
              isEn ? 'You practise step by step, at your own pace.' : 'Sie üben Schritt für Schritt, in Ihrem Tempo.',
              isEn ? 'Nothing real is sent, and you cannot break anything.' : 'Es wird nichts wirklich gesendet, und Sie können nichts kaputt machen.',
              isEn ? 'You do not need an account.' : 'Sie brauchen kein Konto.',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2"><Icon name="check_circle" className="text-xl text-[#176B68] shrink-0" />{line}</li>
            ))}
          </ul>
        </div>

        <section aria-labelledby="for-you-lessons" className="space-y-3">
          <h2 id="for-you-lessons" className="text-2xl font-bold text-[#17324D] dark:text-white">{isEn ? 'Your lessons' : 'Ihre Lektionen'}</h2>
          <ol className="space-y-3">
            {picked.map((lesson, i) => {
              const done = completedIds.includes(lesson.id);
              return (
                <li key={lesson.id} className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span aria-hidden="true" className="w-11 h-11 shrink-0 rounded-full bg-[#17324D] text-white font-bold text-lg flex items-center justify-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-[#17324D] dark:text-white">{lesson.title}</h3>
                    <p className="text-base text-[#202B36] dark:text-slate-300">
                      {lesson.durationMinutes} {isEn ? 'minutes' : 'Minuten'}
                      {done && <span className="ml-2 inline-flex items-center gap-1 font-bold text-[#176B68]"><Icon name="check_circle" className="text-lg" />{isEn ? 'Done' : 'Erledigt'}</span>}
                    </p>
                  </div>
                  <a {...linkTo({ page: 'tutorial-detail', tutorialId: lesson.id })} className="link-card inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl bg-[#176B68] hover:bg-[#0F514F] active:bg-[#0A3D3B] text-white font-bold text-base shrink-0">
                    {done ? (isEn ? 'Practise again' : 'Noch einmal üben') : (isEn ? 'Start lesson' : 'Lektion starten')}
                    <Icon name="arrow_forward" className="text-xl" />
                  </a>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="bg-[#EAF2F8] dark:bg-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
          {allSaved ? (
            <>
              <p className="text-lg font-bold text-[#17324D] dark:text-white flex items-center gap-2" role="status"><Icon name="bookmark" className="text-xl" />{isEn ? 'These lessons are kept in "My progress".' : 'Diese Lektionen sind unter „Mein Fortschritt“ gespeichert.'}</p>
              <a {...linkTo({ page: 'dashboard' }, () => onNavigate('dashboard'))} className="underline font-bold text-[#17324D] dark:text-white">{isEn ? 'Open My progress' : 'Mein Fortschritt öffnen'}</a>
            </>
          ) : (
            <>
              <p className="text-base text-[#202B36] dark:text-slate-200">{isEn ? 'Want to find these lessons again later, without this link?' : 'Möchten Sie diese Lektionen später ohne diesen Link wiederfinden?'}</p>
              <button type="button" onClick={() => onSaveAll(ids)} className="inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl border-2 border-[#17324D] dark:border-white bg-[#FFFFFF] dark:bg-slate-900 text-[#17324D] dark:text-white font-bold text-base hover:bg-[#F7F8F5]">
                <Icon name="bookmark_border" className="text-xl" />{isEn ? 'Keep them in "My progress"' : 'Unter „Mein Fortschritt“ merken'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
