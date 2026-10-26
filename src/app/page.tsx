'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { TopicMapView } from '@/components/TopicMapView';
import { DiagnosticQuizView } from '@/components/DiagnosticQuizView';
import { GapReportView } from '@/components/GapReportView';
import { RevisionPlanView } from '@/components/RevisionPlanView';
import { ExplainAssistantView } from '@/components/ExplainAssistantView';
import { MaterialUploadView } from '@/components/MaterialUploadView';
import { ProgressDashboardView } from '@/components/ProgressDashboardView';
import { DatabaseStudioView } from '@/components/DatabaseStudioView';
import { ArchitectureView } from '@/components/ArchitectureView';
import { AuthLandingView } from '@/components/AuthLandingView';
import { TeacherDashboardView } from '@/components/TeacherDashboardView';
import { Course, GapReport, RevisionPlan, UserSession } from '@/types';
import {
  getActiveCourse,
  getStoredCourses,
  setActiveCourseId,
  getStoredGapReport,
  getStoredRevisionPlan,
  saveGapReport,
  saveRevisionPlan,
  getStoredUser,
  clearStoredUser
} from '@/lib/storage';
import { computeGapReport, generatePersonalizedPlan } from '@/lib/rag-engine';
import { INITIAL_PRELOADED_COURSE } from '@/lib/sample-data';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [previewStudentView, setPreviewStudentView] = useState(false);

  const [activeTab, setActiveTab] = useState<string>('topic-map');
  const [courses, setCourses] = useState<Course[]>([INITIAL_PRELOADED_COURSE]);
  const [activeCourse, setActiveCourse] = useState<Course>(INITIAL_PRELOADED_COURSE);
  const [gapReport, setGapReport] = useState<GapReport | null>(null);
  const [revisionPlan, setRevisionPlan] = useState<RevisionPlan | null>(null);
  const [quizSelectedTopicId, setQuizSelectedTopicId] = useState<string | null>(null);
  const [assistantTopicPrompt, setAssistantTopicPrompt] = useState<string | null>(null);

  const loadData = (userOverride?: UserSession | null) => {
    const user = userOverride !== undefined ? userOverride : currentUser;
    const loadedCourses = getStoredCourses();

    // Filter courses based on enrolledCourses for student accounts
    let accessibleCourses = loadedCourses;
    if (user && user.role === 'student' && user.enrolledCourses && user.enrolledCourses.length > 0) {
      const filtered = loadedCourses.filter(c =>
        user.enrolledCourses!.includes(c.id) ||
        user.enrolledCourses!.includes(c.subjectCode)
      );
      if (filtered.length > 0) {
        accessibleCourses = filtered;
      }
    }
    setCourses(accessibleCourses);

    let currentCourse = getActiveCourse();
    if (!accessibleCourses.some(c => c.id === currentCourse.id)) {
      currentCourse = accessibleCourses[0] || loadedCourses[0];
      setActiveCourseId(currentCourse.id);
    }
    setActiveCourse(currentCourse);

    let report = getStoredGapReport(currentCourse.id);
    let plan = getStoredRevisionPlan(currentCourse.id);

    // If initial run and no gap report exists yet, generate initial baseline from course topics
    if (!report) {
      report = computeGapReport(currentCourse.id, currentCourse.topics, []);
      saveGapReport(report);
    }
    if (!plan && report) {
      plan = generatePersonalizedPlan(report, currentCourse.topics, '3_day_sprint', 3);
      saveRevisionPlan(plan);
    }

    setGapReport(report);
    setRevisionPlan(plan);
  };

  useEffect(() => {
    // Check if user is already signed in
    const stored = getStoredUser();
    setCurrentUser(stored);
    loadData(stored);
  }, []);

  const handleSelectCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    loadData();
  };

  const handleStartQuizForTopic = (topicId: string) => {
    setQuizSelectedTopicId(topicId);
    setActiveTab('quiz');
  };

  const handleStartFullDiagnostic = () => {
    setQuizSelectedTopicId(null);
    setActiveTab('quiz');
  };

  const handleAskExplainForTopic = (topicTitle: string) => {
    setAssistantTopicPrompt(topicTitle);
    setActiveTab('explain-chat');
  };

  const handleQuizCompleted = () => {
    loadData();
    setActiveTab('gap-report');
  };

  const handleSignOut = () => {
    clearStoredUser();
    setCurrentUser(null);
    setPreviewStudentView(false);
  };

  // 1. FIRST SCREEN: ONLY SIGN IN AND SIGN UP IN THE MIDDLE
  if (!currentUser) {
    return (
      <AuthLandingView
        onAuthenticated={user => {
          setCurrentUser(user);
          setPreviewStudentView(false);
          loadData(user);
        }}
      />
    );
  }

  // 2. TEACHER ROLE: SHOW TEACHER PORTAL & CLASS PERFORMANCE
  if (currentUser.role === 'teacher' && !previewStudentView) {
    return (
      <TeacherDashboardView
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onSwitchToStudentView={() => setPreviewStudentView(true)}
      />
    );
  }

  // 3. STUDENT ROLE (OR TEACHER IN PREVIEW MODE): SHOW CURRENT PROJECT DASHBOARD
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Educator Preview Bar (if teacher switched to student view) */}
      {currentUser.role === 'teacher' && previewStudentView && (
        <div className="bg-emerald-800 text-white px-4 py-2 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-300" />
            <span>
              Educator Preview Mode: You are viewing the student study workflow as <strong>{currentUser.name}</strong>.
            </span>
          </div>
          <button
            onClick={() => setPreviewStudentView(false)}
            className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Teacher Dashboard</span>
          </button>
        </div>
      )}

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCourse={activeCourse}
        allCourses={courses}
        onSelectCourse={handleSelectCourse}
        gapReport={gapReport}
        onRefreshData={loadData}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onUserChanged={user => setCurrentUser(user)}
        onCourseCreated={c => {
          setActiveCourse(c);
          loadData();
          setActiveTab('topic-map');
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'topic-map' && (
          <TopicMapView
            course={activeCourse}
            gapReport={gapReport}
            onStartQuizForTopic={handleStartQuizForTopic}
            onAskExplainForTopic={handleAskExplainForTopic}
            onStartFullDiagnostic={handleStartFullDiagnostic}
          />
        )}

        {activeTab === 'quiz' && (
          <DiagnosticQuizView
            course={activeCourse}
            selectedTopicId={quizSelectedTopicId}
            onQuizCompleted={handleQuizCompleted}
            onClearTopicFilter={() => setQuizSelectedTopicId(null)}
          />
        )}

        {activeTab === 'gap-report' && (
          <GapReportView
            course={activeCourse}
            gapReport={gapReport}
            onNavigateToPlan={() => setActiveTab('revision-plan')}
            onRetakeQuiz={handleStartFullDiagnostic}
            onAskExplainForTopic={handleAskExplainForTopic}
          />
        )}

        {activeTab === 'revision-plan' && (
          <RevisionPlanView
            course={activeCourse}
            gapReport={gapReport}
            revisionPlan={revisionPlan}
            onPlanUpdated={p => setRevisionPlan(p)}
            onAskExplainForTopic={handleAskExplainForTopic}
          />
        )}

        {activeTab === 'explain-chat' && (
          <ExplainAssistantView
            course={activeCourse}
            initialTopicPrompt={assistantTopicPrompt}
            onClearInitialPrompt={() => setAssistantTopicPrompt(null)}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialUploadView
            course={activeCourse}
            onCourseUpdated={c => {
              setActiveCourse(c);
              loadData();
            }}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressDashboardView
            course={activeCourse}
            gapReport={gapReport}
            revisionPlan={revisionPlan}
            onRetakeQuiz={handleStartFullDiagnostic}
            onNavigateToPlan={() => setActiveTab('revision-plan')}
          />
        )}

        {activeTab === 'database' && (
          <DatabaseStudioView course={activeCourse} />
        )}

        {activeTab === 'architecture' && <ArchitectureView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>GapFinder AI</strong> &bull; Proactive Diagnostic Learning & Personalized Revision Engine
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Next.js 14 &bull; TypeScript &bull; Tailwind CSS &bull; Grounded RAG</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
