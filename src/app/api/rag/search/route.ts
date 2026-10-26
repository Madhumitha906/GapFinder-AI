import { NextRequest, NextResponse } from 'next/server';
import { searchRelevantChunks } from '@/lib/rag-engine';
import { SAMPLE_CHUNKS } from '@/lib/sample-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, customChunks, topK = 4 } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const chunks = customChunks && Array.isArray(customChunks) ? customChunks : SAMPLE_CHUNKS;
    const results = searchRelevantChunks(query, chunks, topK);

    return NextResponse.json({
      query,
      resultsCount: results.length,
      results: results.map(r => ({
        score: r.score,
        docTitle: r.chunk.docTitle,
        section: r.chunk.section,
        text: r.chunk.text,
        keywords: r.chunk.keywords
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Search failed' }, { status: 500 });
  }
}
