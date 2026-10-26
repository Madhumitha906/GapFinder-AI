'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  UserPlus,
  LogIn,
  GraduationCap,
  BookOpen,
  Award,
  Database,
  BarChart3,
  Calendar,
  AlertCircle,
  HelpCircle,
  Cpu,
  Layers,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserSession } from '@/types';
import {
  setStoredUser,
  getRegisteredUsers,
  registerUser,
  authenticateUser,
  RegisteredUser,
  PRESEEDED_USERS
} from '@/lib/storage';

interface AuthLandingViewProps {
  onAuthenticated: (user: UserSession) => void;
}

export function AuthLandingView({ onAuthenticated }: AuthLandingViewProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');

  // Sign Up form state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<'student' | 'teacher' | 'evaluator'>('student');
  const [signUpGoal, setSignUpGoal] = useState('University Semester Finals');
  const [signUpInstitution, setSignUpInstitution] = useState('');
  const [signUpError, setSignUpError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 1-Click Demo Judge Login
  const handleDemoJudgeLogin = () => {
    setIsSubmitting(true);
    const judgeUser = PRESEEDED_USERS.find(u => u.email === 'judge@gapfinder.ai') || {
      id: 'usr-judge-eval',
      name: 'Hackathon Judge / Evaluator',
      email: 'judge@gapfinder.ai',
      role: 'evaluator' as const,
      isDemoUser: true
    };
    setStoredUser(judgeUser);
    setIsSubmitting(false);
    onAuthenticated(judgeUser);
  };

  // Quick Role Login
  const handleQuickLogin = (user: RegisteredUser) => {
    setIsSubmitting(true);
    setStoredUser(user);
    setIsSubmitting(false);
    onAuthenticated(user);
  };

  // Standard Sign In Form
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    if (!signInEmail.trim()) {
      setSignInError('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    const registered = authenticateUser(signInEmail);

    if (registered) {
      setStoredUser(registered);
      setIsSubmitting(false);
      onAuthenticated(registered);
    } else {
      // Create user automatically for fast judge testing
      const newUser = registerUser({
        name: signInEmail.split('@')[0],
        email: signInEmail.trim(),
        role: 'student',
        targetGoal: 'University Semester Finals'
      });
      setStoredUser(newUser);
      setIsSubmitting(false);
      onAuthenticated(newUser);
    }
  };

  // Handle Sign Up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');

    if (!signUpName.trim()) {
      setSignUpError('Please enter your full name.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setSignUpError('Please enter a valid email address.');
      return;
    }
    if (signUpPassword && signUpConfirmPassword && signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);

    const newUser = registerUser({
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      role: signUpRole,
      targetGoal: signUpGoal,
      institution: signUpInstitution.trim() || undefined
    });

    setStoredUser(newUser);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }

    setSuccessMessage(`Welcome, ${newUser.name}! Setting up your workspace...`);
    setTimeout(() => {
      setIsSubmitting(false);
      onAuthenticated(newUser);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Banner */}
      <header className="border-b border-white/10 px-6 py-4 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-white">GapFinder</span>
                <span className="text-xs font-black px-1.5 py-0.2 rounded bg-indigo-500 text-white">AI</span>
              </div>
              <p className="text-[11px] text-slate-300 -mt-0.5">
                Proactive Diagnostic Learning & Personalized Revision Engine
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/15 text-indigo-200">
              PostgreSQL 16 &bull; pgvector &bull; Next.js 14
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col lg:flex-row items-center justify-center gap-10">
        {/* Left Column: Product Value & RAG Highlights */}
        <div className="flex-1 space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Find What You Don't Know Before the Exam Finds Out</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Stop studying everything equally. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
              Diagnose & conquer your blind spots.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Most study tools wait for students to ask questions, but students can't ask about gaps they don't know they have. <strong>GapFinder AI</strong> maps your syllabus, tests you with questions grounded strictly in your own materials, diagnoses cognitive gaps, and builds an adaptive revision plan.
          </p>

          {/* Preloaded Course Callout */}
          <div className="p-4 rounded-2xl bg-indigo-900/40 border border-indigo-500/30 backdrop-blur-sm space-y-2">
            <div className="flex items-center gap-2 text-indigo-200 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Preloaded Sample Course Ready for Testing</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              ⭐ <strong>CS301: Operating Systems & System Architecture</strong> is preloaded with 5 syllabus units, 10 chunked documents (textbooks, notes, past papers), and diagnostic quiz questions with verbatim citations.
            </p>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Grounded RAG</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Verbatim source citations for every question and explanation.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-rose-400" />
                <span>Cognitive Gap Report</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Identifies Recall, Misunderstanding, and Formula Slips.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Adaptive Revision</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Priority knapsack plan that adapts as quiz scores improve.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>PostgreSQL + pgvector</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                768-dim HNSW cosine indexing with live database studio.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In & Sign Up Interactive Card */}
        <div className="w-full max-w-md shrink-0">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            {/* Tab Header: Sign In vs Sign Up */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setSignInError('');
                  setSignUpError('');
                }}
                className={`py-3 rounded-2xl flex items-center justify-center gap-2 transition ${
                  activeTab === 'signin'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setSignInError('');
                  setSignUpError('');
                }}
                className={`py-3 rounded-2xl flex items-center justify-center gap-2 transition ${
                  activeTab === 'signup'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* ========================================================== */}
              {/* TAB 1: SIGN IN */}
              {/* ========================================================== */}
              {activeTab === 'signin' && (
                <div className="space-y-4">
                  {/* Instant Demo Judge Login Highlight */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Instant Hackathon Evaluation Access</span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        Judge Mode
                      </span>
                    </div>

                    <p className="text-[11px] text-indigo-900/80 leading-relaxed">
                      Click below to immediately enter the application with verified judge evaluation privileges:
                    </p>

                    <button
                      type="button"
                      onClick={handleDemoJudgeLogin}
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-700 hover:to-violet-800 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-2 hover:scale-[1.01]"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Sign In as Demo Judge (judge@gapfinder.ai)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick One-Click Demo Role Accounts */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Or 1-Click Role Login
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const student = PRESEEDED_USERS.find(u => u.role === 'student');
                          if (student) handleQuickLogin(student);
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-white text-left transition space-y-0.5"
                      >
                        <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                          <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                          <span>Student</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">Alex Rivera</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const teacher = PRESEEDED_USERS.find(u => u.role === 'teacher');
                          if (teacher) handleQuickLogin(teacher);
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-white text-left transition space-y-0.5"
                      >
                        <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Teacher</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">Prof. Sarah Vance</div>
                      </button>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center py-1">
                    <div className="border-t border-slate-200 w-full" />
                    <span className="bg-white px-2.5 text-[10px] uppercase font-bold text-slate-400 absolute">
                      Or Sign In with Email
                    </span>
                  </div>

                  {signInError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{signInError}</span>
                    </div>
                  )}

                  {/* Standard Sign In Form */}
                  <form onSubmit={handleSignIn} className="space-y-3">
                    <div>
                      <label className="font-semibold text-slate-700 text-xs block mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          placeholder="student@university.edu"
                          value={signInEmail}
                          onChange={e => setSignInEmail(e.target.value)}
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-slate-700 text-xs">
                          Password
                        </label>
                        <span className="text-[10px] text-indigo-600 hover:underline cursor-pointer">
                          Forgot password?
                        </span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={signInPassword}
                          onChange={e => setSignInPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !signInEmail.trim()}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{isSubmitting ? 'Authenticating...' : 'Sign In & Enter Dashboard'}</span>
                    </button>
                  </form>

                  <div className="text-center pt-1 text-[11px] text-slate-500">
                    <span>Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('signup')}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Sign Up free
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================== */}
              {/* TAB 2: SIGN UP */}
              {/* ========================================================== */}
              {activeTab === 'signup' && (
                <div className="space-y-4">
                  <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="text-[11px] text-indigo-950">
                      <strong className="block font-bold">Create Your Free Account</strong>
                      <span>Diagnose knowledge gaps from your syllabus & get adaptive revision plans.</span>
                    </div>
                  </div>

                  {signUpError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{signUpError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSignUp} className="space-y-3">
                    {/* Full Name */}
                    <div>
                      <label className="font-semibold text-slate-700 text-xs block mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Maya Patel"
                        value={signUpName}
                        onChange={e => setSignUpName(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="font-semibold text-slate-700 text-xs block mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          placeholder="maya@university.edu"
                          value={signUpEmail}
                          onChange={e => setSignUpEmail(e.target.value)}
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                      <label className="font-semibold text-slate-700 text-xs block mb-1">
                        I am using GapFinder AI as: <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <label
                          className={`p-2 rounded-xl border cursor-pointer text-center transition flex flex-col items-center justify-center gap-1 ${
                            signUpRole === 'student'
                              ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value="student"
                            checked={signUpRole === 'student'}
                            onChange={() => setSignUpRole('student')}
                            className="sr-only"
                          />
                          <GraduationCap className="w-4 h-4 text-indigo-600" />
                          <span className="text-[11px]">Student</span>
                        </label>

                        <label
                          className={`p-2 rounded-xl border cursor-pointer text-center transition flex flex-col items-center justify-center gap-1 ${
                            signUpRole === 'teacher'
                              ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value="teacher"
                            checked={signUpRole === 'teacher'}
                            onChange={() => setSignUpRole('teacher')}
                            className="sr-only"
                          />
                          <BookOpen className="w-4 h-4 text-emerald-600" />
                          <span className="text-[11px]">Teacher</span>
                        </label>

                        <label
                          className={`p-2 rounded-xl border cursor-pointer text-center transition flex flex-col items-center justify-center gap-1 ${
                            signUpRole === 'evaluator'
                              ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value="evaluator"
                            checked={signUpRole === 'evaluator'}
                            onChange={() => setSignUpRole('evaluator')}
                            className="sr-only"
                          />
                          <Award className="w-4 h-4 text-amber-600" />
                          <span className="text-[11px]">Judge</span>
                        </label>
                      </div>
                    </div>

                    {/* Target Goal & Institution */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="font-semibold text-slate-700 text-xs block mb-1">
                          Target Exam Focus
                        </label>
                        <select
                          value={signUpGoal}
                          onChange={e => setSignUpGoal(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-white"
                        >
                          <option value="University Semester Finals">University Semester Finals</option>
                          <option value="GATE / Competitive Exam">GATE / Competitive Exam</option>
                          <option value="Placement & Interview Prep">Placement & Interview Prep</option>
                          <option value="Self-Directed Deep Mastery">Self-Directed Deep Mastery</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 text-xs block mb-1">
                          Institution (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Stanford University"
                          value={signUpInstitution}
                          onChange={e => setSignUpInstitution(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="font-semibold text-slate-700 text-xs block mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={signUpPassword}
                          onChange={e => setSignUpPassword(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 text-xs block mb-1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={signUpConfirmPassword}
                          onChange={e => setSignUpConfirmPassword(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !signUpName.trim() || !signUpEmail.trim()}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-700 hover:to-violet-800 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{isSubmitting ? 'Creating Account...' : 'Create Account & Start Diagnosis'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  <div className="text-center pt-1 text-[11px] text-slate-500">
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('signin')}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Sign In here
                    </button>
                  </div>
                </div>
              )}

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>NextAuth JWT Token Cookies & PostgreSQL User Store</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-4 px-6 text-center text-xs text-slate-400 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GapFinder AI &bull; Proactive Diagnostic Study & Personalized Revision</span>
          <span>Next.js 14 App Router &bull; TypeScript &bull; Tailwind CSS &bull; Supabase pgvector</span>
        </div>
      </footer>
    </div>
  );
}
