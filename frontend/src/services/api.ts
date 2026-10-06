import { ApiResponse, KanjiAnnotatedDictItem, KanjiAPIResult, KanjiItems } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const convertJapaneseText = async (text: string): Promise<ApiResponse<KanjiAnnotatedDictItem[]>> => {
    try {
        const response = await fetch(`${API_URL}/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        const data: ApiResponse<KanjiAnnotatedDictItem[]> = await response.json();
        return data;
    } catch (err) {
        return {
            success: false,
            code: "NETWORK_ERROR",
            result: null,
            message: err instanceof Error ? err.message : 'Network failure',
            timestamp: Date.now(),
        }
    }
}

export const fetchFirstKanji = async (signal?: AbortSignal): Promise<ApiResponse<KanjiItems[]>> => {
    try {
        const response = await fetch(`${API_URL}/kanji/first-six`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal
        });
        const data: ApiResponse<KanjiItems[]> = await response.json();
        return data;
    } catch (err) {
        return {
            success: false,
            code: "NETWORK_ERROR",
            result: null,
            message: err instanceof Error ? err.message : 'Network failure',
            timestamp: Date.now()
        }
    }
}

export const searchKanji = async (kanjiQuery: string, signal?: AbortSignal, limit: number = 20, offset: number = 0): Promise<ApiResponse<KanjiAPIResult>> => {
    try {
        const response = await fetch(`${API_URL}/kanji/search?q=${encodeURIComponent(kanjiQuery.trim())}&limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal
        });
        const data: ApiResponse<KanjiAPIResult> = await response.json();
        return data;
    } catch (err) {
        return {
            success: false,
            code: "NETWORK_ERROR",
            result: null,
            message: err instanceof Error ? err.message : 'Network failure',
            timestamp: Date.now()
        }
    }
}

export const fetchPronunciation = async (word: string): Promise<Blob> => {
    const response = await fetch(`${API_URL}/pronounce?text=${encodeURIComponent(word)}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch pronunciation: ${response.statusText}`);
    }

    return await response.blob();
} 