import React from 'react';
import { Icon } from '../components/Icon';
import { PageId, Language } from '../types';
import { CATEGORIES_EN, CATEGORIES_DE, TUTORIALS_EN, TUTORIALS_DE } from '../data/content';
import { OfficialTopicIcon } from '../components/OfficialTopicIcon';
import { handleImageError } from '../assets/images';
import { fitsDevice, useChosenDevice } from '../utils/phoneType';
import { goTo } from '../utils/router';
import { ServiceLogo } from '../components/ServiceLogo';
import { SERVICES, groupOfCategory } from '../data/services';

interface TopicsScreenProps {
  onNavigate: (page: PageId) => void;
  onSelectCategoryFilter: (categoryId: string) => void;
  onSelectTutorial: (tutorialId: string) => void;
  lang?: Language;
}

export const TopicsScreen: React.FC<TopicsScreenProps> = ({ onNavigate, onSelectCategoryFilter, onSelectTutorial, lang = 'en' }) => {
  const isEn = lang === 'en';
  const categories = isEn ? CATEGORIES_EN : CATEGORIES_DE;
  const device = useChosenDevice();
  const tutorials = (isEn ? TUTORIALS_EN : TUTORIALS_DE).filter((tut) => fitsDevice(tut, device));

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-8 px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-sm text-[#202B36]" aria-label={isEn ? 'Breadcrumb' : 'Brotkrumen-Navigation'}>
            <button onClick={() => onNavigate('home')} className="underline text-[#17324D] min-h-[44px]">{isEn ? 'Home' : 'Startseite'}</button>
            <span aria-hidden="true">/</span>
            <span className="font-bold text-[#17324D]">{isEn ? 'Topics' : 'Themen'}</span>
          </nav>
          <h1 className="text-4xl font-bold text-[#17324D]">{isEn ? 'Choose a topic' : 'Wählen Sie ein Thema'}</h1>
          <p className="text-[#202B36] max-w-[65ch]">
            {isEn ? 'Each lesson is about one thing you want to do. Take your time.' : 'Jede Lektion dreht sich um eine Sache, die Sie tun möchten. Nehmen Sie sich Zeit.'}
          </p>
        </div>

        {categories.map((cat) => {
          const lessons = tutorials.filter((t) => t.categoryId === cat.id);
          const group = groupOfCategory(cat.id);
          return (
            <section key={cat.id} className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
              <img src={cat.image} alt="" loading="lazy" className="w-full h-28 md:h-full object-cover rounded-xl" onError={(e) => handleImageError(e)} />
              <div className="space-y-3 min-w-0">
                <h2 className="text-2xl font-bold text-[#17324D] flex items-center gap-2">
                  <OfficialTopicIcon topicId={cat.id} size="lg" />
                  <span className="min-w-0">{cat.title}</span>
                </h2>
                <p className="text-[#202B36] max-w-[65ch]">{cat.description}</p>
                {group && (
                  <ul className="flex flex-wrap gap-2" aria-label={isEn ? 'Available services' : 'Verfügbare Dienste'}>
                    {SERVICES.filter((service) => service.group === group).map((service) => (
                      <li key={service.id}><ServiceLogo service={service} size={40} /><span className="sr-only">{service.name}</span></li>
                    ))}
                  </ul>
                )}
                {!group && (
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {lessons.slice(0, 4).map((tut) => (
                      <li key={tut.id}>
                        <button
                          onClick={() => onSelectTutorial(tut.id)}
                          className="w-full h-full text-left px-3 py-2 min-h-[48px] rounded-xl border-2 border-[#667382] text-[#17324D] font-bold text-base flex items-center justify-between gap-2 hover:bg-[#EAF2F8] dark:hover:bg-slate-800"
                        >
                          <span className="min-w-0">{tut.title}</span>
                          <Icon name="arrow_forward" className="text-xl" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => onSelectCategoryFilter(cat.id)}
                  className="inline-flex items-center gap-2 px-5 min-h-[48px] rounded-xl bg-[#176B68] hover:bg-[#0F514F] text-white font-bold text-base"
                >
                  {group
                    ? (isEn ? 'Choose your service' : 'Ihren Dienst wählen')
                    : (isEn ? `All ${lessons.length} lessons` : `Alle ${lessons.length} Lektionen`)}
                  <Icon name="arrow_forward" className="text-xl" />
                </button>
                {cat.id === 'ki' && (
                  <button onClick={() => goTo({ page: 'free-roam', tutorialId: 'ai' })} className="ml-2 inline-flex items-center gap-2 px-5 min-h-[48px] rounded-xl border-2 border-[#17324D] text-[#17324D] font-bold text-base hover:bg-[#EAF2F8]">
                    {isEn ? 'Free roam: try a chatbot' : 'Frei erkunden: Chatbot ausprobieren'}
                  </button>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
