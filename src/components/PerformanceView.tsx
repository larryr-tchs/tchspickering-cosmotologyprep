import React, { useState } from 'react';
import {
  Trophy,
  BarChart3,
  Bookmark,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  Trash2,
} from 'lucide-react';
import { QuizHistoryRecord, Question } from '../types';
import { SUBJECTS } from '../data/subjects';
import { QUESTIONS } from '../data/questions';
import {
  getQuizHistory,
  clearQuizHistory,
  getBookmarkedQuestions,
  toggleQuestionBookmark,
  playSound,
} from '../utils/storage';

interface PerformanceViewProps {
  onStartBookmarkedQuiz: (bookmarkedQuestions: Question[]) => void;
  onNavigateToStudyGuide: (subjectId: string) => void;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({
  onStartBookmarkedQuiz,
  onNavigateToStudyGuide,
}) => {
  const [history, setHistory] = useState<QuizHistoryRecord[]>(getQuizHistory());
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(getBookmarkedQuestions());
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const totalQuizzes = history.length;
  const passedQuizzes = history.filter((h) => h.passed).length;
  const passRate = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0;
  const avgScore =
    totalQuizzes > 0
      ? Math.round(history.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes)
      : 0;
  const totalQuestionsAnswered = history.reduce((acc, curr) => acc + curr.totalQuestions, 0);

  // Calculate subject mastery from history
  const subjectStats: Record<string, { correct: number; total: number }> = {};
  history.forEach((rec) => {
    if (!rec.subjectBreakdown) return;
    (Object.entries(rec.subjectBreakdown) as [string, { correct: number; total: number }][]).forEach(
      ([name, data]) => {
        if (!subjectStats[name]) {
          subjectStats[name] = { correct: 0, total: 0 };
        }
        subjectStats[name].correct += data.correct;
        subjectStats[name].total += data.total;
      }
    );
  });

  const bookmarkedQuestionsList = QUESTIONS.filter((q) =>
    bookmarkedIds.includes(q.id)
  );

  const handleRemoveBookmark = (id: string) => {
    playSound('click');
    const updated = toggleQuestionBookmark(id);
    setBookmarkedIds(updated);
  };

  const handleClearHistory = () => {
    clearQuizHistory();
    setHistory([]);
    setShowClearConfirm(false);
    playSound('click');
  };

  // Readiness Score 0-100%
  const calculateReadiness = () => {
    if (totalQuizzes === 0) return 30; // Baseline starting study
    const weightedAvg = avgScore * 0.6;
    const volumeFactor = Math.min(totalQuizzes * 5, 25);
    const passBonus = passRate >= 75 ? 15 : 5;
    return Math.min(Math.round(weightedAvg + volumeFactor + passBonus), 99);
  };

  const readinessScore = calculateReadiness();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Readiness Score Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>State Board Exam Readiness Index</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Your Exam Readiness: {readinessScore}%
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {readinessScore >= 80
              ? 'Excellent progress! Your score trends indicate a high probability of passing the written state board exam on your first attempt.'
              : readinessScore >= 60
              ? 'On track! Keep taking full-length timed quizzes and review weaker scientific domains.'
              : 'Early study stage. Complete subject study guides and daily practice quizzes to elevate your readiness.'}
          </p>
        </div>

        {/* Circular or Pill Meter */}
        <div className="flex-shrink-0 text-center bg-white/10 rounded-2xl p-6 border border-white/20 min-w-36">
          <div className="text-4xl sm:text-5xl font-black text-rose-400">{readinessScore}%</div>
          <div className="text-xs text-slate-300 mt-1 font-medium">Readiness Index</div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Exams Completed</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalQuizzes}</span>
          <span className="text-[11px] text-slate-400">Total sessions</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Average Score</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{avgScore}%</span>
          <span className="text-[11px] text-emerald-600 font-semibold">Pass mark: 75%</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Pass Rate</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{passRate}%</span>
          <span className="text-[11px] text-slate-400">{passedQuizzes} passed tests</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Questions Answered</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalQuestionsAnswered}</span>
          <span className="text-[11px] text-slate-400">Items practiced</span>
        </div>
      </div>

      {/* Subject Domain Mastery Bars */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Domain Mastery Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Track your strength in each of the official examination categories.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            {SUBJECTS.length} Subjects
          </span>
        </div>

        <div className="space-y-3.5 pt-1">
          {SUBJECTS.map((sub) => {
            const stat = subjectStats[sub.name];
            const pct = stat && stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;
            const isTested = pct !== null;
            const isPassing = isTested && pct >= 75;

            return (
              <div key={sub.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{sub.name}</span>
                  <div className="flex items-center space-x-2">
                    {isTested ? (
                      <>
                        <span className="text-slate-500">
                          {stat.correct}/{stat.total} ({pct}%)
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                            isPassing
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isPassing ? 'Proficient' : 'Needs Practice'}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400 italic">Not tested yet</span>
                    )}
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isPassing ? 'bg-emerald-500' : isTested ? 'bg-rose-500' : 'bg-slate-200'
                    }`}
                    style={{ width: `${pct ?? 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bookmarked Questions Bank */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Saved Question Bank ({bookmarkedQuestionsList.length})
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Questions you flagged for ongoing review during test practice.
            </p>
          </div>

          {bookmarkedQuestionsList.length > 0 && (
            <button
              onClick={() => onStartBookmarkedQuiz(bookmarkedQuestionsList)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>Quiz All Saved Items</span>
            </button>
          )}
        </div>

        {bookmarkedQuestionsList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            No questions saved yet. Click the bookmark icon during quizzes to save questions here for custom drill sessions.
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {bookmarkedQuestionsList.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                      {q.subjectName}
                    </span>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 pt-1">
                      {idx + 1}. {q.text}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveBookmark(q.id)}
                    className="text-xs text-slate-400 hover:text-red-600 p-1"
                    title="Remove from saved bank"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                  <strong className="text-emerald-700">Correct Answer: </strong>
                  {q.options.find((o) => o.id === q.correctOptionId)?.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quiz History Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Exam History Log</h2>
            <p className="text-xs text-slate-500">Log of your past practice exams and scores.</p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center space-x-1 text-xs text-slate-500 hover:text-red-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Log</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            No quiz attempts recorded yet. Begin your first practice exam from the Quizzes tab!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-bold">
                <tr>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Exam Title</th>
                  <th className="px-3 py-2.5">Score</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80">
                    <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{rec.date}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-900">{rec.title}</td>
                    <td className="px-3 py-2.5 font-bold text-slate-800">
                      {rec.score}/{rec.totalQuestions} ({rec.percentage}%)
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          rec.passed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {rec.passed ? 'PASSED' : 'NEEDS WORK'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">
                      {Math.floor(rec.timeSpentSeconds / 60)}m {rec.timeSpentSeconds % 60}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Reset Quiz History?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will clear all recorded quiz scores and reset your domain mastery metrics. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
