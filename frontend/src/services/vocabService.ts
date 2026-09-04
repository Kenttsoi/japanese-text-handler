import { supabase } from '../utils/supabaseClient';

export const vocabService = {
  async getAllVocab() {
    const { data, count, error } = await supabase.from('word_entries').select('*', { count: 'exact' }).order('id', { ascending: true }).limit(9);
    if (error) throw error;
    return { data, count };
  },

  async searchVocab(query: string, signal?: AbortSignal, limit: number = 12, offset: number = 0) {
    console.log('Did I call you');
    
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
      items: data || [],
      total: count || 0
    }
  }
}