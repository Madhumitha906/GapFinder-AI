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
  AlertTriangle,
  Plus,
  Database,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Server
} from 'lucide-react';
import { Course, GapReport, UserSession } from '@/types';
import {
  resetToDemoCourse,
  setGeminiApiKey,
  getGeminiApiKey,
  getStoredUser,
  clearStoredUser,
  DEMO_USER
} from '@/lib/storage';
import { CreateCourseModal } from '@/components/CreateCourseModal';
import { AuthModal } from '@/components/AuthModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeCourse: Course;
  allCourses: Course[];
  onSelectCourse: (courseId: string) => void;
  gapReport: GapReport | null;
  onRefreshData: () => void;
  onCourseCreated?: (newCourse: Course) => void;
  currentUser?: UserSession;
  onSignOut?: () => void;
  onUserChanged?: (user: UserSession) => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  activeCourse,
  allCourses,
  onSelectCourse,
  gapReport,
  onRefreshData,
  onCourseCreated,
  currentUser: currentUserProp,
  onSignOut,
  onUserChanged
}: NavbarProps) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const [currentUser, setCurrentUser] = useState<UserSession>(() => currentUserProp || getStoredUser() || DEMO_USER);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  // Sync with prop when parent updates user
  React.useEffect(() => {
    if (currentUserProp) {
      setCurrentUser(currentUserProp);
    }
  }, [currentUserProp]);

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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Top Bar: Evaluation Status, NextAuth User, & Tools */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white text-xs px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
            Judge Evaluation Demo
          </span>

          {/* Interactive User Session Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-[11px]">
            <User className="w-3 h-3 text-indigo-300" />
            <span className="text-slate-300">
              User: <strong className="text-white">{currentUser.name || currentUser.email}</strong>
            </span>
            <span
              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                currentUser.role === 'evaluator'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  : currentUser.role === 'teacher'
                  ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                  : 'bg-sky-400/20 text-sky-300 border border-sky-400/30'
              }`}
            >
              {currentUser.role}
            </span>
          </div>

          {/* Sign In & Sign Up Buttons */}
          <div className="inline-flex items-center rounded-lg bg-white/5 border border-white/10 p-0.5 gap-1">
            <button
              onClick={() => {
                setAuthModalTab('signin');
                setShowAuthModal(true);
              }}
              className="inline-flex items-center gap-1 text-slate-200 hover:text-white transition px-2 py-0.5 rounded hover:bg-white/10 cursor-pointer font-semibold text-[11px]"
              title="Sign In with Demo Judge or existing account"
            >
              <LogIn className="w-3 h-3 text-indigo-300" />
              <span>Sign In</span>
            </button>

            <span className="text-slate-600 text-[10px]">|</span>

            <button
              onClick={() => {
                setAuthModalTab('signup');
                setShowAuthModal(true);
              }}
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 transition px-2 py-0.5 rounded hover:bg-amber-400/10 cursor-pointer font-bold text-[11px]"
              title="Create a new student, teacher, or judge account"
            >
              <UserPlus className="w-3 h-3 text-amber-300" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              clearStoredUser();
              if (onSignOut) {
                onSignOut();
              } else {
                setCurrentUser(DEMO_USER);
                onRefreshData();
              }
            }}
            className="text-slate-400 hover:text-rose-300 transition px-1.5 py-0.5 rounded hover:bg-rose-500/10 text-[10px] inline-flex items-center gap-1"
            title="Sign out and return to landing screen"
          >
            <LogOut className="w-2.5 h-2.5" />
            <span>Sign Out</span>
          </button>

          {/* PostgreSQL / Supabase pgvector Status Badge */}
          <button
            onClick={() => setActiveTab('database')}
            className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white transition px-2.5 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 cursor-pointer font-medium text-[11px]"
            title="Click to open PostgreSQL & pgvector Database Studio"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Server className="w-3 h-3 text-emerald-400" />
            <span>PostgreSQL: <strong className="text-emerald-300">pgvector Connected</strong></span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setApiKeyInput(getGeminiApiKey());
              setShowKeyModal(true);
            }}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition px-2 py-0.5 rounded hover:bg-white/10 text-[11px]"
            title="Configure Gemini API Key (Optional)"
          >
            <Key className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Key</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition px-2 py-0.5 rounded hover:bg-white/10 text-[11px]"
            title="Reset to fresh sample syllabus, notes, and past papers"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-300" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* 2. Middle Row: Brand Logo, Active Course Dropdown, & + New Course Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('topic-map')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-700 bg-clip-text text-transparent">
                GapFinder
              </span>
              <span className="text-xs font-bold ml-1 px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
              Diagnostic Study & Personalized Revision Engine
            </p>
          </div>
        </div>

        {/* Course Selector Dropdown & + New Course Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 px-2 hidden sm:inline">
              Active Course:
            </span>
            <select
              value={activeCourse.id}
              onChange={e => {
                if (e.target.value === '__NEW_COURSE__') {
                  setShowCreateModal(true);
                } else {
                  onSelectCourse(e.target.value);
                }
              }}
              className="text-xs font-bold bg-white text-slate-800 rounded-lg px-3 py-1.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer max-w-[260px] sm:max-w-[320px] truncate shadow-2xs"
            >
              {allCourses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.isPreloaded ? '⭐ ' : ''}{c.title}
                </option>
              ))}
              <option value="__NEW_COURSE__">➕ Upload & Create New Course...</option>
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm hover:scale-105 shrink-0"
            title="Upload and parse a new course syllabus"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Course</span>
          </button>
        </div>
      </div>

      {/* 3. Dedicated Navigation Tabs Row (No Overlapping, No Collisions) */}
      <div className="bg-slate-50/90 border-t border-slate-100 px-4 sm:px-6 lg:px-8 py-1.5 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('topic-map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'topic-map'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Topic Map</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Diagnostic Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('gap-report')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'gap-report'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Gap Report</span>
            {weakCount > 0 && (
              <span className={`ml-0.5 rounded-full text-[10px] px-1.5 py-0.2 font-extrabold ${
                activeTab === 'gap-report' ? 'bg-white text-rose-700' : 'bg-rose-600 text-white animate-pulse'
              }`}>
                {weakCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('revision-plan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'revision-plan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Revision Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('explain-chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'explain-chat'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Explain (RAG)</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'materials'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Uploads</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'progress'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Progress</span>
          </button>

          {/* Database & pgvector Tab - Prominent Emerald Highlight */}
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'database'
                ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/40'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>DB & pgvector</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'architecture'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Docs</span>
          </button>
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

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCourseCreated={newCourse => {
          if (onCourseCreated) {
            onCourseCreated(newCourse);
          } else {
            onRefreshData();
          }
        }}
      />

      {/* NextAuth Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        initialTab={authModalTab}
        onUserLoggedIn={user => {
          setCurrentUser(user);
          if (onUserChanged) onUserChanged(user);
          onRefreshData();
        }}
      />
    </header>
  );
}
