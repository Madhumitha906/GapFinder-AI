'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Plus,
  ArrowRight,
  LogOut,
  GraduationCap,
  Sparkles,
  FileText,
  Calendar,
  Layers,
  Award,
  ChevronDown,
  Mail,
  ExternalLink,
  Clock,
  HelpCircle,
  Eye,
  Sliders,
  Send
} from 'lucide-react';
import { UserSession, TeacherSubjectClass, StudentPerformanceRecord } from '@/types';
import { TEACHER_SUBJECTS_DATA } from '@/lib/sample-data';

interface TeacherDashboardViewProps {
  currentUser: UserSession;
  onSignOut: () => void;
  onSwitchToStudentView?: () => void;
}

export function TeacherDashboardView({
  currentUser,
  onSignOut,
  onSwitchToStudentView
}: TeacherDashboardViewProps) {
  const [subjects, setSubjects] = useState<TeacherSubjectClass[]>(TEACHER_SUBJECTS_DATA);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(TEACHER_SUBJECTS_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'distinction' | 'proficient' | 'needs_attention' | 'critical'>('all');
  const [inspectedStudent, setInspectedStudent] = useState<StudentPerformanceRecord | null>(null);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);

  // New Subject form state
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSemester, setNewSemester] = useState('Fall Semester 2026');
  const [newEnrolledCount, setNewEnrolledCount] = useState(25);

  // Current active subject data
  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Filter students
  const filteredStudents = currentSubject.students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.weakestTopic.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (tierFilter === 'distinction') return student.performanceTier === 'High Distinction';
    if (tierFilter === 'proficient') return student.performanceTier === 'Proficient';
    if (tierFilter === 'needs_attention') return student.performanceTier === 'Needs Attention';
    if (tierFilter === 'critical') return student.performanceTier === 'Critical Gap';
    return true;
  });

  const handleAddNewSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectTitle.trim()) return;

    const newSubj: TeacherSubjectClass = {
      id: `subj-${Date.now()}`,
      subjectTitle: newSubjectTitle.trim(),
      subjectCode: newSubjectCode.trim() || 'SUBJ-101',
      semester: newSemester,
      enrolledStudentsCount: Number(newEnrolledCount) || 20,
      activeSignedInCount: Math.round((Number(newEnrolledCount) || 20) * 0.9),
      classAverageScore: 70,
      criticalGapCount: 2,
      topPerformersCount: 6,
      commonWeakTopic: 'Foundational Concepts & Terminology',
      students: [
        {
          id: `std-new-1`,
          name: 'Alex Rivera',
          email: 'alex.rivera@university.edu',
          enrolledSubject: newSubjectTitle.trim(),
          subjectCode: newSubjectCode.trim() || 'SUBJ-101',
          quizzesAttempted: 2,
          overallScore: 72,
          performanceTier: 'Proficient',
          weakestTopic: 'Chapter 2 Core Principles',
          strongestTopic: 'Introduction & Definitions',
          primaryCognitiveGap: 'Conceptual Misunderstanding',
          lastActive: 'Today',
          recommendedRemedial: 'Assign introductory diagnostic review modules.',
          topicScores: {
            'Unit 1': 82,
            'Unit 2': 62
          }
        }
      ]
    };

    setSubjects([newSubj, ...subjects]);
    setSelectedSubjectId(newSubj.id);
    setShowAddSubjectModal(false);
    setNewSubjectTitle('');
    setNewSubjectCode('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* 1. Teacher Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  GapFinder AI
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Teacher / Educator Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5">
                Class-Level Topic Mastery, Enrolled Student Diagnostics &amp; Cognitive Gap Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Teacher Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-800">{currentUser.name}</span>
              <span className="text-slate-400">({currentUser.email})</span>
            </div>

            {onSwitchToStudentView && (
              <button
                onClick={onSwitchToStudentView}
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
                title="Preview what a student sees on GapFinder AI"
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Student View</span>
              </button>
            )}

            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 transition"
              title="Sign out and return to the main sign in screen"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 flex-1 w-full">
        {/* Question 1: WHICH SUBJECT DO YOU TEACH? */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Subject &amp; Curriculum Selection</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Which subject do you teach?
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Select from your assigned curriculum courses below to inspect enrolled students and performance:
              </p>
            </div>

            <button
              onClick={() => setShowAddSubjectModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm hover:scale-105 self-start sm:self-center shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Subject</span>
            </button>
          </div>

          {/* Subject Cards Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {subjects.map(subj => {
              const isSelected = subj.id === selectedSubjectId;
              return (
                <button
                  key={subj.id}
                  onClick={() => {
                    setSelectedSubjectId(subj.id);
                    setTierFilter('all');
                  }}
                  className={`p-4 rounded-xl text-left border transition relative ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      Active
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-400 font-mono block">
                    {subj.subjectCode}
                  </span>
                  <strong className="text-sm font-bold text-slate-900 block mt-0.5 line-clamp-1">
                    {subj.subjectTitle}
                  </strong>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span>{subj.semester}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <strong>{subj.activeSignedInCount}</strong> / {subj.enrolledStudentsCount} signed in
                    </span>
                    <span className="font-extrabold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {subj.classAverageScore}% Avg
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 2 & 3: HOW MANY STUDENTS SIGNED IN & WHAT IS OVERALL PERFORMANCE? */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: How many students are signed in */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Signed In Students</span>
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {currentSubject.activeSignedInCount}
              </span>
              <span className="text-xs text-slate-400">
                / {currentSubject.enrolledStudentsCount} Enrolled
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{Math.round((currentSubject.activeSignedInCount / currentSubject.enrolledStudentsCount) * 100)}% Student Participation Rate</span>
            </p>
          </div>

          {/* Metric 2: Total students' overall performance */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Overall Class Performance</span>
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-700">
                {currentSubject.classAverageScore}%
              </span>
              <span className="text-xs text-slate-500 font-bold">Class Average</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${currentSubject.classAverageScore}%` }}
              />
            </div>
          </div>

          {/* Metric 3: Top Performers */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Top Performers (&gt;80%)</span>
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-600">
                {currentSubject.topPerformersCount}
              </span>
              <span className="text-xs text-slate-400">Students in Distinction Tier</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Demonstrating mastery across all syllabus units.
            </p>
          </div>

          {/* Metric 4: Critical Knowledge Gaps */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Critical Gaps (&lt;50%)</span>
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-600">
                {currentSubject.criticalGapCount}
              </span>
              <span className="text-xs text-rose-700 font-bold">Students at Exam Risk</span>
            </div>
            <p className="text-[11px] text-rose-700/80 font-medium">
              Flagged for remedial revision review.
            </p>
          </div>
        </div>

        {/* Class-Wide Topic Mastery & Common Knowledge Blindspot */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Class-Wide Topic Mastery Breakdown &amp; Blindspots</span>
              </h2>
              <p className="text-xs text-slate-500">
                Aggregated performance across all {currentSubject.activeSignedInCount} students for {currentSubject.subjectCode}:
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Primary Class Blindspot: {currentSubject.commonWeakTopic}</span>
            </div>
          </div>

          {/* Topic Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800">Unit 1: Process Scheduling (Round Robin &amp; SJF)</span>
                <span className="text-emerald-700 font-extrabold">84% Class Mastery (Strong)</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '84%' }} />
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-2">
                <span className="text-slate-800">Unit 2: Process Synchronization &amp; Semaphores</span>
                <span className="text-emerald-700 font-extrabold">72% Class Mastery (Proficient)</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '72%' }} />
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-2">
                <span className="text-slate-800">Unit 3: Deadlock Prevention &amp; Banker's Safety</span>
                <span className="text-amber-700 font-extrabold">65% Class Mastery (Moderate)</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">Unit 4: Virtual Memory &amp; Paging (FIFO Belady)</span>
                  <span className="text-rose-700 font-extrabold">46% Class Mastery (Weak Gap!)</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '46%' }} />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                <strong className="block font-bold flex items-center gap-1.5 text-amber-950">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>AI Curriculum Diagnostic Insight:</span>
                </strong>
                <p className="text-[11px] leading-relaxed">
                  64% of enrolled students answered incorrectly on FIFO replacement due to <strong>Conceptual Misunderstanding</strong> (assuming more RAM frames always reduces page faults). Recommended action: allocate 15 minutes of lecture time to review Belady's Anomaly counterexamples.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Question 4: WHAT THEIR INDIVIDUAL PERFORMANCES ARE? */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Individual Student Performances ({currentSubject.activeSignedInCount} Students)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Detailed diagnosis for each student signed in to {currentSubject.subjectTitle}:
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setTierFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  tierFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({currentSubject.students.length})
              </button>
              <button
                onClick={() => setTierFilter('distinction')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  tierFilter === 'distinction'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Distinction
              </button>
              <button
                onClick={() => setTierFilter('proficient')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  tierFilter === 'proficient'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Proficient
              </button>
              <button
                onClick={() => setTierFilter('critical')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  tierFilter === 'critical'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                Critical Gaps
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student by name, email, or weak topic..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Quizzes</th>
                  <th className="p-3">Overall Mastery</th>
                  <th className="p-3">Performance Tier</th>
                  <th className="p-3">Weakest Topic (Gap)</th>
                  <th className="p-3">Cognitive Gap Type</th>
                  <th className="p-3 text-right">Diagnosis Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{student.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{student.email}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">
                      {student.quizzesAttempted} Quizzes
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-bold">{student.overallScore}%</strong>
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.overallScore >= 80
                                ? 'bg-amber-500'
                                : student.overallScore >= 60
                                ? 'bg-emerald-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${student.overallScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          student.performanceTier === 'High Distinction'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : student.performanceTier === 'Proficient'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : student.performanceTier === 'Needs Attention'
                            ? 'bg-yellow-100 text-yellow-900 border border-yellow-200'
                            : 'bg-rose-100 text-rose-900 border border-rose-200'
                        }`}
                      >
                        {student.performanceTier}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 font-medium truncate max-w-[180px]">
                      {student.weakestTopic}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          student.primaryCognitiveGap === 'Conceptual Misunderstanding'
                            ? 'bg-purple-100 text-purple-900'
                            : student.primaryCognitiveGap === 'Recall Failure'
                            ? 'bg-rose-100 text-rose-900'
                            : student.primaryCognitiveGap === 'Application / Formula Slip'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {student.primaryCognitiveGap}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setInspectedStudent(student)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[11px] transition inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect Gap Report</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Student Details Inspection Modal */}
      {inspectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Student Individual Diagnostic Gap Report
                </span>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>{inspectedStudent.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      inspectedStudent.performanceTier === 'High Distinction'
                        ? 'bg-amber-100 text-amber-900'
                        : inspectedStudent.performanceTier === 'Proficient'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-rose-100 text-rose-900'
                    }`}
                  >
                    {inspectedStudent.performanceTier}
                  </span>
                </h3>
                <span className="text-xs text-slate-500">{inspectedStudent.email} &bull; {inspectedStudent.enrolledSubject}</span>
              </div>
              <button
                onClick={() => setInspectedStudent(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Score cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Overall Mastery</span>
                  <strong className="text-xl font-black text-slate-900">{inspectedStudent.overallScore}%</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Quizzes Taken</span>
                  <strong className="text-xl font-black text-indigo-700">{inspectedStudent.quizzesAttempted}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Cognitive Gap</span>
                  <strong className="text-[11px] font-bold text-rose-700 block truncate mt-1">
                    {inspectedStudent.primaryCognitiveGap}
                  </strong>
                </div>
              </div>

              {/* Topic Scores */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Topic-by-Topic Performance:
                </span>
                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {Object.entries(inspectedStudent.topicScores).map(([topic, score]) => (
                    <div key={topic} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-800">{topic}</span>
                        <span className={score >= 75 ? 'text-emerald-700' : score >= 55 ? 'text-amber-700' : 'text-rose-700'}>
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            score >= 75 ? 'bg-emerald-500' : score >= 55 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weakest vs Strongest */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-rose-800 uppercase block">Weakest Concept</span>
                  <strong className="text-xs text-rose-950 block">{inspectedStudent.weakestTopic}</strong>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Mastered Concept</span>
                  <strong className="text-xs text-emerald-950 block">{inspectedStudent.strongestTopic}</strong>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-indigo-900 uppercase block">
                  Personalized Teacher Recommendation
                </span>
                <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                  {inspectedStudent.recommendedRemedial}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  alert(`Personalized study nudge sent to ${inspectedStudent.name} (${inspectedStudent.email})!`);
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Study Recommendation</span>
              </button>

              <button
                onClick={() => setInspectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">Add New Subject</h3>
              </div>
              <button
                onClick={() => setShowAddSubjectModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddNewSubject} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Subject Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS404: Compiler Design & Optimization"
                  value={newSubjectTitle}
                  onChange={e => setNewSubjectTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Subject Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS-404-OPT"
                  value={newSubjectCode}
                  onChange={e => setNewSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Semester
                  </label>
                  <input
                    type="text"
                    value={newSemester}
                    onChange={e => setNewSemester(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Enrolled Students
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={newEnrolledCount}
                    onChange={e => setNewEnrolledCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newSubjectTitle.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
                >
                  Create Subject Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GapFinder AI &bull; Teacher &amp; Educator Class Diagnostic Analytics</span>
          <span className="text-slate-400">Next.js 14 &bull; TypeScript &bull; PostgreSQL User Store</span>
        </div>
      </footer>
    </div>
  );
}
