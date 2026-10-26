-- ==========================================================
-- GapFinder AI Database Schema (PostgreSQL + Supabase pgvector)
-- ==========================================================

-- Enable pgvector extension for semantic similarity retrieval
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  description TEXT,
  target_exam TEXT,
  is_preloaded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Documents Table (Syllabus, Textbook Notes, Past Papers)
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('syllabus', 'textbook', 'notes', 'past_papers')),
  content TEXT NOT NULL,
  size_bytes BIGINT,
  upload_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Document Chunks Table with pgvector Embeddings
CREATE TABLE IF NOT EXISTS document_chunks (
  id TEXT PRIMARY KEY,
  doc_id TEXT REFERENCES documents(id) ON DELETE CASCADE,
  doc_title TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  section TEXT NOT NULL,
  content TEXT NOT NULL,
  token_count INT,
  keywords TEXT[],
  embedding vector(768), -- 768 dimensions for Gemini text-embedding-004 / 1536 for OpenAI
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for ultra-fast Cosine Distance retrieval using HNSW
CREATE INDEX IF NOT EXISTS document_chunks_embedding_hnsw_idx
  ON document_chunks
  USING hnsw (embedding vector_cosine_ops);

-- 4. Topics Table (Structured Curriculum Knowledge Graph)
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  unit TEXT NOT NULL,
  description TEXT,
  syllabus_weightage INT NOT NULL DEFAULT 15,
  estimated_minutes INT NOT NULL DEFAULT 45,
  bloom_level TEXT CHECK (bloom_level IN ('Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate')),
  mastery_status TEXT DEFAULT 'untested' CHECK (mastery_status IN ('weak', 'medium', 'strong', 'untested')),
  current_score INT DEFAULT 0,
  subtopics TEXT[],
  reference_sections TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Diagnostic Quiz Attempts Table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  quiz_title TEXT NOT NULL,
  topic_ids TEXT[],
  score_percentage INT NOT NULL,
  answers_json JSONB NOT NULL,
  duration_seconds INT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Gap Reports Table
CREATE TABLE IF NOT EXISTS gap_reports (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  overall_score INT NOT NULL,
  weak_count INT NOT NULL,
  medium_count INT NOT NULL,
  strong_count INT NOT NULL,
  exam_readiness TEXT NOT NULL,
  summary_diagnosis TEXT NOT NULL,
  diagnoses_json JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Personalized Revision Plans Table
CREATE TABLE IF NOT EXISTS revision_plans (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  gap_report_id TEXT REFERENCES gap_reports(id) ON DELETE CASCADE,
  timeframe_preset TEXT NOT NULL,
  daily_hours INT NOT NULL DEFAULT 3,
  total_days INT NOT NULL DEFAULT 3,
  projected_gain TEXT,
  days_schedule_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- Stored Procedure (RPC) for pgvector Similarity Retrieval
-- ==========================================================
CREATE OR REPLACE FUNCTION match_document_chunks (
  query_embedding vector(768),
  match_count INT DEFAULT 4,
  filter_course_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  id TEXT,
  doc_id TEXT,
  doc_title TEXT,
  doc_type TEXT,
  section TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.doc_id,
    dc.doc_title,
    dc.doc_type,
    dc.section,
    dc.content,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  JOIN documents d ON dc.doc_id = d.id
  WHERE (filter_course_id IS NULL OR d.course_id = filter_course_id)
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
