import { ApiResponse, VocabAPIResult, VocabItems } from '@/types';
import { supabase } from '../utils/supabaseClient';

export const vocabService = {
  async getAllVocab(): Promise<ApiResponse<VocabAPIResult>> {
    try {
      const { data, count, error } = await supabase.from('word_entries').select('*', { count: 'exact' }).order('id', { ascending: true }).limit(9);
      if (error) throw error;
      return {
        success: true,
        code: 'SUCCESS',
        result: {
          data: data || [],
          total: count || 0,
        },
        message: null,
        timestamp: Date.now(),
      }
    } catch (err: any) {
      return {
        success: false,
        code: err.code || "SUPABASE_ERROR",
        result: null,
        message: err.message || "",
        timestamp: Date.now(),
      }
    }
  },

  async searchVocab(query: string, signal?: AbortSignal, limit: number = 12, offset: number = 0): Promise<ApiResponse<VocabAPIResult>> {
    try {
      const queryTerm = `${query}:*`;
      const { data, error, count } = await supabase
        .from('word_entries')
        .select('*', { count: 'exact' })
        .textSearch('fts_vector', queryTerm.trim(), {
          config: 'simple'
        })
        .limit(limit)
        .range(offset, offset + limit - 1)
        .abortSignal(signal || new AbortController().signal);
      if (error) throw error;
      return {
        success: true,
        code: 'SUCCESS',
        result: {
          data: data || [],
          total: count || 0,
        },
        message: null,
        timestamp: Date.now(),
      }
    } catch (err: any) {
      return {
        success: false,
        code: err.code || "SUPABASE_ERROR",
        result: null,
        message: err.message || "",
        timestamp: Date.now(),
      }
    }
  }
}