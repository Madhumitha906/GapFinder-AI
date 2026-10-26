# Contributing to GapFinder AI

Thank you for your interest in contributing to **GapFinder AI**! We welcome contributions from developers, educators, and researchers.

---

## 1. Development Workflow

1. **Fork the Repository**: Create your own fork on GitHub.
2. **Clone Locally**:
   ```bash
   git clone https://github.com/your-username/GapFinder-AI.git
   cd GapFinder-AI
   ```
3. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/topic-graph-enhancement
   ```
4. **Install Dependencies**:
   ```bash
   npm install
   ```
5. **Run Locally**:
   ```bash
   npm run dev
   ```

---

## 2. Coding Standards & Conventions

- **Next.js & React**: Adhere strictly to the Next.js 14 App Router conventions. Keep client components marked with `'use client'` only where interactive state or browser hooks are required.
- **TypeScript**: All new code must be strictly typed. Do not use `any` unless absolutely necessary with an explanatory comment. Define shared data interfaces in [`src/types/index.ts`](file:///d:/GapFinder%20AI/src/types/index.ts).
- **Styling**: Use Tailwind CSS utility classes. Maintain the indigo / violet / slate palette for students, emerald / teal for educators, and amber for evaluators.
- **Documentation**: Preserve existing code comments and update [`docs/ARCHITECTURE.md`](file:///d:/GapFinder%20AI/docs/ARCHITECTURE.md) if modifying API routes or system components.

---

## 3. Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

- `feat:` A new feature or user-facing functionality
- `fix:` A bug fix or UI correction
- `docs:` Documentation additions or updates
- `style:` Formatting or cosmetic changes without code logic changes
- `refactor:` Code refactoring without changing behavior
- `test:` Adding or updating tests
- `chore:` Dependency bumps, build script changes, or repository maintenance

*Example:* `feat(teacher): add exportable PDF report for class diagnostic averages`

---

## 4. Submitting a Pull Request (PR)

1. Ensure the production build passes with zero errors:
   ```bash
   npm run build
   ```
2. Verify that no secrets or `.env.local` files are staged.
3. Push your feature branch to your fork:
   ```bash
   git push origin feature/topic-graph-enhancement
   ```
4. Open a Pull Request against the `main` branch of `Madhumitha906/GapFinder-AI`.
5. Clearly describe your changes, the rationale, and testing steps.
