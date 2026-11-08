import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { PageId, UserProfile, Language } from '../types';
import { TUTORIALS_EN, TUTORIALS_DE } from '../data/content';
import { CertificateModal } from '../components/CertificateModal';
import { PhonePicker } from '../components/PhonePicker';

interface DashboardScreenProps {
  onNavigate: (page: PageId) => void;
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  tutorialSteps: Record<string, number>;
  onSelectTutorial: (tutorialId: string, stepIndex?: number) => void;
  onToggleBookmark: (tutorialId: string) => void;
  onOpenPhoneSupport?: () => void;
  onOpenSupportModal?: () => void;
  lang?: Language;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  user,
  onUpdateUser,
  tutorialSteps,
  onSelectTutorial,
  onToggleBookmark,
  onOpenPhoneSupport,
  onOpenSupportModal,
  lang = 'en',
}) => {
  const [certModalOpen, setCertModalOpen] = useState(false);

  const isEn = lang === 'en';
  const tutorials = isEn ? TUTORIALS_EN : TUTORIALS_DE;

  const completedTutorials = tutorials.filter((t) =>
    user.completedTutorialIds.includes(t.id)
  );

  const savedTutorials = tutorials.filter((t) =>
    user.savedTutorialIds.includes(t.id)
  );

  // Lessons started but not finished, with the step to continue at.
  const lessonsInProgress = tutorials.filter(
    (t) => tutorialSteps[t.id] !== undefined && !user.completedTutorialIds.includes(t.id)
  );

  const handleSignOut = () => {
    onUpdateUser({ ...user, name: '', email: '', isLoggedIn: false, isGuest: true });
  };

  return (
    <div className="flex-1 w-full bg-[#F7F8F5] dark:bg-slate-950 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome & Persona Header */}
        <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border-2 border-[#E5E9ED] dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#17324D] text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-sm shrink-0">
                {user.isGuest ? 'G' : user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#176B68] dark:text-teal-400">
                    {user.isGuest
                      ? (isEn ? 'Guest: saved only in this browser' : 'Gast: nur in diesem Browser gespeichert')
                      : (isEn ? `Signed in as ${user.email}` : `Angemeldet als ${user.email}`)}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17324D] dark:text-white mt-1">
                  {isEn ? 'My Progress' : 'Mein Fortschritt'}
                  {!user.isGuest && `: ${user.name}`}
                </h1>
                <p className="text-sm text-[#202B36] dark:text-slate-300 mt-1">
                  {isEn ? 'No account needed. You can continue here at any time.' : 'Kein Konto nötig. Sie können hier jederzeit weitermachen.'}
                </p>
              </div>
            </div>

            {/* Switch mode button */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={user.isGuest ? () => onNavigate('anmelden') : handleSignOut}
                className="px-4 py-2 rounded-xl border border-[#E5E9ED] dark:border-slate-700 text-xs font-semibold text-[#17324D] dark:text-slate-200 bg-[#FFFFFF] dark:bg-slate-800 hover:bg-[#EAF2F8] transition-colors"
              >
                {user.isGuest
                  ? (isEn ? 'Sign in or create an account (optional)' : 'Anmelden oder Konto erstellen (freiwillig)')
                  : (isEn ? 'Sign out' : 'Abmelden')}
              </button>

              {completedTutorials.length > 0 && (
                <button
                  onClick={() => setCertModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#17324D] hover:bg-[#0f2336] text-white font-bold text-sm transition-colors shadow-sm"
                >
                  <Icon name="school" className="text-lg" />
                  <span>{isEn ? 'View Certificate' : 'Teilnahmebestätigung ansehen'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#E5E9ED] dark:border-slate-800">
            <PhonePicker lang={lang} />
          </div>

          {/* Interactive Progress Bar */}
          <div className="mt-8 pt-6 border-t border-[#E5E9ED] dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-[#17324D] dark:text-white">
              <span className="flex items-center gap-2">
                <Icon name="trending_up" className="text-[#176B68]" />
                <span>{isEn ? 'Lessons completed' : 'Abgeschlossene Lektionen'}</span>
              </span>
              <span className="text-[#176B68]">
                {user.completedTutorialIds.length}
              </span>
            </div>
          </div>
        </div>

        {/* Resume: continue each unfinished lesson at the exact step */}
        <section className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border-2 border-[#E5E9ED] dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Icon name="play_circle" className="text-2xl text-[#176B68]" />
            <h2 className="text-xl font-bold text-[#17324D] dark:text-white">
              {isEn ? 'Continue where you stopped' : 'Dort weitermachen, wo Sie aufgehört haben'}
            </h2>
          </div>

          {lessonsInProgress.length === 0 ? (
            <div className="space-y-3">
              <p className="text-base text-[#202B36] dark:text-slate-300">
                {isEn
                  ? 'No lesson in progress right now. Choose a topic whenever you are ready.'
                  : 'Gerade ist keine Lektion offen. Wählen Sie ein Thema, wann immer Sie möchten.'}
              </p>
              <button
                onClick={() => onNavigate('themen')}
                className="px-5 py-3 min-h-[48px] rounded-xl bg-[#176B68] hover:bg-[#0f514e] text-white text-base font-bold transition-colors shadow-sm"
              >
                {isEn ? 'Choose a topic' : 'Thema wählen'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {lessonsInProgress.map((tut) => {
                const stepIndex = Math.min(tutorialSteps[tut.id], tut.steps.length - 1);
                const stepPercent = Math.round(((stepIndex + 1) / tut.steps.length) * 100);
                return (
                  <div
                    key={tut.id}
                    className="p-4 rounded-2xl border border-[#E5E9ED] dark:border-slate-700 bg-[#EAF2F8]/40 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className="font-bold text-[#17324D] dark:text-white text-base">{tut.title}</h3>
                      <p className="text-sm font-semibold text-[#202B36] dark:text-slate-300">
                        {isEn
                          ? `Step ${stepIndex + 1} of ${tut.steps.length}`
                          : `Schritt ${stepIndex + 1} von ${tut.steps.length}`}
                      </p>
                      <div className="w-full max-w-sm h-3 bg-[#EAF2F8] dark:bg-slate-800 rounded-full overflow-hidden border border-[#667382]">
                        <div className="h-full bg-[#176B68] rounded-full" style={{ width: `${stepPercent}%` }} />
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectTutorial(tut.id, stepIndex)}
                      className="px-5 py-3 min-h-[48px] rounded-xl bg-[#176B68] hover:bg-[#0f514e] text-white text-base font-bold transition-colors shadow-sm shrink-0"
                    >
                      {isEn ? 'Resume lesson' : 'Lektion fortsetzen'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#FFFFFF] dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] border border-[#E5E9ED] dark:border-slate-700 flex items-center justify-center shrink-0">
              <Icon name="task_alt" className="text-2xl" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#17324D] dark:text-white block">
                {user.completedTutorialIds.length}
              </span>
              <span className="text-xs font-semibold text-[#202B36] dark:text-slate-300">
                {isEn ? 'Completed Guides' : 'Abgeschlossene Anleitungen'}
              </span>
            </div>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] border border-[#E5E9ED] dark:border-slate-700 flex items-center justify-center shrink-0">
              <Icon name="bookmark" className="text-2xl" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#17324D] dark:text-white block">
                {user.savedTutorialIds.length}
              </span>
              <span className="text-xs font-semibold text-[#202B36] dark:text-slate-300">
                {isEn ? 'Saved for Later' : 'Für später gemerkt'}
              </span>
            </div>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#E5E9ED] dark:border-slate-800 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] border border-[#E5E9ED] dark:border-slate-700 flex items-center justify-center shrink-0">
              <Icon name="play_circle" className="text-2xl" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#17324D] dark:text-white block">
                {lessonsInProgress.length}
              </span>
              <span className="text-xs font-semibold text-[#202B36] dark:text-slate-300">
                {isEn ? 'Lessons in Progress' : 'Offene Lektionen'}
              </span>
            </div>
          </div>
        </div>

        {/* Saved Tutorials List (Bookmarks) */}
        <section className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border-2 border-[#E5E9ED] dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="bookmark" className="text-2xl text-[#176B68]" />
              <h2 className="text-xl font-bold text-[#17324D] dark:text-white">
                {isEn ? `Saved Guides (${savedTutorials.length})` : `Meine gemerkten Anleitungen (${savedTutorials.length})`}
              </h2>
            </div>

            <button
              onClick={() => onNavigate('tutorials')}
              className="text-xs font-bold text-[#176B68] hover:underline"
            >
              {isEn ? 'Find more guides →' : 'Weitere Anleitungen finden →'}
            </button>
          </div>

          {savedTutorials.length === 0 ? (
            <div className="text-center py-8 text-[#202B36] dark:text-slate-400 bg-[#EAF2F8]/40 dark:bg-slate-800/40 rounded-2xl border border-[#E5E9ED] dark:border-slate-700">
              <p>{isEn ? 'You have no saved guides yet.' : 'Sie haben sich noch keine Anleitungen gemerkt.'}</p>
              <button
                onClick={() => onNavigate('tutorials')}
                className="mt-3 px-4 py-2 bg-[#17324D] hover:bg-[#0f2336] text-white rounded-xl text-xs font-bold"
              >
                {isEn ? 'Browse Tutorials' : 'Anleitungen durchstöbern'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {savedTutorials.map((tut) => (
                <div
                  key={tut.id}
                  className="p-4 rounded-2xl border border-[#E5E9ED] dark:border-slate-700 bg-[#EAF2F8]/30 dark:bg-slate-800/50 hover:bg-[#EAF2F8]/60 transition-colors flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#202B36] dark:text-slate-400 mb-1">
                      <span className="font-bold text-[#176B68]">{tut.categoryTitle}</span>
                      <button
                        onClick={() => onToggleBookmark(tut.id)}
                        className="text-[#202B36] hover:text-red-600 font-bold"
                        title={isEn ? 'Remove bookmark' : 'Aus Merkliste entfernen'}
                      >
                        ✕
                      </button>
                    </div>
                    <h3 className="font-bold text-[#17324D] dark:text-white text-base line-clamp-2">
                      {tut.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => onSelectTutorial(tut.id, tutorialSteps[tut.id])}
                    className="w-full py-2.5 rounded-xl bg-[#176B68] hover:bg-[#0f514e] text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    {isEn ? 'Continue Guide →' : 'Jetzt fortsetzen →'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Completed Tutorials List */}
        <section className="bg-[#FFFFFF] dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border-2 border-[#E5E9ED] dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Icon name="check_circle" className="text-2xl text-[#176B68]" />
            <h2 className="text-xl font-bold text-[#17324D] dark:text-white">
              {isEn ? `Successfully Completed Modules (${completedTutorials.length})` : `Erfolgreich abgeschlossene Module (${completedTutorials.length})`}
            </h2>
          </div>

          {completedTutorials.length === 0 ? (
            <p className="text-[#202B36] dark:text-slate-400 text-sm">
              {isEn ? 'No modules completed yet. Start with your first tutorial!' : 'Noch keine Module abgeschlossen. Starten Sie mit Ihrem ersten Tutorial!'}
            </p>
          ) : (
            <div className="space-y-3">
              {completedTutorials.map((tut) => (
                <div
                  key={tut.id}
                  className="p-4 rounded-2xl border border-[#E5E9ED] dark:border-slate-700 bg-[#EAF2F8]/40 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="verified" className="text-[#176B68] text-2xl" />
                    <div>
                      <h3 className="font-bold text-[#17324D] dark:text-white text-base">
                        {tut.title}
                      </h3>
                      <span className="text-xs text-[#202B36] dark:text-slate-400">
                        {isEn ? 'Topic:' : 'Themenbereich:'} {tut.categoryTitle} • {isEn ? 'Level:' : 'Stufe:'} {tut.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectTutorial(tut.id);
                        onNavigate('tutorial-detail');
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-[#E5E9ED] dark:border-slate-700 text-xs font-semibold text-[#17324D] dark:text-slate-200 hover:bg-[#FFFFFF] transition-colors"
                    >
                      {isEn ? 'Review' : 'Wiederholen'}
                    </button>
                    <button
                      onClick={() => setCertModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#17324D] hover:bg-[#0f2336] text-white text-xs font-bold transition-colors"
                    >
                      {isEn ? 'View Certificate' : 'Urkunde anzeigen'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        user={user}
        completed={completedTutorials}
        lang={lang}
      />
    </div>
  );
};
