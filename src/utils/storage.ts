import { QuizHistoryRecord } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'cosmo_quiz_history_v1',
  BOOKMARKS: 'cosmo_bookmarked_questions_v1',
  FLASHCARD_MASTERED: 'cosmo_flashcard_mastered_v1',
  EXAM_DATE: 'cosmo_exam_date_v1',
  AUDIO_ENABLED: 'cosmo_audio_enabled_v1',
  CUSTOM_CLASSROOM_PHOTO: 'cosmo_custom_classroom_photo_v1',
  STUDENT_PROFILE: 'cosmo_student_profile_v1',
  INSTRUCTOR_ACTIVE_CLASS: 'cosmo_instructor_active_class_v1',
  INSTRUCTOR_SAVED_CLASSES: 'cosmo_instructor_saved_classes_v1',
};

export function getQuizHistory(): QuizHistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load quiz history:', e);
    return [];
  }
}

export function saveQuizRecord(record: QuizHistoryRecord): QuizHistoryRecord[] {
  try {
    const current = getQuizHistory();
    const updated = [record, ...current].slice(0, 50); // keep last 50
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save quiz record:', e);
    return [];
  }
}

export function clearQuizHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (e) {
    console.error('Failed to clear quiz history:', e);
  }
}

export function getBookmarkedQuestions(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleQuestionBookmark(questionId: string): string[] {
  try {
    const current = getBookmarkedQuestions();
    const exists = current.includes(questionId);
    const updated = exists ? current.filter((id) => id !== questionId) : [...current, questionId];
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function getMasteredFlashcards(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARD_MASTERED);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleFlashcardMastered(cardId: string): string[] {
  try {
    const current = getMasteredFlashcards();
    const exists = current.includes(cardId);
    const updated = exists ? current.filter((id) => id !== cardId) : [...current, cardId];
    localStorage.setItem(STORAGE_KEYS.FLASHCARD_MASTERED, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function getExamDate(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EXAM_DATE);
    if (stored) return stored;
    // Default 30 days from now
    const target = new Date();
    target.setDate(target.getDate() + 30);
    return target.toISOString().split('T')[0];
  } catch (e) {
    return '';
  }
}

export function setExamDate(dateStr: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXAM_DATE, dateStr);
  } catch (e) {
    console.error('Failed to save exam date:', e);
  }
}

export function getAudioEnabled(): boolean {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.AUDIO_ENABLED);
    return val !== 'false';
  } catch (e) {
    return true;
  }
}

export function setAudioEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIO_ENABLED, String(enabled));
  } catch (e) {
    console.error('Failed to set audio preference:', e);
  }
}

export function getClassroomPhoto(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.CUSTOM_CLASSROOM_PHOTO);
  } catch (e) {
    return null;
  }
}

export function setClassroomPhoto(photoDataUrl: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CLASSROOM_PHOTO, photoDataUrl);
  } catch (e) {
    console.error('Failed to save classroom photo:', e);
  }
}

export function resetClassroomPhoto(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_CLASSROOM_PHOTO);
  } catch (e) {
    console.error('Failed to reset classroom photo:', e);
  }
}

export function getStudentProfile(): { studentName: string; classCode: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
    return raw ? JSON.parse(raw) : { studentName: '', classCode: '' };
  } catch (e) {
    return { studentName: '', classCode: '' };
  }
}

export function saveStudentProfile(profile: { studentName: string; classCode: string }): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save student profile:', e);
  }
}

export function getInstructorActiveClass(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.INSTRUCTOR_ACTIVE_CLASS) || 'COSMO-101';
  } catch (e) {
    return 'COSMO-101';
  }
}

export function saveInstructorActiveClass(code: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INSTRUCTOR_ACTIVE_CLASS, code.trim().toUpperCase());
  } catch (e) {
    console.error('Failed to save instructor active class:', e);
  }
}

// Simple Web Audio synth chimes for audio feedback without external audio files
export function playSound(type: 'click' | 'correct' | 'incorrect' | 'complete' | 'pass') {
  if (!getAudioEnabled()) return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'correct') {
      const now = ctx.currentTime;
      [587.33, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.08, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.18);
      });
    } else if (type === 'incorrect') {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.15);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'pass') {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.09, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.35);
      });
    }
  } catch (e) {
    // Ignore audio error
  }
}
