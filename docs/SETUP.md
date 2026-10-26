# GapFinder AI — Setup & Installation Guide

This guide covers complete local setup, environment configuration, database initialization, and evaluator testing for **GapFinder AI**.

---

## 1. Prerequisites

Before installing, ensure your environment meets the following requirements:

- **Node.js**: `v18.17.0+` or `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm v10+` (included with Node.js)
- **Version Control**: `git v2.30+`
- **Supported Operating Systems**: Windows 10/11, macOS, Linux (Ubuntu/Debian)

---

## 2. Installation & Quickstart

### Step 1: Clone the Repository
```bash
git clone https://github.com/Madhumitha906/GapFinder-AI.git
cd GapFinder-AI
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```

Open your browser to **[http://localhost:3000](http://localhost:3000)**. The application will start immediately with preloaded demonstration data!

---

## 3. Environment Variables Configuration

GapFinder AI works **100% out-of-the-box in zero-dependency evaluation mode** without needing any API keys.

If you wish to configure live Google Gemini AI calls or link to an external PostgreSQL / Supabase database, copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### Environment Variable Reference

| Variable Name | Required | Default / Safe Value | Description |
|---|---|---|---|
| `NEXTAUTH_URL` | No (Production) | `http://localhost:3000` | Canonical URL of the application |
| `NEXTAUTH_SECRET` | No (Production) | `gapfinder-super-secret-key-eval-2026-production` | Secret string used to sign JWT session cookies |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | `https://your-project.supabase.co` | URL of your Supabase project instance |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | `your-anon-public-key` | Public anonymous key for client requests |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | `your-service-role-key` | Server-side elevated key (Never commit to Git!) |
| `POSTGRES_URL` | Optional | `postgresql://postgres:...` | Direct PostgreSQL connection string |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Optional | `AIzaSy...` | Google Gemini API key for live generative responses |

> **Security Note**: Never commit `.env.local` or any private service keys to Git. The repository's `.gitignore` automatically blocks `.env*.local` and `.env`.

---

## 4. Evaluator Demo Account Initialization

GapFinder AI comes preconfigured with three dedicated demo accounts ready for evaluation:

| Role | Full Name | Email Address | Password | Enrolled Course Access |
|---|---|---|---|---|
| **Professor** | Dr. Sarah Williams | `prof.sarah@gapfinder.demo` | `Professor@123` | CS201 (OS), CS202 (DBMS), CS301 (ML) |
| **Student** | Alex Chen | `alex.chen@gapfinder.demo` | `Student@123` | CS201 (OS) and CS202 (DBMS) |
| **Student** | Priya Sharma | `priya.sharma@gapfinder.demo` | `Student@123` | CS201 (OS) and CS301 (ML Fundamentals) |

### How Demo Accounts are Activated
1. **Preseeded Browser Storage**: These three accounts are preseeded into the client persistence layer (`src/lib/storage.ts`) and configured in NextAuth (`src/lib/auth.ts`).
2. **Instant 1-Click Cards**: On the first screen ([http://localhost:3000](http://localhost:3000)), evaluators can click the **"1-Click Login &rarr;"** button on any of the three cards to authenticate immediately.
3. **Manual Form Submission**: Alternatively, click **"Fill Form"** or type the email and password directly into the sign-in inputs to verify form submission and password validation.
4. **New Account Registration**: Evaluators can also click the **"Sign Up"** tab to register custom student or teacher accounts with any desired subject goal.

---

## 5. PostgreSQL & Supabase Database Setup (Optional)

If you wish to run GapFinder AI with a live Supabase backend:

1. Create a free project on [Supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Copy and paste the contents of [`supabase/schema.sql`](file:///d:/GapFinder%20AI/supabase/schema.sql) into the editor.
4. Click **Run**. The script will:
   - Enable the `vector` extension (`pgvector`).
   - Create tables: `courses`, `syllabus_topics`, `documents`, `document_chunks`, `diagnostic_quizzes`, `quiz_attempts`, `gap_reports`, `revision_plans`, and `teacher_cohort_analytics`.
   - Build an `ivfflat` index on `document_chunks.embedding (vector_cosine_ops)`.
   - Create the stored procedure `match_document_chunks` for fast vector similarity search.
5. In your `.env.local`, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 6. Build and Verification Commands

### Lint & Typecheck
```bash
npm run build
```
This runs the full TypeScript compiler check and Next.js static page generation.

### Run Production Server
```bash
npm run build
npm run start
```
Starts the optimized production server on `http://localhost:3000`.

---

## 7. Troubleshooting

### Port 3000 Already in Use
If port 3000 is occupied by another process:
```bash
# Run on an alternate port
npm run dev -- -p 3001
# Or for production:
npm run start -- -p 3001
```

### Windows PowerShell Script Execution Policy
If running `npm` produces a script execution error on Windows PowerShell:
```powershell
# Use npm.cmd instead
npm.cmd run dev
```

### Reset Demo Workspace
To clear any modified quiz attempts or added topics and return the browser to pristine demo state:
1. Open the top navigation bar inside the app.
2. Click the **"Reset Demo"** button.
3. Or open browser DevTools &rarr; Application &rarr; Local Storage &rarr; Clear.
