import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { QuizSetup } from './components/QuizSetup';
import { QuizView } from './components/QuizView';
import { QuizResultsView } from './components/QuizResultsView';
import { StudyGuidesView } from './components/StudyGuidesView';
import { FlashcardsView } from './components/FlashcardsView';
import { ProtocolDrillView } from './components/ProtocolDrillView';
import { PerformanceView } from './components/PerformanceView';
import { InstructorHub } from './components/InstructorHub';
import { AppTab, Question, QuizConfig, QuizHistoryRecord, SubjectId } from './types';
import { QUESTIONS } from './data/questions';
import { saveQuizRecord, getBookmarkedQuestions } from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('quizzes');
  const [quizState, setQuizState] = useState<'setup' | 'active' | 'results'>('setup');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentConfig, setCurrentConfig] = useState<QuizConfig | null>(null);
  const [lastRecord, setLastRecord] = useState<QuizHistoryRecord | null>(null);
  const [lastUserAnswers, setLastUserAnswers] = useState<Record<string, string>>({});
  const [targetStudySubject, setTargetStudySubject] = useState<SubjectId>('infection-control');

  // Start a customized quiz
  const handleStartQuiz = (config: QuizConfig) => {
    let pool = [...QUESTIONS];

    if (config.mode === 'subject-focus' && config.subjectId) {
      pool = pool.filter((q) => q.subjectId === config.subjectId);
    } else if (config.mode === 'missed-review') {
      const bookmarked = getBookmarkedQuestions();
      pool = pool.filter((q) => bookmarked.includes(q.id));
      if (pool.length === 0) {
        // Fallback to high yield questions if none bookmarked
        pool = pool.filter((q) => q.isHighYield);
      }
    }

    // Shuffle pool
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(config.questionCount, shuffled.length));

    setCurrentQuestions(selected);
    setCurrentConfig(config);
    setQuizState('active');
  };

  // When exam completes
  const handleFinishQuiz = (
    record: QuizHistoryRecord,
    userAnswers: Record<string, string>
  ) => {
    saveQuizRecord(record);
    setLastRecord(record);
    setLastUserAnswers(userAnswers);
    setQuizState('results');
  };

  // Retake same quiz with fresh shuffle
  const handleRetakeQuiz = () => {
    if (!currentConfig) return;
    handleStartQuiz(currentConfig);
  };

  // Retake only missed questions
  const handleRetakeMissed = (missedQuestions: Question[]) => {
    if (missedQuestions.length === 0) return;
    setCurrentQuestions(missedQuestions);
    setCurrentConfig({
      mode: 'missed-review',
      questionCount: missedQuestions.length,
      timeLimitMinutes: Math.max(Math.round(missedQuestions.length * 0.8), 5),
      instantFeedback: true,
    });
    setQuizState('active');
  };

  // Quit back to setup
  const handleQuitQuiz = () => {
    setQuizState('setup');
  };

  // Navigate to study guide from quiz or result
  const handleNavigateToStudyGuide = (subjectId: SubjectId) => {
    setTargetStudySubject(subjectId);
    setActiveTab('study-guides');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch a focused 10-question quiz on a subject from study guide
  const handleLaunchSubjectQuiz = (subjectId: SubjectId) => {
    setActiveTab('quizzes');
    handleStartQuiz({
      mode: 'subject-focus',
      subjectId,
      questionCount: 10,
      timeLimitMinutes: 10,
      instantFeedback: true,
    });
  };

  // Start bookmarked questions quiz from performance dashboard
  const handleStartBookmarkedQuiz = (bookmarkedQuestions: Question[]) => {
    if (bookmarkedQuestions.length === 0) return;
    setActiveTab('quizzes');
    setCurrentQuestions(bookmarkedQuestions);
    setCurrentConfig({
      mode: 'missed-review',
      questionCount: bookmarkedQuestions.length,
      timeLimitMinutes: Math.max(Math.round(bookmarkedQuestions.length * 0.8), 5),
      instantFeedback: true,
    });
    setQuizState('active');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      {/* Persistent Navigation Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (quizState === 'active') {
            const confirmLeave = window.confirm(
              'You have an exam in progress. Are you sure you want to navigate away? Your current answers will be discarded.'
            );
            if (!confirmLeave) return;
            setQuizState('setup');
          }
          setActiveTab(tab);
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: PRACTICE QUIZZES & EXAM RUNNER */}
        {activeTab === 'quizzes' && (
          <>
            {quizState === 'setup' && (
              <QuizSetup onStartQuiz={handleStartQuiz} />
            )}

            {quizState === 'active' && currentConfig && (
              <QuizView
                questions={currentQuestions}
                config={currentConfig}
                onFinishQuiz={handleFinishQuiz}
                onQuitQuiz={handleQuitQuiz}
              />
            )}

            {quizState === 'results' && lastRecord && currentConfig && (
              <QuizResultsView
                record={lastRecord}
                questions={currentQuestions}
                userAnswers={lastUserAnswers}
                onRetake={handleRetakeQuiz}
                onRetakeMissed={handleRetakeMissed}
                onNavigateToStudyGuide={handleNavigateToStudyGuide}
                onBackToQuizzes={() => setQuizState('setup')}
              />
            )}
          </>
        )}

        {/* TAB 2: DETAILED STUDY GUIDES */}
        {activeTab === 'study-guides' && (
          <StudyGuidesView
            initialSubjectId={targetStudySubject}
            onLaunchSubjectQuiz={handleLaunchSubjectQuiz}
          />
        )}

        {/* TAB 3: TERMINOLOGY FLASHCARDS */}
        {activeTab === 'flashcards' && <FlashcardsView />}

        {/* TAB 4: SAFETY PROTOCOL SEQUENCING DRILLS */}
        {activeTab === 'protocols' && <ProtocolDrillView />}

        {/* TAB 5: STUDENT PERFORMANCE DASHBOARD */}
        {activeTab === 'performance' && (
          <PerformanceView
            onStartBookmarkedQuiz={handleStartBookmarkedQuiz}
            onNavigateToStudyGuide={(subId) =>
              handleNavigateToStudyGuide(subId as SubjectId)
            }
          />
        )}

        {/* TAB 6: INSTRUCTOR RESOURCE HUB */}
        {activeTab === 'instructor' && <InstructorHub />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            CosmoBoard Exam Prep • Written Cosmetology State Board Simulator
          </p>
          <p>
            Designed for Cosmetology Instructors & Students • Aligned with National-Interstate Council (NIC) Standards & Milady Curriculums
          </p>
        </div>
      </footer>
    </div>
  );
}
