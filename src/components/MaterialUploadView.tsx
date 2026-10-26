'use client';

import React, { useState } from 'react';
import {
  Upload,
  FileText,
  BookOpen,
  HelpCircle,
  Trash2,
  Plus,
  Sparkles,
  Layers,
  CheckCircle2,
  Eye,
  X
} from 'lucide-react';
import { Course, DocumentChunk, DocumentType, UploadedDocument } from '@/types';
import { chunkDocument } from '@/lib/rag-engine';
import { saveCourse } from '@/lib/storage';

interface MaterialUploadViewProps {
  course: Course;
  onCourseUpdated: (course: Course) => void;
}

export function MaterialUploadView({
  course,
  onCourseUpdated
}: MaterialUploadViewProps) {
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<DocumentType>('notes');
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeViewingDoc, setActiveViewingDoc] = useState<UploadedDocument | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      setRawText(content || '');
    };
    reader.readAsText(file);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !rawText.trim()) return;

    setIsProcessing(true);

    const docId = `doc-${Date.now()}`;
    const chunks = chunkDocument(docId, docTitle.trim(), docType, rawText);

    const newDoc: UploadedDocument = {
      id: docId,
      courseId: course.id,
      title: docTitle.trim(),
      type: docType,
      content: rawText,
      chunks,
      uploadDate: new Date().toISOString().split('T')[0],
      sizeBytes: new Blob([rawText]).size
    };

    const updatedDocuments = [...course.documents, newDoc];
    const updatedCourse: Course = {
      ...course,
      documents: updatedDocuments
    };

    saveCourse(updatedCourse);
    onCourseUpdated(updatedCourse);

    setDocTitle('');
    setRawText('');
    setIsProcessing(false);
  };

  const handleDeleteDoc = (docId: string) => {
    if (confirm('Delete this document and its indexed chunks?')) {
      const updatedDocuments = course.documents.filter(d => d.id !== docId);
      const updatedCourse: Course = {
        ...course,
        documents: updatedDocuments
      };
      saveCourse(updatedCourse);
      onCourseUpdated(updatedCourse);
    }
  };

  const totalChunks = course.documents.reduce((acc, d) => acc + d.chunks.length, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Upload className="w-3.5 h-3.5" />
            <span>Document Knowledge Base & Chunker</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Study Material Repository
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Uploaded materials are chunked, semantically indexed, and used to generate grounded diagnostic questions and citations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-center">
            <div className="text-xs text-slate-500 font-semibold">Indexed Documents</div>
            <div className="text-xl font-bold text-slate-900">{course.documents.length}</div>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-xl text-center">
            <div className="text-xs text-indigo-600 font-semibold">Active Chunks</div>
            <div className="text-xl font-bold text-indigo-700">{totalChunks}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Upload New Material</span>
          </h2>

          <form onSubmit={handleAddDocument} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Document Title
              </label>
              <input
                type="text"
                placeholder="e.g. Chapter 6 Concurrency Notes"
                value={docTitle}
                onChange={e => setDocTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Material Classification
              </label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value as DocumentType)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-white"
              >
                <option value="syllabus">📜 Official Syllabus (Defines topic tree)</option>
                <option value="textbook">📖 Textbook Chapter</option>
                <option value="notes">📝 Lecture Notes & Handouts</option>
                <option value="past_papers">🎯 Past Examination Paper & Solutions</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Upload File (.txt, .md, .pdf)
              </label>
              <input
                type="file"
                accept=".txt,.md,.pdf,.json"
                onChange={handleFileUpload}
                className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Or Paste Material Text
              </label>
              <textarea
                rows={6}
                placeholder="Paste chapter text, syllabus topics, or exam questions..."
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing || !docTitle.trim() || !rawText.trim()}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Chunking & Indexing...' : 'Parse & Add to Knowledge Base'}</span>
            </button>
          </form>
        </div>

        {/* Uploaded Documents List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Grounded Course Documents ({course.documents.length})</span>
            </h2>
            <span className="text-xs text-slate-500">
              Grounded in current course: <strong>{course.subjectCode}</strong>
            </span>
          </div>

          <div className="space-y-3">
            {course.documents.map(doc => {
              let typeBadge = 'bg-slate-100 text-slate-700';
              if (doc.type === 'syllabus') typeBadge = 'bg-indigo-100 text-indigo-700 border border-indigo-200';
              else if (doc.type === 'past_papers') typeBadge = 'bg-amber-100 text-amber-800 border border-amber-200';
              else if (doc.type === 'textbook') typeBadge = 'bg-emerald-100 text-emerald-800 border border-emerald-200';

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${typeBadge}`}>
                        {doc.type.replace('_', ' ')}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{doc.title}</h3>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {doc.content.slice(0, 160)}...
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>{doc.chunks.length} Chunks Generated</span>
                      <span>&bull;</span>
                      <span>{Math.round(doc.sizeBytes / 1024)} KB</span>
                      <span>&bull;</span>
                      <span>Uploaded {doc.uploadDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => setActiveViewingDoc(doc)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>View Chunks</span>
                    </button>

                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chunk Viewer Modal */}
      {activeViewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Parsed Chunks: {activeViewingDoc.title}
                </h3>
                <span className="text-xs text-slate-500">
                  {activeViewingDoc.chunks.length} semantically partitioned chunks with source provenance
                </span>
              </div>
              <button
                onClick={() => setActiveViewingDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {activeViewingDoc.chunks.map((chk, idx) => (
                <div
                  key={chk.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="text-indigo-700">Chunk #{idx + 1} &bull; {chk.section}</span>
                    <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                      ~{chk.tokenCount} tokens
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-100">
                    {chk.text}
                  </p>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    <span className="text-slate-400 font-semibold">Keywords:</span>
                    {chk.keywords.map(kw => (
                      <span key={kw} className="bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
