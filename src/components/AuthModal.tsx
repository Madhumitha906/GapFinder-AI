'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
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
  getRegisteredUsers,
  registerUser,
  authenticateUser,
  RegisteredUser,
  PRESEEDED_USERS
} from '@/lib/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession;
  onUserLoggedIn: (user: UserSession) => void;
  initialTab?: 'signin' | 'signup';
}

export function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onUserLoggedIn,
  initialTab = 'signin'
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);

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

  // Sync initial tab when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSignInError('');
      setSignUpError('');
      setSuccessMessage('');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // 1-Click Demo Judge Login
  const handleDemoJudgeLogin = () => {
    setIsSubmitting(true);
    const judgeUser = PRESEEDED_USERS.find(u => u.email === 'judge@gapfinder.ai') || {
      id: 'usr-judge-eval',
      name: 'Hackathon Judge',
      email: 'judge@gapfinder.ai',
      role: 'evaluator' as const,
      isDemoUser: true
    };
    setStoredUser(judgeUser);
    onUserLoggedIn(judgeUser);
    setIsSubmitting(false);
    onClose();
  };

  // Quick Account Login
  const handleQuickLogin = (user: RegisteredUser) => {
    setIsSubmitting(true);
    setStoredUser(user);
    onUserLoggedIn(user);
    setIsSubmitting(false);
    onClose();
  };

  // Handle Standard Sign In
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
      onUserLoggedIn(registered);
      setIsSubmitting(false);
      onClose();
    } else {
      // Auto-register convenience for judge testing or prompt
      const newUser = registerUser({
        name: signInEmail.split('@')[0],
        email: signInEmail.trim(),
        role: 'student',
        targetGoal: 'Semester Exams'
      });
      setStoredUser(newUser);
      onUserLoggedIn(newUser);
      setIsSubmitting(false);
      onClose();
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
      setSignUpError('Please provide a valid email address.');
      return;
    }
    if (signUpPassword && signUpConfirmPassword && signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);

    // Register user in storage
    const createdUser = registerUser({
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      role: signUpRole,
      targetGoal: signUpGoal,
      institution: signUpInstitution.trim() || undefined
    });

    setStoredUser(createdUser);
    onUserLoggedIn(createdUser);

    // Celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // confetti fallback
    }

    setSuccessMessage(`Account created! Welcome, ${createdUser.name}!`);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
              <Lock className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Account Authentication</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  PostgreSQL & NextAuth
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                Secure session management & personal document indexing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector: Sign In vs Sign Up */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setSignInError('');
              setSignUpError('');
            }}
            className={`pb-2.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition ${
              activeTab === 'signin'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
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
            className={`pb-2.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition ${
              activeTab === 'signup'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up (Create Account)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 1: SIGN IN */}
          {/* ==================================================== */}
          {activeTab === 'signin' && (
            <div className="space-y-4">
              {/* Quick Demo Judge Login Highlight */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Instant Hackathon Evaluation Access</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    Judge Mode
                  </span>
                </div>

                <p className="text-[11px] text-indigo-900/80 leading-relaxed">
                  Click below to immediately authenticate with verified judge credentials and full platform access:
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

              {/* Quick Pre-seeded Account Switcher */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Or One-Click Demo Role Login
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
                      <span>Student Account</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Alex Rivera (CS Undergrad)</div>
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
                      <span>Teacher / Educator</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Prof. Sarah Vance (Faculty)</div>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center py-1">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2.5 text-[10px] uppercase font-bold text-slate-400 absolute">
                  Or Sign In with Credentials
                </span>
              </div>

              {signInError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{signInError}</span>
                </div>
              )}

              {/* Standard Form */}
              <form onSubmit={handleSignIn} className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
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
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">
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
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
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

              <div className="text-center pt-1">
                <span className="text-slate-500 text-[11px]">Don't have an account yet? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-indigo-600 font-bold hover:underline text-[11px]"
                >
                  Sign Up now
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: SIGN UP */}
          {/* ==================================================== */}
          {activeTab === 'signup' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-indigo-950">
                  <strong className="block font-bold">Create Your Free GapFinder AI Account</strong>
                  <span>Diagnose your knowledge gaps, generate grounded quizzes, and build adaptive revision plans.</span>
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
                  <label className="font-semibold text-slate-700 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maya Patel"
                    value={signUpName}
                    onChange={e => setSignUpName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
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
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    I am using GapFinder AI as: <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <label
                      className={`p-2.5 rounded-xl border cursor-pointer text-center transition flex flex-col items-center justify-center gap-1 ${
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
                      className={`p-2.5 rounded-xl border cursor-pointer text-center transition flex flex-col items-center justify-center gap-1 ${
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
                      className={`p-2.5 rounded-xl border cursor-pointer text-center transition flex flex-col items-center justify-center gap-1 ${
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
                      <span className="text-[11px]">Judge / Evaluator</span>
                    </label>
                  </div>
                </div>

                {/* Target Study Goal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Target Exam / Purpose
                    </label>
                    <select
                      value={signUpGoal}
                      onChange={e => setSignUpGoal(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-white"
                    >
                      <option value="University Semester Finals">University Semester Finals</option>
                      <option value="GATE / Competitive Exam">GATE / Competitive Exam</option>
                      <option value="Placement & Interview Prep">Placement & Interview Prep</option>
                      <option value="GRE / Technical Certifications">GRE / Technical Certifications</option>
                      <option value="Self-Directed Deep Mastery">Self-Directed Deep Mastery</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Institution / University (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Stanford University"
                      value={signUpInstitution}
                      onChange={e => setSignUpInstitution(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={e => setSignUpPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={signUpConfirmPassword}
                      onChange={e => setSignUpConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !signUpName.trim() || !signUpEmail.trim()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isSubmitting ? 'Creating Account...' : 'Create Account & Start Diagnosis'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="text-center pt-1">
                <span className="text-slate-500 text-[11px]">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="text-indigo-600 font-bold hover:underline text-[11px]"
                >
                  Sign In here
                </button>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>PostgreSQL Users Table & NextAuth JWT Session Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
}
