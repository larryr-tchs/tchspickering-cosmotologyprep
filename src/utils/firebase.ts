import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ClassCohort, StudentExamSubmission } from '../types';

// Initialize Firebase app singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Must use firestoreDatabaseId from firebase-applet-config.json
export const db: Firestore = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || undefined
);

/**
 * Submit an exam score to Firestore for an instructor's class code
 */
export async function submitStudentScore(
  submission: Omit<StudentExamSubmission, 'id'>
): Promise<string> {
  const normalizedClassCode = submission.classCode.trim().toUpperCase();
  
  const docRef = await addDoc(collection(db, 'examSubmissions'), {
    ...submission,
    classCode: normalizedClassCode,
    studentName: submission.studentName.trim(),
    timestamp: Date.now(),
    submittedAt: new Date().toISOString(),
  });

  return docRef.id;
}

/**
 * Real-time listener for all student submissions under a given class code
 */
export function subscribeToClassSubmissions(
  classCode: string,
  onUpdate: (submissions: StudentExamSubmission[]) => void,
  onError?: (error: Error) => void
): () => void {
  const normalized = classCode.trim().toUpperCase();
  const submissionsRef = collection(db, 'examSubmissions');
  
  // We can query by classCode
  const q = query(
    submissionsRef,
    where('classCode', '==', normalized)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const results: StudentExamSubmission[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        results.push({
          id: docSnap.id,
          classCode: data.classCode,
          studentName: data.studentName || 'Anonymous Student',
          studentEmail: data.studentEmail,
          quizTitle: data.quizTitle || 'Cosmetology Exam',
          quizMode: data.quizMode || 'full-mock',
          score: data.score ?? 0,
          totalQuestions: data.totalQuestions ?? 0,
          percentage: data.percentage ?? 0,
          passed: data.passed ?? (data.percentage >= 75),
          timeSpentSeconds: data.timeSpentSeconds ?? 0,
          subjectBreakdown: data.subjectBreakdown || {},
          submittedAt: data.submittedAt || new Date().toISOString(),
          timestamp: data.timestamp || 0,
        });
      });

      // Sort newest first
      results.sort((a, b) => b.timestamp - a.timestamp);
      onUpdate(results);
    },
    (err) => {
      console.error('Error listening to submissions:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Register or update a class cohort
 */
export async function createClassCohort(cohort: ClassCohort): Promise<void> {
  const normalizedCode = cohort.classCode.trim().toUpperCase();
  const docRef = doc(db, 'classes', normalizedCode);
  await setDoc(docRef, {
    classCode: normalizedCode,
    className: cohort.className.trim(),
    instructorName: cohort.instructorName?.trim() || 'Cosmetology Instructor',
    createdAt: cohort.createdAt || new Date().toISOString(),
  }, { merge: true });
}

/**
 * Fetch a class cohort to verify code exists
 */
export async function verifyClassCohort(classCode: string): Promise<ClassCohort | null> {
  const normalizedCode = classCode.trim().toUpperCase();
  const docRef = doc(db, 'classes', normalizedCode);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as ClassCohort;
  }
  return null;
}

/**
 * Fetch all classes
 */
export async function fetchAllClasses(): Promise<ClassCohort[]> {
  try {
    const snap = await getDocs(collection(db, 'classes'));
    const classes: ClassCohort[] = [];
    snap.forEach((docSnap) => {
      classes.push(docSnap.data() as ClassCohort);
    });
    return classes;
  } catch (err) {
    console.error('Failed to fetch classes:', err);
    return [];
  }
}
