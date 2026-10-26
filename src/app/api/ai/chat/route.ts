import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchRelevantChunks, synthesizeRAGAnswer } from '@/lib/rag-engine';
import { SAMPLE_CHUNKS } from '@/lib/sample-data';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages, customChunks, topicFilter } = await req.json();

    const lastMessage = messages[messages.length - 1];
    const query = lastMessage ? lastMessage.content : '';

    const chunks = customChunks && Array.isArray(customChunks) ? customChunks : SAMPLE_CHUNKS;
    const topHits = searchRelevantChunks(query, chunks, 3);

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const context = topHits
          .map(h => `[Source: ${h.chunk.docTitle} - ${h.chunk.section}]:\n${h.chunk.text}`)
          .join('\n\n');

        const prompt = `You are GapFinder AI's Grounded Revision Assistant.
Answer the student's question STRICTLY using the retrieved course excerpts below.
Every factual claim must cite the specific section. Do not hallucinate external facts.

Retrieved Course Context:
${context}

Student Question:
${query}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({
          role: 'assistant',
          content: text,
          citations: topHits.map(h => ({
            docTitle: h.chunk.docTitle,
            section: h.chunk.section,
            snippet: h.chunk.text.slice(0, 160) + '...',
            relevanceScore: h.score
          })),
          provider: 'Gemini (Live via Vercel AI Layer)'
        });
      } catch (err: any) {
        console.warn('Gemini API call failed, using deterministic RAG synthesis:', err.message);
      }
    }

    // Deterministic High-Fidelity RAG fallback
    const { answer, citations } = synthesizeRAGAnswer(query, chunks);

    return NextResponse.json({
      role: 'assistant',
      content: answer,
      citations,
      provider: 'Deterministic Hybrid RAG Engine'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI request failed' }, { status: 500 });
  }
}
