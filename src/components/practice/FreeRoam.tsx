import React, { useEffect, useState } from 'react';
import { Icon } from '../Icon';
import { ServiceLogo } from '../ServiceLogo';
import { Language } from '../../types';
import { TUTORIALS_DE, TUTORIALS_EN } from '../../data/content';
import { serviceById } from '../../data/services';
import { PracticeContext } from './PracticeTap';
import { PRACTICE_SCREENS } from './practiceScreens';
import { appStyle, type AppId } from './messaging/apps';
import { useDevice } from '../../utils/phoneType';
import { DesktopShell } from './DesktopShell';
import { DesktopStage } from './DesktopScreens';
import { PhonePicker } from '../PhonePicker';
import { HomeIndicator } from './PhoneParts';

type State = { screen: string; isDone: boolean; kind?: string };

const FIELD: Record<string, string> = { 'new-to': 'to', 'forward-to': 'to', 'new-subject': 'subject', groupname: 'groupName' };
const START: Record<string, string> = { messenger: 'list', email: 'inbox', social: 'feed', banking: 'unlock', ai: 'chat' };

/** Where a tap leads in free roam. Returns null when that button has no screen here. */
function nextState(screenId: string, appId: string, s: State, id: string, typed: string, platform: 'iphone' | 'android'): State | null {
  const go = (screen: string, kind?: string): State => ({ screen, isDone: false, kind });
  const done = (kind: string): State => ({ screen: s.screen, isDone: true, kind });
  if (screenId === 'messenger') {
    const app = appStyle(appId as AppId, platform);
    if (id === 'back') return s.screen === 'reply-typing' || s.screen === 'msgmenu' ? go('hold') : go('list');
    if (id.startsWith('chat-')) return go('hold');
    if (id === 'bubble-peter') return go('msgmenu');
    if (id === 'menu-reply') return go('reply-typing');
    if (id.startsWith('menu-')) return go('hold');
    if (id === 'message-field') return go('typing');
    if (id === 'microphone') return go('recording', 'voice');
    if (id === 'rec-delete') return go('hold');
    if (id === 'video-call' || id === 'voice-call') return go('call');
    if (id === 'hangup') return done('call');
    if (id === 'attach') return go(app.hasMenu ? 'attach' : 'gallery');
    if (id === 'gallery') return go('gallery');
    if (id === 'close-gallery' || id === 'close-preview') return go('hold');
    if (id.startsWith('photo-')) return go(app.preview === 'full' ? 'preview' : 'inline', 'photo');
    if (id === 'new-chat') return go('newchat');
    if (id === 'new-group') return go('pick0');
    if (id === 'pick-anna') return s.screen === 'pick0' ? go('pick1') : null;
    if (id === 'pick-peter') return s.screen === 'pick1' ? go('pick2') : null;
    if (id === 'pick-next') return go('groupname');
    if (id === 'send') {
      if (s.screen === 'groupname') return typed ? done('group') : null;
      if (s.screen === 'recording') return done('voice');
      if (s.screen === 'preview' || s.screen === 'inline') return done('photo');
      if (s.screen === 'reply-typing') return typed ? done('reply') : null;
      return typed ? done('message') : null;
    }
    return null;
  }
  if (screenId === 'email') {
    if (id === 'mail-more') return go('mail-menu', s.kind);
    if (id === 'mail-prize') return go('mail', 'spam');
    if (id === 'mail-news') return go('mail', 'unsubscribe');
    if (id === 'mail-club') return go('mail', 'restore');
    if (id.startsWith('mail-')) return go('mail', 'reply');
    if (id === 'compose') return go('new-to', 'new');
    if (id === 'reply') return go('reply', 'reply');
    if (id === 'forward') return go('forward-to', 'forward');
    if (id === 'archive') return { screen: 'mail', isDone: true, kind: 'archive' };
    if (id === 'delete') return go('inbox-after', 'restore');
    if (id === 'star') return go(s.screen === 'mail-starred' ? 'mail' : 'mail-starred', s.kind);
    if (id === 'menu') return go('folders');
    if (id === 'folder-trash') return go('trash');
    if (id === 'folder-starred') return go('starred');
    if (id.startsWith('folder-')) return go('inbox');
    if (id === 'trash-club') return go('trash-mail');
    if (id === 'move-inbox') return { screen: 'mail', isDone: true, kind: 'restore' };
    if (id === 'starred-anna' || id === 'result-anna' || id === 'result-other') return go('mail', 'reply');
    if (id === 'search') return go('search-mail');
    if (id === 'report-spam') return { screen: 'mail', isDone: true, kind: 'spam' };
    if (id === 'mark-unread') return go('inbox');
    if (id === 'unsubscribe') return go('unsub-confirm');
    if (id === 'unsub-yes') return { screen: 'mail', isDone: true, kind: 'unsubscribe' };
    if (id === 'attach') return go('attach-pick');
    if (id === 'file-photo' || id === 'file-doc') return go('new-body-att', 'attach');
    if (id === 'back') return go(s.screen === 'reply' || s.screen === 'forward-to' || s.screen === 'mail-menu' ? 'mail' : 'inbox', s.kind);
    if (id === 'contact-anna' || id === 'contact-peter') return s.screen === 'forward-to' ? go('forward-body', 'forward') : go('new-subject', 'new');
    if (id === 'body-field') return go('new-attach', 'new');
    if (id === 'send') {
      if (s.screen === 'new-attach') return typed ? done('new') : null;
      if (s.screen === 'new-body-att') return typed ? { screen: 'mail', isDone: true, kind: 'attach' } : null;
      if (s.screen === 'forward-body') return typed ? { screen: 'mail', isDone: true, kind: 'forward' } : null;
      if (s.screen === 'reply') return typed ? done('reply') : null;
      if (s.screen === 'search-mail') return typed ? go('search-results') : null;
    }
    return null;
  }
  if (screenId === 'social') {
    if (id === 'like') return go(s.screen === 'liked' ? 'feed' : 'liked');
    if (id === 'comment') return go('comment');
    if (id === 'search') return go('search');
    if (id === 'back' || id === 'menu-cancel') return go('feed');
    if (id === 'result-one' || id.startsWith('result-other')) return done('search');
    if (id === 'new-post') return go(appId === 'reddit' ? 'post-community' : ['instagram', 'tiktok', 'pinterest', 'youtube'].includes(appId) ? 'post-gallery' : 'post-write', 'post');
    if (id.startsWith('post-photo') || id.startsWith('community-')) return go('post-write', 'post');
    if (id === 'inbox') return go('inbox');
    if (id.startsWith('dm-')) return go('dm', 'message');
    if (id === 'share') return go('share-sheet');
    if (id === 'share-peter' || id === 'share-anna') return go('share-picked', 'share');
    if (id === 'profile') return go('profile');
    if (id === 'follow') return { screen: 'feed', isDone: true, kind: 'follow' };
    if (id === 'profile-more') return go('profile-menu');
    if (id === 'block-user') return go('block-confirm');
    if (id === 'block-yes') return { screen: 'feed', isDone: true, kind: 'block' };
    if (id === 'send') {
      if (s.screen === 'share-picked') return { screen: 'feed', isDone: true, kind: 'share' };
      if (s.screen === 'search') return typed ? go('results', 'search') : null;
      if (!typed) return null;
      return { screen: 'feed', isDone: true, kind: s.screen === 'post-write' ? 'post' : s.screen === 'dm' ? 'message' : 'like' };
    }
    return null;
  }
  if (screenId === 'banking') {
    if (id === 'unlock' || id === 'back' || id === 'cancel') return go('overview');
    if (id === 'more') return go('more');
    if (id === 'abroad') return go('intl-country');
    if (id.startsWith('country-')) return go('recipient');
    if (id === 'standing-orders') return go('standing-list');
    if (id === 'standing-new' || id === 'scheduled') return go('recipient');
    if (id.startsWith('order-') && id !== 'order-delete' && id !== 'order-yes') return go('order-detail');
    if (id === 'order-delete') return go('order-confirm');
    if (id === 'order-yes') return go('more');
    if (id === 'documents') return go('documents-list');
    if (id.startsWith('doc-')) return go('more');
    if (id === 'card') return go('card-screen');
    if (id === 'card-block') return go('card-reason');
    if (id.startsWith('reason-')) return go('card-confirm');
    if (id === 'card-yes') return go('more');
    if (id === 'account' || id === 'statements') return go('payments');
    if (id === 'send-money') return go('sendmenu');
    if (id === 'transfer' || id === 'standing' || id === 'own-transfer') return go('recipient');
    if (id.startsWith('person-')) return go('amount');
    if (id.startsWith('amount-')) return go('check');
    if (id === 'confirm') return go('approve');
    if (id === 'approve-ok') return done('transfer');
    if (id.startsWith('payment-')) return done('balance');
    return null;
  }
  if (screenId === 'ai') {
    if (id === 'message-field') return go('typing');
    if (id === 'send') return typed ? done('ask') : null;
  }
  return null;
}

