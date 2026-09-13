export type SubjectId =
  | 'infection-control'
  | 'anatomy-physiology'
  | 'chemistry-electricity'
  | 'trichology-scalp'
  | 'chemical-texture'
  | 'hair-coloring'
  | 'haircutting-styling'
  | 'esthetics-skincare'
  | 'nail-technology'
  | 'laws-ethics';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  shortName: string;
  category: 'Scientific' | 'Hair Care' | 'Skin & Nails' | 'Laws & Safety';
  examWeightPercent: number; // e.g. 20%
  questionCount: number;
  iconName: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  description: string;
}

export interface QuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface Question {
  id: string;
  subjectId: SubjectId;
  subjectName: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  stateBoardTip?: string;
  isHighYield?: boolean;
}

export type AppTab =
  | 'quizzes'
  | 'study-guides'
  | 'flashcards'
  | 'protocols'
  | 'performance'
  | 'instructor';

export type QuizMode =
  | 'full-mock'
  | 'domain-timed'
  | 'quick-blitz'
  | 'missed-review'
  | 'subject-focus';

export interface QuizConfig {
  mode: QuizMode;
  subjectId?: SubjectId | 'all';
  questionCount: number;
  timeLimitMinutes: number; // 0 for untimed
  instantFeedback: boolean; // whether to show explanation right away or only at end
}

export interface QuizSessionState {
  config: QuizConfig;
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<string, string>; // questionId -> optionId
  flaggedQuestionIds: string[];
  timeRemainingSeconds: number;
  isFinished: boolean;
  startedAt: number;
  completedAt?: number;
}

export interface QuizHistoryRecord {
  id: string;
  title: string;
  date: string;
  timestamp: number;
  mode: QuizMode;
  subjectName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  subjectBreakdown: Record<string, { correct: number; total: number }>;
}

export interface KeyTerm {
  term: string;
  definition: string;
  examContext?: string;
}

export interface ClassCohort {
  classCode: string;
  className: string;
  instructorName?: string;
  createdAt: string;
}

export interface StudentExamSubmission {
  id?: string;
  classCode: string;
  studentName: string;
  studentEmail?: string;
  quizTitle: string;
  quizMode: QuizMode;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  subjectBreakdown: Record<string, { correct: number; total: number }>;
  submittedAt: string;
  timestamp: number;
}

export interface StudySection {
  id: string;
  heading: string;
  content: string;
  bulletPoints?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  callout?: {
    type: 'critical' | 'warning' | 'tip' | 'formula';
    title: string;
    text: string;
  };
}

export interface StudyGuide {
  subjectId: SubjectId;
  title: string;
  subtitle: string;
  examWeightNotice: string;
  keyTakeaways: string[];
  sections: StudySection[];
  glossary: KeyTerm[];
  quickReviewQuestions: {
    question: string;
    answer: string;
  }[];
}

export interface Flashcard {
  id: string;
  subjectId: SubjectId;
  subjectName: string;
  front: string;
  back: string;
  hint?: string;
  examTag?: string;
}

export interface ProtocolStepItem {
  id: string;
  order: number;
  text: string;
  detail: string;
}

export interface StateBoardProtocol {
  id: string;
  title: string;
  subtitle: string;
  whyCritical: string;
  steps: ProtocolStepItem[];
}
