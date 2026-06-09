export interface KanaItem {
  kana: string;
  romaji: string;
}

export interface CardGridProps {
  isLoading: boolean;
  data: any[]
}

export interface KanjiItems {
  kun_readings: string;
  literal: string;
  meaning_en: string;
  on_readings: string;
  nanori_readings?: string;
  jlpt?: string;
}

export interface VocabItems {
  id: number;
  word: string;
  reading: string;
  meaning_ch: string;
  jlpt_level_1?: string | null;
  pos?: string | null;
}