import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Printer,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Eye,
  EyeOff,
  Flame,
} from 'lucide-react';
import { SubjectId } from '../types';
import { SUBJECTS } from '../data/subjects';
import { STUDY_GUIDES } from '../data/studyGuides';
import { playSound } from '../utils/storage';

interface StudyGuidesViewProps {
  initialSubjectId?: SubjectId;
  onLaunchSubjectQuiz: (subjectId: SubjectId) => void;
}

export const StudyGuidesView: React.FC<StudyGuidesViewProps> = ({
  initialSubjectId = 'infection-control',
  onLaunchSubjectQuiz,
}) => {
  const [activeSubjectId, setActiveSubjectId] = useState<SubjectId>(initialSubjectId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>([]);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  const activeSubject = SUBJECTS.find((s) => s.id === activeSubjectId) || SUBJECTS[0];
  const guide = STUDY_GUIDES[activeSubjectId] || STUDY_GUIDES['infection-control'];

  // Toggle individual section or expand all
  const toggleSection = (id: string) => {
    playSound('click');
    setExpandedSectionIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const isSectionExpanded = (id: string) => {
    // If searching, keep everything expanded
    if (searchQuery.trim().length > 0) return true;
    // Default all expanded if empty
    return expandedSectionIds.length === 0 || expandedSectionIds.includes(id);
  };

  const handleToggleRevealAnswer = (index: number) => {
    playSound('click');
    setRevealedAnswers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handlePrint = () => {
    playSound('click');
    window.print();
  };

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return guide.sections;
    const q = searchQuery.toLowerCase();
    return guide.sections.filter(
      (sec) =>
        sec.heading.toLowerCase().includes(q) ||
        sec.content.toLowerCase().includes(q) ||
        sec.bulletPoints?.some((bp) => bp.toLowerCase().includes(q)) ||
        sec.table?.rows.some((r) => r.some((cell) => cell.toLowerCase().includes(q)))
    );
  }, [guide.sections, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search and Print Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topics, laws, terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Print or Save PDF Study Guide"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Guide</span>
          </button>

          <button
            onClick={() => onLaunchSubjectQuiz(activeSubjectId)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Quiz This Subject</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Subjects List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
            Exam Subjects ({SUBJECTS.length})
          </div>

          <div className="space-y-1.5 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
            {SUBJECTS.map((sub) => {
              const isSelected = sub.id === activeSubjectId;
              return (
                <button
                  key={sub.id}
                  id={`subject-guide-tab-${sub.id}`}
                  onClick={() => {
                    playSound('click');
                    setActiveSubjectId(sub.id);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-rose-50/80 border-rose-300 text-rose-950 font-bold shadow-xs'
                      : 'border-transparent hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        isSelected ? 'bg-rose-600 ring-2 ring-rose-300' : 'bg-slate-300'
                      }`}
                    />
                    <div className="truncate">
                      <div className="text-xs sm:text-sm font-semibold truncate leading-tight">
                        {sub.shortName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{sub.category}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${
                      isSelected
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    ~{sub.examWeightPercent}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Column: Study Guide Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Guide Header Banner */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                {activeSubject.category} Sciences
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {guide.examWeightNotice}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {guide.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {guide.subtitle}
              </p>
            </div>

            {/* Key Takeaways Checklist */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-rose-600" />
                <span>State Board Core Must-Knows</span>
              </div>
              <ul className="space-y-1.5">
                {guide.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Guide Sections */}
          <div className="space-y-4">
            {filteredSections.map((section) => {
              const expanded = isSectionExpanded(section.id);
              return (
                <div
                  key={section.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
                  >
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {section.heading}
                    </h2>
                    {expanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {expanded && (
                    <div className="px-5 pb-6 sm:px-6 space-y-4 pt-1 text-slate-700 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                      <p>{section.content}</p>

                      {/* Bullet points */}
                      {section.bulletPoints && section.bulletPoints.length > 0 && (
                        <div className="space-y-2 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                          {section.bulletPoints.map((bp, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                              <div className="flex-1">{bp}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Table if present */}
                      {section.table && (
                        <div className="overflow-x-auto rounded-xl border border-slate-200 my-3">
                          <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                            <thead className="bg-slate-100/90 text-slate-800 font-bold">
                              <tr>
                                {section.table.headers.map((h, hi) => (
                                  <th key={hi} className="px-3.5 py-2.5">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                              {section.table.rows.map((row, ri) => (
                                <tr key={ri} className="hover:bg-slate-50/60">
                                  {row.map((cell, ci) => (
                                    <td key={ci} className="px-3.5 py-2.5 align-top whitespace-pre-line text-slate-700">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Callout Box if present */}
                      {section.callout && (
                        <div
                          className={`p-4 rounded-xl border space-y-1.5 ${
                            section.callout.type === 'critical'
                              ? 'bg-rose-50 border-rose-200 text-rose-950'
                              : section.callout.type === 'warning'
                              ? 'bg-amber-50 border-amber-200 text-amber-950'
                              : 'bg-indigo-50 border-indigo-200 text-indigo-950'
                          }`}
                        >
                          <div className="flex items-center space-x-2 font-bold text-xs">
                            {section.callout.type === 'critical' ? (
                              <AlertTriangle className="w-4 h-4 text-rose-600" />
                            ) : (
                              <Lightbulb className="w-4 h-4 text-amber-600" />
                            )}
                            <span>{section.callout.title}</span>
                          </div>
                          <p className="text-xs leading-relaxed">{section.callout.text}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Glossary Section */}
          {guide.glossary && guide.glossary.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-rose-600" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Key Examination Terminology
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {guide.glossary.map((gt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-1"
                  >
                    <div className="text-xs sm:text-sm font-bold text-rose-900">
                      {gt.term}
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      {gt.definition}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive "Check Your Knowledge" Micro-Quiz */}
          {guide.quickReviewQuestions && guide.quickReviewQuestions.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Quick Knowledge Check
                  </h2>
                </div>
                <span className="text-xs text-slate-500">Click to reveal answers</span>
              </div>

              <div className="space-y-3 pt-1">
                {guide.quickReviewQuestions.map((item, qIdx) => {
                  const isRevealed = Boolean(revealedAnswers[qIdx]);
                  return (
                    <div
                      key={qIdx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-xs sm:text-sm font-semibold text-slate-900">
                          {qIdx + 1}. {item.question}
                        </div>
                        <button
                          onClick={() => handleToggleRevealAnswer(qIdx)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 flex-shrink-0"
                        >
                          {isRevealed ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                              <span>Hide</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-rose-600" />
                              <span>Reveal</span>
                            </>
                          )}
                        </button>
                      </div>

                      {isRevealed && (
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900 animate-in fade-in">
                          <span className="font-bold text-emerald-800">Answer: </span>
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-rose-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold">Ready to test what you just studied?</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Take a 10-question timed practice drill covering {activeSubject.shortName}.
              </p>
            </div>
            <button
              onClick={() => onLaunchSubjectQuiz(activeSubjectId)}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-xs sm:text-sm text-white shadow-md flex-shrink-0"
            >
              Start {activeSubject.shortName} Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