/** Words that belong to one lesson only, such as a warning or a different recipient. */
const LESSON_WORDS = ['nameBad', 'rejectable', 'hideTransferRows', 'extraOneLabel', 'extraOneValue', 'extraTwoLabel', 'extraTwoValue', 'doneText', 'checkName', 'ibanValue', 'doneTitle'];

function withoutLessonWords(all: Record<string, string>, own: Record<string, string>): Record<string, string> {
  const clean = { ...all };
  LESSON_WORDS.forEach((key) => delete clean[key]);
  return { ...clean, ...own };
}

/** Free roam: click around a simulated app without a task. Nothing real happens. */
export const FreeRoam: React.FC<{ appId: string; onExit: () => void; lang: Language }> = ({ appId, onExit, lang }) => {
  const isEn = lang === 'en';
  const device = useDevice();
  const onComputer = device === 'computer';
  const platform: 'iphone' | 'android' = appId === 'imessage' || appId === 'applemail' || device === 'iphone' ? 'iphone' : 'android';
  const lessons = isEn ? TUTORIALS_EN : TUTORIALS_DE;
  const lesson = lessons.find((t) => (appId === 'ai' ? t.id === 'ai-first-question' : t.practice?.appId === appId && t.practice?.device !== 'desktop'));
  // Free roam can reach every screen, so it needs the words of all lessons for this app.
  const scenario = lesson?.practice && {
    ...lesson.practice,
    labels: withoutLessonWords(Object.assign({}, ...lessons.filter((t) => t.practice?.appId === lesson.practice?.appId && lesson.practice?.appId && t.practice?.device !== 'desktop').map((t) => t.practice!.labels)), lesson.practice.labels),
  };
  const service = serviceById(appId);
  const name = service?.name ?? scenario?.labels.appTitle ?? '';
  const start = START[scenario?.screenId ?? 'messenger'];
  const [state, setState] = useState<State>({ screen: start, isDone: false });
  const [fields, setFields] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [lastWrongId, setLastWrongId] = useState<string | undefined>();
  const finishedLesson = state.isDone ? lessons.find((t) => t.practice?.appId === scenario?.appId && t.practice?.kind === state.kind) : undefined;
  const screenLabels = finishedLesson ? { ...scenario!.labels, doneTitle: finishedLesson.practice!.labels.doneTitle, doneText: finishedLesson.practice!.labels.doneText } : scenario?.labels;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [appId]);

  if (!scenario) {
    return (
      <div className="flex-1 w-full p-8 space-y-4">
        <p>{isEn ? 'We could not find this app.' : 'Diese App haben wir nicht gefunden.'}</p>
        <button onClick={onExit} className="px-5 min-h-[48px] rounded-xl border-2 border-[#17324D] text-[#17324D] font-bold">{isEn ? 'Back' : 'Zurück'}</button>
      </div>
    );
  }
  const Screen = PRACTICE_SCREENS[scenario.screenId];
  const fieldKey = FIELD[state.screen] ?? 'main';
  const typed = fields[fieldKey] ?? '';
  const setTyped: React.Dispatch<React.SetStateAction<string>> = (value) =>
    setFields((prev) => {
      const current = prev[fieldKey] ?? '';
      return { ...prev, [fieldKey]: typeof value === 'function' ? value(current) : value };
    });

  const inertNote = isEn
    ? 'This practice does not show this part of the app, so nothing happened. Try another button.'
    : 'Diesen Teil der App zeigt diese Übung nicht, es ist also nichts passiert. Probieren Sie einen anderen Knopf.';

  const onTap = (raw: string) => {
    const id = raw.replace(/:short$/, '');
    setLastWrongId(undefined);
    const next = nextState(scenario.screenId, appId, state, id, typed, platform);
    if (next) {
      // Starting something new clears what was typed for the last message.
      if (['list', 'inbox', 'feed', 'overview'].includes(next.screen)) setFields({});
      setState(next);
      setMessage('');
    } else if (id === 'send') {
      setLastWrongId('send');
      setMessage(isEn ? 'Please write something first. Then you can send.' : 'Bitte schreiben Sie zuerst etwas. Dann können Sie senden.');
    } else if (id) {
      setMessage(id.startsWith('pick-')
        ? (isEn ? 'In this practice, you add Anna first and then Peter.' : 'In dieser Übung fügen Sie zuerst Anna und dann Peter hinzu.')
        : inertNote);
    }
  };

  const restart = () => {
    setState({ screen: start, isDone: false });
    setFields({});
    setMessage('');
  };

  const button = 'inline-flex items-center justify-center gap-2 px-5 min-h-[48px] rounded-xl font-bold text-base';

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 pt-6 pb-24 px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_23rem] gap-4 lg:gap-x-10 items-start">
        <div className="space-y-4 min-w-0">
          <h1 className="text-3xl font-bold text-[#17324D] flex items-center gap-3">
            {service && <ServiceLogo service={service} size={48} />}
            <span className="min-w-0">{isEn ? `Free roam: ${name}` : `Frei erkunden: ${name}`}</span>
          </h1>
          <p className="flex items-center gap-3 p-3 rounded-xl bg-[#EAF2F8] text-[#202B36] font-bold">
            <Icon name="verified_user" className="text-2xl text-[#176B68]" />
            {isEn ? 'No task here. Tap whatever you like. Nothing real happens, and nothing can break.' : 'Hier gibt es keine Aufgabe. Tippen Sie, worauf Sie möchten. Es passiert nichts Echtes, und nichts kann kaputtgehen.'}
          </p>
          <div aria-live="polite">
            {state.isDone && !message && (
              <p className="flex items-start gap-3 p-3 rounded-xl bg-[#E3F1F0] dark:bg-slate-800 border-2 border-[#176B68] text-[#202B36] dark:text-slate-100">
                <Icon name="check_circle" className="text-2xl text-[#176B68]" />
                {isEn ? 'That worked in this practice. Nothing real was sent. Tap "Start again" to keep exploring.' : 'Das hat in dieser Übung geklappt. Es wurde nichts wirklich gesendet. Tippen Sie auf „Von vorne“, um weiter zu erkunden.'}
              </p>
            )}
            {message && (
              <p className="flex items-start gap-3 p-3 rounded-xl bg-[#FFFFFF] dark:bg-slate-900 border-2 border-[#17324D] text-[#202B36]">
                <Icon name="info" className="text-2xl text-[#17324D]" />{message}
              </p>
            )}
          </div>
          <PhonePicker lang={lang} compact />
          <div className="flex flex-wrap gap-3">
            <button onClick={onExit} className={`${button} border-2 border-[#17324D] text-[#17324D] hover:bg-[#EAF2F8]`}>
              <Icon name="arrow_back" className="text-xl" />{isEn ? 'Back' : 'Zurück'}
            </button>
            <button onClick={restart} className={`${button} bg-[#176B68] hover:bg-[#0F514F] text-white`}>
              <Icon name="play_circle" className="text-xl" />{isEn ? 'Start again' : 'Von vorne'}
            </button>
          </div>
        </div>
        {onComputer ? (
          <div className="lg:col-span-2 w-full rounded-xl p-2" style={{ background: '#202B36' }} role="group" aria-label={isEn ? 'Simulated computer' : 'Simulierter Computer'}>
            <p className="px-2 pb-1 text-center text-[1rem] font-bold" style={{ color: '#FFFFFF' }}>{isEn ? 'Simulated computer – practice, not real' : 'Simulierter Computer – Übung, nicht echt'}</p>
            <PracticeContext.Provider value={{ showMe: false, tapHereLabel: scenario.labels.tapHere, onTap, typed, setTyped, fields, needsText: false, lastWrongId, clearWrong: () => setLastWrongId(undefined), freeRoam: true, platform, computer: onComputer }}>
            <div key={`${state.screen}-${state.isDone}`} onClick={() => setMessage(inertNote)} className="phone-sim rounded-lg overflow-hidden" style={{ background: '#3B4A54' }}>
                <DesktopStage>
                  <DesktopShell screenId={scenario.screenId} appId={scenario.appId} screen={state.isDone ? 'done' : state.screen} labels={screenLabels ?? scenario.labels} lang={lang}>
                    <Screen screen={state.screen} isDone={state.isDone} appId={scenario.appId} kind={state.kind ?? scenario.kind} labels={screenLabels ?? scenario.labels} lang={lang} />
                  </DesktopShell>
                </DesktopStage>
              </div>
            </PracticeContext.Provider>
          </div>
        ) : (
        <div className="w-full max-w-[23rem] mx-auto rounded-[2rem] p-2 lg:sticky lg:top-[5.5rem]" style={{ background: '#202B36' }} role="group" aria-label={scenario.labels.phoneLabel}>
          <p className="px-2 pb-1 text-center text-[1rem] font-bold" style={{ color: '#FFFFFF' }}>{scenario.labels.phoneBadge}</p>
          <PracticeContext.Provider value={{ showMe: false, tapHereLabel: scenario.labels.tapHere, onTap, typed, setTyped, fields, needsText: false, lastWrongId, clearWrong: () => setLastWrongId(undefined), freeRoam: true, platform, computer: onComputer }}>
            <div
              key={`${state.screen}-${state.isDone}`}
              onClick={() => setMessage(inertNote)}
              className={`phone-sim flex flex-col h-[clamp(24rem,calc(100svh_-_7.5rem),39rem)] lg:h-[clamp(24rem,calc(100dvh_-_10rem),39rem)] rounded-[1.5rem] overflow-hidden ${appId === 'imessage' || appId === 'applemail' ? 'is-ios' : ''}`}
              style={{ background: '#FFFFFF' }}
            >
              <Screen screen={state.screen} isDone={state.isDone} appId={scenario.appId} kind={state.kind ?? scenario.kind} labels={screenLabels ?? scenario.labels} lang={lang} />
              <HomeIndicator platform={platform} />
            </div>
          </PracticeContext.Provider>
        </div>
        )}
      </div>
    </div>
  );
};
