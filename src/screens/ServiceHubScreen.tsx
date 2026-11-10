import React, { useEffect, useRef } from 'react';
import { Icon } from '../components/Icon';
import { goTo } from '../utils/router';
import { ServiceLogo } from '../components/ServiceLogo';
import { PageId, Language } from '../types';
import { TUTORIALS_EN, TUTORIALS_DE } from '../data/content';
import { GROUP_CATEGORY, SERVICES, ServiceGroup } from '../data/services';
import { lessonRank } from '../data/learningPath';
import { PhonePicker } from '../components/PhonePicker';
import { useChosenDevice } from '../utils/phoneType';

interface ServiceHubScreenProps {
  group: ServiceGroup;
  selectedService?: string;
  onSelectService: (serviceId?: string) => void;
  onNavigate: (page: PageId) => void;
  onSelectTutorial: (tutorialId: string) => void;
  completedIds: string[];
  lang?: Language;
}

const TEXTS: Record<ServiceGroup, { en: [string, string, string, string]; de: [string, string, string, string] }> = {
  messaging: {
    en: ['Messaging apps', 'Which app do you use?', 'Each app looks a little different. Choose yours, and practise on a phone screen that looks like it.', 'Not sure? Look at your phone. Your apps have these names and pictures.'],
    de: ['Nachrichten-Apps', 'Welche App benutzen Sie?', 'Jede App sieht etwas anders aus. Wählen Sie Ihre App und üben Sie an einem Handy-Bildschirm, der ihr ähnelt.', 'Nicht sicher? Schauen Sie auf Ihr Handy. Ihre Apps haben diese Namen und Bilder.'],
  },
  email: {
    en: ['Email', 'Which email service do you use?', 'Your email address often shows it: the part after the @ sign, for example @gmail.com or @gmx.de.', 'Not sure? Look at your email address, or ask someone you trust.'],
    de: ['E-Mail', 'Welchen E-Mail-Dienst benutzen Sie?', 'Ihre E-Mail-Adresse verrät es oft: der Teil nach dem @-Zeichen, zum Beispiel @gmail.com oder @gmx.de.', 'Nicht sicher? Schauen Sie auf Ihre E-Mail-Adresse, oder fragen Sie eine Vertrauensperson.'],
  },
  social: {
    en: ['Social media', 'Which service interests you?', 'Practise the basics with made-up posts. Nothing you do here is really published.', 'You do not need any of these. Only join what you enjoy.'],
    de: ['Soziale Medien', 'Welcher Dienst interessiert Sie?', 'Üben Sie die Grundlagen mit erfundenen Beiträgen. Nichts, was Sie hier tun, wird wirklich veröffentlicht.', 'Sie brauchen keinen dieser Dienste. Machen Sie nur mit, wenn es Ihnen Freude macht.'],
  },
  banking: {
    en: ['Online banking', 'Which bank are you with?', 'Practise transfers, standing orders, payments abroad and more, with made-up money. The practice screen is a neutral example, not your bank\'s real app, so yours will look different.', 'Your bank\'s website or a branch can show you its real app. Never enter your real login data on a practice site.'],
    de: ['Online-Banking', 'Bei welcher Bank sind Sie?', 'Üben Sie Überweisungen, Daueraufträge, Zahlungen ins Ausland und mehr, mit erfundenem Geld. Der Übungsbildschirm ist ein neutrales Beispiel, nicht die echte App Ihrer Bank, Ihre sieht also anders aus.', 'Die Website oder eine Filiale Ihrer Bank zeigt Ihnen die echte App. Geben Sie niemals echte Zugangsdaten auf einer Übungsseite ein.'],
  },
};

