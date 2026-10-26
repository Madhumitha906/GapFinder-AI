'use client';

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Upload,
  Sparkles,
  Layers,
  CheckCircle2,
  FileText,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, TopicNode, UploadedDocument } from '@/types';
import { chunkDocument } from '@/lib/rag-engine';
import { saveCourse, setActiveCourseId } from '@/lib/storage';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: (newCourse: Course) => void;
}

export function CreateCourseModal({
  isOpen,
  onClose,
  onCourseCreated
}: CreateCourseModalProps) {
  const [courseTitle, setCourseTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [targetExam, setTargetExam] = useState('');
  const [description, setDescription] = useState('');
  const [syllabusText, setSyllabusText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!courseTitle) {
      setCourseTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      setSyllabusText(content || '');
    };
    reader.readAsText(file);
  };

  const handleLoadSampleTemplate = () => {
    setCourseTitle('Data Structures & Algorithms');
    setSubjectCode('CS-201');
    setTargetExam('Semester Final Examination 2026');
    setDescription('Core curriculum covering asymptotic analysis, balanced search trees, dynamic programming, and graph algorithms.');
    setSyllabusText(`# CS201 Data Structures and Algorithms Syllabus
Unit 1: Asymptotic Analysis & Recurrences (20% Weightage)
- Big-O, Big-Omega, Big-Theta bounds
- Master Theorem and recursion tree methods
Unit 2: Balanced Trees & Priority Queues (30% Weightage)
- AVL Trees and Red-Black tree rotations
- Binary Min/Max Heaps and HeapSort
Unit 3: Graph Traversal & Shortest Paths (25% Weightage)
- BFS, DFS, and topological sort
- Dijkstra's single-source shortest path and Bellman-Ford
Unit 4: Dynamic Programming & Greedy Algorithms (25% Weightage)
- Optimal substructure and overlapping subproblems
- 0/1 Knapsack, Longest Common Subsequence (LCS)`);
  };

  const parseTopicsFromSyllabus = (text: string, courseId: string): TopicNode[] => {
    const lines = text.split('\n');
    const topics: TopicNode[] = [];
    let currentUnit = 'Unit 1: Core Fundamentals';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.toLowerCase().startsWith('unit') || line.toLowerCase().startsWith('chapter') || line.toLowerCase().startsWith('module')) {
        currentUnit = line.replace(/^#+\s*/, '');
      } else if (line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./)) {
        const topicTitle = line.replace(/^[-*0-9.]+\s*/, '').trim();
        if (topicTitle.length > 3) {
          topics.push({
            id: `top-${courseId}-${topics.length + 1}`,
            courseId,
            title: topicTitle,
            unit: currentUnit,
            description: `Core syllabus module covering ${topicTitle} under ${currentUnit}.`,
            syllabusWeightage: Math.max(10, Math.floor(100 / Math.max(1, (topics.length + 4)))),
            estimatedMinutesToMaster: 45,
            bloomLevel: topics.length % 2 === 0 ? 'Apply' : 'Analyze',
            masteryStatus: 'untested',
            subtopics: [topicTitle, 'Foundational Definitions', 'Exam Practice Problems'],
            referenceSections: [currentUnit]
          });
        }
      }
    }

    // Fallback if formatting was freeform
    if (topics.length === 0) {
      topics.push(
        {
          id: `top-${courseId}-1`,
          courseId,
          title: 'Foundational Principles & Core Concepts',
          unit: 'Unit 1: Introduction & Fundamentals',
          description: `Key definitions and conceptual framework for ${courseTitle || 'this course'}.`,
          syllabusWeightage: 30,
          estimatedMinutesToMaster: 50,
          bloomLevel: 'Understand',
          masteryStatus: 'untested',
          subtopics: ['Core Definitions', 'System Architecture', 'Methodology'],
          referenceSections: ['Unit 1']
        },
        {
          id: `top-${courseId}-2`,
          courseId,
          title: 'Advanced Operations & Problem Solving',
          unit: 'Unit 2: Applied Methodologies',
          description: `Problem solving strategies and boundary condition analysis.`,
          syllabusWeightage: 35,
          estimatedMinutesToMaster: 60,
          bloomLevel: 'Apply',
          masteryStatus: 'untested',
          subtopics: ['Application Problems', 'Formulas & Derivations', 'Edge Cases'],
          referenceSections: ['Unit 2']
        },
        {
          id: `top-${courseId}-3`,
          courseId,
          title: 'Synthesis & Exam Edge Cases',
          unit: 'Unit 3: Integration & Exam Synthesis',
          description: `Multi-topic synthesis questions and past examination problem types.`,
          syllabusWeightage: 35,
          estimatedMinutesToMaster: 55,
          bloomLevel: 'Analyze',
          masteryStatus: 'untested',
          subtopics: ['Synthesis Questions', 'Optimization', 'Past Exam Pitfalls'],
          referenceSections: ['Unit 3']
        }
      );
    }

    return topics;
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    setIsSubmitting(true);
    const newCourseId = `course-${Date.now()}`;
    const code = subjectCode.trim() || 'GEN-101';
    const exam = targetExam.trim() || 'Upcoming Final Exam';
    const desc = description.trim() || `Course syllabus and study materials for ${courseTitle.trim()}.`;

    // Parse syllabus into documents & chunks
    const documents: UploadedDocument[] = [];
    if (syllabusText.trim()) {
      const docId = `doc-${Date.now()}-syl`;
      const chunks = chunkDocument(docId, `${courseTitle.trim()} Official Syllabus`, 'syllabus', syllabusText.trim());
      documents.push({
        id: docId,
        courseId: newCourseId,
        title: `${courseTitle.trim()} Official Syllabus`,
        type: 'syllabus',
        content: syllabusText.trim(),
        chunks,
        uploadDate: new Date().toISOString().split('T')[0],
        sizeBytes: new Blob([syllabusText]).size
      });
    }

    const topics = parseTopicsFromSyllabus(syllabusText, newCourseId);

    const newCourse: Course = {
      id: newCourseId,
      title: courseTitle.trim(),
      subjectCode: code,
      description: desc,
      targetExam: exam,
      documents,
      topics,
      isPreloaded: false
    };

    saveCourse(newCourse);
    setActiveCourseId(newCourseId);
    onCourseCreated(newCourse);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Plus className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create & Upload New Course</h2>
              <p className="text-[11px] text-slate-300">
                Map your own syllabus into an AI topic tree, diagnostic quiz, and revision plan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreateCourse} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Quick Preset Banner */}
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-indigo-900 font-medium text-[11px]">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Want a quick test with another subject?</span>
            </div>
            <button
              type="button"
              onClick={handleLoadSampleTemplate}
              className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs transition"
            >
              Fill Sample "Data Structures & Algorithms"
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Course Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Data Structures & Algorithms, Physics 101"
                value={courseTitle}
                onChange={e => setCourseTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Subject / Course Code
              </label>
              <input
                type="text"
                placeholder="e.g. CS201, PHY101"
                value={subjectCode}
                onChange={e => setSubjectCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Target Examination
              </label>
              <input
                type="text"
                placeholder="e.g. University Final Exam, Midterm, GATE"
                value={targetExam}
                onChange={e => setTargetExam(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Course Description (Optional)
              </label>
              <input
                type="text"
                placeholder="Brief summary of what this course covers"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>
          </div>

          {/* Syllabus Ingestion Section */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Upload Syllabus or Curriculum Outline</span>
              </label>
              <span className="text-[10px] text-slate-400">
                (GapFinder AI parses this into your Topic Knowledge Graph)
              </span>
            </div>

            <div>
              <input
                type="file"
                accept=".txt,.md,.pdf,.json"
                onChange={handleFileUpload}
                className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>

            <textarea
              rows={6}
              placeholder="Or paste your syllabus modules and topics here:
Unit 1: Introduction & Fundamentals
- Topic A
- Topic B
Unit 2: Advanced Concepts
- Topic C
- Topic D..."
              value={syllabusText}
              onChange={e => setSyllabusText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !courseTitle.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Building Topic Graph...' : 'Create Course & Generate Topic Map'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
