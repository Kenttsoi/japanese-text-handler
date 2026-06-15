import { supabase } from '../utils/supabaseClient';

export const vocabService = {
  async getAllVocab() {
    const { data, error } = await supabase.from('word_entries').select('*').order('id', { ascending: true }).limit(9);
    if (error) throw error;
    return data;
  },

  async searchVocab(query: string) {
    const { data, error } = await supabase
      .from('word_entries')
      .select('*')
      .or(`word.ilike.%${query}%,reading.ilike.%${query}%,meaning.ilike.%${query}%`);
    if (error) throw error;
    return data || [];
  }
}