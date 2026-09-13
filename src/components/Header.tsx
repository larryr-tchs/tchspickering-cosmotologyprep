import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  BookOpen,
  Layers,
  ShieldAlert,
  BarChart3,
  UserCheck,
  Calendar,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { getExamDate, setExamDate, getAudioEnabled, setAudioEnabled, playSound } from '../utils/storage';

export type AppTab = 'quizzes' | 'study-guides' | 'flashcards' | 'protocols' | 'performance' | 'instructor';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const [examDate, setExamDateState] = useState<string>(getExamDate());
  const [showDateModal, setShowDateModal] = useState<boolean>(false);
  const [audioActive, setAudioActive] = useState<boolean>(getAudioEnabled());

  const handleAudioToggle = () => {
    const next = !audioActive;
    setAudioActive(next);
    setAudioEnabled(next);
    if (next) playSound('click');
  };

  const calculateDaysLeft = (): number => {
    if (!examDate) return 30;
    const target = new Date(examDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const daysLeft = calculateDaysLeft();

  const handleSaveExamDate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('examDate') as HTMLInputElement;
    if (input && input.value) {
      setExamDateState(input.value);
      setExamDate(input.value);
      playSound('correct');
      setShowDateModal(false);
    }
  };

  const navItems: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'quizzes', label: 'Practice Quizzes', icon: Clock },
    { id: 'study-guides', label: 'Subject Guides', icon: BookOpen },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'protocols', label: 'Safety Protocols', icon: ShieldAlert },
    { id: 'performance', label: 'My Progress', icon: BarChart3 },
    { id: 'instructor', label: 'Instructor Hub', icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('quizzes')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm ring-1 ring-rose-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">CosmoBoard Pro</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                  <Sparkles className="w-3 h-3 mr-1 text-rose-500" />
                  State Board Prep
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">NIC & Milady Written Exam Simulation</p>
            </div>
          </div>

          {/* Right Controls: Days countdown & Audio toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Exam Countdown Button */}
            <button
              id="exam-countdown-btn"
              onClick={() => setShowDateModal(true)}
              className="group flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition-colors"
              title="Click to change your State Board exam date"
            >
              <Calendar className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
              <span>
                <strong className="text-slate-900 font-bold">{daysLeft}</strong> {daysLeft === 1 ? 'day' : 'days'} to Exam
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              id="audio-toggle-btn"
              onClick={handleAudioToggle}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title={audioActive ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
              aria-label="Toggle sound effects"
            >
              {audioActive ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="bg-slate-50/70 border-t border-slate-200/60 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-2 py-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  playSound('click');
                  onTabChange(item.id);
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 ring-1 ring-slate-200/50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'instructor' && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5"
                    title="Live Gradebook active"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Exam Date Modal */}
      {showDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Set Your State Board Exam Date</h3>
              </div>
              <button
                onClick={() => setShowDateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Tracking your target test date helps pace your study guide review and practice quizzes according to the recommended 4-week preparation schedule.
            </p>
            <form onSubmit={handleSaveExamDate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Exam Date
                </label>
                <input
                  type="date"
                  name="examDate"
                  defaultValue={examDate}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-xs"
                >
                  Save Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
