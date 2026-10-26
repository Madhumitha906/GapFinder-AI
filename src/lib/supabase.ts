import { createClient } from '@supabase/supabase-js';
import { DocumentChunk, SourceCitation } from '@/types';
import { searchRelevantChunks } from './rag-engine';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

// Initialize Supabase Client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabase);
};

/**
 * Hybrid Vector Search:
 * Uses Supabase pgvector RPC 'match_document_chunks' if connected,
 * otherwise transparently falls back to our high-accuracy local BM25 + cosine vector engine.
 */
export async function queryPgVectorStore(
  query: string,
  localFallbackChunks: DocumentChunk[],
  topK: number = 4
): Promise<Array<{ chunk: DocumentChunk; score: number }>> {
  if (isSupabaseConfigured() && supabase) {
    try {
      // In production with pgvector:
      const { data, error } = await supabase.rpc('match_document_chunks', {
        query_text: query,
        match_count: topK
      });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          chunk: {
            id: item.id,
            docId: item.doc_id,
            docTitle: item.doc_title,
            docType: item.doc_type,
            section: item.section,
            text: item.content,
            keywords: item.keywords || []
          },
          score: item.similarity
        }));
      }
    } catch (err) {
      console.warn('Supabase vector query failed, using hybrid fallback:', err);
    }
  }

  // Local fallback
  return searchRelevantChunks(query, localFallbackChunks, topK);
}
