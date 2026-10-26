'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  BookOpen,
  Sparkles,
  Quote,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShieldCheck,
  Bot,
  User
} from 'lucide-react';
import { Course, DocumentChunk, RAGChatMessage, SourceCitation } from '@/types';
import { synthesizeRAGAnswer } from '@/lib/rag-engine';
import { getStoredChatMessages, saveChatMessage } from '@/lib/storage';

interface ExplainAssistantViewProps {
  course: Course;
  initialTopicPrompt?: string | null;
  onClearInitialPrompt?: () => void;
}

export function ExplainAssistantView({
  course,
  initialTopicPrompt,
  onClearInitialPrompt
}: ExplainAssistantViewProps) {
  // Collect all chunks across uploaded documents
  const allChunks: DocumentChunk[] = [];
  course.documents.forEach(d => {
    allChunks.push(...d.chunks);
  });

  const [messages, setMessages] = useState<RAGChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [expandedCitationMap, setExpandedCitationMap] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loaded = getStoredChatMessages(course.id);
    if (loaded.length === 0) {
      // Welcome message
      const initial: RAGChatMessage = {
        id: 'msg-welcome',
        role: 'assistant',
        content: `👋 Hello! I am your **Grounded Revision Assistant**. I provide answers and study guidance **strictly derived from your uploaded syllabus, textbook chapters, and past examination papers**.\n\nEvery explanation I provide includes verifiable citations to your course materials. How can I help clarify your gaps today?`,
        timestamp: new Date().toISOString()
      };
      setMessages([initial]);
    } else {
      setMessages(loaded);
    }
  }, [course.id]);

  useEffect(() => {
    if (initialTopicPrompt) {
      handleSendMessage(`Explain the core principles and common exam pitfalls of "${initialTopicPrompt}" based on my course material.`);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialTopicPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: RAGChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    saveChatMessage(course.id, userMsg);
    setInputValue('');
    setIsThinking(true);

    // Simulate RAG semantic retrieval & answer synthesis
    setTimeout(() => {
      const { answer, citations } = synthesizeRAGAnswer(query, allChunks);

      const botMsg: RAGChatMessage = {
        id: `msg-${Date.now()}-bot`,
        role: 'assistant',
        content: answer,
        timestamp: new Date().toISOString(),
        citations,
        groundedScore: citations.length > 0 ? 0.96 : 0.2
      };

      setMessages(prev => [...prev, botMsg]);
      saveChatMessage(course.id, botMsg);
      setIsThinking(false);
    }, 600);
  };

  const toggleCitation = (msgId: string) => {
    setExpandedCitationMap(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const samplePrompts = [
    'Why does Belady Anomaly occur in FIFO?',
    'How to calculate EAT on TLB miss?',
    'Explain the 4 Coffman deadlock conditions',
    'What is the difference between counting and binary semaphores?',
    'Show a past midterm question and model answer'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-inner">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Explain-This-Topic Assistant (RAG Grounded)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Zero Hallucination Filter
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Active Knowledge Base: {allChunks.length} indexed chunks from {course.documents.length} verified course documents
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Clear assistant conversation history?')) {
              localStorage.removeItem(`gapfinder_chat_messages_v1_${course.id}`);
              setMessages([]);
            }
          }}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-semibold shrink-0">Try Asking:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="shrink-0 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-900 transition text-[11px] shadow-2xs font-medium"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Thread Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 min-h-[480px] max-h-[620px] overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm space-y-2.5 ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-slate-50 border border-slate-200/80 text-slate-900 rounded-tl-none'
            }`}>
              {/* Message Content */}
              <div className="whitespace-pre-wrap leading-relaxed">
                {msg.content}
              </div>

              {/* Citations Drawer for Assistant Messages */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80 text-xs">
                  <button
                    onClick={() => toggleCitation(msg.id)}
                    className="flex items-center justify-between w-full text-[11px] font-bold text-violet-700 hover:text-violet-900 bg-violet-50/80 px-2.5 py-1.5 rounded-lg border border-violet-100 transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-violet-600" />
                      <span>{msg.citations.length} Grounded Source Citations (Click to view)</span>
                    </span>
                    {expandedCitationMap[msg.id] ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {expandedCitationMap[msg.id] && (
                    <div className="mt-2 space-y-2 animate-in fade-in">
                      {msg.citations.map((cite, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 space-y-1 shadow-2xs"
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-indigo-900 truncate max-w-[280px]">
                              {cite.docTitle}
                            </span>
                            <span className="text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">
                              {cite.relevanceScore ? `${Math.round(cite.relevanceScore * 100)}% Match` : 'Cited'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 font-semibold italic">
                            Section: {cite.section}
                          </div>
                          <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                            "{cite.snippet}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
              <span>Retrieving relevant chunks and verifying citations...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Ask a question about your syllabus, concepts, or past exam problems..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isThinking}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
