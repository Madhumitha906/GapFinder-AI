'use client';

import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ArrowUpRight,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { Course, GapReport, QuizAttempt, RevisionPlan } from '@/types';
import { getStoredAttempts } from '@/lib/storage';

interface ProgressDashboardViewProps {
  course: Course;
  gapReport: GapReport | null;
  revisionPlan: RevisionPlan | null;
  onRetakeQuiz: () => void;
  onNavigateToPlan: () => void;
}

export function ProgressDashboardView({
  course,
  gapReport,
  revisionPlan,
  onRetakeQuiz,
  onNavigateToPlan
}: ProgressDashboardViewProps) {
  const attempts: QuizAttempt[] = getStoredAttempts(course.id);

  // Compute aggregate stats
  const totalQuestionsAnswered = attempts.reduce((acc, a) => acc + Object.keys(a.answers).length, 0);
  const totalCorrect = attempts.reduce((acc, a) => {
    return acc + Object.values(a.answers).filter(ans => ans.isCorrect).length;
  }, 0);
  const overallAccuracy = totalQuestionsAnswered > 0
    ? Math.round((totalCorrect / totalQuestionsAnswered) * 100)
    : 0;

  // Revision plan task progress
  let completedPlanTasks = 0;
  let totalPlanTasks = 0;
  if (revisionPlan) {
    for (const d of revisionPlan.days) {
      for (const t of d.tasks) {
        totalPlanTasks++;
        if (t.completed) completedPlanTasks++;
      }
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Learning Trajectory & Metacognitive Growth</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Progress & Mastery Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking your diagnostic improvement across quiz attempts and dynamic revision tasks.
          </p>
        </div>

        <button
          onClick={onRetakeQuiz}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retake Diagnostic Assessment</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Diagnostic Score</div>
          <div className="text-3xl font-extrabold text-indigo-700">
            {gapReport?.overallScore ?? 0}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Current Syllabus Mastery</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Questions Solved</div>
          <div className="text-3xl font-extrabold text-slate-900">
            {totalQuestionsAnswered}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {overallAccuracy}% accuracy rate
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Assessment Attempts</div>
          <div className="text-3xl font-extrabold text-slate-900">
            {attempts.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Logged sessions</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Tasks Completed</div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {completedPlanTasks}/{totalPlanTasks}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Revision schedule</div>
        </div>
      </div>

      {/* Topic Mastery Evolution */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-600" />
          <span>Topic Mastery Trajectory</span>
        </h2>

        <div className="space-y-3">
          {course.topics.map(topic => {
            const diag = gapReport?.topicDiagnoses.find(d => d.topicId === topic.id);
            const score = diag ? diag.scorePercentage : topic.currentScore || 0;
            const status = diag ? diag.status : topic.masteryStatus;

            return (
              <div
                key={topic.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 max-w-md">
                  <div className="font-bold text-slate-900">{topic.title}</div>
                  <div className="text-[11px] text-slate-500">{topic.unit} &bull; {topic.syllabusWeightage}% weight</div>
                </div>

                <div className="w-full sm:w-64 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span className={`capitalize ${
                      status === 'weak' ? 'text-rose-600' : status === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {status}
                    </span>
                    <span className="text-slate-800">{score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        score < 50 ? 'bg-rose-500' : score < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(8, score)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Quiz Attempts Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Diagnostic Attempt History</span>
        </h2>

        {attempts.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            No previous attempts recorded yet. Run a diagnostic quiz to see your historical trajectory!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {attempts.map(att => (
              <div
                key={att.id}
                className="py-3.5 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{att.quizTitle}</div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(att.completedAt).toLocaleString()} &bull; {Object.keys(att.answers).length} Questions &bull; {att.durationSeconds}s duration
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                    att.scorePercentage >= 75
                      ? 'bg-emerald-100 text-emerald-800'
                      : att.scorePercentage >= 50
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {att.scorePercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
