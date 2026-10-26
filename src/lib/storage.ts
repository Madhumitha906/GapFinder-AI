import {
  Course,
  GapReport,
  QuizAttempt,
  QuizQuestion,
  RAGChatMessage,
  RevisionPlan,
  UploadedDocument,
  UserSession
} from '@/types';
import {
  INITIAL_PRELOADED_COURSE,
  SAMPLE_QUIZ_QUESTIONS
} from './sample-data';
import {
  computeGapReport,
  generatePersonalizedPlan
} from './rag-engine';

export interface RegisteredUser extends UserSession {
  passwordHash?: string;
  createdAt: string;
  targetGoal?: string;
  institution?: string;
}

const STORAGE_KEYS = {
  CURRENT_USER: 'gapfinder_user_v1',
  REGISTERED_USERS: 'gapfinder_registered_users_v1',
  COURSES: 'gapfinder_courses_v1',
  ACTIVE_COURSE_ID: 'gapfinder_active_course_v1',
  QUIZ_ATTEMPTS: 'gapfinder_quiz_attempts_v1',
  GAP_REPORTS: 'gapfinder_gap_reports_v1',
  REVISION_PLANS: 'gapfinder_revision_plans_v1',
  CHAT_MESSAGES: 'gapfinder_chat_messages_v1',
  GEMINI_KEY: 'gapfinder_gemini_key_v1'
};

export const DEMO_USER: UserSession = {
  id: 'usr-demo-judge',
  name: 'Judge / Evaluator',
  email: 'judge@gapfinder.ai',
  role: 'evaluator',
  isDemoUser: true
};

export const PRESEEDED_USERS: RegisteredUser[] = [
  {
    id: 'usr-judge-eval',
    name: 'Hackathon Judge',
    email: 'judge@gapfinder.ai',
    role: 'evaluator',
    targetGoal: 'Hackathon Evaluation & Verification',
    institution: 'Judging Committee',
    createdAt: '2026-10-20T10:00:00Z',
    isDemoUser: true
  },
  {
    id: 'usr-student-alex',
    name: 'Alex Rivera',
    email: 'student@gapfinder.ai',
    role: 'student',
    targetGoal: 'University Semester Finals & Placement',
    institution: 'State Tech University (CS Dept)',
    createdAt: '2026-10-22T14:30:00Z',
    isDemoUser: false
  },
  {
    id: 'usr-teacher-sarah',
    name: 'Prof. Sarah Vance',
    email: 'teacher@gapfinder.ai',
    role: 'teacher',
    targetGoal: 'Curriculum Diagnostic Analytics',
    institution: 'Faculty of Computer Science',
    createdAt: '2026-10-21T09:15:00Z',
    isDemoUser: false
  }
];

export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return PRESEEDED_USERS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(PRESEEDED_USERS));
      return PRESEEDED_USERS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : PRESEEDED_USERS;
  } catch {
    return PRESEEDED_USERS;
  }
}

export function registerUser(newUserData: {
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'evaluator';
  targetGoal?: string;
  institution?: string;
  password?: string;
}): RegisteredUser {
  const users = getRegisteredUsers();
  const existing = users.find(u => u.email.toLowerCase() === newUserData.email.toLowerCase());
  if (existing) {
    return existing;
  }

  const newUser: RegisteredUser = {
    id: `usr-${Date.now()}`,
    name: newUserData.name.trim(),
    email: newUserData.email.trim().toLowerCase(),
    role: newUserData.role,
    targetGoal: newUserData.targetGoal || 'Final Exams Prep',
    institution: newUserData.institution || 'University / College',
    createdAt: new Date().toISOString(),
    isDemoUser: false
  };

  users.push(newUser);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
  }
  return newUser;
}

export function authenticateUser(email: string, _password?: string): RegisteredUser | null {
  const users = getRegisteredUsers();
  const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  return found || null;
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USER));
}

export function getStoredUser(): UserSession {
  if (typeof window === 'undefined') return DEMO_USER;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : DEMO_USER;
  } catch {
    return DEMO_USER;
  }
}

export function setStoredUser(user: UserSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

export function getStoredCourses(): Course[] {
  if (typeof window === 'undefined') return [INITIAL_PRELOADED_COURSE];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify([INITIAL_PRELOADED_COURSE]));
      return [INITIAL_PRELOADED_COURSE];
    }
    return JSON.parse(data);
  } catch {
    return [INITIAL_PRELOADED_COURSE];
  }
}

export function saveCourse(course: Course): void {
  if (typeof window === 'undefined') return;
  const courses = getStoredCourses();
  const index = courses.findIndex(c => c.id === course.id);
  if (index >= 0) {
    courses[index] = course;
  } else {
    courses.push(course);
  }
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
}

