import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import { Language, PageId, Tutorial } from '../../types';
import { speakText, stopSpeech } from '../../utils/speech';
import { goTo } from '../../utils/router';
import { useHelpLevel } from '../../utils/helpLevel';
import { HelpLevelPicker } from '../HelpLevelPicker';
import { PhonePicker } from '../PhonePicker';
import { useDevice } from '../../utils/phoneType';
import { computerLesson } from '../../data/computerWords';
import { DesktopShell } from './DesktopShell';
import { iphoneLesson } from '../../data/practiceLessons';
import { DesktopStage } from './DesktopScreens';
import { HomeIndicator } from './PhoneParts';
import { playCorrect, playSent, playTryAgain } from '../../utils/feedback';
import { PracticeContext } from './PracticeTap';
import { PRACTICE_SCREENS } from './practiceScreens';
import { ServiceLogo } from '../ServiceLogo';
import { serviceById } from '../../data/services';

interface GuidedPracticeProps {
  tutorial: Tutorial;
  tutorials: Tutorial[];
  /** Zero-based step. Undefined shows the introduction. */
  stepIndex?: number;
  isDone: boolean;
  isSaved: boolean;
  /** Goes to a step. Undefined goes to the introduction. */
  onGoToStep: (stepIndex?: number) => void;
  onFinish: () => void;
  onLeave: () => void;
  onNavigate: (page: PageId) => void;
  onSelectTutorial: (tutorialId: string) => void;
  onToggleBookmark: (tutorialId: string) => void;
  lang: Language;
}

type Feedback = { kind: 'success' | 'hint' | 'showMe'; text: string; stepIndex: number };

const outlineButton =
  'inline-flex items-center justify-center gap-2 px-5 py-2 min-h-[48px] rounded-xl border-2 border-[#17324D] bg-[#FFFFFF] text-[#17324D] font-bold text-base hover:bg-[#EAF2F8]';
const primaryButton =
  'inline-flex items-center justify-center gap-2 px-6 py-2 min-h-[48px] rounded-xl bg-[#17324D] text-white font-bold text-base hover:bg-[#0F2438] active:bg-[#0A1A2A]';
const secondaryButton =
  'inline-flex items-center justify-center gap-2 px-5 py-2 min-h-[48px] rounded-xl bg-[#176B68] text-white font-bold text-base hover:bg-[#0F514F] active:bg-[#0A3D3B]';

/** How long the "that was right" mark stays on the spot before the next screen appears. */
const CORRECT_MARK_MS = 420;

/**
 * Reusable guided practice: instructions next to a simulated screen. Only the
 * correct tap moves on, a wrong tap gives a calm hint and never blocks, and
 * there is no time limit for the learner. The screen comes from PRACTICE_SCREENS.
 */
