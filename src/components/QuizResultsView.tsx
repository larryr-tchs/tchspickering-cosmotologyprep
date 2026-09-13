import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  AlertOctagon,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  BookOpen,
  Send,
  Printer,
  GraduationCap,
  Check,
  Sparkles,
} from 'lucide-react';
import { Question, QuizHistoryRecord, SubjectId } from '../types';
import {
  playSound,
  toggleQuestionBookmark,
  getBookmarkedQuestions,
  getStudentProfile,
  saveStudentProfile,
} from '../utils/storage';
import { submitStudentScore } from '../utils/firebase';

interface QuizResultsViewProps {
  record: QuizHistoryRecord;
  questions: Question[];
  userAnswers: Record<string, string>;
  onRetake: () => void;
  onRetakeMissed: (missedQuestions: Question[]) => void;
  onNavigateToStudyGuide: (subjectId: SubjectId) => void;
  onBackToQuizzes: () => void;
}

export const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  record,
  questions,
  userAnswers,
  onRetake,
  onRetakeMissed,
  onNavigateToStudyGuide,
  onBackToQuizzes,
}) => {
  const [filter, setFilter] = useState<'all' | 'missed' | 'correct'>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(getBookmarkedQuestions());

  // Student class submission state
  const [studentName, setStudentName] = useState<string>(() => getStudentProfile().studentName || '');
  const [classCode, setClassCode] = useState<string>(() => getStudentProfile().classCode || 'COSMO-101');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedToClass, setSubmittedToClass] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSendToInstructor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!studentName.trim() || !classCode.trim()) {
      setSubmissionError('Please enter both your Student Name and Class Code.');
      return;
    }

    setSubmissionError(null);
    setIsSubmitting(true);
    playSound('click');

    try {
      saveStudentProfile({ studentName: studentName.trim(), classCode: classCode.trim().toUpperCase() });
      await submitStudentScore({
        classCode: classCode.trim().toUpperCase(),
        studentName: studentName.trim(),
        quizTitle: record.title || 'Cosmetology State Board Practice',
        quizMode: record.mode,
        score: record.score,
        totalQuestions: record.totalQuestions,
        percentage: record.percentage,
        passed: record.passed,
        timeSpentSeconds: record.timeSpentSeconds,
        subjectBreakdown: record.subjectBreakdown,
        submittedAt: new Date().toISOString(),
        timestamp: Date.now(),
      });
      setSubmittedToClass(true);
      playSound('correct');
    } catch (err) {
      console.error('Failed to submit score to instructor:', err);
      setSubmissionError('Unable to transmit score. Please check your network or try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (record.passed) {
      playSound('pass');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#fbbf24', '#34d399', '#60a5fa'],
      });
    } else {
      playSound('incorrect');
    }
  }, [record.passed]);

  const handleToggleBookmark = (questionId: string) => {
    playSound('click');
    const updated = toggleQuestionBookmark(questionId);
    setBookmarkedIds(updated);
  };

  const missedQuestions = questions.filter(
    (q) => userAnswers[q.id] !== q.correctOptionId
  );
  const correctQuestions = questions.filter(
    (q) => userAnswers[q.id] === q.correctOptionId
  );

  const displayedQuestions =
    filter === 'missed'
      ? missedQuestions
      : filter === 'correct'
      ? correctQuestions
      : questions;

  const formatSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner: Pass or Needs Improvement */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border shadow-sm ${
          record.passed
            ? 'bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white border-emerald-700/60'
            : 'bg-gradient-to-br from-rose-950 via-slate-900 to-slate-900 text-white border-rose-900/60'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
              {record.passed ? <Trophy className="w-3.5 h-3.5 text-amber-300" /> : <AlertOctagon className="w-3.5 h-3.5 text-rose-300" />}
              <span>Official Benchmark: 75% Passing Score</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {record.passed ? 'State Board Ready: You Passed!' : 'Review Recommended'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              {record.passed
                ? `Outstanding performance! You achieved ${record.percentage}%, successfully clearing the 75% passing mark. Review missed items below to reinforce your knowledge.`
                : `You scored ${record.percentage}%. The state board written exam requires a minimum of 75%. Focus your revision on the weak domains identified below.`}
            </p>
          </div>

          {/* Large Score Badge */}
          <div className="flex sm:flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex-shrink-0 text-center min-w-36">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              {record.percentage}%
            </div>
            <div className="text-xs font-medium text-slate-200 mt-1">
              {record.score} of {record.totalQuestions} Correct
            </div>
          </div>
        </div>

        {/* Quick Stats bar */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/15 text-center text-xs">
          <div>
            <span className="text-slate-300 block">Correct</span>
            <span className="text-sm sm:text-base font-bold text-emerald-300">
              {record.score}
            </span>
          </div>
          <div>
            <span className="text-slate-300 block">Missed</span>
            <span className="text-sm sm:text-base font-bold text-rose-300">
              {record.totalQuestions - record.score}
            </span>
          </div>
          <div>
            <span className="text-slate-300 block">Time Spent</span>
            <span className="text-sm sm:text-base font-bold text-white flex items-center justify-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-300 inline" />
              <span>{formatSeconds(record.timeSpentSeconds)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onRetake}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Quiz</span>
        </button>

        {missedQuestions.length > 0 && (
          <button
            onClick={() => onRetakeMissed(missedQuestions)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
          >
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span>Practice {missedQuestions.length} Missed Questions</span>
          </button>
        )}

        <button
          onClick={onBackToQuizzes}
          className="ml-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          Back to Exam Menu
        </button>
      </div>

      {/* Student Gradebook Submission Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Submit Score to Teacher's Gradebook
              </h3>
              <p className="text-xs text-slate-500">
                Send your exam grade and domain breakdown directly to your cosmetology instructor's live dashboard.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold self-start sm:self-auto cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Official Report (PDF)</span>
          </button>
        </div>

        {submittedToClass ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Score Recorded!</strong> Transmitted for <strong>{studentName}</strong> to Class Code{' '}
                <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300">
                  {classCode}
                </span>.
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium bg-emerald-100/60 px-2 py-0.5 rounded-md self-start sm:self-auto">
              ✓ Logged in Gradebook
            </span>
          </div>
        ) : (
          <form onSubmit={handleSendToInstructor} className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Alexis Jordan"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Instructor Class Code
                </label>
                <input
                  type="text"
                  required
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  placeholder="e.g. COSMO-101"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-60 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send to Teacher'}</span>
                </button>
              </div>
            </div>

            {submissionError && (
              <p className="text-xs text-rose-600 mt-2 font-medium">
                {submissionError}
              </p>
            )}
          </form>
        )}
      </div>

      {/* Domain Performance Breakdown */}
      {Object.keys(record.subjectBreakdown).length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Subject Domain Breakdown
              </h2>
              <p className="text-xs text-slate-500">
                Performance by subject topic to guide your study time.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {Object.keys(record.subjectBreakdown).length} Tested Domains
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {(Object.entries(record.subjectBreakdown) as [string, { correct: number; total: number }][]).map(([subjectName, data]) => {
              const pct = Math.round((data.correct / data.total) * 100);
              const isStrong = pct >= 75;

              return (
                <div key={subjectName} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{subjectName}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500">
                        {data.correct}/{data.total} ({pct}%)
                      </span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                          isStrong
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {isStrong ? 'Strong' : 'Review Needed'}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isStrong ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Question-by-Question Detailed Review */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Detailed Question Review
            </h2>
            <p className="text-xs text-slate-500">
              Inspect correct answers, full explanations, and state board examiner tips.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilter('missed')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'missed' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Missed ({missedQuestions.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'correct' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Correct ({correctQuestions.length})
            </button>
          </div>
        </div>

        {/* List of Reviewed Questions */}
        <div className="space-y-4">
          {displayedQuestions.map((q, idx) => {
            const userChoice = userAnswers[q.id];
            const isCorrect = userChoice === q.correctOptionId;
            const isBookmarked = bookmarkedIds.includes(q.id);

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all ${
                  isCorrect ? 'border-slate-200' : 'border-rose-200 shadow-xs'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {q.subjectName}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Missed
                        </>
                      )}
                    </span>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => handleToggleBookmark(q.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-sm sm:text-base font-semibold text-slate-900 mb-4">
                  {q.text}
                </div>

                {/* Options List */}
                <div className="space-y-2 mb-4">
                  {q.options.map((opt) => {
                    const isSelected = userChoice === opt.id;
                    const isTarget = opt.id === q.correctOptionId;

                    let rowStyle = 'border-slate-200 bg-slate-50/40 text-slate-700';
                    let letterBadge = 'bg-slate-200 text-slate-700';

                    if (isTarget) {
                      rowStyle = 'border-emerald-400 bg-emerald-50 text-emerald-950 font-semibold';
                      letterBadge = 'bg-emerald-600 text-white';
                    } else if (isSelected && !isCorrect) {
                      rowStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                      letterBadge = 'bg-rose-600 text-white';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-start p-3 rounded-xl border text-xs sm:text-sm ${rowStyle}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 ${letterBadge}`}
                        >
                          {opt.id}
                        </span>
                        <span className="pt-0.5 flex-1">{opt.text}</span>
                        {isTarget && (
                          <span className="text-xs font-bold text-emerald-700 ml-2">
                            (Correct)
                          </span>
                        )}
                        {isSelected && !isTarget && (
                          <span className="text-xs font-bold text-rose-700 ml-2">
                            (Your Answer)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-800">
                  <div>
                    <strong className="font-bold text-slate-900">Explanation: </strong>
                    {q.explanation}
                  </div>

                  {q.stateBoardTip && (
                    <div className="flex items-start space-x-2 pt-2 border-t border-slate-200 text-xs text-amber-950">
                      <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-amber-900">State Board Tip: </strong>
                        {q.stateBoardTip}
                      </div>
                    </div>
                  )}

                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => onNavigateToStudyGuide(q.subjectId)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center space-x-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Review {q.subjectName} Study Guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