export function getActiveCourseId(): string {
  if (typeof window === 'undefined') return INITIAL_PRELOADED_COURSE.id;
  try {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_COURSE_ID);
    return id || INITIAL_PRELOADED_COURSE.id;
  } catch {
    return INITIAL_PRELOADED_COURSE.id;
  }
}

export function setActiveCourseId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_COURSE_ID, id);
}

export function getActiveCourse(): Course {
  const courses = getStoredCourses();
  const activeId = getActiveCourseId();
  return courses.find(c => c.id === activeId) || courses[0] || INITIAL_PRELOADED_COURSE;
}

export function getStoredAttempts(courseId?: string): QuizAttempt[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
    const attempts: QuizAttempt[] = data ? JSON.parse(data) : [];
    return courseId ? attempts.filter(a => a.courseId === courseId) : attempts;
  } catch {
    return [];
  }
}

export function saveQuizAttempt(attempt: QuizAttempt): void {
  if (typeof window === 'undefined') return;
  const attempts = getStoredAttempts();
  attempts.unshift(attempt);
  localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(attempts));

  // Update topic status in the active course
  const course = getActiveCourse();
  if (course.id === attempt.courseId) {
    // Recalculate gap report
    const newGapReport = computeGapReport(course.id, course.topics, attempts.filter(a => a.courseId === course.id));
    saveGapReport(newGapReport);

    // Update topic nodes with new mastery status
    course.topics = course.topics.map(t => {
      const diag = newGapReport.topicDiagnoses.find(d => d.topicId === t.id);
      if (diag) {
        return {
          ...t,
          masteryStatus: diag.status,
          currentScore: diag.scorePercentage,
          attemptsCount: diag.attempts
        };
      }
      return t;
    });
    saveCourse(course);

    // Generate / update revision plan
    const newPlan = generatePersonalizedPlan(newGapReport, course.topics, '3_day_sprint', 3);
    saveRevisionPlan(newPlan);
  }
}

export function getStoredGapReport(courseId: string): GapReport | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GAP_REPORTS);
    const reports: Record<string, GapReport> = data ? JSON.parse(data) : {};
    return reports[courseId] || null;
  } catch {
    return null;
  }
}

export function saveGapReport(report: GapReport): void {
  if (typeof window === 'undefined') return;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GAP_REPORTS);
    const reports: Record<string, GapReport> = data ? JSON.parse(data) : {};
    reports[report.courseId] = report;
    localStorage.setItem(STORAGE_KEYS.GAP_REPORTS, JSON.stringify(reports));
  } catch {
    // noop
  }
}

export function getStoredRevisionPlan(courseId: string): RevisionPlan | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REVISION_PLANS);
    const plans: Record<string, RevisionPlan> = data ? JSON.parse(data) : {};
    return plans[courseId] || null;
  } catch {
    return null;
  }
}

export function saveRevisionPlan(plan: RevisionPlan): void {
  if (typeof window === 'undefined') return;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REVISION_PLANS);
    const plans: Record<string, RevisionPlan> = data ? JSON.parse(data) : {};
    plans[plan.courseId] = plan;
    localStorage.setItem(STORAGE_KEYS.REVISION_PLANS, JSON.stringify(plans));
  } catch {
    // noop
  }
}

export function toggleTaskCompletion(courseId: string, taskId: string): RevisionPlan | null {
  const plan = getStoredRevisionPlan(courseId);
  if (!plan) return null;

  for (const day of plan.days) {
    for (const task of day.tasks) {
      if (task.id === taskId) {
        task.completed = !task.completed;
      }
    }
  }

  saveRevisionPlan(plan);
  return plan;
}

export function getStoredChatMessages(courseId: string): RAGChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(`${STORAGE_KEYS.CHAT_MESSAGES}_${courseId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveChatMessage(courseId: string, msg: RAGChatMessage): void {
  if (typeof window === 'undefined') return;
  const msgs = getStoredChatMessages(courseId);
  msgs.push(msg);
  localStorage.setItem(`${STORAGE_KEYS.CHAT_MESSAGES}_${courseId}`, JSON.stringify(msgs));
}

export function getGeminiApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '';
}

export function setGeminiApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key);
}

// Reset data to fresh initial demo course
export function resetToDemoCourse(): void {
  if (typeof window === 'undefined') return;
  localStorage.clear();
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify([INITIAL_PRELOADED_COURSE]));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_COURSE_ID, INITIAL_PRELOADED_COURSE.id);
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USER));
}
