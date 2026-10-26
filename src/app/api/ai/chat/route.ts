import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchRelevantChunks, synthesizeRAGAnswer } from '@/lib/rag-engine';
import { SAMPLE_CHUNKS } from '@/lib/sample-data';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages, customChunks, provider = 'gemini', userApiKey } = await req.json();

    const lastMessage = messages[messages.length - 1];
    const query = lastMessage ? lastMessage.content : '';

    const chunks = customChunks && Array.isArray(customChunks) ? customChunks : SAMPLE_CHUNKS;
    const topHits = searchRelevantChunks(query, chunks, 3);

    const context = topHits
      .map(h => `[Source: ${h.chunk.docTitle} - ${h.chunk.section}]:\n${h.chunk.text}`)
      .join('\n\n');

    const systemPrompt = `You are GapFinder AI's Grounded Revision Assistant.
Answer the student's question STRICTLY using the retrieved course excerpts below.
Every factual claim must cite the specific section. Do not hallucinate external facts.

Retrieved Course Context:
${context}

Student Question:
${query}`;

    // 1. Google Gemini API
    const geminiKey = userApiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (provider === 'gemini' && geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(systemPrompt);
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
          provider: 'Google Gemini 1.5 Flash (via Vercel AI Layer)'
        });
      } catch (err: any) {
        console.warn('Gemini request failed, falling back:', err.message);
      }
    }

    // 2. Groq Cloud (Llama 3.3 70B Versatile)
    const groqKey = userApiKey || process.env.GROQ_API_KEY;
    if (provider === 'groq' && groqKey) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: 'You are GapFinder AI Grounded Assistant.' },
              { role: 'user', content: systemPrompt }
            ],
            temperature: 0.2
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.choices[0]?.message?.content || '';
          return NextResponse.json({
            role: 'assistant',
            content: text,
            citations: topHits.map(h => ({
              docTitle: h.chunk.docTitle,
              section: h.chunk.section,
              snippet: h.chunk.text.slice(0, 160) + '...',
              relevanceScore: h.score
            })),
            provider: 'Groq Llama 3.3 70B (via Vercel AI Layer)'
          });
        }
      } catch (err: any) {
        console.warn('Groq request failed, falling back:', err.message);
      }
    }

    // 3. OpenAI (GPT-4o mini)
    const openaiKey = userApiKey || process.env.OPENAI_API_KEY;
    if (provider === 'openai' && openaiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are GapFinder AI Grounded Assistant.' },
              { role: 'user', content: systemPrompt }
            ],
            temperature: 0.2
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.choices[0]?.message?.content || '';
          return NextResponse.json({
            role: 'assistant',
            content: text,
            citations: topHits.map(h => ({
              docTitle: h.chunk.docTitle,
              section: h.chunk.section,
              snippet: h.chunk.text.slice(0, 160) + '...',
              relevanceScore: h.score
            })),
            provider: 'OpenAI GPT-4o mini (via Vercel AI Layer)'
          });
        }
      } catch (err: any) {
        console.warn('OpenAI request failed, falling back:', err.message);
      }
    }

    // 4. Deterministic Grounded RAG Engine Fallback (Zero external key required)
    const { answer, citations } = synthesizeRAGAnswer(query, chunks);

    return NextResponse.json({
      role: 'assistant',
      content: answer,
      citations,
      provider: 'Deterministic Hybrid RAG Engine (Local Baseline)'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI request failed' }, { status: 500 });
  }
}
