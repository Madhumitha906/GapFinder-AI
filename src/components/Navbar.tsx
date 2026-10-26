'use client';

import React, { useState } from 'react';
import {
  Compass,
  FileText,
  HelpCircle,
  BarChart3,
  Calendar,
  MessageSquare,
  Upload,
  Layers,
  Key,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Course, GapReport } from '@/types';
import { resetToDemoCourse, setGeminiApiKey, getGeminiApiKey } from '@/lib/storage';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeCourse: Course;
  allCourses: Course[];
  onSelectCourse: (courseId: string) => void;
  gapReport: GapReport | null;
  onRefreshData: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  activeCourse,
  allCourses,
  onSelectCourse,
  gapReport,
  onRefreshData
}: NavbarProps) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const handleReset = () => {
    if (confirm('Reset workspace to pristine CS301 Preloaded Course & Demo Data for evaluation?')) {
      resetToDemoCourse();
      onRefreshData();
      alert('Reset completed successfully!');
    }
  };

  const handleSaveKey = () => {
    setGeminiApiKey(apiKeyInput.trim());
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowKeyModal(false);
    }, 1500);
  };

  const weakCount = gapReport?.weakCount || 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Judge & Demo Access Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
            Judge Evaluation Demo
          </span>
          <span className="text-slate-200">
            Preloaded Course: <strong className="text-white">CS301 Operating Systems Core</strong> &bull; Demo User: <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-300">judge@gapfinder.ai</code>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setApiKeyInput(getGeminiApiKey());
              setShowKeyModal(true);
            }}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition px-2 py-0.5 rounded hover:bg-white/10"
            title="Configure Gemini API Key (Optional)"
          >
            <Key className="w-3.5 h-3.5 text-amber-300" />
            <span>AI API Key (Optional)</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition px-2 py-0.5 rounded hover:bg-white/10"
            title="Reset to fresh sample syllabus, notes, and past papers"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-300" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Course Selector */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => setActiveTab('topic-map')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-700 bg-clip-text text-transparent">
                  GapFinder
                </span>
                <span className="text-xs font-semibold ml-1 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  AI
                </span>
              </div>
            </div>

            {/* Course Selector */}
            <div className="hidden md:flex items-center pl-4 border-l border-slate-200">
              <select
                value={activeCourse.id}
                onChange={e => onSelectCourse(e.target.value)}
                className="text-xs font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-lg px-2.5 py-1.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer max-w-[240px] truncate"
              >
                {allCourses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.isPreloaded ? '⭐ ' : ''}{c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('topic-map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'topic-map'
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Topic Map</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'quiz'
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Diagnostic Quiz</span>
            </button>

            <button
              onClick={() => setActiveTab('gap-report')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'gap-report'
                  ? 'bg-rose-50 text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Gap Report</span>
              {weakCount > 0 && (
                <span className="ml-0.5 bg-rose-600 text-white rounded-full text-[10px] px-1.5 py-0.2 font-bold animate-pulse">
                  {weakCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('revision-plan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'revision-plan'
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Revision Plan</span>
            </button>

            <button
              onClick={() => setActiveTab('explain-chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'explain-chat'
                  ? 'bg-violet-50 text-violet-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Explain (RAG)</span>
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'materials'
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Uploads</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'progress'
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Progress</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'architecture'
                  ? 'bg-amber-50 text-amber-800 shadow-sm border border-amber-200'
                  : 'text-amber-700 bg-amber-50/50 hover:bg-amber-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>AI Docs</span>
            </button>
          </nav>
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Gemini API Key (Optional)</h3>
                <p className="text-xs text-slate-500">Enable live Gemini generative calls or use built-in RAG engine</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              GapFinder AI includes a <strong>full deterministic RAG & Diagnostic Engine</strong> that runs immediately without any external keys or paywalls! If you wish to enable live Gemini generative requests, enter your key below:
            </p>

            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 font-mono"
            />

            {keySavedMessage && (
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>API Key saved to browser session!</span>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-xs px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="text-xs px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-sm"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
