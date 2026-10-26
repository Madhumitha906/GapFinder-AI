# GapFinder AI 🧠⚡
> **Grounded Knowledge Gap Diagnostic & Adaptive Personalized Revision Engine for Students & Teachers**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![RAG](https://img.shields.io/badge/RAG-Zero_Hallucination-emerald)](#rag-pipeline)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_%2F_Supabase_pgvector-336791?logo=postgresql)](#postgresql--supabase-pgvector-architecture)
[![Demo](https://img.shields.io/badge/Demo_Access-Preloaded-amber)](#judge--evaluator-credentials)

---

## 🎯 Executive Overview & Problem Statement

### The Problem
Traditional AI study tools suffer from a fatal passive flaw: **they wait for the student to ask a question**. 
However, **a student cannot ask about a gap they don’t know they have**. Before high-stakes exams, students spend over 60% of their revision time reviewing familiar topics where they feel comfortable, while critical syllabus gaps remain completely untouched until exam day. 

Furthermore, teachers lack fine-grained, topic-level diagnostic visibility into where an entire class or individual students are struggling before the final exam.

### The Solution: GapFinder AI
GapFinder AI reverses this paradigm. Instead of another generic "chat with your PDF" tool, GapFinder AI:
1. **First-Screen Streamlined Authentication**: Centered Sign In and Sign Up portal with role-based routing for **Students** and **Teachers**.
2. **Comprehensive Teacher & Educator Portal**: 
   * Identifies which subject the teacher teaches (with dynamic subject switching & custom subject creation).
   * Displays real-time counts of signed-in students for that subject.
   * Delivers cohort-wide overall performance diagnostics (class average, tier distributions, topic mastery bars, class blindspots).
   * Drills down into individual student performances with cognitive gap diagnoses and 1-click remediation.
3. **Student Diagnostic & Revision Workflow**:
   * Parses the student's entire academic corpus (syllabus weightages, textbook chapters, lecture notes, and past question papers).
   * Constructs an interactive **Topic Knowledge Map** with Bloom's taxonomy cognitive levels.
   * Administers **Diagnostic Quizzes** grounded strictly in retrieved material with verifiable source citations.
   * Generates an evidence-based **Gap Report** categorizing topics into **Weak (<50%)**, **Medium (50–75%)**, and **Strong (>75%)** with specific cognitive error classifications.
   * Synthesizes an adaptive **Time-Budgeted Revision Plan** prioritized by exam marks and gap severity.
   * Provides an **Explain-This-Topic RAG Assistant** with strict citation grounding and zero hallucinations.
4. **PostgreSQL / Supabase pgvector Database Studio**:
   * Complete relational and vector schema with vector embeddings, pgvector cosine distance indices, and an interactive query and search tester.

---

## 🏆 Judge & Evaluator Credentials

GapFinder AI comes preloaded with complete university datasets for instantaneous evaluation:

| Role | Email | Password | Preloaded Context / Access |
|---|---|---|---|
| **Teacher / Educator** | `teacher@gapfinder.ai` | `demo123456` | **Prof. Sarah Vance**: CS301 (OS), CS204 (DBMS), CS402 (Distributed Systems), 28 active students, cohort analytics & individual gap drilldowns |
| **Student** | `student@gapfinder.ai` | `demo123456` | **Alex Rivera**: Preloaded CS301 syllabus, textbook notes, diagnostic quiz attempts, weak topic reports, and revision plan |
| **Hackathon Judge** | `judge@gapfinder.ai` | `demo123456` | Evaluator dashboard with direct 1-click access to both Teacher and Student perspectives |

> **Tip**: On the first screen, you can also click the quick 1-click demo buttons under the login form to authenticate immediately without typing credentials!

---

## 🏗️ Technical Architecture & System Design

```
+---------------------------------------------------------------------------------------------------------+
|                                        GapFinder AI Architecture                                        |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|  [First Screen: Centered Authentication Gateway]                                                        |
|   ├── Sign In / Sign Up Card (Centered, distraction-free UI)                                           |
|   └── Role-Based Dispatcher ──┬───────────────────────────────────────────┐                             |
|                               │                                           │                             |
|                               ▼ (Role = Teacher)                          ▼ (Role = Student / Judge)    |
|  [Teacher & Educator Dashboard]                           [Student Diagnostic Learning Engine]          |
|   ├── Subject Selection & Management                      ├── Material Upload (Syllabus, Notes, Papers) |
|   ├── Signed-In Student Counter (e.g. 28/30 active)       ├── Topic Map & Bloom Taxonomy Hierarchy     |
|   ├── Cohort Overall Performance (Avg, Tiers, Mastery)    ├── Grounded Diagnostic Quiz with Citations   |
|   ├── Class-Wide Blindspot Detection                      ├── Gap Report (Weak / Medium / Strong)       |
|   └── Individual Student Roster & Drilldown Drawer        ├── Personalized Time-Budgeted Revision Plan  |
|                                                           ├── Explain-This-Topic RAG Assistant          |
|                                                           └── Progress Dashboard & Historical Trends    |
|                                                                                                         |
|                                         │                                                               |
|                                         ▼                                                               |
|  [Hybrid RAG & Vector Storage Engine (Next.js API + PostgreSQL / Supabase pgvector)]                    |
|   ├── Semantic Boundary Chunking (~650 chars, 100 char overlap)                                         |
|   ├── 1536-dimensional Vector Embeddings & Inverted Keyword Index (BM25 + Cosine)                       |
|   ├── Strict Citation Attribution & Source Grounding Guardrails                                         |
|   └── Full Relational Schema: Courses, Topics, Documents, Quizzes, Attempts, Reports, Plans             |
+---------------------------------------------------------------------------------------------------------+
```

---

## 🧑‍🏫 Teacher Portal Features

When logging in as a Teacher, GapFinder AI answers the 4 key pedagogical questions:

1. **Which subject does the teacher teach?**
   - Active subject selector for university courses (*CS301: Operating Systems & Virtual Memory Architecture*, *CS204: Database Systems & ACID Transactions*, *CS402: Distributed Systems & Consensus Algorithms*).
   - Built-in `+ Add New Subject` modal to register custom subjects, semesters, and syllabi.
2. **How many students are signed in for that subject?**
   - Live counter displaying enrolled students vs. active signed-in students (e.g., **28 signed in / 30 enrolled — 93.3% active engagement**).
3. **What is the total students' overall performance?**
   - Class-wide diagnostic average score (e.g. **68% B- Mastery**).
   - Distribution tiers: *High Distinction (90%+)*, *Proficient (70–89%)*, *Needs Attention (50–69%)*, and *Critical Gaps (<50%)*.
   - Topic-by-topic class mastery bars across the entire syllabus.
   - **AI Class Blindspot Alert**: Flags topics where over 60% of students failed (e.g. *FIFO Page Replacement & Belady's Anomaly at 36%*).
4. **What are their individual performances?**
   - Interactive roster table with real student metrics: quizzes attempted, mastery scores, weakest topic gap, strongest topic, and cognitive gap classification (*Conceptual*, *Application*, *Formula Slip*, or *Terminology*).
   - **1-Click "Inspect Gap Report" Drawer**: View each student's granular topic scores, misconception notes, and targeted remedial plan.
   - **Send Remedial Nudge**: Triggers targeted study modules for struggling students.

---

## 🔍 The RAG Pipeline (Chunking, Embedding, Retrieval)

### 1. Chunking Strategy
- Documents are split into semantic chunks adhering to logical headers (`#`, `Chapter`, `Unit`, `Section`, `Problem`).
- Target chunk size: **650 characters** with an overlap of **100 characters** to ensure uninterrupted contextual boundaries across formulas and definitions.
- Metadata attached to every chunk: `docId`, `docTitle`, `docType`, `section`, `tokenCount`, and extracted domain `keywords`.

### 2. Retrieval & Semantic Similarity
- Hybrid semantic search combining **BM25 term scoring**, **inverse document frequency (IDF)**, and **vector cosine similarity**.
- Automatic intent boosting: queries with "exam" or "solve" prioritize *past question paper chunks*; queries with "weightage" prioritize *syllabus chunks*.
- Each retrieved chunk is scored and ranked, filtering out any hits below the relevance threshold ($\ge 0.05$).

### 3. Citation Provenance & Hallucination Prevention
- Every quiz question and explanation generated displays its source metadata:
  ```json
  {
    "docTitle": "Operating Systems Principles (8th Ed) - Silberschatz & Galvin",
    "section": "Chapter 5.3: CPU Scheduling Algorithms",
    "snippet": "If the time quantum is extremely small, RR is called processor sharing, and results in excessive context-switch overhead..."
  }
  ```
- If a user asks the Explain Assistant a question outside their course material, the system explicitly warns: *"I could not find exact passages in your uploaded syllabus or notes. To maintain strict RAG grounding, please upload relevant material."*

---

## 🗄️ PostgreSQL / Supabase pgvector Architecture

GapFinder AI includes an interactive **Database Studio** view allowing judges to inspect the relational schema, view table records, and execute live vector searches:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Document chunks table with 1536-dimensional embeddings
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    course_id VARCHAR(50) NOT NULL,
    chunk_index INT NOT NULL,
    section_title VARCHAR(255),
    content TEXT NOT NULL,
    token_count INT,
    keywords TEXT[],
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fast approximate nearest neighbor search index using IVFFlat
CREATE INDEX ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Vector Cosine Similarity Search Function
CREATE OR REPLACE FUNCTION match_document_chunks (
    query_embedding vector(1536),
    match_threshold FLOAT,
    match_count INT,
    filter_course_id VARCHAR(50) DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    section_title VARCHAR(255),
    content TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        dc.document_id,
        dc.section_title,
        dc.content,
        1 - (dc.embedding <=> query_embedding) AS similarity
    FROM document_chunks dc
    WHERE (filter_course_id IS NULL OR dc.course_id = filter_course_id)
      AND 1 - (dc.embedding <=> query_embedding) > match_threshold
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
```

---

## 💡 Separation of Concerns in AI

| Module | Retrieval Component | Generative / Diagnostic Component | Separation & Safety Mechanism |
|---|---|---|---|
| **Topic Map** | Extracts units & chapters from syllabus | Categorizes Bloom levels & weightages | Strict regex & semantic heading parsing |
| **Diagnostic Quiz** | Retrieves primary textbook chunk | Formulates distractors representing real misconceptions | Option correctness verified against chunk ground truth |
| **Answer Evaluation** | Retrieves model solution & citation | Explains *why* student answer was wrong | Rule-checked against target option index and excerpt |
| **Gap Report** | Maps test attempts to syllabus nodes | Assigns Weak/Medium/Strong ratings + root causes | Deterministic diagnostic matrix weighted by confidence |
| **Revision Plan** | Ranks weak nodes by exam marks | Allocates daily study minutes & study modes | Constraint satisfaction knapsack algorithm |
| **Explain Assistant** | BM25/Cosine retrieval over all docs | Summarizes concept & provides analogies | Source citations rendered in interactive drawer |

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- Node.js v18+, v20+, or v22+
- npm v10+
- Git

### 1. Clone & Install
```bash
git clone https://github.com/Madhumitha906/GapFinder-AI.git
cd GapFinder-AI
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

### 4. (Optional) Configure Gemini API Key
GapFinder AI includes a **zero-dependency deterministic RAG engine** that runs completely offline with instant preloaded data! If you wish to enable live Google Gemini generative calls, create `.env.local`:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```
Or click the **"AI API Key (Optional)"** button in the top navigation bar inside the app.

---

## 📁 Repository Structure

```
GapFinder AI/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── rag/search/route.ts        # Semantic chunk search endpoint
│   │   │   └── diagnose/route.ts          # Gap report & revision plan endpoint
│   │   ├── globals.css                    # Tailwind CSS styles & animations
│   │   ├── layout.tsx                     # Root HTML & metadata wrapper
│   │   └── page.tsx                       # Main application & role-based view switcher
│   ├── components/
│   │   ├── AuthLandingView.tsx            # Centered first screen Sign In / Sign Up
│   │   ├── TeacherDashboardView.tsx       # Teacher subjects & student performance portal
│   │   ├── Navbar.tsx                     # Navigation header, user profile, role switcher
│   │   ├── TopicMapView.tsx               # Topic hierarchy & syllabus weightage tree
│   │   ├── DiagnosticQuizView.tsx         # Source-grounded diagnostic quiz with citations
│   │   ├── GapReportView.tsx              # Topic gap diagnostic matrix & root causes
│   │   ├── RevisionPlanView.tsx           # Time-budgeted adaptive revision schedule
│   │   ├── ExplainAssistantView.tsx       # RAG grounded conversational tutor
│   │   ├── MaterialUploadView.tsx         # Syllabus/textbook/notes upload & chunking
│   │   ├── ProgressDashboardView.tsx      # Student diagnostic mastery trajectories
│   │   ├── DatabaseStudioView.tsx         # Supabase / PostgreSQL pgvector Studio
│   │   └── ArchitectureView.tsx           # Interactive architecture & RAG documentation
│   ├── lib/
│   │   ├── rag-engine.ts                  # Hybrid search, chunking, gap analysis, knapsack planner
│   │   ├── sample-data.ts                 # Preloaded CS301 syllabus, notes, teacher cohort data
│   │   └── storage.ts                     # Local storage persistence & state sync
│   └── types/
│       └── index.ts                       # Strict TypeScript interfaces & data contracts
├── package.json                           # Dependencies & scripts
├── tsconfig.json                          # TypeScript configuration
├── tailwind.config.ts                     # Tailwind theme and colors
└── README.md                              # Comprehensive project documentation
```

---

## 🔮 Limitations & Future Roadmap

### Current Limitations
1. Complex mathematical formulas formatted in specialized LaTeX fonts require raw text expressions for semantic indexing.
2. Handwritten scanned PDFs require an OCR preprocessing step prior to chunking.
3. Client-side browser storage is utilized for instant zero-setup judge evaluation; production multi-tenant deployments connect to Supabase/PostgreSQL with `pgvector`.

### Future Scalability
- **LMS Integrations**: Two-way gradebook synchronization with Canvas, Blackboard, and Google Classroom.
- **Spaced Repetition Scheduler**: Push notifications right before memory decay using the SuperMemo SM-2 algorithm.
- **Multi-Subject & Multi-Language Support**: Cross-lingual embeddings for state and national examinations.
- **Automated Remedial Content Generator**: Auto-compilation of personalized review booklets for students facing critical gaps.

---

## 📜 License & Acknowledgments
MIT License &copy; 2026 **GapFinder AI Team**. Developed for the Advanced AI Hackathon.
GitHub Repository: [https://github.com/Madhumitha906/GapFinder-AI.git](https://github.com/Madhumitha906/GapFinder-AI.git)
