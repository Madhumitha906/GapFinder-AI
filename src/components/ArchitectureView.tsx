'use client';

import React from 'react';
import {
  FileText,
  Layers,
  Database,
  Search,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Cpu,
  ArrowRight,
  GitBranch,
  Target
} from 'lucide-react';

export function ArchitectureView() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-3">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>System Architecture & Judge Evaluation Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          GapFinder AI Architecture & Technical Design
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-3xl">
          Complete technical blueprint showcasing strict separation of RAG retrieval, question formulation, cognitive gap diagnosis, and adaptive revision scheduling.
        </p>

        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Judge Demo Login</span>
            <strong className="text-amber-300 font-mono">judge@gapfinder.ai</strong>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Preloaded Course</span>
            <strong className="text-white">CS301 Operating Systems Core</strong>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">RAG Vector Engine</span>
            <strong className="text-emerald-300">Deterministic TF-IDF/BM25 + Gemini API</strong>
          </div>
        </div>
      </div>

      {/* 1. Problem Statement & Core Differentiator */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-black text-slate-900 text-lg">
          <Target className="w-5 h-5 text-indigo-600" />
          <span>1. Problem Statement & Why This Project Stands Out</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>The Fundamental Flaw in Generic Study Apps</span>
            </div>
            <p className="text-slate-600">
              Most AI study tools function like reactive chatbots ("Chat with your PDF"). They wait for the student to ask a question. However, <strong>a student cannot ask about a gap they don’t know they have</strong>. Students spend hours revising familiar topics while high-weight weak topics remain untouched.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>The GapFinder AI Solution</span>
            </div>
            <p className="text-indigo-900/80">
              GapFinder AI reverses the flow. It takes the student's syllabus, textbook notes, and past exam papers, structures them into an actionable topic tree, tests the student proactively with grounded questions, pinpoints root-cause misconceptions, and synthesizes a prioritized day-by-day revision schedule.
            </p>
          </div>
        </div>
      </div>

      {/* 2. RAG Pipeline Diagram */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 font-black text-slate-900 text-lg">
          <Search className="w-5 h-5 text-indigo-600" />
          <span>2. End-to-End RAG Pipeline (Chunking, Retrieval, Verification)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
              1
            </div>
            <div className="font-bold text-slate-900">Semantic Chunking</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Documents are partitioned by Chapter/Section headings (~650 characters with 100 char overlap). Extracts section titles and domain keywords.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
              2
            </div>
            <div className="font-bold text-slate-900">BM25 / Vector Search</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Calculates term frequency, inverse document frequency, and n-gram overlap. Ranks chunks by relevance and provenance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
              3
            </div>
            <div className="font-bold text-slate-900">Grounded Formulation</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Quiz questions and assistant answers are constructed <em>strictly</em> using the retrieved chunks, anchoring every question to a verified source excerpt.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
              4
            </div>
            <div className="font-bold text-slate-900">Citation Provenance</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Every diagnostic evaluation exposes the exact Document Title, Section, and snippet so students and judges can inspect the proof.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Clarity on AI Usage */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-black text-slate-900 text-lg">
          <BrainCircuit className="w-5 h-5 text-indigo-600" />
          <span>3. Clarity on AI Usage: Retrieval vs Generation vs Diagnosis</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Feature Stage</th>
                <th className="p-3">Retrieval Mechanism</th>
                <th className="p-3">Generative / Diagnostic Role</th>
                <th className="p-3">Hallucination Guard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3 font-bold text-slate-800">Diagnostic Quiz Generation</td>
                <td className="p-3">Retrieves top-ranked chunks for a target syllabus node</td>
                <td className="p-3">Formulates distractors based on documented misconceptions</td>
                <td className="p-3 text-emerald-700 font-semibold">Strict chunk grounding; citation attached to every option</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-800">Answer Evaluation</td>
                <td className="p-3">Fetches the source citation snippet for the question</td>
                <td className="p-3">Diagnoses cognitive gap (Recall vs Conceptual vs Application)</td>
                <td className="p-3 text-emerald-700 font-semibold">Rule-checked against correct option index and textbook excerpt</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-800">Gap Report Matrix</td>
                <td className="p-3">Aggregates quiz results and syllabus weightages</td>
                <td className="p-3">Assigns Weak (&lt;50%), Medium (50-75%), Strong (&gt;75%)</td>
                <td className="p-3 text-emerald-700 font-semibold">Deterministic scoring matrix + metacognitive confidence weighting</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-800">Adaptive Revision Plan</td>
                <td className="p-3">Pulls weak topics with highest syllabus weightage</td>
                <td className="p-3">Schedules time budgets across student's available days</td>
                <td className="p-3 text-emerald-700 font-semibold">Mathematical knapsack allocation constrained by daily hours</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-800">Explain Assistant (Chat)</td>
                <td className="p-3">Semantic search over all course chunks</td>
                <td className="p-3">Summarizes and explains using retrieved context</td>
                <td className="p-3 text-emerald-700 font-semibold">Direct quote citations displayed in source drawer</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Limitations & Future Scalability */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-black text-slate-900 text-lg">
          <GitBranch className="w-5 h-5 text-indigo-600" />
          <span>4. Limitations & Future Roadmap</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800">Current Limitations</h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
              <li>Mathematical formulas with complex KaTeX symbols are evaluated as structured text expressions.</li>
              <li>Scanned image PDFs require OCR preprocessing before chunk ingestion.</li>
              <li>Client-side browser storage is used for zero-latency instant demo judging; Supabase/PostgreSQL is configured for multi-device enterprise deployment.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800">Future Roadmap</h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
              <li><strong>Teacher Cohort Analytics</strong>: Heatmaps showing class-wide weak topics across 100+ students.</li>
              <li><strong>Automated Spaced Repetition (SM-2)</strong>: Scheduled email reminders when topic retention degrades.</li>
              <li><strong>Multi-Subject & Multi-Language Support</strong>: Cross-lingual embeddings for regional exam boards.</li>
              <li><strong>LMS Platform Integration</strong>: One-click export to Canvas, Moodle, and Google Classroom.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
