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
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserSession } from '@/types';
import {
  setStoredUser,
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
  const [signUpGoal, setSignUpGoal] = useState('Operating Systems (CS301)');
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
      // Auto-register for fast access
      const isTeacher = signInEmail.toLowerCase().includes('teacher') || signInEmail.toLowerCase().includes('prof');
      const newUser = registerUser({
        name: signInEmail.split('@')[0],
        email: signInEmail.trim(),
        role: isTeacher ? 'teacher' : 'student',
        targetGoal: 'University Coursework'
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

    setSuccessMessage(`Account created! Welcome, ${newUser.name}!`);
    setTimeout(() => {
      setIsSubmitting(false);
      onAuthenticated(newUser);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Brand Header Centered */}
      <div className="mb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-2xl tracking-tight text-white">GapFinder</span>
              <span className="text-xs font-black px-1.5 py-0.5 rounded bg-indigo-500 text-white shadow-sm">AI</span>
            </div>
            <p className="text-[11px] text-indigo-200/80 font-medium -mt-0.5">
              Diagnostic Learning & Personalized Revision Engine
            </p>
          </div>
        </div>
      </div>

      {/* Centered Sign In / Sign Up Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Tab Toggle: Sign In vs Sign Up */}
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

        {/* Card Body */}
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
              {/* One-Click Role Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Select Role & Sign In
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Teacher Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const teacher = PRESEEDED_USERS.find(u => u.role === 'teacher');
                      if (teacher) handleQuickLogin(teacher);
                    }}
                    className="p-3 rounded-xl border border-emerald-200 hover:border-emerald-500 bg-emerald-50/60 hover:bg-emerald-50 text-left transition space-y-1 group hover:shadow-xs"
                  >
                    <div className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                      <BookOpen className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition" />
                      <span>Teacher / Educator</span>
                    </div>
                    <div className="text-[10px] text-emerald-800 font-medium truncate">Prof. Sarah Vance</div>
                    <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-200/70 text-emerald-900">
                      Class &amp; Subject Analytics &rarr;
                    </span>
                  </button>

                  {/* Student Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const student = PRESEEDED_USERS.find(u => u.role === 'student');
                      if (student) handleQuickLogin(student);
                    }}
                    className="p-3 rounded-xl border border-sky-200 hover:border-sky-500 bg-sky-50/60 hover:bg-sky-50 text-left transition space-y-1 group hover:shadow-xs"
                  >
                    <div className="font-bold text-sky-950 flex items-center gap-1.5 text-xs">
                      <GraduationCap className="w-4 h-4 text-sky-600 group-hover:scale-110 transition" />
                      <span>Student Account</span>
                    </div>
                    <div className="text-[10px] text-sky-800 font-medium truncate">Alex Rivera</div>
                    <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-200/70 text-sky-900">
                      Diagnostic &amp; Revision &rarr;
                    </span>
                  </button>
                </div>
              </div>

              {/* Instant Demo Judge Login Button */}
              <button
                type="button"
                onClick={handleDemoJudgeLogin}
                disabled={isSubmitting}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <Award className="w-4 h-4" />
                <span>1-Click Hackathon Judge Access (judge@gapfinder.ai)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="relative flex items-center justify-center py-1">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2.5 text-[10px] uppercase font-bold text-slate-400 absolute">
                  Or Credentials Sign In
                </span>
              </div>

              {signInError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{signInError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSignIn} className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 text-xs block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="teacher@gapfinder.ai or student@university.edu"
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
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
                </button>
              </form>

              <div className="text-center pt-1 text-[11px] text-slate-500">
                <span>Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Sign Up now
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 2: SIGN UP */}
          {/* ========================================================== */}
          {activeTab === 'signup' && (
            <div className="space-y-4">
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
                    placeholder="e.g. Prof. Sarah Vance or Alex Rivera"
                    value={signUpName}
                    onChange={e => setSignUpName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="font-semibold text-slate-700 text-xs block mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="name@university.edu"
                      value={signUpEmail}
                      onChange={e => setSignUpEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                  </div>
                </div>

                {/* Role Selector: Student vs Teacher */}
                <div>
                  <label className="font-semibold text-slate-700 text-xs block mb-1">
                    I am joining as: <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      className={`p-2.5 rounded-xl border cursor-pointer text-left transition flex items-center gap-2.5 ${
                        signUpRole === 'teacher'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="signup_role"
                        value="teacher"
                        checked={signUpRole === 'teacher'}
                        onChange={() => setSignUpRole('teacher')}
                        className="sr-only"
                      />
                      <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold leading-tight">Teacher</div>
                        <div className="text-[10px] text-slate-500 font-normal">Class analytics &amp; performance</div>
                      </div>
                    </label>

                    <label
                      className={`p-2.5 rounded-xl border cursor-pointer text-left transition flex items-center gap-2.5 ${
                        signUpRole === 'student'
                          ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="signup_role"
                        value="student"
                        checked={signUpRole === 'student'}
                        onChange={() => setSignUpRole('student')}
                        className="sr-only"
                      />
                      <GraduationCap className="w-4 h-4 text-sky-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold leading-tight">Student</div>
                        <div className="text-[10px] text-slate-500 font-normal">Quizzes &amp; revision plan</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Subject / Target Goal */}
                <div>
                  <label className="font-semibold text-slate-700 text-xs block mb-1">
                    {signUpRole === 'teacher' ? 'Subject You Teach' : 'Primary Target Subject'}
                  </label>
                  <select
                    value={signUpGoal}
                    onChange={e => setSignUpGoal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-white"
                  >
                    <option value="CS301: Operating Systems & System Architecture">CS301: Operating Systems & System Architecture</option>
                    <option value="CS204: Database Management Systems">CS204: Database Management Systems</option>
                    <option value="CS402: Distributed Systems & Cloud Computing">CS402: Distributed Systems & Cloud Computing</option>
                    <option value="Engineering & Computer Science Finals">Engineering & Computer Science Finals</option>
                  </select>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 text-xs block mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={e => setSignUpPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 text-xs block mb-1">
                      Confirm
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={signUpConfirmPassword}
                      onChange={e => setSignUpConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !signUpName.trim() || !signUpEmail.trim()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isSubmitting ? 'Creating Account...' : 'Create Account & Enter'}</span>
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

          {/* Footer note */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>NextAuth Session &amp; PostgreSQL User Roles</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-slate-500">
        GapFinder AI &bull; Role-Based Diagnostic Intelligence &bull; Next.js 14
      </div>
    </div>
  );
}
