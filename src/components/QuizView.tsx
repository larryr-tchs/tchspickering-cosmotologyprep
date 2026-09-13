import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  Flag,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { Question, QuizConfig, QuizHistoryRecord } from '../types';
import { playSound, toggleQuestionBookmark, getBookmarkedQuestions } from '../utils/storage';

interface QuizViewProps {
  questions: Question[];
  config: QuizConfig;
  onFinishQuiz: (record: QuizHistoryRecord, userAnswers: Record<string, string>) => void;
  onQuitQuiz: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  config,
  onFinishQuiz,
  onQuitQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(getBookmarkedQuestions());
  const [showNavModal, setShowNavModal] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showQuitModal, setShowQuitModal] = useState<boolean>(false);

  // Timer logic
  const totalSeconds = config.timeLimitMinutes > 0 ? config.timeLimitMinutes * 60 : 0;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSeconds);
  const [isTimed] = useState<boolean>(config.timeLimitMinutes > 0);
  const [startTime] = useState<number>(Date.now());

  const currentQuestion = questions[currentIndex];
  const isAnswered = currentQuestion && Boolean(userAnswers[currentQuestion.id]);
  const isFlagged = currentQuestion && flaggedIds.includes(currentQuestion.id);
  const isBookmarked = currentQuestion && bookmarkedIds.includes(currentQuestion.id);

  // Timer tick
  useEffect(() => {
    if (!isTimed) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // auto submit
          handleCompleteExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimed]);

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    playSound('click');
    const nextAnswers = {
      ...userAnswers,
      [currentQuestion.id]: optionId,
    };
    setUserAnswers(nextAnswers);

    if (config.instantFeedback) {
      if (optionId === currentQuestion.correctOptionId) {
        playSound('correct');
      } else {
        playSound('incorrect');
      }
    }
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    playSound('click');
    setFlaggedIds((prev) =>
      prev.includes(currentQuestion.id)
        ? prev.filter((id) => id !== currentQuestion.id)
        : [...prev, currentQuestion.id]
    );
  };

  const handleToggleBookmark = () => {
    if (!currentQuestion) return;
    playSound('click');
    const updated = toggleQuestionBookmark(currentQuestion.id);
    setBookmarkedIds(updated);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      playSound('click');
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      playSound('click');
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCompleteExam = useCallback(() => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    let score = 0;
    const subjectBreakdown: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q) => {
      if (!subjectBreakdown[q.subjectName]) {
        subjectBreakdown[q.subjectName] = { correct: 0, total: 0 };
      }
      subjectBreakdown[q.subjectName].total += 1;

      if (userAnswers[q.id] === q.correctOptionId) {
        score += 1;
        subjectBreakdown[q.subjectName].correct += 1;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 75;

    const record: QuizHistoryRecord = {
      id: `quiz-${Date.now()}`,
      title:
        config.mode === 'full-mock'
          ? 'State Board Mock Exam'
          : config.mode === 'quick-blitz'
          ? 'Rapid 10-Min Blitz'
          : config.mode === 'missed-review'
          ? 'Saved Question Drill'
          : questions[0]?.subjectName || 'Subject Quiz',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
      mode: config.mode,
      subjectName: questions[0]?.subjectName || 'Cosmetology',
      score,
      totalQuestions: questions.length,
      percentage,
      passed,
      timeSpentSeconds: timeSpent,
      subjectBreakdown,
    };

    onFinishQuiz(record, userAnswers);
  }, [questions, userAnswers, config, startTime, onFinishQuiz]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSubmitModal || showQuitModal || showNavModal) return;
      if (['1', 'a', 'A'].includes(e.key)) handleSelectOption('A');
      if (['2', 'b', 'B'].includes(e.key)) handleSelectOption('B');
      if (['3', 'c', 'C'].includes(e.key)) handleSelectOption('C');
      if (['4', 'd', 'D'].includes(e.key)) handleSelectOption('D');
      if (e.key === 'ArrowRight' || e.key === 'n') handleNext();
      if (e.key === 'ArrowLeft' || e.key === 'p') handlePrev();
      if (e.key === 'f') handleToggleFlag();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, userAnswers, showSubmitModal, showQuitModal, showNavModal]);

  // Timer formatting
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Progress & Question index */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowQuitModal(true)}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            Exit Exam
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm sm:text-base font-bold text-slate-900">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <button
                onClick={() => setShowNavModal(true)}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 underline"
              >
                Jump to #
              </button>
            </div>
            <div className="w-32 sm:w-44 h-2 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center/Right: Timer & Flags */}
        <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
          {/* Flag Button */}
          <button
            id="flag-question-btn"
            onClick={handleToggleFlag}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isFlagged
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Flag for later review"
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'text-amber-600 fill-amber-500' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isFlagged ? 'Flagged' : 'Flag'}</span>
          </button>

          {/* Bookmark Button */}
          <button
            id="bookmark-question-btn"
            onClick={handleToggleBookmark}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isBookmarked
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Bookmark this question for ongoing study"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Timer Display */}
          {isTimed ? (
            <div
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-xs sm:text-sm border transition-colors ${
                secondsRemaining < 60
                  ? 'bg-red-50 text-red-600 border-red-300 animate-pulse'
                  : secondsRemaining < 300
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Untimed Mode
            </div>
          )}

          {/* Finish Button */}
          <button
            id="submit-exam-open-modal-btn"
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish</span>
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      {currentQuestion && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          {/* Question Metadata Tags */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                {currentQuestion.subjectName}
              </span>
              {currentQuestion.isHighYield && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-600" />
                  High-Yield State Board Question
                </span>
              )}
            </div>
            {isFlagged && (
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Flagged for Review
              </span>
            )}
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
            {currentQuestion.text}
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((option) => {
              const isSelected = userAnswers[currentQuestion.id] === option.id;
              const isCorrect = option.id === currentQuestion.correctOptionId;

              let optionStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 text-slate-800';
              let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';

              if (config.instantFeedback && isAnswered) {
                if (isCorrect) {
                  optionStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-400/50';
                  badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                } else if (isSelected) {
                  optionStyle = 'border-red-400 bg-red-50/70 text-red-950 ring-1 ring-red-300';
                  badgeStyle = 'bg-red-600 text-white border-red-600';
                }
              } else if (isSelected) {
                optionStyle = 'border-rose-600 bg-rose-50/70 text-rose-950 font-semibold ring-1 ring-rose-500/50';
                badgeStyle = 'bg-rose-600 text-white border-rose-600';
              }

              return (
                <button
                  key={option.id}
                  id={`quiz-option-${option.id}`}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full flex items-start text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${optionStyle}`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mr-3.5 flex-shrink-0 border transition-colors ${badgeStyle}`}
                  >
                    {option.id}
                  </span>
                  <span className="text-sm sm:text-base leading-snug pt-0.5">{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Instant Feedback Drawer (if enabled and answered) */}
          {config.instantFeedback && isAnswered && (
            <div
              className={`p-4 sm:p-5 rounded-xl border space-y-3 transition-all ${
                userAnswers[currentQuestion.id] === currentQuestion.correctOptionId
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                {userAnswers[currentQuestion.id] === currentQuestion.correctOptionId ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="font-bold text-sm text-emerald-800">Correct Answer!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="font-bold text-sm text-amber-900">
                      Incorrect — Correct option is {currentQuestion.correctOptionId}
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-800">
                {currentQuestion.explanation}
              </p>

              {currentQuestion.stateBoardTip && (
                <div className="flex items-start space-x-2 p-2.5 rounded-lg bg-white/80 border border-amber-300/60 text-xs text-amber-950">
                  <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-amber-900">Examiner Tip:</strong> {currentQuestion.stateBoardTip}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Prev / Next Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200'
              : 'text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Quick status dots or summary */}
        <div className="text-xs text-slate-500 hidden sm:block">
          <span>{answeredCount} answered</span> •{' '}
          <span className={unansweredCount > 0 ? 'text-amber-600 font-medium' : ''}>
            {unansweredCount} remaining
          </span>
          {flaggedIds.length > 0 && <span> • {flaggedIds.length} flagged</span>}
        </div>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center space-x-1 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs"
          >
            <span>Submit Exam</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Question Navigator Modal */}
      {showNavModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Question Navigator</h3>
              <button
                onClick={() => setShowNavModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 py-3 text-xs text-slate-600">
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span>Answered</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span>Flagged</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-slate-200 inline-block" />
                <span>Unanswered</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full border-2 border-rose-500 inline-block" />
                <span>Current</span>
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5 overflow-y-auto p-1 flex-1">
              {questions.map((q, idx) => {
                const isAns = Boolean(userAnswers[q.id]);
                const isFlg = flaggedIds.includes(q.id);
                const isCurr = idx === currentIndex;

                let btnBg = 'bg-slate-100 text-slate-700 border-slate-200';
                if (isAns) btnBg = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
                if (isFlg) btnBg = 'bg-amber-100 text-amber-900 border-amber-400 font-bold';

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowNavModal(false);
                    }}
                    className={`h-11 rounded-xl text-xs font-medium border flex items-center justify-center relative transition-all ${btnBg} ${
                      isCurr ? 'ring-2 ring-rose-500 font-bold' : ''
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlg && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowNavModal(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 text-rose-600">
              <Send className="w-5 h-5" />
              <h3 className="font-bold text-slate-900 text-base">Finish & Grade Exam?</h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you ready to submit your exam for grading? You will receive your official score breakdown, pass/fail result, and examiner feedback.
            </p>

            {unansweredCount > 0 && (
              <div className="flex items-start space-x-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Notice:</strong> You still have <strong>{unansweredCount} unanswered questions</strong>. On the actual state board, unanswered questions are scored as incorrect.
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Return to Exam
              </button>
              <button
                id="confirm-submit-exam-btn"
                onClick={() => {
                  setShowSubmitModal(false);
                  handleCompleteExam();
                }}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quit Confirmation Modal */}
      {showQuitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 text-slate-800">
              <HelpCircle className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-base">Exit Current Practice Exam?</h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              If you exit now, this session will not be graded or saved to your history.
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowQuitModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Continue Exam
              </button>
              <button
                onClick={() => {
                  setShowQuitModal(false);
                  onQuitQuiz();
                }}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
