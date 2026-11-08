import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { PageId, Language } from '../types';
import { TUTORIALS_EN, TUTORIALS_DE } from '../data/content';
import { speakText, stopSpeech } from '../utils/speech';
import { LessonExample } from '../components/LessonExample';
import { HelpLevelPicker } from '../components/HelpLevelPicker';
import { useHelpLevel } from '../utils/helpLevel';

interface TutorialDetailScreenProps {
  tutorialId: string;
  stepIndex: number;
  onGoToStep: (stepIndex: number) => void;
  onNavigate: (page: PageId) => void;
  onToggleBookmark: (tutorialId: string) => void;
  isSaved: boolean;
  isCompleted: boolean;
  onMarkCompleted: (tutorialId: string) => void;
  onSelectTutorial: (tutorialId: string) => void;
  lang?: Language;
}

export const TutorialDetailScreen: React.FC<TutorialDetailScreenProps> = ({
  tutorialId,
  stepIndex,
  onGoToStep,
  onNavigate,
  onToggleBookmark,
  isSaved,
  isCompleted,
  onMarkCompleted,
  onSelectTutorial,
  lang = 'en',
}) => {
  const isEn = lang === 'en';
  const tutorials = isEn ? TUTORIALS_EN : TUTORIALS_DE;

  const tutorial = tutorials.find((t) => t.id === tutorialId) || tutorials[0];

  const [isSpeaking, setIsSpeaking] = useState(false);
  const help = useHelpLevel();
  const [openTipStep, setOpenTipStep] = useState<number | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<{ id: string; title: string; description: string; dangerLevel: string; advice: string } | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const totalSteps = tutorial.steps.length;
  const currentStepIndex = Math.min(stepIndex, totalSteps - 1); // a link may name a step that does not exist

  // What is needed to finish. Coming back to a saved step counts the steps before it as read.
  const [visitedSteps, setVisitedSteps] = useState<number[]>(() => Array.from({ length: currentStepIndex + 1 }, (_, i) => i));
  const [seenHotspots, setSeenHotspots] = useState<string[]>([]);
  const [doneExercises, setDoneExercises] = useState<number[]>([]);
  const [showMissing, setShowMissing] = useState(false);

  useEffect(() => {
    setVisitedSteps((prev) => (prev.includes(currentStepIndex) ? prev : [...prev, currentStepIndex]));
  }, [currentStepIndex]);

  const openHotspot = (hotspot: { id: string; title: string; description: string; dangerLevel: string; advice: string }) => {
    setSelectedHotspot(hotspot);
    setSeenHotspots((prev) => (prev.includes(hotspot.id) ? prev : [...prev, hotspot.id]));
  };

  const quizTotal = tutorial.quiz?.length ?? 0;
  const quizAnswered = (tutorial.quiz ?? []).filter((q) => quizAnswers[q.id] !== undefined).length;
  const missing: { step: number; text: string }[] = [];
  tutorial.steps.forEach((s, i) => {
    const n = i + 1;
    if (!visitedSteps.includes(i)) {
      missing.push({ step: i, text: isEn ? `Read step ${n}` : `Schritt ${n} lesen` });
      return;
    }
    if (s.hotspots) {
      const count = s.hotspots.filter((h) => seenHotspots.includes(h.id)).length;
      if (count < s.hotspots.length) missing.push({ step: i, text: isEn ? `Step ${n}: open all warning signs (${count} of ${s.hotspots.length} done)` : `Schritt ${n}: alle Warnzeichen öffnen (${count} von ${s.hotspots.length} erledigt)` });
    }
    if ((s.example?.startsWith('scam:') || s.example === 'picture-quiz') && !doneExercises.includes(i)) {
      missing.push({ step: i, text: isEn ? `Step ${n}: finish the exercise` : `Schritt ${n}: Übung abschließen` });
    }
    if (s.visualType === 'quiz' && quizAnswered < quizTotal) {
      missing.push({ step: i, text: isEn ? `Step ${n}: answer all questions (${quizAnswered} of ${quizTotal} answered)` : `Schritt ${n}: alle Fragen beantworten (${quizAnswered} von ${quizTotal} beantwortet)` });
    }
  });

  const handleFinish = () => {
    if (missing.length > 0) {
      setShowMissing(true);
      return;
    }
    setShowMissing(false);
    onMarkCompleted(tutorial.id);
  };

  // Reading stops when the step changes (also with the browser Back button) or the page is left.
  useEffect(() => {
    return () => {
      stopSpeech();
      setIsSpeaking(false);
    };
  }, [currentStepIndex]);

  const currentStep = tutorial.steps[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${currentStep.title}. ${currentStep.lead}. ${currentStep.paragraphs.join(' ')}`;
    speakText(textToRead, () => setIsSpeaking(false), undefined, lang);
    setIsSpeaking(true);
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      onGoToStep(currentStepIndex + 1);
      window.scrollTo(0, 100);
    } else {
      onMarkCompleted(tutorial.id);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      onGoToStep(currentStepIndex - 1);
      window.scrollTo(0, 100);
    }
  };

  const handleSelectQuizOption = (qId: string, optIndex: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [qId]: optIndex,
    }));
  };

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-[#202B36] dark:text-slate-400" aria-label="Breadcrumb">
            <button onClick={() => onNavigate('home')} className="hover:underline hover:text-[#176B68]">
              {isEn ? 'Home' : 'Startseite'}
            </button>
            <span>/</span>
            <button onClick={() => onNavigate('tutorials')} className="hover:underline hover:text-[#176B68]">
              {isEn ? 'Tutorials' : 'Anleitungen'}
            </button>
            <span>/</span>
            <span className="font-bold text-[#17324D] dark:text-white">{tutorial.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            {/* Read Aloud Button */}
            <button
              onClick={handleReadAloud}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                isSpeaking
                  ? 'bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] border-[#176B68] ring-2 ring-[#176B68]'
                  : 'bg-[#FFFFFF] dark:bg-slate-800 text-[#17324D] dark:text-slate-200 border-[#E5E9ED] dark:border-slate-700 hover:bg-[#EAF2F8]'
              }`}
              title={isEn ? 'Read current step aloud' : 'Schritt vorlesen lassen'}
              aria-label={isSpeaking ? (isEn ? 'Stop reading' : 'Vorlesen beenden') : (isEn ? 'Read aloud' : 'Text vorlesen')}
            >
              <Icon name={isSpeaking ? 'stop_circle' : 'volume_up'} className="text-lg text-[#176B68]" />
              <span>{isSpeaking ? (isEn ? 'Stop Reading' : 'Vorlesen beenden') : (isEn ? 'Read Aloud' : 'Text vorlesen')}</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(tutorial.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                isSaved
                  ? 'bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] border-[#176B68]'
                  : 'bg-[#FFFFFF] dark:bg-slate-800 text-[#202B36] dark:text-slate-200 border-[#E5E9ED] dark:border-slate-700 hover:bg-[#EAF2F8]'
              }`}
              aria-label={isSaved ? (isEn ? 'Saved' : 'Gemerkt') : (isEn ? 'Save' : 'Merken')}
            >
              <Icon name={isSaved ? 'bookmark' : 'bookmark_border'} className={`text-lg ${isSaved ? 'text-[#176B68]' : 'text-[#202B36]'}`} />
              <span>{isSaved ? (isEn ? 'Saved' : 'Gemerkt') : (isEn ? 'Save' : 'Merken')}</span>
            </button>
          </div>
        </div>

        {/* Tutorial Title Card */}
        <div className="bg-[#FFFFFF] dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-[#17324D] text-white rounded-lg text-xs font-bold">
              {tutorial.categoryTitle}
            </span>
            <span className="text-xs text-[#202B36] dark:text-slate-300 font-semibold flex items-center gap-1">
              <Icon name="schedule" className="text-sm text-[#176B68]" />
              {tutorial.durationMinutes} {isEn ? 'minutes' : 'Minuten'}
            </span>
            <span className="text-xs text-[#202B36] dark:text-slate-300 font-semibold">
              {isEn ? 'Level:' : 'Stufe:'} {tutorial.difficulty}
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] text-xs font-bold border border-[#176B68]">
                <Icon name="check_circle" className="text-sm text-[#176B68]" />
                {isEn ? 'Successfully Completed' : 'Erfolgreich abgeschlossen'}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#17324D] dark:text-white leading-tight">
            {tutorial.title}
          </h1>

          <p className="hidden sm:block text-base sm:text-lg text-[#202B36] dark:text-slate-300 leading-relaxed">
            {tutorial.description}
          </p>
          <img src={tutorial.image} alt="" className="hidden sm:block w-full h-48 object-cover rounded-xl" />

          {/* Progress bar and Stepper Indicators */}
          <div className="pt-4 border-t border-[#E5E9ED] dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#17324D] dark:text-white">
              <span>{isEn ? `Progress: Step ${currentStepIndex + 1} of ${totalSteps}` : `Fortschritt: Schritt ${currentStepIndex + 1} von ${totalSteps}`}</span>
              <span className="text-[#176B68]">{progressPercent}% {isEn ? 'completed' : 'abgeschlossen'}</span>
            </div>

            <div className="w-full h-3 bg-[#EAF2F8] dark:bg-slate-800 rounded-full overflow-hidden border border-[#E5E9ED] dark:border-slate-700">
              <div
                className="h-full bg-[#176B68] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Step navigation tabs */}
            <div className="flex flex-wrap gap-2 pt-2">
              {tutorial.steps.map((step, idx) => (
                <button
                  key={step.stepNumber}
                  onClick={() => onGoToStep(idx)}
                  aria-label={isEn ? `Step ${idx + 1}` : `Schritt ${idx + 1}`}
                  aria-current={currentStepIndex === idx ? 'step' : undefined}
                  className={`min-h-[44px] min-w-[44px] sm:min-w-[7rem] justify-center sm:justify-start p-2 rounded-xl text-left border transition-all text-xs font-bold flex items-center gap-2 ${
                    currentStepIndex === idx
                      ? 'bg-[#17324D] text-white border-[#17324D] shadow-sm'
                      : visitedSteps.includes(idx)
                      ? 'bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-teal-300 border-[#E5E9ED] dark:border-slate-700'
                      : 'bg-[#FFFFFF] dark:bg-slate-900 text-[#202B36] dark:text-slate-300 border-[#E5E9ED] dark:border-slate-800 hover:bg-[#EAF2F8]'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    currentStepIndex === idx ? 'bg-white text-[#17324D]' : 'bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68]'
                  }`}>
                    {visitedSteps.includes(idx) && idx !== currentStepIndex ? '✓' : idx + 1}
                  </span>
                  <span className="hidden sm:inline truncate">{isEn ? `Step ${idx + 1}` : `Schritt ${idx + 1}`}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-slate-900 p-4 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800">
          <HelpLevelPicker lang={lang} compact={currentStepIndex > 0} />
        </div>

        {/* Current Step Content Box */}
        <article className="bg-[#FFFFFF] dark:bg-slate-900 p-6 sm:p-10 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-extrabold text-[#176B68] block mb-1">
              {isEn ? `Step ${currentStep.stepNumber} of ${totalSteps}` : `Schritt ${currentStep.stepNumber} von ${totalSteps}`}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17324D] dark:text-white">
              {currentStep.title}
            </h2>
            <p className="text-lg text-[#202B36] dark:text-slate-200 font-medium mt-2 leading-relaxed">
              {currentStep.lead}
            </p>
          </div>

          {help === 'full' && (
            <button onClick={handleReadAloud} className="inline-flex items-center gap-2 px-5 min-h-[48px] rounded-xl border-2 border-[#17324D] text-[#17324D] font-bold text-base hover:bg-[#EAF2F8]">
              <Icon name={isSpeaking ? 'stop_circle' : 'volume_up'} className="text-xl" />
              {isSpeaking ? (isEn ? 'Stop reading' : 'Vorlesen beenden') : (isEn ? 'Read this step aloud' : 'Diesen Schritt vorlesen')}
            </button>
          )}

          {/* Standard Paragraphs */}
          <div className="space-y-4 text-base sm:text-lg text-[#202B36] dark:text-slate-300 leading-relaxed font-normal">
            {currentStep.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* INTERACTIVE COMPONENT: Phishing Email Mockup (Step 2) */}
          {currentStep.visualType === 'phishing-mockup' && (
            <div className="mt-8 space-y-6">
              <div className="border-2 border-[#176B68] rounded-2xl overflow-hidden bg-[#FFFFFF] dark:bg-slate-900 shadow-md">
                {/* Simulated Email Header Window */}
                <div className="bg-[#17324D] text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-white/40 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-white/40 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-white/40 inline-block"></span>
                    <span className="text-xs font-mono ml-2 text-white/90">
                      {isEn ? 'Inbox – Suspicious Email Inspection' : 'Posteingang – Verdächtige E-Mail-Vorschau'}
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-[#EAF2F8] text-[#17324D] px-2.5 py-0.5 rounded">
                    ⚠️ {isEn ? 'SCAM DEMO' : 'BETRUGS-BEISPIEL'}
                  </span>
                </div>

                {/* Email Metadata */}
                <div className="p-4 sm:p-6 bg-[#EAF2F8]/50 dark:bg-slate-800/50 border-b border-[#E5E9ED] dark:border-slate-800 space-y-2.5 text-sm">
                  {/* Hotspot 1: Sender */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E9ED] dark:border-slate-700">
                    <div>
                      <span className="font-bold text-[#202B36] dark:text-slate-400 mr-2">{isEn ? 'From:' : 'Von:'}</span>
                      <span className="font-bold text-[#17324D] dark:text-white">Bank Security Alert </span>
                      <span className="text-[#176B68] font-mono text-xs font-bold">
                        &lt;service@spaar-kasse-online-sicherheit.de&gt;
                      </span>
                    </div>
                    <button
                      onClick={() => openHotspot(currentStep.hotspots![0])}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2F8] text-[#17324D] text-xs font-bold border border-[#176B68] hover:bg-[#176B68] hover:text-white transition-all self-start sm:self-auto"
                      aria-label={isEn ? 'Inspect fake sender red flag' : 'Warnung prüfen'}
                    >
                      <span className="w-4 h-4 rounded-full bg-[#176B68] text-white flex items-center justify-center text-[10px]">1</span>
                      <span>{isEn ? 'Inspect Flag' : 'Warnung prüfen'}</span>
                    </button>
                  </div>

                  {/* Hotspot 2: Urgency Subject */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E9ED] dark:border-slate-700">
                    <div>
                      <span className="font-bold text-[#202B36] dark:text-slate-400 mr-2">{isEn ? 'Subject:' : 'Betreff:'}</span>
                      <span className="font-extrabold text-[#17324D] dark:text-white">
                        {isEn ? 'URGENT: Your account will be locked in 24 hours!' : 'DRINGEND: Ihr Sparkassen-Konto wird in 24 Stunden gesperrt!'}
                      </span>
                    </div>
                    <button
                      onClick={() => openHotspot(currentStep.hotspots![1])}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2F8] text-[#17324D] text-xs font-bold border border-[#176B68] hover:bg-[#176B68] hover:text-white transition-all self-start sm:self-auto"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#176B68] text-white flex items-center justify-center text-[10px]">2</span>
                      <span>{isEn ? 'Inspect Flag' : 'Warnung prüfen'}</span>
                    </button>
                  </div>

                  {/* Hotspot 3: Impersonal Greeting */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E9ED] dark:border-slate-700">
                    <div>
                      <span className="font-bold text-[#202B36] dark:text-slate-400 mr-2">{isEn ? 'Salutation:' : 'Anrede:'}</span>
                      <span className="font-semibold text-[#17324D] dark:text-white">
                        {isEn ? '"Dear Customer" (No personal name!)' : '„Sehr geehrter Kunde“ (Kein persönlicher Name!)'}
                      </span>
                    </div>
                    <button
                      onClick={() => openHotspot(currentStep.hotspots![2])}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2F8] text-[#17324D] text-xs font-bold border border-[#176B68] hover:bg-[#176B68] hover:text-white transition-all self-start sm:self-auto"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#176B68] text-white flex items-center justify-center text-[10px]">3</span>
                      <span>{isEn ? 'Inspect Flag' : 'Warnung prüfen'}</span>
                    </button>
                  </div>
                </div>

                {/* Email Body Content with Hotspot 4 (Link) */}
                <div className="p-6 sm:p-8 space-y-4 text-[#202B36] dark:text-slate-200 text-base">
                  <p>
                    {isEn
                      ? 'Due to updated security regulations, all customers must verify their credentials within 24 hours. Failure to respond will result in immediate suspension of your online access.'
                      : 'Aufgrund neuer Sicherheitsrichtlinien müssen alle Kunden Ihre Daten innerhalb von 24 Stunden aktualisieren. Kommen Sie dieser Aufforderung nicht nach, müssen wir Ihr Konto kostenpflichtig sperren.'}
                  </p>
                  
                  <div className="py-4 text-center">
                    <div className="inline-block relative">
                      <button
                        onClick={() => openHotspot(currentStep.hotspots![3])}
                        type="button"
                        className="px-6 py-3.5 bg-[#17324D] hover:bg-[#0f2336] text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2 mx-auto"
                      >
                        <span>{isEn ? 'Verify Bank Account Now' : 'Jetzt Online-Banking bestätigen'}</span>
                        <span className="w-5 h-5 rounded-full bg-[#EAF2F8] text-[#17324D] text-xs font-bold flex items-center justify-center">
                          4
                        </span>
                      </button>
                      <div className="text-xs text-[#202B36] dark:text-slate-400 font-mono mt-2">
                        {isEn ? 'Actually leads to:' : 'Führt zu:'} <span className="text-[#176B68] underline font-bold">http://secure-login-update-sparkasse.de-fake.com</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#202B36] dark:text-slate-400 italic">
                    {isEn ? 'Kind regards,\nYour alleged Bank Security Team' : 'Mit freundlichen Grüßen,\nIhre angebliche Sparkassen-Zentrale'}
                  </p>
                </div>
              </div>

              <p className="font-bold text-[#17324D]" aria-live="polite">
                {isEn
                  ? `${(currentStep.hotspots ?? []).filter((h) => seenHotspots.includes(h.id)).length} of ${currentStep.hotspots?.length ?? 0} warning signs opened`
                  : `${(currentStep.hotspots ?? []).filter((h) => seenHotspots.includes(h.id)).length} von ${currentStep.hotspots?.length ?? 0} Warnzeichen geöffnet`}
              </p>

              {/* Explanatory Callout Card for Selected Hotspot */}
              {selectedHotspot && (
                <div className="bg-[#EAF2F8] dark:bg-slate-800 p-6 rounded-2xl border-2 border-[#176B68] space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="report" className="text-2xl text-[#176B68]" />
                      <h4 className="text-lg font-bold text-[#17324D] dark:text-white">
                        {selectedHotspot.title}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#FFFFFF] dark:bg-slate-900 text-[#17324D] dark:text-teal-300 text-xs font-extrabold uppercase border border-[#E5E9ED] dark:border-slate-700">
                      {isEn ? 'Risk: High' : `Gefahr: ${selectedHotspot.dangerLevel}`}
                    </span>
                  </div>

                  <p className="text-[#202B36] dark:text-slate-200 text-base leading-relaxed">
                    {selectedHotspot.description}
                  </p>

                  <div className="bg-[#FFFFFF] dark:bg-slate-900 p-3.5 rounded-xl border border-[#E5E9ED] dark:border-slate-700 text-sm font-semibold text-[#17324D] dark:text-slate-200 flex items-start gap-2">
                    <Icon name="verified" className="text-base shrink-0 mt-0.5 text-[#176B68]" />
                    <span>{isEn ? 'Everyday Safety Tip:' : 'Tipp für Ihren Alltag:'} {selectedHotspot.advice}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INTERACTIVE COMPONENT: Quiz (Step 4) */}
          {currentStep.visualType === 'quiz' && tutorial.quiz && (
            <div className="mt-8 space-y-6">
              <div className="p-4 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-white text-sm font-bold flex items-center gap-2 border border-[#E5E9ED] dark:border-slate-700">
                <Icon name="psychology" className="text-xl text-[#176B68]" />
                <span>{isEn ? 'Test yourself – select the answer that feels safest to you:' : 'Testen Sie sich selbst – wählen Sie einfach die Antwort an, die Ihnen am sichersten erscheint:'}</span>
              </div>

              <p className="font-bold text-[#17324D]" aria-live="polite">
                {isEn ? `${quizAnswered} of ${quizTotal} questions answered` : `${quizAnswered} von ${quizTotal} Fragen beantwortet`}
              </p>

              {tutorial.quiz.map((q, qIndex) => {
                const selectedOption = quizAnswers[q.id];
                const hasAnswered = selectedOption !== undefined;
                const isCorrect = selectedOption === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-6 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 bg-[#EAF2F8]/30 dark:bg-slate-800/40 space-y-4"
                  >
                    <h4 className="text-lg font-bold text-[#17324D] dark:text-white">
                      {isEn ? `Question ${qIndex + 1}:` : `Frage ${qIndex + 1}:`} {q.question}
                    </h4>

                    <div className="space-y-2.5">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-[#FFFFFF] dark:bg-slate-900 text-[#202B36] dark:text-slate-200 border-[#E5E9ED] dark:border-slate-700 hover:border-[#176B68]';
                        
                        if (hasAnswered) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-teal-300 border-[#176B68] font-bold';
                          } else if (selectedOption === optIdx) {
                            btnStyle = 'bg-[#FFFFFF] dark:bg-slate-900 text-[#202B36] dark:text-slate-300 border-red-300 opacity-80';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuizOption(q.id, optIdx)}
                            className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 ${btnStyle}`}
                          >
                            <span className="w-6 h-6 rounded-full border border-[#E5E9ED] dark:border-slate-700 bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-teal-300 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="text-base">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Instant Explanation Feedback */}
                    {hasAnswered && (
                      <div
                        className={`p-4 rounded-xl border flex items-start gap-3 text-sm leading-relaxed animate-fade-in ${
                          isCorrect
                            ? 'bg-[#EAF2F8] dark:bg-slate-800 border-[#176B68] text-[#17324D] dark:text-slate-200'
                            : 'bg-[#FFFFFF] dark:bg-slate-900 border-[#E5E9ED] dark:border-slate-700 text-[#202B36] dark:text-slate-300'
                        }`}
                      >
                        <Icon name={isCorrect ? 'check_circle' : 'info'} className="text-xl shrink-0 mt-0.5 text-[#176B68]" />
                        <div>
                          <strong className="block mb-1 text-[#17324D] dark:text-white">
                            {isCorrect
                              ? (isEn ? 'Outstanding! Correct answer.' : 'Hervorragend! Richtig geantwortet.')
                              : (isEn ? 'Not quite, but no worries:' : 'Nicht ganz, aber kein Problem:')}
                          </strong>
                          <span>{q.explanation}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {currentStep.example && (
            <LessonExample
              id={currentStep.example}
              lang={lang}
              onDone={() => {
                const step = currentStepIndex;
                setDoneExercises((prev) => (prev.includes(step) ? prev : [...prev, step]));
              }}
            />
          )}

          {/* Helpful Tip Box */}
          {currentStep.tip && help === 'none' && openTipStep !== currentStepIndex && (
            <button onClick={() => setOpenTipStep(currentStepIndex)} className="inline-flex items-center gap-2 px-5 min-h-[48px] rounded-xl bg-[#176B68] hover:bg-[#0F514F] text-white font-bold text-base">
              <Icon name="lightbulb" className="text-xl" />
              {isEn ? 'Show tip' : 'Tipp anzeigen'}
            </button>
          )}
          {currentStep.tip && (help !== 'none' || openTipStep === currentStepIndex) && (
            <div className="bg-[#EAF2F8] dark:bg-slate-800 p-5 rounded-2xl border-l-4 border-[#176B68] flex items-start gap-3">
              <Icon name="lightbulb" className="text-2xl text-[#176B68] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-bold text-[#17324D] dark:text-white mb-0.5">
                  {isEn ? 'Helpful Learning Tip:' : 'Praktischer Lerntipp:'}
                </strong>
                <p className="text-sm text-[#202B36] dark:text-slate-300">{currentStep.tip}</p>
              </div>
            </div>
          )}

          {/* Warning Box */}
          {currentStep.warning && (
            <div className="bg-[#FFFFFF] dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 border-l-4 border-l-[#176B68] flex items-start gap-3">
              <Icon name="security" className="text-2xl text-[#176B68] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-bold text-[#17324D] dark:text-white mb-0.5">
                  {isEn ? 'Important Safety Notice:' : 'Wichtiger Sicherheitshinweis:'}
                </strong>
                <p className="text-sm text-[#202B36] dark:text-slate-300">{currentStep.warning}</p>
              </div>
            </div>
          )}

          {showMissing && missing.length > 0 && (
            <div role="alert" className="p-4 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 border-2 border-[#17324D] space-y-2 text-[#202B36] dark:text-slate-100">
              <p className="font-bold flex items-start gap-2">
                <Icon name="info" className="text-2xl shrink-0 text-[#17324D]" />
                {isEn ? 'Almost there. Please finish these parts first:' : 'Fast geschafft. Bitte erledigen Sie zuerst diese Punkte:'}
              </p>
              <ul className="space-y-2">
                {missing.map((item) => (
                  <li key={item.text}>
                    <button onClick={() => onGoToStep(item.step)} className="w-full text-left inline-flex items-center justify-between gap-2 px-3 py-2 min-h-[48px] rounded-xl border-2 border-[#17324D] text-[#17324D] font-bold text-base hover:bg-[#FFFFFF]">
                      <span className="min-w-0">{item.text}</span>
                      <Icon name="arrow_forward" className="text-xl shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Step Navigation Controls */}
          <div className="pt-6 border-t border-[#E5E9ED] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-base transition-colors ${
                currentStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-[#EAF2F8] dark:bg-slate-800 text-[#202B36] dark:text-slate-600'
                  : 'bg-[#FFFFFF] dark:bg-slate-900 border border-[#E5E9ED] dark:border-slate-700 text-[#202B36] dark:text-slate-200 hover:bg-[#EAF2F8]'
              }`}
            >
              <Icon name="arrow_back" className="" />
              <span>{isEn ? 'Previous Step' : 'Vorheriger Schritt'}</span>
            </button>

            <div className="flex items-center gap-3">
              {currentStepIndex === totalSteps - 1 ? (
                <button
                  onClick={handleFinish}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-bold text-base shadow-md transition-transform hover:scale-[1.01]"
                >
                  <Icon name="verified" className="" />
                  <span>{isEn ? 'Finish lesson' : 'Lektion abschließen'}</span>
                </button>
              ) : (
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-bold text-base shadow-md transition-transform hover:scale-[1.01]"
                >
                  <span>{isEn ? 'Next Step' : 'Nächster Schritt'}</span>
                  <Icon name="arrow_forward" className="" />
                </button>
              )}
            </div>
          </div>
        </article>

        {/* Other Recommended Tutorials */}
        <div className="pt-6">
          <h3 className="text-xl font-bold text-[#17324D] dark:text-white mb-4">
            {isEn ? 'What to do next' : 'Das passt als Nächstes'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(tutorial.nextIds ?? []).map((id) => tutorials.find((t) => t.id === id)).filter((t): t is NonNullable<typeof t> => !!t).map((other) => (
              <button
                type="button"
                key={other.id}
                onClick={() => onSelectTutorial(other.id)}
                className="w-full text-left bg-[#FFFFFF] dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 hover:border-[#176B68] cursor-pointer flex items-center justify-between group transition-colors shadow-sm"
              >
                <div>
                  <span className="text-xs font-bold text-[#176B68] block">{other.categoryTitle}</span>
                  <h4 className="font-bold text-[#17324D] dark:text-white group-hover:text-[#176B68] text-base">
                    {other.title}
                  </h4>
                  <span className="text-xs text-[#202B36] dark:text-slate-400">
                    {other.durationMinutes} {isEn ? 'min' : 'Min.'} • {other.difficulty}
                  </span>
                </div>
                <Icon name="arrow_forward" className="text-xl text-[#176B68] group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
