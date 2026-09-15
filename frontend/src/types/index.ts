export interface ApiResponse<T = unknown> {
  success: boolean;
  code: ApiErrorCode | string;
  result: T | null;
  message: string | null;
  timestamp: number;
}

export type ApiErrorCode =
  | 'SUCCESS'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'INTERNAL_SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export interface KanjiAnnotatedDictItem {
  original: string;
  hiragana: string;
  katakana: string;
  kanji_breakdown: string[];
  word_type: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface KanaItem {
  kana: string;
  romaji: string;
}

export interface CardGridProps {
  isLoading: boolean;
  data: any[];
}
export interface KanjiItems {
  kun_readings: string;
  literal: string;
  meaning_en: string;
  on_readings: string;
  nanori_readings?: string;
  jlpt?: string;
}

export interface VocabAPIResult {
  data: VocabItems[];
  total: number;
}

export interface KanjiAPIResult {
  data: KanjiItems[];
  total: number;
}

export interface VocabItems {
  id: number;
  word: string;
  reading: string;
  meaning_ch: string;
  jlpt_level_1?: string | null;
  pos?: string | null;
}

export type CardType = "vocab" | "kanji";

interface BaseModalProps {
  opened: boolean;
  onClose: () => void;
  query: string;
  total: number;
}

export interface VocabModalProps extends BaseModalProps {
  type: 'vocab';
  starredIds: number[];
  onToggleStar: (id: number) => void
}

export interface KanjiModalProps extends BaseModalProps {
  type: 'kanji';
  starredIds?: number[];
  onToggleStar?: (id: number) => void;
}

export type SharedModalProps = VocabModalProps | KanjiModalProps;

export type SharedModalConfig = Omit<SharedModalProps, 'onClose' | 'opened'>;