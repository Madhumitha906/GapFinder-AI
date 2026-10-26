# GapFinder AI 🧠⚡
> **Grounded Knowledge Gap Diagnostic & Adaptive Personalized Revision Engine for Students & Professors**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![RAG](https://img.shields.io/badge/RAG-Zero_Hallucination-emerald)](#6-system-architecture--rag-pipeline-overview)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_%2F_Supabase_pgvector-336791?logo=postgresql)](#9-environment-variables--databasesupabase-setup)
[![Demo](https://img.shields.io/badge/Demo_Access-Preloaded-amber)](#11-demo-login-credentials-for-evaluators)

---

## 1. Project Title & Overview

**GapFinder AI** is an intelligent academic diagnostic platform that deconstructs a student’s syllabus, textbook chapters, lecture notes, and past examination papers to pinpoint precise knowledge gaps and construct a dynamic, time-budgeted revision plan.

While conventional study tools passively wait for the student to ask questions, GapFinder AI proactively administers source-grounded diagnostic quizzes, categorizes topics into **Weak**, **Medium**, and **Strong** tiers, isolates specific cognitive failure modes, and equips professors with fine-grained topic mastery analytics across an entire class.

---

## 2. Problem Statement & Objectives

### The Problem
Before exams, students spend over 60% of their revision time reviewing familiar topics where they feel comfortable, while critical syllabus gaps remain completely untouched until exam day. Traditional AI study applications act as generic "chatbots" that require students to already know what they do not understand. **A student cannot ask about a gap they don’t know they have.**

Furthermore, professors lack real-time visibility into which syllabus topics are causing systemic confusion before midterms and finals.

### Objectives
1. **Automated Topic Mapping**: Extract hierarchical knowledge trees with Bloom’s taxonomy levels and syllabus weightages.
2. **Grounded Assessment**: Generate diagnostic questions tied strictly to uploaded course passages with verifiable citations.
3. **Evidence-Based Gap Analysis**: Classify topics by comprehension score and detect cognitive root causes (*Recall Failure*, *Conceptual Misunderstanding*, *Application / Formula Slip*).
4. **Time-Budgeted Adaptive Revision**: Formulate daily study schedules tailored to available study days and hours.
5. **Class-Level Professor Analytics**: Provide educators with real-time class averages, performance tier distributions, and curriculum blindspot alerts.

---

## 3. Key Features

- **Centered Authentication Gateway**: Clean, focused first-screen sign-in card with 1-click evaluator logins and role switching.
- **Dedicated Professor & Educator Portal**:
  - *Which subject the teacher teaches:* Dynamic course switcher for CS201 (OS), CS202 (DBMS), and CS301 (ML).
  - *How many students are signed in:* Real-time active signed-in counter (e.g., 28 / 30 enrolled — 93.3% participation).
  - *Total students' overall performance:* Class average, cohort performance tier breakdown, and curriculum topic mastery progress bars.
  - *Individual student performances:* Detailed student roster, weakest/strongest topic detection, cognitive error classifications, and 1-click gap report drilldown inspector.
- **Student Diagnostic & Revision Workspace**:
  - *Topic Map:* Visual curriculum hierarchy with Bloom cognitive tags.
  - *Diagnostic Quiz Engine:* Source-grounded questions with citations, distractor explanations, and metacognitive confidence markers.
  - *Gap Report:* Instant diagnosis of weak, medium, and strong topics with root causes.
  - *Revision Planner:* Dynamic Knapsack-optimized daily schedules (24h Cram, 3-Day Sprint, 7-Day Thorough, 14-Day Mastery).
  - *Explain-This-Topic RAG Assistant:* Conversational tutor quoting exact textbook chunks with zero hallucination.
  - *Progress Dashboard:* Attempt history and score trajectory over time.
- **Interactive Database Studio**: Built-in inspector for PostgreSQL relational tables and live `pgvector` cosine similarity vector searches.

---

## 4. Technology Stack

| Layer | Technologies Used | Verification in Codebase |
|---|---|---|
| **Frontend Framework** | Next.js 14.2 (App Router), React 18 | [`src/app/page.tsx`](file:///d:/GapFinder%20AI/src/app/page.tsx), [`src/app/layout.tsx`](file:///d:/GapFinder%20AI/src/app/layout.tsx) |
| **Language & Typings** | TypeScript 5.6 | [`src/types/index.ts`](file:///d:/GapFinder%20AI/src/types/index.ts) |
| **Styling & UI** | Tailwind CSS 3.4, Lucide React, Canvas Confetti | [`tailwind.config.ts`](file:///d:/GapFinder%20AI/tailwind.config.ts), [`src/app/globals.css`](file:///d:/GapFinder%20AI/src/app/globals.css) |
| **Authentication** | NextAuth.js & Client Auth Provider | [`src/lib/auth.ts`](file:///d:/GapFinder%20AI/src/lib/auth.ts), [`src/components/AuthLandingView.tsx`](file:///d:/GapFinder%20AI/src/components/AuthLandingView.tsx) |
| **Database & Vector Store** | PostgreSQL, Supabase, `pgvector` | [`supabase/schema.sql`](file:///d:/GapFinder%20AI/supabase/schema.sql), [`src/lib/supabase.ts`](file:///d:/GapFinder%20AI/src/lib/supabase.ts) |
| **RAG & Search Engine** | BM25 + Cosine Inverted Term Frequency Index | [`src/lib/rag-engine.ts`](file:///d:/GapFinder%20AI/src/lib/rag-engine.ts) |
| **AI LLM Layer** | Google Gemini API (Optional live enhancement) | [`src/app/api/ai/chat/route.ts`](file:///d:/GapFinder%20AI/src/app/api/ai/chat/route.ts) |

---

## 5. User Workflows

### Student Workflow
1. **Login & Course Selection**: Log in using your student account. Your view automatically filters to your enrolled subjects (e.g., Alex Chen sees CS201 and CS202; Priya Sharma sees CS201 and CS301).
2. **Review Topic Map**: Inspect curriculum units, exam weightages, and prerequisites.
3. **Take Diagnostic Quiz**: Complete grounded multiple-choice questions while recording confidence levels (*Confident*, *Somewhat Confident*, *Guessing*).
4. **Analyze Gap Report**: View topics classified as Weak (<50%), Medium (50–75%), or Strong (>75%) with clear cognitive diagnoses.
5. **Execute Revision Plan**: Follow an adaptive daily schedule with interactive checklists and source citations.
6. **Consult Explain Assistant**: Ask concept questions answered strictly using uploaded textbook passages.

### Professor Workflow
1. **Login to Educator Portal**: Sign in as Dr. Sarah Williams (`prof.sarah@gapfinder.demo`).
2. **Select Active Subject**: Switch between taught courses (*CS201 Operating Systems*, *CS202 Database Systems*, *CS301 Machine Learning*).
3. **Monitor Class Participation**: View live signed-in counters (e.g., 28 signed in out of 30 enrolled).
4. **Inspect Cohort Analytics**: Review overall class diagnostic average (68%), tier distributions (High Distinction, Proficient, Needs Attention, Critical Gaps), and AI blindspot alerts.
5. **Drill Down into Students**: Filter students by score tier, inspect individual gap reports, and send targeted remedial revision nudges.
6. **Educator Student View Preview**: Click "Student View" in the header to experience exactly what students see.

---

## 6. System Architecture & RAG Pipeline Overview

```
+---------------------------------------------------------------------------------------------------------+
|                                        GapFinder AI Architecture                                        |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|  [First Screen: Centered Authentication Gateway]                                                        |
|   └── Role Dispatcher ──┬────────────────────────────────────────────────────────┐                      |
|                         ▼ (Role = Professor)                                     ▼ (Role = Student)     |
|  [Professor Portal (TeacherDashboardView)]              [Student Engine (TopicMap, Quiz, GapReport)]    |
|   ├── Subject Selection & Custom Course Creation         ├── Grounded Diagnostic Quiz with Citations    |
|   ├── Signed-In Student Counter (28/30 active)           ├── Cognitive Gap Report (Weak/Medium/Strong)  |
|   ├── Class Overall Average & Tiers                      ├── Time-Budgeted Revision Schedule            |
|   └── Individual Student Roster & Drilldown Drawer       └── Explain-This-Topic RAG Chatbot             |
|                                                                                                         |
|                                         │                                                               |
|                                         ▼                                                               |
|  [Hybrid RAG & Vector Engine (Next.js API + PostgreSQL / Supabase pgvector)]                             |
|   ├── Semantic Boundary Partitioning (~650 chars, 100 char overlap)                                     |
|   ├── 1536-dimensional Vector Embeddings & Inverted BM25 Search Index                                   |
|   └── Verifiable Citation Attributions (docTitle, section, excerpt)                                     |
+---------------------------------------------------------------------------------------------------------+
```

### RAG Pipeline Specifications
- **Chunking**: Partitions documents on logical section headers (`#`, `Chapter`, `Section`, `Problem`) with **650 characters** target size and **100 characters** overlap.
- **Retrieval**: Hybrid scoring integrating BM25 term weighting, inverse document frequency (IDF), and cosine distance.
- **Zero Hallucination**: Every generated question and explanation cites its specific document, chapter, and text passage.

---

## 7. Project Directory Structure

```
GapFinder AI/
├── docs/
│   ├── ARCHITECTURE.md          # Complete system design & Mermaid component diagram
│   ├── SETUP.md                 # Detailed installation & configuration instructions
│   ├── SECURITY.md              # Secrets management, privacy, & demo account policies
│   └── CONTRIBUTING.md          # Contribution guidelines & coding conventions
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/chat/route.ts       # Grounded RAG chat endpoint
│   │   │   ├── ai/question/route.ts   # Diagnostic question generator
│   │   │   ├── auth/[...nextauth]/route.ts # NextAuth authentication handler
│   │   │   ├── db/status/route.ts     # Supabase / PostgreSQL health check
│   │   │   ├── diagnose/route.ts      # Gap report & revision plan engine
│   │   │   └── rag/search/route.ts    # Hybrid chunk search endpoint
│   │   ├── globals.css          # Tailwind CSS styles and custom badges
│   │   ├── layout.tsx           # Root HTML layout and metadata
│   │   └── page.tsx             # Main view router & role-based switchboard
│   ├── components/
│   │   ├── AuthLandingView.tsx        # Centered first screen Sign In / Sign Up
│   │   ├── DatabaseStudioView.tsx     # Supabase / PostgreSQL pgvector Studio
│   │   ├── DiagnosticQuizView.tsx     # Source-grounded diagnostic quiz
│   │   ├── ExplainAssistantView.tsx   # Grounded RAG conversational tutor
│   │   ├── GapReportView.tsx          # Weak/Medium/Strong diagnostic matrix
│   │   ├── MaterialUploadView.tsx     # Syllabus/textbook/notes upload & chunker
│   │   ├── Navbar.tsx                 # Navigation header with enrolled course selector
│   │   ├── ProgressDashboardView.tsx  # Historical mastery trajectory
│   │   ├── RevisionPlanView.tsx       # Time-budgeted interactive study schedule
│   │   ├── TeacherDashboardView.tsx   # Professor subject & student analytics portal
│   │   └── TopicMapView.tsx           # Knowledge graph & syllabus weightage tree
│   ├── lib/
│   │   ├── auth.ts              # NextAuth configuration and credentials provider
│   │   ├── rag-engine.ts        # Chunking, search, gap diagnosis, & knapsack planner
│   │   ├── sample-data.ts       # Preloaded university courses, chunks, & teacher roster
│   │   ├── storage.ts           # Client persistence layer & preseeded accounts
│   │   └── supabase.ts          # Supabase client initializer
│   └── types/
│       └── index.ts             # Strict TypeScript data contracts & interfaces
├── supabase/
│   └── schema.sql               # PostgreSQL schema & pgvector search function
├── .env.example                 # Safe environment variable template
├── .gitignore                   # Comprehensive secret and build exclusion rules
├── package.json                 # Project dependencies & build scripts
├── tailwind.config.ts           # Tailwind theme configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

---

## 8. Installation & Prerequisites

### Prerequisites
- **Node.js**: `v18.17.0+` or `v20.x` or `v22.x`
- **npm**: `v10+`
- **Git**: `v2.30+`

### Installation Steps
```bash
# 1. Clone the repository
git clone https://github.com/Madhumitha906/GapFinder-AI.git
cd GapFinder-AI

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 9. Environment Variables & Database/Supabase Setup

GapFinder AI runs **completely offline out-of-the-box** using preloaded academic data and client storage.

To connect live Supabase / PostgreSQL and Google Gemini AI, copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### PostgreSQL / Supabase Setup
1. Create a Supabase project at [Supabase.com](https://supabase.com).
2. Execute the SQL script in [`supabase/schema.sql`](file:///d:/GapFinder%20AI/supabase/schema.sql) using the Supabase SQL Editor.
3. Configure your keys in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-publishable-key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...
   ```

---

## 10. Commands to Run, Test, and Build

| Command | Action |
|---|---|
| `npm run dev` | Start development server on `http://localhost:3000` |
| `npm run build` | Compile TypeScript and generate production build |
| `npm run start` | Start production server on `http://localhost:3000` |
| `npm run lint` | Run ESLint static code quality checks |

---

## 11. Demo Login Credentials for Evaluators

The following preconfigured demo accounts are provided for project evaluation:

| Role | Name | Email | Password | Course Access |
|---|---|---|---|---|
| **Professor** | Dr. Sarah Williams | `prof.sarah@gapfinder.demo` | `Professor@123` | **CS201** Operating Systems, **CS202** Database Management Systems, **CS301** Machine Learning Fundamentals |
| **Student** | Alex Chen | `alex.chen@gapfinder.demo` | `Student@123` | **CS201** Operating Systems and **CS202** Database Management Systems |
| **Student** | Priya Sharma | `priya.sharma@gapfinder.demo` | `Student@123` | **CS201** Operating Systems and **CS301** Machine Learning Fundamentals |

> [!NOTE]
> **Hackathon Judge Quick Access**: You may also click the **"1-Click Hackathon Judge Access"** button on the first screen to evaluate all courses simultaneously with `judge@gapfinder.ai`.

### Step-by-Step Evaluator Instructions
1. **Start the application** using `npm run dev` or `npm run start`.
2. **Open the local application URL**: [http://localhost:3000](http://localhost:3000).
3. **Choose Student or Professor login**:
   - Click the **"1-Click Login &rarr;"** button on any of the evaluator cards for instant access, OR
   - Click **"Fill Form"** to test manual credential verification with the email and password above.
4. **Explore the respective dashboard**:
   - **As Professor (Dr. Sarah Williams)**: Inspect taught subjects, view the 28 signed-in students counter, check class averages and distribution tiers, view topic mastery bars, drill down into individual student gap reports, and test the "Student View" preview.
   - **As Student (Alex Chen or Priya Sharma)**: Inspect the Topic Map, take a Diagnostic Quiz with source citations, view the categorized Gap Report, review your personalized Revision Plan, and query the Explain Assistant.

> [!WARNING]
> **DEMO USE ONLY**: These accounts contain synthetic demonstration data for evaluation purposes. Do not enter personal or confidential information. Never use these demo passwords on real external accounts.

---

## 12. Screenshots & Visual Interface

```
+-----------------------------------------------------------------------------------+
|  [Screenshot Placeholder: Centered Authentication Gateway]                        |
|  Clean, distraction-free first page with 1-click evaluator demo cards             |
|  (Dr. Sarah Williams, Alex Chen, Priya Sharma, and Hackathon Judge Access).        |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
|  [Screenshot Placeholder: Professor & Educator Dashboard]                         |
|  Subject switcher (CS201, CS202, CS301), 28/30 active students counter,           |
|  class mastery bars, cohort distribution tiers, and student drilldown table.      |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
|  [Screenshot Placeholder: Grounded Diagnostic Quiz & Citations]                   |
|  Source-grounded questions displaying textbook chapter citations,                  |
|  misconception explanations, and confidence markers (Confident / Guessing).       |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
|  [Screenshot Placeholder: Topic Gap Report & Adaptive Revision Planner]           |
|  Weak (<50%), Medium (50-75%), and Strong (>75%) classification with              |
|  cognitive root causes and Knapsack-budgeted daily revision schedule.            |
+-----------------------------------------------------------------------------------+
```

---

## 13. Testing Instructions

1. **Verify Professor Portal**:
   - Log in as Dr. Sarah Williams (`prof.sarah@gapfinder.demo` / `Professor@123`).
   - Switch between **CS201**, **CS202**, and **CS301** using the subject cards.
   - Verify the student counter shows **28 active signed in / 30 enrolled**.
   - In the student roster, click **"Inspect"** on Alex Chen or Priya Sharma to open the individual diagnostic drawer.
2. **Verify Student Course Enrollment Filtering**:
   - Sign out and log in as **Alex Chen** (`alex.chen@gapfinder.demo` / `Student@123`).
   - Check the course dropdown in the header: verify only **CS201** and **CS202** are accessible.
   - Sign out and log in as **Priya Sharma** (`priya.sharma@gapfinder.demo` / `Student@123`).
   - Verify only **CS201** and **CS301** are accessible.
3. **Verify Diagnostic Quiz & Gap Report**:
   - Start a quiz, select answers, choose a confidence level, and submit.
   - Confirm that the Gap Report immediately recalculates with updated Weak/Medium/Strong badges.
4. **Verify Database Studio**:
   - Click the **"PostgreSQL: pgvector Connected"** badge in the header.
   - Inspect table schemas and run a live vector similarity query test.

---

## 14. Security & Privacy Notes

- **Secrets Isolation**: No API keys or passwords are committed to Git. Local overrides use `.env.local`, which is blocked by `.gitignore`.
- **RBAC**: NextAuth JWT tokens enforce role authorization between professors, students, and evaluators.
- **RAG Grounding**: Responses are bounded to retrieved academic text chunks with exact citations.
- Detailed specifications are available in [`docs/SECURITY.md`](file:///d:/GapFinder%20AI/docs/SECURITY.md).

---

## 15. Known Limitations & Future Enhancements

### Known Limitations
1. Highly specialized mathematical formulas formatted in complex LaTeX require standard textual representations for optimal semantic indexing.
2. Scanned image-only PDFs require an OCR preprocessing pipeline prior to chunking.
3. Client browser persistence is utilized for zero-configuration evaluation; multi-tenant enterprise deployments link directly to Supabase PostgreSQL.

### Future Enhancements
- **Automated Spaced Repetition (SuperMemo SM-2)**: Scheduled push notifications right before memory decay occurs.
- **LMS Gradebook Integration**: Two-way gradebook synchronization with Canvas, Blackboard, and Google Classroom via LTI 1.3.
- **Cross-Lingual Embeddings**: Support for regional languages in national exam preparation.

---

## 16. Contribution Guidelines

Contributions are welcome! Please read [`docs/CONTRIBUTING.md`](file:///d:/GapFinder%20AI/docs/CONTRIBUTING.md) for coding standards, branching conventions, and pull request procedures.

---

## 17. License Information

This project is licensed under the **MIT License**.  
&copy; 2026 **GapFinder AI Team**. Developed for academic evaluation, project demonstration, and recruitment review.

GitHub Repository: **[https://github.com/Madhumitha906/GapFinder-AI.git](https://github.com/Madhumitha906/GapFinder-AI.git)**
