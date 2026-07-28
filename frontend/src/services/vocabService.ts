import { supabase } from '../utils/supabaseClient';

export const vocabService = {
  async getAllVocab() {
    const { data, count, error } = await supabase.from('word_entries').select('*', { count: 'exact' }).order('id', { ascending: true }).limit(9);
    if (error) throw error;
    return { data, count };
  },

  async searchVocab(query: string, signal?: AbortSignal) {
    const queryTerm = `${query}:*`;
    const { data, error } = await supabase
      .from('word_entries')
      .select('*')
      .textSearch('fts_vector', queryTerm.trim(), {
        config: 'simple'
      })
      .abortSignal(signal || new AbortController().signal);
    if (error) throw error;
    return data || [];
  }
}