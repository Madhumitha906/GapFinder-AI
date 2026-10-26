'use client';

import React from 'react';
import {
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  BrainCircuit,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Course, GapReport } from '@/types';

interface GapReportViewProps {
  course: Course;
  gapReport: GapReport | null;
  onNavigateToPlan: () => void;
  onRetakeQuiz: () => void;
  onAskExplainForTopic: (topicTitle: string) => void;
}

export function GapReportView({
  course,
  gapReport,
  onNavigateToPlan,
  onRetakeQuiz,
  onAskExplainForTopic
}: GapReportViewProps) {
  if (!gapReport || gapReport.topicDiagnoses.length === 0) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 my-8">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <BarChart3 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">No Diagnostic Data Yet</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          To generate your knowledge gap diagnosis, take the <strong>Diagnostic Quiz</strong>. GapFinder AI will evaluate your answers against syllabus learning objectives and formulate your weak, medium, and strong topic ratings.
        </p>
        <button
          onClick={onRetakeQuiz}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition"
        >
          Start Diagnostic Quiz Now
        </button>
      </div>
    );
  }

  const { overallScore, weakCount, mediumCount, strongCount, topicDiagnoses, summaryDiagnosis, examReadinessRating, highRiskWarning } = gapReport;

  // Compute cognitive error breakdown
  const errorCounts = {
    conceptual: topicDiagnoses.filter(d => d.cognitiveGap === 'Conceptual Misunderstanding').length,
    application: topicDiagnoses.filter(d => d.cognitiveGap === 'Application / Formula Slip').length,
    recall: topicDiagnoses.filter(d => d.cognitiveGap === 'Recall Failure').length
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Diagnostic Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-2">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Grounded Knowledge Gap Diagnostic</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              Personalized Gap Report: {course.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Generated on {new Date(gapReport.generatedAt).toLocaleDateString()} &bull; Course Code: {course.subjectCode}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Exam Readiness Tag */}
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Exam Readiness</div>
              <span className={`inline-block px-3 py-1 rounded-xl text-xs font-extrabold ${
                examReadinessRating === 'High Risk'
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : examReadinessRating === 'Needs Targeted Work'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {examReadinessRating}
              </span>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-500 font-semibold leading-none">Score</span>
              <span className="text-xl font-black text-indigo-700 leading-tight">{overallScore}%</span>
            </div>
          </div>
        </div>

        {/* Summary Description */}
        <p className="text-xs sm:text-sm text-slate-700 mt-4 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <strong>Diagnostic Summary:</strong> {summaryDiagnosis}
        </p>

        {/* High Risk Exam Warning */}
        {highRiskWarning && (
          <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Exam Mark Risk Warning: </strong>
              <span>{highRiskWarning}</span>
            </div>
          </div>
        )}
      </div>

      {/* Metric Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-rose-200/80 shadow-sm relative overflow-hidden">
          <div className="w-1.5 h-full bg-rose-500 absolute left-0 top-0 bottom-0" />
          <div className="flex items-center justify-between text-rose-700 text-xs font-bold mb-1">
            <span>Critical Weak Topics</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{weakCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Score &lt; 50% or systematic misconceptions. Must be prioritized immediately.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm relative overflow-hidden">
          <div className="w-1.5 h-full bg-amber-500 absolute left-0 top-0 bottom-0" />
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold mb-1">
            <span>Medium / Borderline Topics</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{mediumCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Score 50% - 75% or correct with guessing. Needs targeted reinforcement.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-sm relative overflow-hidden">
          <div className="w-1.5 h-full bg-emerald-500 absolute left-0 top-0 bottom-0" />
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold mb-1">
            <span>Firmly Mastered Topics</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{strongCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Score &gt; 75% with verified confidence. Ready for exam.
          </p>
        </div>
      </div>

      {/* Cognitive Error Analysis Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-indigo-600" />
          <span>Cognitive Error Analysis (Why you missed questions)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="font-bold text-slate-800">Conceptual Misunderstandings: {errorCounts.conceptual}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Confusing underlying system principles (e.g. FIFO vs LRU, time quantum limits).
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="font-bold text-slate-800">Application / Formula Slips: {errorCounts.application}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Calculations errors (e.g. TLB Effective Access Time memory lookups).
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="font-bold text-slate-800">Recall Failures: {errorCounts.recall}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Terminology or definition slips under timed conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Topic-by-Topic Diagnostic Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Topic-Level Diagnosis & Prescriptions</span>
          </h2>
          <button
            onClick={onNavigateToPlan}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Generate Adaptive Revision Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {topicDiagnoses.map((diag, idx) => {
            let statusColor = 'border-slate-200 bg-white';
            let badgeColor = 'bg-slate-100 text-slate-700';

            if (diag.status === 'weak') {
              statusColor = 'border-rose-200 bg-rose-50/20';
              badgeColor = 'bg-rose-100 text-rose-700 border border-rose-200';
            } else if (diag.status === 'medium') {
              statusColor = 'border-amber-200 bg-amber-50/20';
              badgeColor = 'bg-amber-100 text-amber-800 border border-amber-200';
            } else if (diag.status === 'strong') {
              statusColor = 'border-emerald-200 bg-emerald-50/20';
              badgeColor = 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            }

            return (
              <div
                key={diag.topicId}
                className={`rounded-2xl border p-5 transition ${statusColor}`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badgeColor}`}>
                      {diag.status.toUpperCase()} ({diag.scorePercentage}%)
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{diag.topicTitle}</h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{diag.unit}</span>
                    <span>&bull;</span>
                    <span>Confidence: {Math.round(diag.confidenceAverage * 100)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs">
                  {/* Root Cause Reason */}
                  <div className="space-y-1">
                    <div className="font-bold text-slate-700 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Root Cause Diagnosis:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                      {diag.rootCauseReason}
                    </p>
                  </div>

                  {/* Recommended Action & Grounded Citation */}
                  <div className="space-y-1">
                    <div className="font-bold text-slate-700 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Recommended Revision Focus & Citation:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                      {diag.recommendedAction}
                    </p>
                  </div>
                </div>

                {/* Primary Citation Badge */}
                {diag.primaryCitations && diag.primaryCitations[0] && (
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5 truncate max-w-xl">
                      <span className="font-semibold text-indigo-700">Source:</span>
                      <span className="truncate">{diag.primaryCitations[0].docTitle} &bull; {diag.primaryCitations[0].section}</span>
                    </div>
                    <button
                      onClick={() => onAskExplainForTopic(diag.topicTitle)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold underline shrink-0 ml-2"
                    >
                      Explain in Chat &rarr;
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
