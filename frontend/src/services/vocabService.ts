import { supabase } from '../utils/supabaseClient';

export const vocabService = {
  async getAllVocab() {
    const { data, error } = await supabase.from('word_entries').select('*').order('id', { ascending: true }).limit(9);
    if (error) throw error;
    return data;
  },

  async searchVocab(query: string, signal?: AbortSignal) {
    const { data, error } = await supabase
      .from('word_entries')
      .select('*')
      .textSearch('fts_vector', query.trim(), {
        config: 'simple'
      })
      .abortSignal(signal || new AbortController().signal);
    if (error) throw error;
    return data || [];
  }
}