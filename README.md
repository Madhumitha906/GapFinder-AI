# GapFinder AI 🧠⚡
> **Grounded Knowledge Gap Diagnostic & Adaptive Personalized Revision Engine**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![RAG](https://img.shields.io/badge/RAG-Zero_Hallucination-emerald)](#rag-pipeline)
[![Demo](https://img.shields.io/badge/Demo_Access-Preloaded-amber)](#judge-demo-credentials)

---

## 🎯 Executive Overview & Problem Statement

### The Problem
Traditional AI study tools suffer from a fatal passive flaw: **they wait for the student to ask a question**. 
However, **a student cannot ask about a gap they don’t know they have**. Before high-stakes exams, students spend over 60% of their revision time reviewing familiar topics where they feel comfortable, while critical syllabus gaps remain completely untouched until exam day.

### The Solution: GapFinder AI
GapFinder AI reverses this paradigm. Instead of another generic "chat with your PDF" tool, GapFinder AI:
1. **Parses the Student’s Entire Academic Corpus**: Syllabus weightages, textbook chapters, lecture notes, and past question papers.
2. **Builds a Structured Topic Map**: Deconstructs the curriculum into modules, Bloom taxonomy cognitive levels, and exam mark weightages.
3. **Administers Grounded Diagnostic Quizzes**: Tests the student with questions generated *strictly* from retrieved material with verifiable source citations.
4. **Delivers an Evidence-Based Gap Report**: Categorizes topics into **Weak (<50%)**, **Medium (50–75%)**, and **Strong (>75%)**, detailing the exact root cause misconception (e.g. *Conceptual Confusion vs Formula Slip vs Recall Failure*).
5. **Synthesizes an Adaptive Prioritized Revision Plan**: Prioritizes high-weight weak topics first, budgeted by the student’s available days and daily study hours.
6. **Updates Dynamically**: As the student retakes quizzes or ticks off revision milestones, the Gap Report and Revision Plan recalibrate automatically.

---

## 🏆 Judge Demo Credentials & Instant Testing

To allow judges to test the full end-to-end diagnosis immediately without any manual file uploads or API keys, **GapFinder AI comes preloaded with an accredited university course**:

* **Preloaded Course**: `CS301: Operating Systems & System Architecture`
* **Demo User**: `judge@gapfinder.ai` / `demo123456`
* **Preloaded Documents**:
  1. *CS301 Official Syllabus & Weightage Table* (Unit 1: 18%, Unit 2: 42%, Unit 3: 40%)
  2. *Operating Systems Principles (8th Ed) - Silberschatz & Galvin* (CPU Scheduling, Semaphores, Deadlocks, Paging, Page Replacement)
  3. *University Midterm Exam & Model Solutions* (Concurrency bugs, TLB Effective Access Time derivations)
* **Preloaded Topic Knowledge Graph**: 5 core modules with Bloom cognitive levels.
* **Preloaded Diagnostic Questions**: 5 grounded assessment questions with exact source citations and misconception explanations.

---

## 🏗️ Technical Architecture & System Design

```
+-----------------------------------------------------------------------------------+
|                               GapFinder AI Architecture                            |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [Student Ingestion]                                                              |
|   ├── Official Syllabus (Defines topic hierarchy, weightages, learning goals)     |
|   ├── Textbook Chapters & Notes (Provides domain depth & invariant definitions)   |
|   └── Past Examination Papers (Provides real test problems & model solutions)     |
|                                                                                   |
|                                         │                                         |
|                                         ▼                                         |
|  [RAG Ingestion & Chunking Engine]                                                |
|   ├── Semantic Boundary Partitioning (~650 chars with 100 char overlap)           |
|   ├── Keyword & Section Heading Extraction                                        |
|   └── Vector Indexing & Inverted Index (BM25 + Cosine Term Frequency)             |
|                                                                                   |
|                                         │                                         |
|                     ┌───────────────────┴───────────────────┐                     |
|                     ▼                                       ▼                     |
|  [Diagnostic Question Generator]                 [Explain RAG Assistant]          |
|   ├── Grounded chunk retrieval                     ├── Multi-chunk synthesis      |
|   ├── Misconception distractor formulation         ├── Exact citation drawer      |
|   └── Verifiable source citations                  └── Zero-hallucination guard   |
|                     │                                                             |
|                     ▼                                                             |
|  [Student Assessment & Metacognitive Taker]                                       |
|   ├── Timed answer selection                                                      |
|   └── Confidence markers: Confident / Educated Guess / Blind Guess                |
|                     │                                                             |
|                     ▼                                                             |
|  [Gap Analysis Diagnostic Matrix]                                                 |
|   ├── Accuracy Score per Syllabus Node                                            |
|   ├── Cognitive Gap Classification: Recall vs Conceptual vs Formula Slip          |
|   └── Severity Rating: WEAK (Red) | MEDIUM (Amber) | STRONG (Green)               |
|                     │                                                             |
|                     ▼                                                             |
|  [Adaptive Time-Budgeted Revision Planner]                                        |
|   ├── Knapsack Priority Queue: (Gap Severity * Syllabus Weightage)                |
|   ├── Time Horizon: 24h Cram | 3-Day Sprint | 7-Day Deep | 14-Day Mastery         |
|   └── Interactive Dynamic Checklist with Markdown Schedule Export                 |
+-----------------------------------------------------------------------------------+
```

---

## 🔍 The RAG Pipeline (Chunking, Embedding, Retrieval)

### 1. Chunking Strategy
- Documents are split into semantic chunks adhering to logical headers (`#`, `Chapter`, `Unit`, `Section`, `Problem`).
- Target chunk size: **650 characters** with an overlap of **100 characters** to ensure uninterrupted contextual boundaries across formulas and definitions.
- Metadata is attached to every chunk: `docId`, `docTitle`, `docType`, `section`, `tokenCount`, and extracted domain `keywords`.

### 2. Retrieval & Semantic Similarity
- Hybrid semantic search combining **BM25 term scoring**, **inverse document frequency (IDF)**, and **n-gram matching**.
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

## 💡 Clarity on AI Usage: Separation of Concerns

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
- Node.js v18+ or v20+ or v22+
- npm v10+

### 1. Clone & Install
```bash
git clone https://github.com/your-username/gapfinder-ai.git
cd gapfinder-ai
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. (Optional) Configure Gemini API Key
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
│   │   │   ├── rag/search/route.ts      # REST API for semantic chunk search
│   │   │   └── diagnose/route.ts        # REST API for gap reports & revision plans
│   │   ├── globals.css                  # Tailwind styles & gradients
│   │   ├── layout.tsx                   # App metadata & layout wrapper
│   │   └── page.tsx                     # Main interactive single-page application
│   ├── components/
│   │   ├── Navbar.tsx                   # Top navigation, course selector, demo badge
│   │   ├── TopicMapView.tsx             # Visual topic tree with mastery badges
│   │   ├── DiagnosticQuizView.tsx       # Grounded quiz taker with citations & confidence
│   │   ├── GapReportView.tsx            # Weak/Medium/Strong diagnostics & root causes
│   │   ├── RevisionPlanView.tsx         # Time-budgeted interactive revision schedule
│   │   ├── ExplainAssistantView.tsx     # Grounded RAG chatbot with citations drawer
│   │   ├── MaterialUploadView.tsx       # PDF/Text upload, chunker, & document manager
│   │   ├── ProgressDashboardView.tsx    # Mastery trajectories & historical attempts
│   │   └── ArchitectureView.tsx         # Comprehensive system architecture & AI guide
│   ├── lib/
│   │   ├── rag-engine.ts                # Chunking, retrieval, gap diagnosis, plan planner
│   │   ├── sample-data.ts               # Preloaded CS301 syllabus, textbook notes, & past papers
│   │   └── storage.ts                   # Local persistence layer & demo state manager
│   └── types/
│       └── index.ts                     # Strict TypeScript interfaces
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🔮 Limitations & Future Roadmap

### Current Limitations
1. Complex mathematical formulas formatted in specialized LaTeX fonts require raw text expressions for semantic indexing.
2. Handwritten scanned PDFs require an OCR preprocessing step prior to chunking.
3. Client-side browser storage is utilized for instant zero-setup judge evaluation; enterprise multi-device deployments should bind to Supabase/PostgreSQL with `pgvector`.

### Future Scalability
- **Teacher Cohort Analytics**: Aggregated class heatmaps highlighting where 60%+ of students share identical misconceptions.
- **Automated Spaced Repetition (SuperMemo SM-2)**: Scheduled revision push notifications right before memory decay occurs.
- **Multi-Language Support**: Regional syllabus translations and cross-lingual embeddings for state and national examinations.
- **Direct LMS Integration**: Seamless sync with Canvas, Blackboard, and Google Classroom gradebooks.

---

## 📜 License
MIT License &copy; 2026 GapFinder AI Team. Built for the Advanced AI Hackathon.
