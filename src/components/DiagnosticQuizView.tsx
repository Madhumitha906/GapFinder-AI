'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BarChart3,
  Quote
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, QuizQuestion, StudentQuizAnswer, QuizAttempt } from '@/types';
import { SAMPLE_QUIZ_QUESTIONS } from '@/lib/sample-data';
import { saveQuizAttempt } from '@/lib/storage';

interface DiagnosticQuizViewProps {
  course: Course;
  selectedTopicId: string | null;
  onQuizCompleted: () => void;
  onClearTopicFilter: () => void;
}

export function DiagnosticQuizView({
  course,
  selectedTopicId,
  onQuizCompleted,
  onClearTopicFilter
}: DiagnosticQuizViewProps) {
  // Filter questions if specific topic chosen, otherwise use all course diagnostic questions
  const questions: QuizQuestion[] = selectedTopicId
    ? SAMPLE_QUIZ_QUESTIONS.filter(q => q.topicId === selectedTopicId)
    : SAMPLE_QUIZ_QUESTIONS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<'confident' | 'somewhat_confident' | 'guessing'>('confident');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, StudentQuizAnswer>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  const handleOptionSelect = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQ.correctOptionIndex;
    const answerRecord: StudentQuizAnswer = {
      questionId: currentQ.id,
      selectedOptionIndex: selectedOption,
      isCorrect,
      confidence,
      timeSpentSeconds: 25
    };

    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: answerRecord
    }));

    setIsAnswerSubmitted(true);

    if (isCorrect) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Complete quiz
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const finalAnswers = { ...answers };
    let correctCount = 0;
    Object.values(finalAnswers).forEach(a => {
      if (a.isCorrect) correctCount++;
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      courseId: course.id,
      quizTitle: selectedTopicId
        ? `Topic Quiz: ${currentQ.topicTitle}`
        : 'Full Course Diagnostic Evaluation',
      topicIds: Array.from(new Set(questions.map(q => q.topicId))),
      questions,
      answers: finalAnswers,
      scorePercentage,
      completedAt: new Date().toISOString(),
      durationSeconds: 120
    };

    saveQuizAttempt(attempt);
    setQuizFinished(true);

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleResetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setAnswers({});
    setQuizFinished(false);
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-lg mx-auto">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">No questions found</h3>
        <p className="text-xs text-slate-500 mb-4">
          No generated quiz questions for this specific topic yet.
        </p>
        <button
          onClick={onClearTopicFilter}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          View Full Diagnostic Quiz
        </button>
      </div>
    );
  }

  // Quiz Summary Card when finished
  if (quizFinished) {
    const totalQ = questions.length;
    let correctCount = 0;
    Object.values(answers).forEach(a => {
      if (a.isCorrect) correctCount++;
    });
    const finalScore = Math.round((correctCount / totalQ) * 100);

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            Diagnostic Completed
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            Assessment Results: {finalScore}%
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {correctCount} out of {totalQ} questions answered correctly.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>AI Knowledge Gap Diagnosis Updated</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Your answers were mapped directly to the syllabus knowledge tree. Your <strong>Gap Report</strong> and <strong>Personalized Revision Plan</strong> have been updated with precise chapter citations and priority recommendations!
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onQuizCompleted}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition hover:scale-105"
          >
            <span>View Full Gap Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetQuiz}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>
    );
  }

  const isCurrentCorrect = selectedOption === currentQ.correctOptionIndex;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
      {/* Progress & Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
              Question {currentIndex + 1} of {questions.length}
            </span>
            {selectedTopicId && (
              <button
                onClick={onClearTopicFilter}
                className="text-[11px] text-slate-500 hover:text-indigo-600 underline"
              >
                (Switch to Full Quiz)
              </button>
            )}
          </div>
          <h2 className="text-sm font-bold text-slate-800 mt-1">
            Topic: {currentQ.topicTitle}
          </h2>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Difficulty:{' '}
          <span className={`capitalize ${
            currentQ.difficulty === 'hard' ? 'text-rose-600' : currentQ.difficulty === 'medium' ? 'text-amber-600' : 'text-emerald-600'
          }`}>
            {currentQ.difficulty}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        {/* Source Citation Badge */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs">
          <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-indigo-950">Grounded Source Citation: </span>
            <span className="text-indigo-800 font-medium">{currentQ.citation.docTitle}</span> &bull;{' '}
            <span className="text-indigo-600 italic">{currentQ.citation.section}</span>
          </div>
        </div>

        {/* Question Text */}
        <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {currentQ.question}
        </div>

        {/* Multiple Choice Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let optionStyles = 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50';
            
            if (isAnswerSubmitted) {
              if (idx === currentQ.correctOptionIndex) {
                optionStyles = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-2 ring-emerald-500/30';
              } else if (idx === selectedOption) {
                optionStyles = 'border-rose-500 bg-rose-50/80 text-rose-950 font-semibold ring-2 ring-rose-500/30';
              } else {
                optionStyles = 'border-slate-200 opacity-60';
              }
            } else if (selectedOption === idx) {
              optionStyles = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium ring-2 ring-indigo-600/30';
            }

            return (
              <div
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition flex items-start gap-3 ${optionStyles}`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  selectedOption === idx ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 text-slate-500'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1">{option}</div>
                {isAnswerSubmitted && idx === currentQ.correctOptionIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswerSubmitted && idx === selectedOption && idx !== currentQ.correctOptionIndex && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Student Confidence Marker (Crucial for metacognitive gap analysis) */}
        {!isAnswerSubmitted && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-slate-600">Your confidence on this concept:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setConfidence('confident')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  confidence === 'confident'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🟢 Confident
              </button>
              <button
                type="button"
                onClick={() => setConfidence('somewhat_confident')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  confidence === 'somewhat_confident'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🟡 Educated Guess
              </button>
              <button
                type="button"
                onClick={() => setConfidence('guessing')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  confidence === 'guessing'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🔴 Unsure / Blind Guess
              </button>
            </div>
          </div>
        )}

        {/* Evaluation & Misconception Breakdown (Visible after submit) */}
        {isAnswerSubmitted && (
          <div className={`p-5 rounded-xl border text-xs space-y-3 animate-in fade-in ${
            isCurrentCorrect
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-rose-50/70 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {isCurrentCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Correct! Grounded Diagnostic Verified</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Misconception Detected</span>
                </>
              )}
            </div>

            <p className="leading-relaxed">
              {isCurrentCorrect ? currentQ.explanation : currentQ.misconceptionExplanation}
            </p>

            {/* Exact Textbook Excerpt Quote */}
            <div className="p-3 rounded-lg bg-white/80 border border-slate-200/80 text-slate-700 italic space-y-1">
              <div className="flex items-center gap-1 font-semibold text-[11px] text-slate-800 not-italic">
                <Quote className="w-3.5 h-3.5 text-indigo-600" />
                <span>Textbook Ground Truth Snippet:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                "{currentQ.citation.snippet}"
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
            >
              Verify Answer & Diagnose
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md transition"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Assessment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
