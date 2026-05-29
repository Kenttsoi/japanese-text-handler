import { supabase } from '../utils/supabaseClient';

export const vocabService = {
    async getAllVocab() {
        const { data, error } = await supabase.from('word_entries').select('*').order('id', { ascending: true }).limit(9);
        if (error) throw error;
        return data;
    }
}