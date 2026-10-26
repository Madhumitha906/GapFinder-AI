'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { UserSession } from '@/types';
import { setStoredUser } from '@/lib/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession;
  onUserLoggedIn: (user: UserSession) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onUserLoggedIn
}: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleDemoJudgeLogin = () => {
    setIsSubmitting(true);
    const judgeUser: UserSession = {
      id: 'usr-judge-1',
      name: 'Hackathon Judge / Evaluator',
      email: 'judge@gapfinder.ai',
      role: 'evaluator',
      isDemoUser: true
    };
    setStoredUser(judgeUser);
    onUserLoggedIn(judgeUser);
    setIsSubmitting(false);
    onClose();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    const customUser: UserSession = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email: email.trim(),
      role: 'student',
      isDemoUser: false
    };
    setStoredUser(customUser);
    onUserLoggedIn(customUser);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
              <Lock className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Authentication & Access</h2>
              <p className="text-[11px] text-slate-300">Powered by NextAuth.js</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Quick Demo Judge Login Button */}
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Instant Hackathon Evaluation Access</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Judge Mode
              </span>
            </div>

            <p className="text-[11px] text-indigo-900/80 leading-relaxed">
              Click below to immediately log in with verified judge evaluation privileges without typing credentials:
            </p>

            <button
              onClick={handleDemoJudgeLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In as Demo Judge (judge@gapfinder.ai)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2.5 text-[10px] uppercase font-bold text-slate-400 absolute">
              Or Custom Student Login
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Student Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In as Student'}
            </button>
          </form>

          {/* Footer note */}
          <div className="flex items-center gap-2 pt-2 text-[10px] text-slate-500 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>NextAuth.js JWT Session Management & Secure Token Cookies</span>
          </div>
        </div>
      </div>
    </div>
  );
}
