import React from 'react';
import { Icon } from '../components/Icon';
import { PageId, Language } from '../types';
import { CATEGORIES_EN, CATEGORIES_DE, TUTORIALS_EN, TUTORIALS_DE } from '../data/content';
import { OfficialTopicIcon } from '../components/OfficialTopicIcon';
import { IMAGES, handleImageError } from '../assets/images';
import { ServiceLogo } from '../components/ServiceLogo';
import { SERVICES, groupOfCategory } from '../data/services';
import { fitsDevice, useChosenDevice } from '../utils/phoneType';

interface HomeScreenProps {
  onNavigate: (page: PageId) => void;
  onSelectTutorial: (tutorialId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenSupportModal: () => void;
  lang?: Language;
}

const primary = 'inline-flex items-center justify-center gap-2 px-6 min-h-[56px] rounded-xl bg-[#17324D] hover:bg-[#0F2438] active:bg-[#0A1A2A] text-white font-bold text-base';
const secondary = 'inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl bg-[#176B68] hover:bg-[#0F514F] active:bg-[#0A3D3B] text-white font-bold text-base';
const outline = 'inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl border-2 border-[#17324D] text-[#17324D] font-bold text-base hover:bg-[#EAF2F8]';

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onSelectTutorial, onSelectCategory, onOpenSupportModal, lang = 'en' }) => {
  const isEn = lang === 'en';
  const categories = isEn ? CATEGORIES_EN : CATEGORIES_DE;
  const device = useChosenDevice();
  const tutorials = (isEn ? TUTORIALS_EN : TUTORIALS_DE).filter((tut) => fitsDevice(tut, device));
  const steps = isEn
    ? [
        ['Choose a topic', 'Pick what you want to do, for example send a photo to your family.'],
        ['Practise on a simulated phone', 'It looks like the real thing, but nothing real happens. You cannot break anything.'],
        ['Use it in real life', 'Repeat a lesson as often as you like. Then try it on your own phone.'],
      ]
    : [
        ['Thema wählen', 'Wählen Sie, was Sie tun möchten, zum Beispiel Ihrer Familie ein Foto schicken.'],
        ['Am simulierten Handy üben', 'Es sieht echt aus, aber es passiert nichts Echtes. Sie können nichts kaputt machen.'],
        ['Im echten Leben anwenden', 'Wiederholen Sie jede Lektion, so oft Sie möchten. Dann probieren Sie es am eigenen Handy.'],
      ];

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950">
      <section className="bg-[#FFFFFF] dark:bg-slate-900 px-4 sm:px-8 py-10 md:py-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <p className="inline-flex items-start gap-2 px-4 py-2 rounded-xl bg-[#E3F1F0] dark:bg-slate-800 border-2 border-[#176B68] text-[#202B36] dark:text-slate-100 font-bold text-base">
              <Icon name="check_circle" className="text-xl text-[#176B68] mt-1" />
              {isEn ? '100% free & ad-free – Step by step at your own pace' : '100% kostenfrei & werbefrei – Schritt für Schritt im eigenen Tempo'}
            </p>
            <h1 className="text-5xl font-bold text-[#17324D]">
              {isEn ? 'Step by step into everyday digital life' : 'Schritt für Schritt in den digitalen Alltag'}
            </h1>
            <p className="text-[#202B36] max-w-[65ch]">
              {isEn
                ? 'Practise messaging, email, social media, online banking and more in a safe place. No account and no prior knowledge needed.'
                : 'Üben Sie Nachrichten, E-Mail, soziale Medien, Online-Banking und mehr an einem sicheren Ort. Ohne Konto und ohne Vorkenntnisse.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => onNavigate('themen')} className={primary}>
                {isEn ? 'Choose a topic' : 'Thema wählen'}
                <Icon name="arrow_forward" className="text-xl" />
              </button>
              <button onClick={() => onSelectTutorial('whatsapp-photo')} className={outline}>
                {isEn ? 'Try it: send a photo' : 'Ausprobieren: Foto senden'}
              </button>
            </div>
          </div>
          <img
            src={IMAGES.heroSeniorWoman}
            alt={isEn ? 'Smiling older woman using her smartphone' : 'Ältere Frau lächelt und benutzt ihr Smartphone'}
            className="w-full aspect-[16/9] sm:aspect-[4/3] object-cover rounded-2xl"
            onError={(e) => handleImageError(e, '/assets/images/hero_senior_woman_1793286326933.jpg')}
          />
        </div>
      </section>

      <section className="px-4 sm:px-8 py-12">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-[#17324D]">{isEn ? 'What would you like to learn?' : 'Was möchten Sie lernen?'}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => {
              const count = tutorials.filter((t) => t.categoryId === cat.id).length;
              const group = groupOfCategory(cat.id);
              return (
                <article key={cat.id} className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 overflow-hidden flex flex-col">
                  <img src={cat.image} alt="" loading="lazy" className="h-20 sm:h-36 w-full object-cover" onError={(e) => handleImageError(e)} />
                  <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2">
                    <h3 className="flex-1 sm:flex-none text-lg sm:text-xl font-bold text-[#17324D] flex items-center gap-2">
                      <span className="hidden sm:inline-flex"><OfficialTopicIcon topicId={cat.id} size="md" /></span>
                      <span className="min-w-0 break-words hyphens-auto">{cat.title}</span>
                    </h3>
                    <p className="hidden sm:block text-[#202B36] text-sm flex-1">{cat.subtitle}</p>
                    {group ? (
                      <span className="hidden sm:flex flex-wrap gap-1" aria-hidden="true">
                        {SERVICES.filter((service) => service.group === group).slice(0, 5).map((service) => <ServiceLogo key={service.id} service={service} size={32} />)}
                      </span>
                    ) : (
                      <p className="hidden sm:block text-[#202B36] text-sm">{isEn ? `${count} lessons` : `${count} Lektionen`}</p>
                    )}
                    <button
                      onClick={() => onSelectCategory(cat.id)}
                      className={`${secondary} w-full !px-2`}
                    >
                      {isEn ? 'Open topic' : 'Thema öffnen'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#EAF2F8] dark:bg-slate-900 px-4 sm:px-8 py-12">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-[#17324D]">{isEn ? 'How it works' : 'So funktioniert es'}</h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map(([title, text], i) => (
              <li key={title} className="flex items-start gap-3">
                <span aria-hidden="true" className="w-11 h-11 shrink-0 rounded-full bg-[#17324D] text-white font-bold flex items-center justify-center">{i + 1}</span>
                <div>
                  <h3 className="text-xl font-bold text-[#17324D]">{title}</h3>
                  <p className="text-[#202B36]">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 sm:px-8 py-12">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-center">
          <img
            src={IMAGES.seniorManLaptop}
            alt={isEn ? 'Older man working calmly on his laptop' : 'Älterer Mann arbeitet entspannt an seinem Laptop'}
            loading="lazy"
            className="w-full aspect-[16/9] sm:aspect-[4/3] object-cover rounded-2xl"
            onError={(e) => handleImageError(e, '/assets/images/senior_man_laptop_1793286327955.jpg')}
          />
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-[#17324D]">{isEn ? 'Just getting started? Then you are in the right place.' : 'Sie fangen gerade an? Dann sind Sie hier richtig.'}</h2>
            <p className="text-[#202B36] max-w-[65ch]">
              {isEn ? 'Mistakes are normal, and no problem here. If you get stuck, help is one tap away.' : 'Fehler sind normal und hier kein Problem. Wenn Sie nicht weiterkommen, ist Hilfe nur einen Tipp entfernt.'}
            </p>
            <button onClick={onOpenSupportModal} className={outline}>
              <Icon name="help" className="text-xl" />
              {isEn ? 'Open help' : 'Hilfe öffnen'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
