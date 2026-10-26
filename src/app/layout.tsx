import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GapFinder AI | Diagnostic Study & Personalized Revision Engine',
  description: 'AI that finds student knowledge gaps from syllabus, notes, and past papers, then generates an adaptive prioritized revision plan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen text-slate-900 bg-slate-50">
        {children}
      </body>
    </html>
  );
}
