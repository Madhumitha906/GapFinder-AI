'use client';

import React from 'react';
import {
  Compass,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  MessageSquare,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Course, GapReport, TopicNode } from '@/types';

interface TopicMapViewProps {
  course: Course;
  gapReport: GapReport | null;
  onStartQuizForTopic: (topicId: string) => void;
  onAskExplainForTopic: (topicTitle: string) => void;
  onStartFullDiagnostic: () => void;
}

export function TopicMapView({
  course,
  gapReport,
  onStartQuizForTopic,
  onAskExplainForTopic,
  onStartFullDiagnostic
}: TopicMapViewProps) {
  // Group topics by Unit
  const unitsMap: Record<string, TopicNode[]> = {};
  for (const topic of course.topics) {
    const unitName = topic.unit || 'General Topics';
    if (!unitsMap[unitName]) unitsMap[unitName] = [];
    unitsMap[unitName].push(topic);
  }

  const weakCount = gapReport?.weakCount || 0;
  const mediumCount = gapReport?.mediumCount || 0;
  const strongCount = gapReport?.strongCount || 0;
  const totalTopics = course.topics.length;
  const testedCount = weakCount + mediumCount + strongCount;
  const masteryPercentage = gapReport?.overallScore || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Diagnostic Prompt Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>AI Topic Tree & Curriculum Diagnosis</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {course.title}
          </h1>

          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            {course.description} GapFinder AI parsed your syllabus into a prioritized knowledge graph. Run a diagnostic quiz to find where your hidden gaps lie.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onStartFullDiagnostic}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition hover:scale-105"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Run Full Diagnostic Quiz (5 Questions)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Target Exam: <strong>{course.targetExam}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Diagnosed Mastery</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{masteryPercentage}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {testedCount > 0 ? `${testedCount}/${totalTopics} topics tested` : 'Untested - Run quiz below'}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-rose-100 bg-rose-50/20 shadow-sm">
          <div className="flex items-center justify-between text-rose-600 text-xs mb-1 font-semibold">
            <span>Weak Topics</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{weakCount}</div>
          <div className="text-[11px] text-rose-700/80 mt-1">
            {weakCount > 0 ? 'High exam risk' : 'No weak gaps detected'}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-amber-100 bg-amber-50/20 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 text-xs mb-1 font-semibold">
            <span>Medium Topics</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{mediumCount}</div>
          <div className="text-[11px] text-amber-700/80 mt-1">Needs reinforcement</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-emerald-100 bg-emerald-50/20 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 text-xs mb-1 font-semibold">
            <span>Strong Topics</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{strongCount}</div>
          <div className="text-[11px] text-emerald-700/80 mt-1">Firmly mastered</div>
        </div>
      </div>

      {/* Structured Topic Hierarchy */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Syllabus Breakdown & Knowledge Graph</span>
          </h2>
          <span className="text-xs text-slate-500">
            {Object.keys(unitsMap).length} Syllabus Modules &bull; {course.topics.length} Key Subtopics
          </span>
        </div>

        {Object.entries(unitsMap).map(([unitName, topics], uIdx) => (
          <div
            key={unitName}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
          >
            <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide bg-indigo-100/60 px-2 py-0.5 rounded">
                  Module {uIdx + 1}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{unitName}</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Total Weight: {topics.reduce((acc, t) => acc + t.syllabusWeightage, 0)}%
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {topics.map(topic => {
                const diag = gapReport?.topicDiagnoses.find(d => d.topicId === topic.id);
                const status = diag ? diag.status : topic.masteryStatus;
                const score = diag ? diag.scorePercentage : topic.currentScore;

                return (
                  <div
                    key={topic.id}
                    className="p-5 hover:bg-slate-50/60 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{topic.title}</span>

                        {/* Status Chip */}
                        {status === 'weak' && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Weak ({score}%)
                          </span>
                        )}
                        {status === 'medium' && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Medium ({score}%)
                          </span>
                        )}
                        {status === 'strong' && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Strong ({score}%)
                          </span>
                        )}
                        {status === 'untested' && (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            Untested
                          </span>
                        )}

                        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {topic.syllabusWeightage}% Exam Weight
                        </span>

                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Bloom: {topic.bloomLevel}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {topic.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {topic.subtopics.map(st => (
                          <span
                            key={st}
                            className="text-[10px] text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/60"
                          >
                            {st}
                          </span>
                        ))}
                      </div>

                      {diag && (
                        <div className="text-[11px] text-slate-600 pt-1">
                          <strong className="text-slate-700">Diagnosis:</strong> {diag.rootCauseReason}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                      <button
                        onClick={() => onAskExplainForTopic(topic.title)}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                        title="Open Grounded RAG Assistant"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-violet-600" />
                        <span>Explain</span>
                      </button>

                      <button
                        onClick={() => onStartQuizForTopic(topic.id)}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Quiz This</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