export const GuidedPractice: React.FC<GuidedPracticeProps> = ({
  tutorial: givenTutorial, tutorials, stepIndex, isDone, isSaved, onGoToStep, onFinish, onLeave, onNavigate, onSelectTutorial, onToggleBookmark, lang,
}) => {
  const isEn = lang === 'en';
  const device = useDevice();
  const platform = device === 'iphone' ? 'iphone' : 'android';
  const onComputer = device === 'computer' && givenTutorial.practice?.device !== 'desktop';
  // On iPhone some apps put their buttons elsewhere; on the computer you click instead of tap. The lesson text follows.
  const tutorial = onComputer ? computerLesson(givenTutorial, lang) : platform === 'iphone' ? iphoneLesson(lang, givenTutorial) : givenTutorial;
  const scenario = tutorial.practice!;
  const isDesktop = scenario.device === 'desktop' || onComputer;
  const Screen = PRACTICE_SCREENS[scenario.screenId];
  const totalSteps = tutorial.steps.length;
  const isIntro = !isDone && stepIndex === undefined;
  const currentIndex = Math.min(stepIndex ?? 0, totalSteps - 1);
  const step = tutorial.steps[currentIndex];
  const practiceStep = step.practice!;
  const fieldKey = practiceStep.field ?? 'main';

  // Steps below this are solved, so "Next" may move on. A link to a later step counts as solved up to there.
  const [solvedUpTo, setSolvedUpTo] = useState(isDone ? totalSteps : currentIndex);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showMeStep, setShowMeStep] = useState<number | null>(null);
  const [correctId, setCorrectId] = useState<string | undefined>();
  const [fields, setFields] = useState<Record<string, string>>({});
  const [lastWrongId, setLastWrongId] = useState<string | undefined>();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const help = useHelpLevel();
  const [tipStep, setTipStep] = useState<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const phoneFrameRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const moveTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(moveTimer.current), []);

  useEffect(() => {
    if (!isIntro) setSolvedUpTo((prev) => Math.max(prev, isDone ? totalSteps : currentIndex));
  }, [isIntro, isDone, currentIndex, totalSteps]);

  // A new step: stop reading and bring keyboard and screen-reader users to its heading.
  // On small screens a practice step brings the whole phone into view, with the step's instruction at its top,
  // instead of jumping up to the heading, so nobody has to scroll down to the phone after every tap.
  useEffect(() => {
    const small = window.innerWidth < 1024;
    if (!isFirstRender.current) headingRef.current?.focus({ preventScroll: !small || (!isIntro && !isDone) });
    if (small && !isIntro && !isDone && !isFirstRender.current) {
      const frame = phoneFrameRef.current?.getBoundingClientRect();
      // 80 px stay free at the bottom for the "Powered by Netlify" badge.
      if (frame) window.scrollTo({ top: Math.max(0, window.scrollY + frame.bottom - (window.innerHeight - 80)), behavior: 'instant' });
    }
    isFirstRender.current = false;
    return () => {
      stopSpeech();
      setIsSpeaking(false);
    };
  }, [isIntro, isDone, currentIndex]);

  const typed = fields[fieldKey] ?? '';
  const setTyped: React.Dispatch<React.SetStateAction<string>> = (value) =>
    setFields((prev) => {
      const current = prev[fieldKey] ?? '';
      return { ...prev, [fieldKey]: typeof value === 'function' ? value(current) : value };
    });
  const needsText = !isIntro && !isDone && !!practiceStep.requiresText && typed.length === 0;

  // A warning from the app belongs to the step it appeared in.
  useEffect(() => setLastWrongId(undefined), [currentIndex, isDone]);

  const visibleFeedback = !isIntro && !isDone && feedback?.stepIndex === currentIndex ? feedback : null;

  // After a wrong tap the hint must be seen, also on small screens and when zoomed in.
  useEffect(() => {
    if (feedback?.kind === 'hint') feedbackRef.current?.scrollIntoView({ block: 'nearest' });
  }, [feedback]);

  const handleTap = (id: string) => {
    if (correctId) return; // the move to the next screen is already under way
    if (id.endsWith(':short')) {
      // Held too briefly: explain it. The next short tap counts, so nobody gets stuck.
      playTryAgain();
      setFeedback({ kind: 'hint', text: isEn ? 'Keep your finger on it for a moment before you let go. If that is difficult, just tap it again.' : 'Lassen Sie den Finger einen Moment darauf, bevor Sie loslassen. Wenn das schwierig ist, tippen Sie einfach noch einmal.', stepIndex: currentIndex });
      return;
    }
    if (id === practiceStep.targetId && !needsText) {
      setSolvedUpTo((prev) => Math.max(prev, currentIndex + 1));
      setCorrectId(id);
      const isLast = currentIndex === totalSteps - 1;
      if (isLast) playSent();
      else playCorrect();
      moveTimer.current = window.setTimeout(() => {
        setCorrectId(undefined);
        if (isLast) {
          onFinish();
        } else {
          setFeedback({ kind: 'success', text: practiceStep.successText, stepIndex: currentIndex + 1 });
          onGoToStep(currentIndex + 1);
        }
      }, CORRECT_MARK_MS);
      return;
    }
    playTryAgain();
    setLastWrongId(id);
    setFeedback({
      kind: 'hint',
      text: help === 'none'
        ? (isEn ? 'That was not it yet. Look around and try another spot.' : 'Das war es noch nicht. Schauen Sie sich um und versuchen Sie eine andere Stelle.')
        : practiceStep.hints[id] ?? practiceStep.fallbackHint,
      stepIndex: currentIndex,
    });
  };

  const handleShowMe = (text: string) => {
    setShowMeStep(currentIndex);
    setFeedback({ kind: 'showMe', text, stepIndex: currentIndex });
    const target =
      screenRef.current?.querySelector<HTMLElement>(`button[data-practice-id="${practiceStep.targetId}"]`) ??
      screenRef.current?.querySelector<HTMLElement>('[data-practice-id="keyboard"] button');
    target?.focus();
    target?.scrollIntoView({ block: 'center' });
  };

  const handleNext = () => {
    if (solvedUpTo > currentIndex) {
      if (currentIndex === totalSteps - 1) onFinish();
      else onGoToStep(currentIndex + 1);
      return;
    }
    // "Next" stays visible but never skips the tap: it points to the right spot instead.
    if (help === 'none') {
      setFeedback({ kind: 'hint', text: isEn ? 'First do this step on the phone. If you are unsure, ask for a tip.' : 'Machen Sie diesen Schritt zuerst am Handy. Wenn Sie unsicher sind, fordern Sie einen Tipp an.', stepIndex: currentIndex });
      return;
    }
    handleShowMe(`${isEn ? 'First, please tap on the phone.' : 'Bitte tippen Sie zuerst auf das Handy.'} ${practiceStep.fallbackHint}`);
  };

  const handleBack = () => {
    if (currentIndex === 0) onGoToStep(undefined);
    else onGoToStep(currentIndex - 1);
  };

  const handlePracticeAgain = () => {
    setSolvedUpTo(0);
    setFeedback(null);
    setShowMeStep(null);
    setFields({});
    onGoToStep(0);
  };

  // With "No help" a first request gives a tip in words. Only a second one shows the spot.
  const handleAskForTip = () => {
    if (tipStep === currentIndex) {
      handleShowMe(practiceStep.showMeText);
      return;
    }
    setTipStep(currentIndex);
    setFeedback({ kind: 'showMe', text: practiceStep.fallbackHint, stepIndex: currentIndex });
  };

  let readAloudText = help === 'none' ? `${step.title}.` : `${step.title}. ${step.lead} ${step.paragraphs.join(' ')}`;
  if (isIntro) {
    readAloudText = `${scenario.introTitle}. ${scenario.introText} ${tutorial.steps.map((s) => `${s.stepNumber}. ${s.title}.`).join(' ')}`;
  } else if (isDone) {
    readAloudText = `${scenario.successTitle} ${scenario.successText}`;
  }

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(speakText(readAloudText, () => setIsSpeaking(false), undefined, lang));
  };

  const nextTutorial = tutorials.find((t) => t.id === scenario.nextTutorialId);
  const progressPercent = isIntro ? 0 : Math.round(((isDone ? totalSteps : currentIndex + 1) / totalSteps) * 100);
  const progressText = isIntro
    ? (isEn ? `${totalSteps} steps. You have not started yet.` : `${totalSteps} Schritte. Sie haben noch nicht begonnen.`)
    : isDone
    ? (isEn ? `All ${totalSteps} steps done` : `Alle ${totalSteps} Schritte geschafft`)
    : (isEn ? `Step ${currentIndex + 1} of ${totalSteps}` : `Schritt ${currentIndex + 1} von ${totalSteps}`);

  const isIos = scenario.appId === 'imessage' || scenario.appId === 'applemail' || platform === 'iphone';
  // iMessage and Apple Mail only exist on Apple devices.
  const shownPlatform: 'iphone' | 'android' = scenario.appId === 'imessage' || scenario.appId === 'applemail' ? 'iphone' : platform;
  const service = serviceById(scenario.appId);

  const navButtons = (
    <>
      <button onClick={isIntro ? onLeave : handleBack} className={outlineButton}>
        <Icon name="arrow_back" className="text-xl" />
        {isEn ? 'Back' : 'Zurück'}
      </button>
      <button onClick={isIntro ? () => onGoToStep(0) : handleNext} className={primaryButton}>
        {isIntro ? (isEn ? 'Start practice' : 'Übung starten') : (isEn ? 'Next' : 'Weiter')}
        <Icon name="arrow_forward" className="text-xl" />
      </button>
    </>
  );

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 pt-6 px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto space-y-4">
        <div className={`grid grid-cols-1 ${isDesktop ? '' : 'lg:grid-cols-[minmax(0,1fr)_23rem]'} gap-4 lg:gap-x-10 items-start`}>
        <div className="lg:col-start-1 lg:row-start-1 space-y-3 min-w-0">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[#202B36]" aria-label={isEn ? 'Breadcrumb' : 'Brotkrumen-Navigation'}>
          <button onClick={() => onNavigate('home')} className="underline text-[#17324D] min-h-[44px]">{isEn ? 'Home' : 'Startseite'}</button>
          <span aria-hidden="true">/</span>
          <button onClick={onLeave} className="underline text-[#17324D] min-h-[44px]">{tutorial.categoryTitle}</button>
          <span aria-hidden="true">/</span>
          <span className="font-bold text-[#17324D]">{tutorial.title}</span>
        </nav>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-bold text-[#17324D] flex items-center gap-3 min-w-0">
            {service && <ServiceLogo service={service} size={48} />}
            <span className="min-w-0">{tutorial.title}</span>
          </h1>
          <button onClick={() => onToggleBookmark(tutorial.id)} aria-pressed={isSaved} className={outlineButton}>
            <Icon name={isSaved ? 'bookmark' : 'bookmark_border'} className="text-xl" />
            {isSaved ? (isEn ? 'Saved' : 'Gemerkt') : (isEn ? 'Save' : 'Merken')}
          </button>
        </div>

        {/* Always visible: nothing real happens here */}
        <p className="flex items-center gap-3 p-3 rounded-xl bg-[#EAF2F8] text-[#202B36] text-base font-bold">
          <Icon name="verified_user" className="text-2xl text-[#176B68]" />
          {scenario.notice}
        </p>

        <div className="space-y-1">
          <p className="text-base font-bold text-[#17324D]" aria-live="polite">{progressText}</p>
          <div
            role="progressbar"
            aria-label={progressText}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
            className="w-full h-4 bg-[#EAF2F8] rounded-full overflow-hidden border border-[#667382]"
          >
            <div className="h-full bg-[#176B68] rounded-full transition-[width] duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        </div>

          {/* Instructions */}
          <section key={isIntro ? 'intro' : isDone ? 'done' : currentIndex} className="page-enter lg:col-start-1 lg:row-start-2 bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 p-5 space-y-4">
            {isDone ? (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#E3F1F0] dark:bg-slate-800 border-2 border-[#176B68]">
                <Icon name="check_circle" className="text-4xl text-[#176B68]" />
                <div>
                  <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-[#17324D] outline-none scroll-mt-28">{scenario.successTitle}</h2>
                  <p className="mt-2 text-[#202B36]">{scenario.successText}</p>
                </div>
              </div>
            ) : isIntro ? (
              <>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-[#17324D] outline-none scroll-mt-28">{scenario.introTitle}</h2>
                <p className="text-[#202B36]">{scenario.introText}</p>
                <ol className="space-y-2">
                  {tutorial.steps.map((s) => (
                    <li key={s.stepNumber} className="flex items-center gap-3 text-[#202B36]">
                      <span className="w-9 h-9 shrink-0 rounded-full bg-[#17324D] text-white font-bold flex items-center justify-center" aria-hidden="true">{s.stepNumber}</span>
                      <span>{s.title}</span>
                    </li>
                  ))}
                </ol>
                <HelpLevelPicker lang={lang} />
                {scenario.device !== 'desktop' && <PhonePicker lang={lang} />}
              </>
            ) : (
              <>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-[#17324D] outline-none scroll-mt-28">{step.stepNumber}. {step.title}</h2>
                {help === 'none' ? (
                  <p className="text-[#202B36]">{isEn ? 'Try to find it yourself.' : 'Versuchen Sie, es selbst zu finden.'}</p>
                ) : (
                  <>
                    <p className="text-xl font-bold text-[#202B36]">{step.lead}</p>
                    {step.paragraphs.map((text) => (
                      <p key={text} className="text-[#202B36]">{text}</p>
                    ))}
                  </>
                )}
              </>
            )}
            {isIntro && (scenario.appId || scenario.screenId === 'ai') && (
              <button onClick={() => goTo({ page: 'free-roam', tutorialId: scenario.appId ?? 'ai' })} className={secondaryButton}>
                <Icon name="smartphone" className="text-xl" />
                {isEn ? 'Free roam: click around without a task' : 'Frei erkunden: ohne Aufgabe ausprobieren'}
              </button>
            )}
            <button onClick={handleReadAloud} className={outlineButton}>
              <Icon name={isSpeaking ? 'stop_circle' : 'volume_up'} className="text-xl" />
              {isSpeaking ? (isEn ? 'Stop reading' : 'Vorlesen beenden') : (isEn ? 'Read aloud' : 'Vorlesen')}
            </button>
            {/* Small screens: "Start practice" right here, not below the phone preview */}
            {isIntro && <div className="lg:hidden flex flex-wrap items-center justify-between gap-3 pt-2">{navButtons}</div>}
          </section>

          {/* Hints and results of taps. On small screens right above the phone, so they are seen together with it. */}
          <div
            ref={feedbackRef}
            aria-live="polite"
            className={`${isDesktop ? 'lg:row-start-3' : 'lg:col-start-1 lg:row-start-3'} min-w-0 scroll-mb-40 scroll-mt-4 lg:scroll-mt-28 ${visibleFeedback ? '' : 'max-lg:hidden'}`}
          >
            {visibleFeedback && (
              <div className={`page-enter flex items-start gap-3 p-4 rounded-xl border-2 ${visibleFeedback.kind === 'success' ? 'bg-[#E3F1F0] dark:bg-slate-800 border-[#176B68]' : 'bg-[#EAF2F8] border-[#17324D]'}`}>
                <Icon
                  name={visibleFeedback.kind === 'success' ? 'check_circle' : visibleFeedback.kind === 'hint' ? 'info' : 'lightbulb'}
                  className={`text-3xl ${visibleFeedback.kind === 'success' ? 'text-[#176B68]' : 'text-[#17324D]'}`}
                />
                <div className="text-[#202B36]">
                  <strong className="block">
                    {visibleFeedback.kind === 'success' && (isEn ? 'Well done!' : 'Gut gemacht!')}
                    {visibleFeedback.kind === 'hint' && (isEn ? 'No problem. Please try again.' : 'Kein Problem. Versuchen Sie es noch einmal.')}
                    {visibleFeedback.kind === 'showMe' && (showMeStep === currentIndex || help !== 'none' ? (isEn ? 'Here it is.' : 'Hier ist es.') : (isEn ? 'Here is a tip.' : 'Hier ist ein Tipp.'))}
                  </strong>
                  {visibleFeedback.text}
                </div>
              </div>
            )}
          </div>

          {/* Simulated phone */}
          <div
            ref={phoneFrameRef}
            className={isDesktop ? 'lg:row-start-4 w-full rounded-xl p-2' : 'lg:col-start-2 lg:row-start-1 lg:row-span-5 w-full max-w-[23rem] mx-auto rounded-[2rem] p-2 lg:sticky lg:top-24'}
            style={{ background: '#202B36' }}
            role="group"
            aria-label={scenario.labels.phoneLabel}
          >
            <p className="px-2 pb-1 text-center text-[1rem] font-bold" style={{ color: '#FFFFFF' }}>{isDesktop ? (isEn ? 'Simulated computer – practice, not real' : 'Simulierter Computer – Übung, nicht echt') : scenario.labels.phoneBadge}</p>
            {/* Small screens: what to do now, right on the phone frame, so instruction and phone are seen together */}
            {!isIntro && !isDone && (
              <p aria-hidden="true" className="lg:hidden mx-1 mb-2 px-3 py-2 rounded-xl text-base font-bold leading-snug" style={{ background: '#FFFFFF', color: '#17324D' }}>
                {step.stepNumber}. {help === 'none' ? step.title : step.lead}
              </p>
            )}
            <PracticeContext.Provider
              value={{
                platform: shownPlatform,
                computer: onComputer,
                targetId: isIntro || isDone ? undefined : practiceStep.targetId,
                showMe: help === 'full' || showMeStep === currentIndex,
                tapHereLabel: scenario.labels.tapHere,
                correctId,
                onTap: isIntro || isDone ? () => {} : handleTap,
                typed,
                setTyped,
                fields,
                needsText,
                lastWrongId,
                clearWrong: () => setLastWrongId(undefined),
              }}
            >
              <div
                ref={screenRef}
                key={isDone ? 'done' : `${practiceStep.screen}`}
                onClick={() => {
                  if (!isIntro && !isDone) handleTap('');
                }}
                className={`phone-sim flex flex-col ${isDesktop ? 'rounded-lg' : `${isIntro || isDone ? 'h-[clamp(24rem,calc(100svh_-_7.5rem),39rem)]' : 'h-[clamp(24rem,calc(100svh_-_11rem),39rem)]'} lg:h-[39rem] rounded-[1.5rem]`} overflow-hidden ${isIos && !isDesktop ? 'is-ios' : ''} ${isIntro ? 'pointer-events-none' : ''}`}
                style={{ background: isDesktop ? '#3B4A54' : '#FFFFFF' }}
                inert={isIntro}
              >
                {isDesktop ? (
                  <DesktopStage>
                    {onComputer ? (
                      <DesktopShell screenId={scenario.screenId} appId={scenario.appId} screen={isDone ? 'done' : practiceStep.screen} labels={scenario.labels} lang={lang}>
                        <Screen screen={practiceStep.screen} isDone={isDone} appId={scenario.appId} kind={scenario.kind} labels={scenario.labels} lang={lang} />
                      </DesktopShell>
                    ) : (
                      <Screen screen={practiceStep.screen} isDone={isDone} appId={scenario.appId} kind={scenario.kind} labels={scenario.labels} lang={lang} />
                    )}
                  </DesktopStage>
                ) : (
                  <>
                    <Screen
                      screen={practiceStep.screen}
                      isDone={isDone}
                      appId={scenario.appId}
                      kind={scenario.kind}
                      labels={scenario.labels}
                      lang={lang}
                    />
                    <HomeIndicator platform={shownPlatform} />
                  </>
                )}
              </div>
            </PracticeContext.Provider>
          </div>

          {/* Tip button, help and device choice, and the buttons after the last step */}
          <div className={`${isDesktop ? 'lg:row-start-5' : 'lg:col-start-1 lg:row-start-4'} space-y-4 min-w-0`}>
            {!isIntro && !isDone && help !== 'full' && (
              <button onClick={help === 'none' ? handleAskForTip : () => handleShowMe(practiceStep.showMeText)} className={secondaryButton}>
                <Icon name="lightbulb" className="text-xl" />
                {help === 'none' && tipStep !== currentIndex ? (isEn ? 'I need a tip' : 'Ich brauche einen Tipp') : (isEn ? 'Show me' : 'Zeigen Sie es mir')}
              </button>
            )}
            {!isIntro && !isDone && <HelpLevelPicker lang={lang} compact />}
            {!isIntro && !isDone && scenario.device !== 'desktop' && <PhonePicker lang={lang} compact />}

            {isDone && (
              <div className="flex flex-wrap gap-3">
                {nextTutorial && (
                  <button onClick={() => onSelectTutorial(nextTutorial.id)} className={`${primaryButton} text-left`}>
                    <span>{isEn ? 'Next lesson:' : 'Nächste Lektion:'} {nextTutorial.title}</span>
                    <Icon name="arrow_forward" className="text-xl" />
                  </button>
                )}
                <button onClick={handlePracticeAgain} className={secondaryButton}>
                  <Icon name="play_circle" className="text-xl" />
                  {isEn ? 'Practise again' : 'Noch einmal üben'}
                </button>
                <button onClick={() => onNavigate('dashboard')} className={outlineButton}>
                  {isEn ? 'See my progress' : 'Meinen Fortschritt ansehen'}
                </button>
              </div>
            )}
          </div>

          {/* Large screens: Back and Next sit under the instructions, clear of the "Powered by Netlify" badge. */}
          {!isDone && <div className={`hidden lg:flex ${isDesktop ? 'lg:row-start-6' : 'lg:col-start-1 lg:row-start-5'} items-center justify-between gap-3 pb-8`}>{navButtons}</div>}
        </div>

        {/* Small screens: Back and Next below everything, not fixed, so the phone gets the whole screen.
            A correct tap moves on by itself. The bottom space keeps them clear of the "Powered by Netlify" badge. */}
        {!isDone && !isIntro ? (
          <div className="lg:hidden flex flex-wrap items-center justify-between gap-3 pt-3 pb-[76px]">
            {navButtons}
          </div>
        ) : (
          <div className="pb-[76px] lg:pb-8" />
        )}
      </div>
    </div>
  );
};
