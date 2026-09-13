import React, { useState, useRef } from 'react';
import defaultClassroomImg from '../assets/images/cosmetology_classroom_1789214328005.jpg';
import {
  Clock,
  Zap,
  Target,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Camera,
  Upload,
  RotateCcw,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { QuizConfig, QuizMode, SubjectId } from '../types';
import { SUBJECTS } from '../data/subjects';
import {
  getBookmarkedQuestions,
  playSound,
  getClassroomPhoto,
  setClassroomPhoto,
  resetClassroomPhoto,
  getStudentProfile,
  saveStudentProfile,
} from '../utils/storage';

interface QuizSetupProps {
  onStartQuiz: (config: QuizConfig) => void;
  initialSubjectId?: SubjectId;
}

export const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz, initialSubjectId }) => {
  const [selectedMode, setSelectedMode] = useState<QuizMode>(initialSubjectId ? 'domain-timed' : 'full-mock');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(initialSubjectId || 'infection-control');
  const [questionCount, setQuestionCount] = useState<number>(initialSubjectId ? 10 : 30);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(initialSubjectId ? 15 : 45);
  const [instantFeedback, setInstantFeedback] = useState<boolean>(false);
  const [classroomPhoto, setClassroomPhotoState] = useState<string>(() => {
    return getClassroomPhoto() || defaultClassroomImg;
  });
  const [isCustomPhoto, setIsCustomPhoto] = useState<boolean>(() => {
    return !!getClassroomPhoto();
  });
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string>(() => getStudentProfile().studentName || '');
  const [classCode, setClassCode] = useState<string>(() => getStudentProfile().classCode || 'COSMO-101');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadFeedback('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setClassroomPhoto(dataUrl);
      setClassroomPhotoState(dataUrl);
      setIsCustomPhoto(true);
      playSound('correct');
      setUploadFeedback('Classroom photo updated successfully!');
      setTimeout(() => setUploadFeedback(null), 3500);
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = () => {
    resetClassroomPhoto();
    setClassroomPhotoState(defaultClassroomImg);
    setIsCustomPhoto(false);
    playSound('click');
    setUploadFeedback('Reset to default classroom photo.');
    setTimeout(() => setUploadFeedback(null), 3000);
  };

  const bookmarkedCount = getBookmarkedQuestions().length;

  const handleModeChange = (mode: QuizMode) => {
    playSound('click');
    setSelectedMode(mode);
    if (mode === 'full-mock') {
      setQuestionCount(30);
      setTimeLimitMinutes(45);
      setInstantFeedback(false);
    } else if (mode === 'quick-blitz') {
      setQuestionCount(10);
      setTimeLimitMinutes(10);
      setInstantFeedback(true);
    } else if (mode === 'domain-timed') {
      setQuestionCount(10);
      setTimeLimitMinutes(15);
      setInstantFeedback(true);
    } else if (mode === 'missed-review') {
      setQuestionCount(Math.min(bookmarkedCount || 10, 20));
      setTimeLimitMinutes(20);
      setInstantFeedback(true);
    }
  };

  const handleLaunch = () => {
    playSound('correct');
    if (studentName.trim() || classCode.trim()) {
      saveStudentProfile({
        studentName: studentName.trim(),
        classCode: classCode.trim().toUpperCase() || 'COSMO-101',
      });
    }
    const config: QuizConfig = {
      mode: selectedMode,
      subjectId: selectedMode === 'domain-timed' ? selectedSubject : 'all',
      questionCount: selectedMode === 'missed-review' ? (bookmarkedCount > 0 ? bookmarkedCount : 10) : questionCount,
      timeLimitMinutes,
      instantFeedback,
    };
    onStartQuiz(config);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Hero Banner with Cosmetology Classroom Photo */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white rounded-2xl shadow-sm border border-slate-700/60 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left info content */}
          <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30 mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>State Board Timed Practice Exam</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-snug">
                Simulate Your Written State Board
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Step onto the salon training floor and prepare under authentic test conditions with realistic timed countdowns, multiple-choice questions aligned with NIC & Milady standards, and detailed state board examiner explanations.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-700/60 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NIC & Milady Compliant</span>
              </span>
              <span className="text-slate-500">•</span>
              <span>Infection Control Protocols</span>
              <span className="text-slate-500">•</span>
              <span>Chemical & Hair Services</span>
            </div>
          </div>

          {/* Right classroom image frame */}
          <div className="lg:col-span-5 relative bg-slate-950/70 flex flex-col justify-end border-t lg:border-t-0 lg:border-l border-slate-700/60 min-h-[220px] sm:min-h-[250px]">
            <img
              src={classroomPhoto}
              alt="Cosmetology Classroom Lab & Styling Stations"
              className="absolute inset-0 w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Subtle gradient vignette for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

            {/* Overlay banner with classroom caption and photo customization */}
            <div className="relative z-10 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-rose-600 text-white shrink-0">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white tracking-wide truncate">
                      {isCustomPhoto ? 'My Cosmetology Classroom' : 'Cosmetology Classroom & Salon Floor'}
                    </p>
                    <p className="text-[11px] text-slate-300 truncate">Practical styling stations & board clinic</p>
                  </div>
                </div>

                {/* Photo upload / reset trigger buttons */}
                <div className="flex items-center space-x-1.5 shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="classroom-photo-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/20 hover:bg-white/30 active:scale-95 text-white text-[11px] font-medium backdrop-blur-xs transition-all border border-white/25 cursor-pointer"
                    title="Upload your own cosmetology classroom picture"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{isCustomPhoto ? 'Change' : 'Upload Yours'}</span>
                  </button>
                  {isCustomPhoto && (
                    <button
                      type="button"
                      onClick={handleResetPhoto}
                      className="p-1 rounded-md bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 text-[11px] transition-all border border-slate-600 cursor-pointer"
                      title="Reset to default classroom photo"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {uploadFeedback && (
                <p className="text-[11px] text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 rounded-md px-2 py-0.5">
                  {uploadFeedback}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selection Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          1. Choose Exam Mode
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Full Mock */}
          <div
            onClick={() => handleModeChange('full-mock')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedMode === 'full-mock'
                ? 'border-rose-600 bg-rose-50/40 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700 mb-2">
                <Target className="w-5 h-5" />
              </div>
              {selectedMode === 'full-mock' && (
                <CheckCircle2 className="w-5 h-5 text-rose-600" />
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900">Comprehensive Mock Exam</h3>
            <p className="text-xs text-slate-600 mt-1">
              Cross-domain exam weighted by official state board percentages. Mimics the official Pearson VUE / PSI test format.
            </p>
            <div className="mt-3 flex items-center space-x-2 text-xs font-medium text-slate-500">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">30 Questions</span>
              <span>•</span>
              <span>45 Minutes</span>
            </div>
          </div>

          {/* Domain Specific */}
          <div
            onClick={() => handleModeChange('domain-timed')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedMode === 'domain-timed'
                ? 'border-rose-600 bg-rose-50/40 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 mb-2">
                <Clock className="w-5 h-5" />
              </div>
              {selectedMode === 'domain-timed' && (
                <CheckCircle2 className="w-5 h-5 text-rose-600" />
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900">Subject-Specific Quiz</h3>
            <p className="text-xs text-slate-600 mt-1">
              Target a specific domain (e.g. Infection Control, Chemistry, Hair Coloring) to strengthen weak subject areas.
            </p>
            <div className="mt-3 flex items-center space-x-2 text-xs font-medium text-slate-500">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">10-15 Questions</span>
              <span>•</span>
              <span>Custom Timed</span>
            </div>
          </div>

          {/* Rapid Blitz */}
          <div
            onClick={() => handleModeChange('quick-blitz')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedMode === 'quick-blitz'
                ? 'border-rose-600 bg-rose-50/40 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800 mb-2">
                <Zap className="w-5 h-5" />
              </div>
              {selectedMode === 'quick-blitz' && (
                <CheckCircle2 className="w-5 h-5 text-rose-600" />
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900">Rapid 10-Minute Blitz</h3>
            <p className="text-xs text-slate-600 mt-1">
              Fast 10 questions with immediate instant explanations. Ideal for warmups or daily review between salon client appointments.
            </p>
            <div className="mt-3 flex items-center space-x-2 text-xs font-medium text-slate-500">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">10 Questions</span>
              <span>•</span>
              <span>10 Minutes</span>
            </div>
          </div>

          {/* Bookmarked / Missed */}
          <div
            onClick={() => handleModeChange('missed-review')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedMode === 'missed-review'
                ? 'border-rose-600 bg-rose-50/40 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 mb-2">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              {selectedMode === 'missed-review' && (
                <CheckCircle2 className="w-5 h-5 text-rose-600" />
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900">Bookmarked Questions Bank</h3>
            <p className="text-xs text-slate-600 mt-1">
              Review and test yourself only on questions you flagged or saved for special attention.
            </p>
            <div className="mt-3 flex items-center space-x-2 text-xs font-medium text-slate-500">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {bookmarkedCount} Saved Questions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* If Domain Mode: Pick Subject */}
      {selectedMode === 'domain-timed' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            2. Select Subject Domain
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SUBJECTS.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  playSound('click');
                  setSelectedSubject(sub.id);
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-left border transition-all ${
                  selectedSubject === sub.id
                    ? 'border-rose-500 bg-rose-50/60 ring-1 ring-rose-400/50'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">{sub.shortName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Exam Weight: ~{sub.examWeightPercent}%</div>
                </div>
                {selectedSubject === sub.id && (
                  <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Options & Timing */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          {selectedMode === 'domain-timed' ? '3' : '2'}. Test Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Question count */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Number of Questions
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              disabled={selectedMode === 'missed-review'}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:ring-2 focus:ring-rose-500"
            >
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
              <option value={30}>30 Questions (Full Standard)</option>
              <option value={45}>45 Questions (Extensive)</option>
            </select>
          </div>

          {/* Time limit */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Time Limit
            </label>
            <select
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:ring-2 focus:ring-rose-500"
            >
              <option value={10}>10 Minutes (Fast)</option>
              <option value={15}>15 Minutes</option>
              <option value={20}>20 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes (Official Ratio)</option>
              <option value={60}>60 Minutes (Generous)</option>
              <option value={0}>Untimed (Study Practice)</option>
            </select>
          </div>

          {/* Feedback mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Explanation Delivery
            </label>
            <div className="flex items-center space-x-2 h-10">
              <button
                type="button"
                onClick={() => setInstantFeedback(!instantFeedback)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center space-x-1.5 transition-colors ${
                  instantFeedback
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {instantFeedback ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant Feedback (Study)</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>At Exam End (Real Exam)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* State Board Advice note */}
        <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs leading-relaxed">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">State Board Passing Benchmark:</strong> You need at least <strong>75%</strong> to pass the written cosmetology board exam in most states. We recommend taking timed full exams until you consistently score 85%+!
          </div>
        </div>
      </div>

      {/* Student Roster & Teacher Gradebook Info */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Student Identification & Class Code (Optional)
            </h3>
            <p className="text-xs text-slate-500">
              Taking this for your cosmetology class? Enter your name and teacher's class code to log your score into their live cloud gradebook.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Maya Lin"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Teacher's Class Code
            </label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              placeholder="e.g. COSMO-101"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-end">
        <button
          id="start-quiz-submit-btn"
          onClick={handleLaunch}
          className="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Clock className="w-5 h-5" />
          <span>Begin Timed Exam</span>
        </button>
      </div>
    </div>
  );
};
