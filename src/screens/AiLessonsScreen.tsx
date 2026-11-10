import React from 'react';
import { Icon } from '../components/Icon';
import { OfficialTopicIcon } from '../components/OfficialTopicIcon';
import { handleImageError } from '../assets/images';
import { CATEGORIES_DE, CATEGORIES_EN, TUTORIALS_DE, TUTORIALS_EN } from '../data/content';
import { Language, PageId } from '../types';

interface AiLessonsScreenProps {
  onNavigate: (page: PageId) => void;
  onSelectTutorial: (tutorialId: string) => void;
  completedIds: string[];
  lang?: Language;
}

/** "Everyday AI": all AI lessons on one page, like the Digital Safety page has its guides. */
export const AiLessonsScreen: React.FC<AiLessonsScreenProps> = ({ onNavigate, onSelectTutorial, completedIds, lang = 'en' }) => {
  const isEn = lang === 'en';
  const category = (isEn ? CATEGORIES_EN : CATEGORIES_DE).find((cat) => cat.id === 'ki');
  const lessons = (isEn ? TUTORIALS_EN : TUTORIALS_DE).filter((tut) => tut.categoryId === 'ki');
  const done = lessons.filter((tut) => completedIds.includes(tut.id)).length;

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-3">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-[#202B36]" aria-label={isEn ? 'Breadcrumb' : 'Brotkrumen-Navigation'}>
            <button onClick={() => onNavigate('home')} className="underline text-[#17324D] min-h-[44px]">{isEn ? 'Home' : 'Startseite'}</button>
            <span aria-hidden="true">/</span>
            <button onClick={() => onNavigate('themen')} className="underline text-[#17324D] min-h-[44px]">{isEn ? 'Topics' : 'Themen'}</button>
            <span aria-hidden="true">/</span>
            <span className="font-bold text-[#17324D]">{category?.title}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#17324D] flex items-center gap-3">
            <OfficialTopicIcon topicId="ki" size="lg" />
            <span className="min-w-0">{category?.title}</span>
          </h1>
          <p className="text-[#202B36] max-w-[65ch]">{category?.description}</p>
          <p className="flex items-center gap-2 font-bold text-[#17324D]">
            <Icon name="task_alt" className="text-2xl text-[#176B68]" />
            {isEn ? `${done} of ${lessons.length} lessons completed` : `${done} von ${lessons.length} Lektionen abgeschlossen`}
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#17324D]">{isEn ? `All AI lessons (${lessons.length})` : `Alle KI-Lektionen (${lessons.length})`}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson, index) => {
              const isDone = completedIds.includes(lesson.id);
              return (
                <li key={lesson.id}>
                  <button
                    onClick={() => onSelectTutorial(lesson.id)}
                    className="w-full h-full text-left bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#667382] hover:border-[#176B68] hover:bg-[#EAF2F8] overflow-hidden flex flex-col"
                  >
                    <img src={lesson.image} alt="" loading="lazy" className="w-full h-32 object-cover" onError={(e) => handleImageError(e)} />
                    <span className="p-4 flex flex-col gap-2 flex-1">
                      <span className="font-bold text-lg text-[#17324D]">{index + 1}. {lesson.title}</span>
                      <span className="text-base text-[#202B36]">{lesson.description}</span>
                      <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-[#202B36]">
                        <span className="inline-flex items-center gap-1"><Icon name="schedule" className="text-xl" />{isEn ? `${lesson.durationMinutes} min` : `${lesson.durationMinutes} Min.`}</span>
                        {isDone && (
                          <span className="inline-flex items-center gap-1 font-bold text-[#176B68]"><Icon name="check_circle" className="text-xl" />{isEn ? 'Completed' : 'Abgeschlossen'}</span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <button onClick={() => onNavigate('themen')} className="inline-flex items-center gap-2 px-5 min-h-[48px] rounded-xl border-2 border-[#17324D] text-[#17324D] font-bold text-base hover:bg-[#EAF2F8]">
          <Icon name="arrow_back" className="text-xl" />
          {isEn ? 'Back to all topics' : 'Zurück zu allen Themen'}
        </button>
      </div>
    </div>
  );
};
