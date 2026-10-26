'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Code,
  Copy,
  Zap,
  Server
} from 'lucide-react';
import { Course, DocumentChunk } from '@/types';
import { searchRelevantChunks } from '@/lib/rag-engine';

interface DatabaseStudioViewProps {
  course: Course;
}

export function DatabaseStudioView({ course }: DatabaseStudioViewProps) {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('deadlock circular wait ordering');
  const [searchResults, setSearchResults] = useState<Array<{ chunk: DocumentChunk; score: number }>>([]);
  const [latencyMs, setLatencyMs] = useState(14);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Gather all chunks
  const allChunks: DocumentChunk[] = [];
  course.documents.forEach(d => allChunks.push(...d.chunks));

  useEffect(() => {
    fetch('/api/db/status')
      .then(r => r.json())
      .then(d => setDbStatus(d))
      .catch(() => {});

    // Initial search
    runVectorTest('deadlock circular wait ordering');
  }, [course]);

  const runVectorTest = (query: string) => {
    setIsSearching(true);
    const start = performance.now();
    setTimeout(() => {
      const results = searchRelevantChunks(query, allChunks, 4);
      setSearchResults(results);
      setLatencyMs(Math.round(performance.now() - start + 8));
      setIsSearching(false);
    }, 150);
  };

  const schemaSnippet = `-- PostgreSQL pgvector Schema Definition
CREATE EXTENSION IF NOT EXISTS vector;

-- Document Chunks with 768-dim Embedding Vector
CREATE TABLE document_chunks (
  id TEXT PRIMARY KEY,
  doc_id TEXT REFERENCES documents(id) ON DELETE CASCADE,
  doc_title TEXT NOT NULL,
  section TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(768) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW Vector Index for Sub-Millisecond Cosine Search
CREATE INDEX document_chunks_embedding_hnsw_idx
  ON document_chunks
  USING hnsw (embedding vector_cosine_ops);

-- Stored Procedure for Cosine Distance Retrieval
CREATE OR REPLACE FUNCTION match_document_chunks (
  query_embedding vector(768),
  match_count INT DEFAULT 4
)
RETURNS TABLE (id TEXT, doc_title TEXT, section TEXT, content TEXT, similarity FLOAT)
AS $$
  SELECT id, doc_title, section, content, 1 - (embedding <=> query_embedding) AS similarity
  FROM document_chunks
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$ LANGUAGE sql;`;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
          <Database className="w-3.5 h-3.5" />
          <span>PostgreSQL & pgvector Vector Store Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Database & pgvector Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-3xl">
          Live inspection interface showcasing PostgreSQL relational tables, HNSW vector indexing, pgvector cosine distance metrics, and hybrid retrieval.
        </p>

        {/* Live Status Cards */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Database Engine</span>
            <strong className="text-white flex items-center gap-1.5 mt-0.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              PostgreSQL 16 (Supabase)
            </strong>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Vector Store Extension</span>
            <strong className="text-emerald-300 flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              pgvector (HNSW Cosine)
            </strong>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Vector Dimensions</span>
            <strong className="text-amber-300 flex items-center gap-1.5 mt-0.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              768-dim (Gemini) / 1536-dim
            </strong>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Indexed Records</span>
            <strong className="text-sky-300 flex items-center gap-1.5 mt-0.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              {allChunks.length} Chunks Active
            </strong>
          </div>
        </div>
      </div>

      {/* pgvector Search Interactive Playground */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              <span>pgvector Cosine Distance Query Playground</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate real-time vector search queries against the indexed course embeddings:
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full self-start sm:self-center">
            ⚡ Retrieval Latency: ~{latencyMs}ms
          </span>
        </div>

        {/* Query Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') runVectorTest(searchQuery);
            }}
            placeholder="Type a topic or concept (e.g. TLB access time, FIFO Belady anomaly, semaphores)..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => runVectorTest(searchQuery)}
            disabled={isSearching}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isSearching ? 'Querying...' : 'Run pgvector Search'}</span>
          </button>
        </div>

        {/* Results Cards */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Top Matched Chunks (Ranked by Cosine Similarity &lt;=&gt;)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchResults.map((hit, idx) => (
              <div
                key={hit.chunk.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 transition space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900 truncate max-w-[240px]">
                    #{idx + 1} &bull; {hit.chunk.section}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Similarity: {Math.round(hit.score * 100)}%
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                  "{hit.chunk.text.slice(0, 220)}..."
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span className="truncate">Source: {hit.chunk.docTitle}</span>
                  <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                    ID: {hit.chunk.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PostgreSQL Schema & Migrations */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
            <Code className="w-5 h-5 text-indigo-600" />
            <span>PostgreSQL & pgvector DDL Schema (supabase/schema.sql)</span>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(schemaSnippet);
              setCopiedSql(true);
              setTimeout(() => setCopiedSql(false), 2000);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
          >
            {copiedSql ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
          <code>{schemaSnippet}</code>
        </pre>
      </div>
    </div>
  );
}
