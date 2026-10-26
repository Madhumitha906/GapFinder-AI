export type DocumentType = 'syllabus' | 'textbook' | 'notes' | 'past_papers';

export interface SourceCitation {
  docId: string;
  docTitle: string;
  docType: DocumentType;
  section: string;
  pageOrChunk?: string;
  snippet: string;
  relevanceScore?: number;
}

export interface DocumentChunk {
  id: string;
  docId: string;
  docTitle: string;
  docType: DocumentType;
  section: string;
  text: string;
  tokenCount?: number;
  keywords: string[];
}

export interface UploadedDocument {
  id: string;
  title: string;
  type: DocumentType;
  content: string;
  chunks: DocumentChunk[];
  uploadDate: string;
  sizeBytes: number;
  courseId: string;
}

export type MasteryStatus = 'weak' | 'medium' | 'strong' | 'untested';

export interface TopicNode {
  id: string;
  courseId: string;
  title: string;
  unit: string;
  description: string;
  syllabusWeightage: number; // percentage or points e.g. 15%
  estimatedMinutesToMaster: number;
  bloomLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate';
  masteryStatus: MasteryStatus;
  currentScore?: number;
  attemptsCount?: number;
  subtopics: string[];
  prerequisites?: string[];
  referenceSections: string[];
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  topicTitle: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  misconceptionExplanation?: string;
  citation: SourceCitation;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'concept_check' | 'application_problem' | 'past_exam_analysis';
}

export interface StudentQuizAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  confidence: 'confident' | 'somewhat_confident' | 'guessing';
  timeSpentSeconds: number;
}

export interface QuizAttempt {
  id: string;
  courseId: string;
  quizTitle: string;
  topicIds: string[];
  questions: QuizQuestion[];
  answers: Record<string, StudentQuizAnswer>;
  scorePercentage: number;
  completedAt: string;
  durationSeconds: number;
}

export interface TopicDiagnosis {
  topicId: string;
  topicTitle: string;
  unit: string;
  status: MasteryStatus;
  scorePercentage: number;
  attempts: number;
  confidenceAverage: number; // 0 to 1
  rootCauseReason: string;
  cognitiveGap: 'Recall Failure' | 'Conceptual Misunderstanding' | 'Application / Formula Slip' | 'None (Mastered)';
  recommendedAction: string;
  primaryCitations: SourceCitation[];
}

export interface GapReport {
  id: string;
  courseId: string;
  generatedAt: string;
  overallScore: number;
  weakCount: number;
  mediumCount: number;
  strongCount: number;
  totalTopics: number;
  summaryDiagnosis: string;
  topicDiagnoses: TopicDiagnosis[];
  highRiskWarning?: string;
  examReadinessRating: 'High Risk' | 'Needs Targeted Work' | 'Exam Ready' | 'Distinction Track';
}

export interface RevisionTask {
  id: string;
  topicId: string;
  topicTitle: string;
  priority: 'high' | 'medium' | 'low';
  allocatedMinutes: number;
  completed: boolean;
  actionItem: string;
  keyCitation: SourceCitation;
  recommendedStudyMode: 'Re-read Concept Chunks' | 'Solve Application Problems' | 'Flashcards & Formulas' | 'Quick Reinforcement';
}

export interface RevisionDay {
  dayNumber: number;
  dateLabel: string;
  focusTheme: string;
  estimatedMinutes: number;
  tasks: RevisionTask[];
}

export interface RevisionPlan {
  id: string;
  courseId: string;
  gapReportId: string;
  createdAt: string;
  timeframePreset: '24h_cram' | '3_day_sprint' | '7_day_thorough' | '14_day_mastery';
  dailyHours: number;
  totalDays: number;
  days: RevisionDay[];
  efficiencyTips: string[];
  projectedScoreGain: string;
}

export interface RAGChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: SourceCitation[];
  groundedScore?: number;
}

export interface Course {
  id: string;
  title: string;
  subjectCode: string;
  description: string;
  targetExam: string;
  documents: UploadedDocument[];
  topics: TopicNode[];
  isPreloaded?: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'evaluator';
  isDemoUser: boolean;
}

export interface StudentPerformanceRecord {
  id: string;
  name: string;
  email: string;
  enrolledSubject: string;
  subjectCode: string;
  quizzesAttempted: number;
  overallScore: number;
  performanceTier: 'High Distinction' | 'Proficient' | 'Needs Attention' | 'Critical Gap';
  weakestTopic: string;
  strongestTopic: string;
  primaryCognitiveGap: 'Recall Failure' | 'Conceptual Misunderstanding' | 'Application / Formula Slip' | 'None (Mastered)';
  lastActive: string;
  topicScores: Record<string, number>;
  recommendedRemedial: string;
}

export interface TeacherSubjectClass {
  id: string;
  subjectTitle: string;
  subjectCode: string;
  semester: string;
  enrolledStudentsCount: number;
  activeSignedInCount: number;
  classAverageScore: number;
  criticalGapCount: number;
  topPerformersCount: number;
  commonWeakTopic: string;
  students: StudentPerformanceRecord[];
}
