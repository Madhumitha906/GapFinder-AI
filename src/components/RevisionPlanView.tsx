'use client';

import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Download,
  RotateCcw,
  Zap,
  CheckSquare,
  Square
} from 'lucide-react';
import { Course, GapReport, RevisionPlan, RevisionTask } from '@/types';
import { generatePersonalizedPlan } from '@/lib/rag-engine';
import { saveRevisionPlan, toggleTaskCompletion } from '@/lib/storage';

interface RevisionPlanViewProps {
  course: Course;
  gapReport: GapReport | null;
  revisionPlan: RevisionPlan | null;
  onPlanUpdated: (plan: RevisionPlan) => void;
  onAskExplainForTopic: (topicTitle: string) => void;
}

export function RevisionPlanView({
  course,
  gapReport,
  revisionPlan,
  onPlanUpdated,
  onAskExplainForTopic
}: RevisionPlanViewProps) {
  const [selectedPreset, setSelectedPreset] = useState<RevisionPlan['timeframePreset']>(
    revisionPlan?.timeframePreset || '3_day_sprint'
  );
  const [dailyHours, setDailyHours] = useState<number>(revisionPlan?.dailyHours || 3);

  // If no plan exists or user wants to regenerate
  const handleRegeneratePlan = (preset = selectedPreset, hours = dailyHours) => {
    if (!gapReport) return;
    const newPlan = generatePersonalizedPlan(gapReport, course.topics, preset, hours);
    saveRevisionPlan(newPlan);
    onPlanUpdated(newPlan);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = toggleTaskCompletion(course.id, taskId);
    if (updated) {
      onPlanUpdated(updated);
    }
  };

  const handleExportMarkdown = () => {
    if (!revisionPlan) return;
    let md = `# GapFinder AI - Personalized Revision Plan\n`;
    md += `**Course**: ${course.title} (${course.subjectCode})\n`;
    md += `**Target Exam**: ${course.targetExam}\n`;
    md += `**Plan Budget**: ${revisionPlan.totalDays} Days @ ${revisionPlan.dailyHours} Hours/Day\n`;
    md += `**Projected Exam Boost**: ${revisionPlan.projectedScoreGain}\n\n`;

    for (const day of revisionPlan.days) {
      md += `## Day ${day.dayNumber}: ${day.focusTheme} (${day.estimatedMinutes} mins)\n\n`;
      for (const t of day.tasks) {
        md += `- [${t.completed ? 'x' : ' '}] **${t.topicTitle}** (${t.allocatedMinutes}m - ${t.priority.toUpperCase()} priority)\n`;
        md += `  - *Action*: ${t.actionItem}\n`;
        md += `  - *Source*: ${t.keyCitation.docTitle} (${t.keyCitation.section})\n\n`;
      }
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GapFinder_Revision_Plan_${course.subjectCode}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!gapReport) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 my-8">
        <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">No Gap Report Available</h3>
        <p className="text-xs text-slate-500">
          A personalized revision plan requires a completed diagnostic report. Please complete a diagnostic quiz first.
        </p>
      </div>
    );
  }

  // Active plan or default generated
  const plan = revisionPlan || generatePersonalizedPlan(gapReport, course.topics, selectedPreset, dailyHours);

  // Calculate task completion progress
  let totalTasks = 0;
  let completedTasks = 0;
  for (const d of plan.days) {
    for (const t of d.tasks) {
      totalTasks++;
      if (t.completed) completedTasks++;
    }
  }
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white border border-emerald-900/60 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Prioritized Time-Budgeted Revision Engine</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              Adaptive Revision Plan: {course.title}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Prioritizing your {gapReport.weakCount} weak areas first, then reinforcing medium topics, saving your strong topics for rapid review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Projected Boost</div>
              <div className="text-2xl font-black text-white">{plan.projectedScoreGain}</div>
            </div>
            <button
              onClick={handleExportMarkdown}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20"
              title="Download Plan as Markdown"
            >
              <Download className="w-4 h-4" />
              <span>Export Plan</span>
            </button>
          </div>
        </div>

        {/* Timeframe & Budget Controls */}
        <div className="mt-6 pt-6 border-t border-emerald-800/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Time Horizon
            </label>
            <select
              value={selectedPreset}
              onChange={e => {
                const p = e.target.value as RevisionPlan['timeframePreset'];
                setSelectedPreset(p);
                handleRegeneratePlan(p, dailyHours);
              }}
              className="w-full text-xs bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="24h_cram">⚡ 24-Hour Emergency Prep (1 Day)</option>
              <option value="3_day_sprint">🔥 3-Day Sprint (Recommended)</option>
              <option value="7_day_thorough">📅 7-Day Comprehensive Review</option>
              <option value="14_day_mastery">🏆 14-Day Distinction Track</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Daily Study Hours
            </label>
            <select
              value={dailyHours}
              onChange={e => {
                const h = parseInt(e.target.value, 10);
                setDailyHours(h);
                handleRegeneratePlan(selectedPreset, h);
              }}
              className="w-full text-xs bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={1}>1 Hour / Day (Light)</option>
              <option value={2}>2 Hours / Day</option>
              <option value={3}>3 Hours / Day (Standard)</option>
              <option value={4}>4 Hours / Day (Intensive)</option>
              <option value={6}>6 Hours / Day (Full-Time)</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              onClick={() => handleRegeneratePlan(selectedPreset, dailyHours)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recalculate Schedule With Current Gaps</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Efficiency Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            Revision Checklist Progress: {completedTasks} of {totalTasks} Tasks Completed
          </span>
          <span className="font-extrabold text-emerald-600 text-sm">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-[11px] text-slate-500 italic">
          💡 <strong>Study Strategy:</strong> {plan.efficiencyTips[0]}
        </div>
      </div>

      {/* Day by Day Plan Schedule */}
      <div className="space-y-6">
        {plan.days.map(day => (
          <div
            key={day.dayNumber}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Day Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                  D{day.dayNumber}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{day.focusTheme}</h3>
                  <span className="text-[11px] text-slate-500">{day.dateLabel}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{day.tasks.reduce((acc, t) => acc + t.allocatedMinutes, 0)} Mins Allocated</span>
              </div>
            </div>

            {/* Tasks List */}
            <div className="divide-y divide-slate-100 p-2">
              {day.tasks.map(task => {
                let priorityBadge = 'bg-slate-100 text-slate-700';
                if (task.priority === 'high') priorityBadge = 'bg-rose-100 text-rose-700 border border-rose-200';
                else if (task.priority === 'medium') priorityBadge = 'bg-amber-100 text-amber-800 border border-amber-200';

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      task.completed ? 'bg-slate-50/70 opacity-60' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="mt-0.5 text-emerald-600 hover:scale-110 transition shrink-0"
                      >
                        {task.completed ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {task.topicTitle}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${priorityBadge}`}>
                            {task.priority} Priority
                          </span>
                          <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            {task.recommendedStudyMode}
                          </span>
                        </div>

                        <p className={`text-xs ${task.completed ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                          {task.actionItem}
                        </p>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="truncate">Reference: {task.keyCitation.docTitle} &bull; {task.keyCitation.section}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {task.allocatedMinutes} min
                      </span>
                      <button
                        onClick={() => onAskExplainForTopic(task.topicTitle)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
                      >
                        Ask AI
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