/** Choose your service first, then what you want to do in it. */
export const ServiceHubScreen: React.FC<ServiceHubScreenProps> = ({ group, selectedService, onSelectService, onNavigate, onSelectTutorial, completedIds, lang = 'en' }) => {
  const isEn = lang === 'en';
  const [crumb, title, intro, note] = TEXTS[group][isEn ? 'en' : 'de'];
  const tutorials = isEn ? TUTORIALS_EN : TUTORIALS_DE;
  const services = SERVICES.filter((service) => service.group === group);
  const selected = services.find((service) => service.id === selectedService);
  const panelRef = useRef<HTMLElement>(null);
  const device = useChosenDevice();

  // Keep the opened task list in view.
  useEffect(() => {
    panelRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selected?.id]);

  const lessons = selected ? tutorials.filter((t) => t.practice?.appId === selected.id).sort((a, b) => lessonRank(a) - lessonRank(b)) : [];
  const generalLessons = tutorials.filter((t) => t.categoryId === GROUP_CATEGORY[group] && !t.practice?.appId);

  const lessonButton = (id: string, label: string) => {
    const done = completedIds.includes(id);
    return (
      <li key={id}>
        <button
          onClick={() => onSelectTutorial(id)}
          className="w-full h-full text-left px-4 py-3 min-h-[56px] rounded-xl bg-[#176B68] hover:bg-[#0F514F] text-white font-bold text-base flex items-center justify-between gap-2"
        >
          <span className="min-w-0">{label}{done && (isEn ? ' (done)' : ' (geschafft)')}</span>
          <Icon name={done ? 'check_circle' : 'arrow_forward'} className="text-xl" />
        </button>
      </li>
    );
  };

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-8 px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="space-y-2">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-[#202B36]" aria-label={isEn ? 'Breadcrumb' : 'Brotkrumen-Navigation'}>
            <button onClick={() => onNavigate('home')} className="underline text-[#17324D]">{isEn ? 'Home' : 'Startseite'}</button>
            <span aria-hidden="true">/</span>
            <button onClick={() => onNavigate('themen')} className="underline text-[#17324D]">{isEn ? 'Topics' : 'Themen'}</button>
            <span aria-hidden="true">/</span>
            <span className="font-bold text-[#17324D]">{crumb}</span>
          </nav>
          <h1 className="text-4xl font-bold text-[#17324D]">{title}</h1>
          <p className="text-[#202B36] max-w-[65ch]">{intro}</p>
          <PhonePicker lang={lang} compact phoneOnly={group === 'banking'} />
        </div>

        {/* "dense" lets the next tiles fill the row, so the task list opens directly under the clicked tile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 grid-flow-row-dense">
          {services.map((service) => {
            const isSelected = selected?.id === service.id;
            return (
              <React.Fragment key={service.id}>
              <button
                onClick={() => onSelectService(isSelected ? undefined : service.id)}
                aria-pressed={isSelected}
                className={`text-left p-4 rounded-2xl border-2 bg-[#FFFFFF] dark:bg-slate-900 flex flex-col sm:flex-row items-center sm:items-start gap-3 hover:bg-[#EAF2F8] dark:hover:bg-slate-800 ${
                  isSelected ? 'border-[#17324D] ring-2 ring-[#17324D]' : 'border-[#667382]'
                }`}
              >
                <ServiceLogo service={service} />
                <span className="min-w-0 max-w-full text-center sm:text-left">
                  <span className="block text-xl font-bold text-[#17324D] break-words">
                    {service.name}
                    {isSelected && <Icon name="check_circle" className="text-xl ml-2 text-[#176B68]" />}
                  </span>
                  <span className="hidden sm:block text-base text-[#202B36]">{isEn ? service.aboutEn : service.aboutDe}</span>
                </span>
              </button>
              {isSelected && (
                <section ref={panelRef} aria-live="polite" className="col-span-full scroll-mb-24 page-enter bg-[#EAF2F8] dark:bg-slate-900 rounded-2xl border-2 border-[#17324D] p-4 sm:p-5 space-y-3">
            <h2 className="text-2xl font-bold text-[#17324D]">
              {isEn ? `What would you like to do in ${selected.name}?` : `Was möchten Sie in ${selected.name} tun?`}
            </h2>
                <button
                  onClick={() => goTo({ page: 'free-roam', tutorialId: selected.id })}
                  className="w-full text-left px-4 py-3 min-h-[56px] rounded-xl bg-[#17324D] hover:bg-[#0F2438] text-white font-bold text-base flex items-center justify-between gap-2"
                >
                  <span className="min-w-0">{isEn ? `Free roam: click around in ${selected.name}` : `Frei erkunden: ${selected.name} ausprobieren`}</span>
                  <Icon name="arrow_forward" className="text-xl" />
                </button>
            {/* Only for "Computer" in "Where do you use your apps?", and first, because it is where computer learners start. */}
            {device === 'computer' && lessons.some((tut) => tut.practice?.device === 'desktop') && (
              <>
                <h3 className="text-xl font-bold text-[#17324D]">{isEn ? 'Getting started on the computer' : 'Am Computer einrichten'}</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {lessons.filter((tut) => tut.practice?.device === 'desktop').map((tut) => lessonButton(tut.id, tut.title))}
                </ul>
              </>
            )}
            <h3 className="text-xl font-bold text-[#17324D]">{isEn ? 'Lessons' : 'Lektionen'}</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {lessons.filter((tut) => tut.practice?.device !== 'desktop').map((tut) => lessonButton(tut.id, tut.title))}
            </ul>
          </section>
              )}
              </React.Fragment>
            );
          })}
        </div>

        {!selected && (
          <p className="p-4 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#202B36] flex items-start gap-3">
            <Icon name="info" className="text-2xl text-[#17324D]" />
            {note}
          </p>
        )}

        {generalLessons.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-[#17324D]">{isEn ? 'Good to know, for every service' : 'Gut zu wissen, für jeden Dienst'}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {generalLessons.map((tut) => lessonButton(tut.id, tut.title))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};
