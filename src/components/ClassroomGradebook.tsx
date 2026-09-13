import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  AlertTriangle,
  Clock,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  TrendingUp,
  RefreshCw,
  Plus,
  Share2,
  Check,
  ChevronRight,
  BookOpen,
  Sparkles,
  Layers,
} from 'lucide-react';
import { StudentExamSubmission, ClassCohort } from '../types';
import {
  subscribeToClassSubmissions,
  createClassCohort,
  submitStudentScore,
} from '../utils/firebase';
import {
  getInstructorActiveClass,
  saveInstructorActiveClass,
  playSound,
} from '../utils/storage';

export const ClassroomGradebook: React.FC = () => {
  const [classCode, setClassCode] = useState<string>(getInstructorActiveClass());
  const [inputCode, setInputCode] = useState<string>('');
  const [submissions, setSubmissions] = useState<StudentExamSubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'pass' | 'review'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<StudentExamSubmission | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showNewClassModal, setShowNewClassModal] = useState<boolean>(false);
  const [newClassName, setNewClassName] = useState<string>('Pickering Cosmetology Cohort');
  const [newClassCodeInput, setNewClassCodeInput] = useState<string>('PICKERING-1');
  const [isSubmittingDemo, setIsSubmittingDemo] = useState<boolean>(false);

  // Subscribe to real-time updates for the current active classCode
  useEffect(() => {
    setIsLoading(true);
    saveInstructorActiveClass(classCode);

    const unsubscribe = subscribeToClassSubmissions(
      classCode,
      (data) => {
        setSubmissions(data);
        setIsLoading(false);
      },
      (err) => {
        console.error('Gradebook subscription error:', err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [classCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classCode);
    setCopiedCode(true);
    playSound('click');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSwitchClass = (newCode: string) => {
    if (!newCode.trim()) return;
    const clean = newCode.trim().toUpperCase();
    setClassCode(clean);
    setInputCode('');
    playSound('click');
  };

  const handleCreateNewCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassCodeInput.trim() || !newClassName.trim()) return;
    const code = newClassCodeInput.trim().toUpperCase();
    try {
      await createClassCohort({
        classCode: code,
        className: newClassName.trim(),
        instructorName: 'Cosmetology Instructor',
        createdAt: new Date().toISOString(),
      });
      setClassCode(code);
      setShowNewClassModal(false);
      playSound('correct');
    } catch (err) {
      console.error('Failed to create cohort:', err);
    }
  };

  // Quick demo submission so instructor can immediately verify the live pipeline
  const handleGenerateSampleSubmission = async () => {
    setIsSubmittingDemo(true);
    playSound('click');
    const demoNames = ['Maya Lin (Sample)', 'Jordan Lee (Sample)', 'Alex Rivera (Sample)', 'Taylor Smith (Sample)'];
    const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];
    const score = Math.floor(Math.random() * 20) + 70; // 70 to 90
    const total = 100;
    const pct = Math.round((score / total) * 100);

    try {
      await submitStudentScore({
        classCode,
        studentName: randomName,
        quizTitle: 'Full State Board Practice Simulation',
        quizMode: 'full-mock',
        score,
        totalQuestions: total,
        percentage: pct,
        passed: pct >= 75,
        timeSpentSeconds: 2100,
        subjectBreakdown: {
          'Infection Control & Safety': { correct: 28, total: 30 },
          'Chemical Texture & Relaxers': { correct: 14, total: 20 },
          'Hair Coloring & Chemistry': { correct: 16, total: 20 },
          'Anatomy & Esthetics': { correct: 14, total: 15 },
          'Nail Care & State Laws': { correct: 13, total: 15 },
        },
        submittedAt: new Date().toISOString(),
        timestamp: Date.now(),
      });
      playSound('pass');
    } catch (err) {
      console.error('Demo submission error:', err);
    } finally {
      setIsSubmittingDemo(false);
    }
  };

  // Export gradebook to CSV
  const handleExportCSV = () => {
    playSound('click');
    if (submissions.length === 0) return;

    const headers = [
      'Student Name',
      'Class Code',
      'Exam Title',
      'Mode',
      'Score',
      'Total',
      'Percentage',
      'Status',
      'Time Spent (Sec)',
      'Date Submitted',
    ];

    const rows = submissions.map((s) => [
      `"${s.studentName.replace(/"/g, '""')}"`,
      `"${s.classCode}"`,
      `"${s.quizTitle.replace(/"/g, '""')}"`,
      s.quizMode,
      s.score,
      s.totalQuestions,
      `${s.percentage}%`,
      s.passed ? 'PASSED' : 'NEEDS REVIEW',
      s.timeSpentSeconds,
      `"${new Date(s.submittedAt).toLocaleString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cosmetology_grades_${classCode}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate cohort aggregates
  const totalSubmissions = submissions.length;
  const averagePercentage =
    totalSubmissions > 0
      ? Math.round(
          submissions.reduce((acc, curr) => acc + curr.percentage, 0) /
            totalSubmissions
        )
      : 0;

  const passedCount = submissions.filter((s) => s.passed).length;
  const passRate =
    totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 0;

  // Aggregate weakest subjects across all submissions
  const domainAggregate: Record<string, { correct: number; total: number }> = {};
  submissions.forEach((s) => {
    if (s.subjectBreakdown) {
      (Object.entries(s.subjectBreakdown) as [string, { correct: number; total: number }][]).forEach(([name, data]) => {
        if (!domainAggregate[name]) {
          domainAggregate[name] = { correct: 0, total: 0 };
        }
        domainAggregate[name].correct += data.correct;
        domainAggregate[name].total += data.total;
      });
    }
  });

  let weakestDomain: { name: string; pct: number } | null = null;
  Object.entries(domainAggregate).forEach(([name, data]) => {
    if (data.total >= 5) {
      const pct = Math.round((data.correct / data.total) * 100);
      if (!weakestDomain || pct < weakestDomain.pct) {
        weakestDomain = { name, pct };
      }
    }
  });

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch = s.studentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'pass') return s.passed;
    if (filterMode === 'review') return !s.passed;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Class Code Header & Student Invitation Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                Live Cloud Sync Active
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-500">
                Firestore Database Connected
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Class Cohort Gradebook
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Real-time student scores, State Board pass tracking, and domain weakness diagnostics.
            </p>
          </div>

          {/* Active Class Code Box with 1-click Copy */}
          <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-xl p-2 sm:p-3 shrink-0">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                Class Join Code
              </span>
              <span className="text-base sm:text-lg font-black tracking-wider text-rose-700 font-mono">
                {classCode}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
              title="Copy class code to clipboard"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Student Instruction Callout */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-950">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Give this code to your students:</strong> Tell them to type{' '}
              <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded text-rose-700 border border-rose-200">
                {classCode}
              </span>{' '}
              on the Quiz screen to have their test results automatically sent to this screen.
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Quick switcher */}
            <input
              type="text"
              placeholder="Switch code..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSwitchClass(inputCode);
              }}
              className="w-28 px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white uppercase font-mono"
            />
            {inputCode && (
              <button
                onClick={() => handleSwitchClass(inputCode)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-semibold text-xs"
              >
                Go
              </button>
            )}
            <button
              onClick={() => setShowNewClassModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-rose-600" />
              <span>New Cohort</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Statistics Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Submissions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Tests Completed</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-slate-900">{totalSubmissions}</div>
          <p className="text-[11px] text-slate-500">
            Total exams logged under <span className="font-mono font-semibold">{classCode}</span>
          </p>
        </div>

        {/* Class Average Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Class Average</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {totalSubmissions > 0 ? `${averagePercentage}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-500">
            {averagePercentage >= 75
              ? 'Above the 75% State Board benchmark'
              : 'Below 75% passing requirement'}
          </p>
        </div>

        {/* Pass Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Board Pass Rate</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600">
            {totalSubmissions > 0 ? `${passRate}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-500">
            {passedCount} of {totalSubmissions} scores ≥ 75%
          </p>
        </div>

        {/* Priority Remediation Alert */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Weakest Domain</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-sm font-bold text-rose-700 truncate">
            {weakestDomain ? weakestDomain.name : 'No Weak Areas Yet'}
          </div>
          <p className="text-[11px] text-slate-500">
            {weakestDomain
              ? `Cohort average: ${weakestDomain.pct}% — Recommended for class review`
              : 'Aggregate domain performance looks steady'}
          </p>
        </div>
      </div>

      {/* Roster & Scores Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search student by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Filter Pills & CSV Export */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  filterMode === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({submissions.length})
              </button>
              <button
                onClick={() => setFilterMode('pass')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  filterMode === 'pass'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Passed ({passedCount})
              </button>
              <button
                onClick={() => setFilterMode('review')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  filterMode === 'review'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Needs Review ({submissions.length - passedCount})
              </button>
            </div>

            {submissions.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-xs"
                title="Download CSV for PowerSchool or Canvas"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            )}

            <button
              onClick={handleGenerateSampleSubmission}
              disabled={isSubmittingDemo}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors"
              title="Add a sample student test score to preview the live table"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSubmittingDemo ? 'animate-spin' : ''}`} />
              <span>{isSubmittingDemo ? 'Sending...' : 'Test Demo Score'}</span>
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 text-xs space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-rose-600" />
              <p>Connecting to live classroom database...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  No Student Submissions for {classCode}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Students will appear here automatically when they complete a quiz on their devices with class code{' '}
                  <span className="font-mono font-bold text-rose-700">{classCode}</span>.
                </p>
              </div>
              <button
                onClick={handleGenerateSampleSubmission}
                disabled={isSubmittingDemo}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Generate Demo Student Submission</span>
              </button>
            </div>
          ) : (
            <table className="min-w-full text-xs text-left divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Exam / Mode</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Time Spent</th>
                  <th className="px-4 py-3">Submitted At</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredSubmissions.map((sub, idx) => (
                  <tr key={sub.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                        {sub.studentName.charAt(0).toUpperCase()}
                      </div>
                      <span>{sub.studentName}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="font-medium text-slate-800 block truncate max-w-xs">
                        {sub.quizTitle}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400">
                        {sub.quizMode}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {sub.score}/{sub.totalQuestions} ({sub.percentage}%)
                    </td>
                    <td className="px-4 py-3">
                      {sub.passed ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>PASS</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>&lt; 75% REVIEW</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono">
                      {Math.floor(sub.timeSpentSeconds / 60)}m {sub.timeSpentSeconds % 60}s
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-[11px]">
                      {new Date(sub.submittedAt).toLocaleDateString()}{' '}
                      <span className="text-slate-400">
                        {new Date(sub.submittedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          playSound('click');
                          setSelectedSubmission(sub);
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                      >
                        <span>Breakdown</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Student Detail Breakdown Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Student Examination Record
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedSubmission.studentName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedSubmission.quizTitle} • Class Code: {selectedSubmission.classCode}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Score pill */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                selectedSubmission.passed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div>
                <span className="text-xs font-semibold block">
                  {selectedSubmission.passed ? 'State Board Passing Score' : 'Below 75% Passing Threshold'}
                </span>
                <span className="text-2xl font-black">{selectedSubmission.percentage}%</span>
                <span className="text-xs ml-2 text-slate-600">
                  ({selectedSubmission.score}/{selectedSubmission.totalQuestions} questions)
                </span>
              </div>
              <div className="text-right text-xs">
                <span className="block text-slate-500">Time Taken</span>
                <span className="font-bold font-mono">
                  {Math.floor(selectedSubmission.timeSpentSeconds / 60)}m {selectedSubmission.timeSpentSeconds % 60}s
                </span>
              </div>
            </div>

            {/* Subject domain breakdown list */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Subject Domain Breakdown
              </h4>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {(Object.entries(selectedSubmission.subjectBreakdown) as [string, { correct: number; total: number }][]).map(([subject, stats]) => {
                  const pct = Math.round((stats.correct / stats.total) * 100);
                  const isPassing = pct >= 75;
                  return (
                    <div key={subject} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{subject}</span>
                        <span className={`font-mono font-bold ${isPassing ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {stats.correct}/{stats.total} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isPassing ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Class Modal */}
      {showNewClassModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateNewCohort}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create New Class Cohort</h3>
                <p className="text-xs text-slate-500">
                  Generate a custom join code for your specific section or semester.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewClassModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Class Cohort Name
                </label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. Pickering AM Senior Cosmetology"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Custom Class Code (Students will type this)
                </label>
                <input
                  type="text"
                  required
                  value={newClassCodeInput}
                  onChange={(e) => setNewClassCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. PICKERING-AM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Short, easy to remember codes work best (e.g. CCIU-1, COSMO-AM, PICKERING-2).
                </span>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowNewClassModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                Create & Switch to Class
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
