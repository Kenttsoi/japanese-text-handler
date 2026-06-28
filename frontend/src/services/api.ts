const API_URL = import.meta.env.VITE_API_URL || '/api';

export const convertJapaneseText = async (text: string) => {
    try {
        const response = await fetch(`${API_URL}/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        if (!response.ok) {
            throw new Error('API request failed');
        }
        return await response.json();
    } catch (err) {
        console.error('[FRONTEND ERROR]', err);
        throw err;
    }
}

export const annotateTextSimple = async (text: string) => {
    try {
        const response = await fetch(`${API_URL}/annotate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        if (!response.ok) {
            throw new Error('API request failed');
        }
        return await response.json();
    } catch (error) {
        console.error("[FRONT ERROR] ", error);
        throw error;
    }
}

export const annotateText = async (text: string) => {
    try {
        const response = await fetch(`${API_URL}/annotate2`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        if (!response.ok) {
            throw new Error('API request failed');
        }
        return await response.json();
    } catch (error) {
        console.error("[FRONT ERROR] ", error);
        throw error;
    }
}

export const annotateSample = async (text: string) => {
    try {
        const response = await fetch(`${API_URL}/annotateSample`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        if (!response.ok) {
            throw new Error('API request failed');
        }
        return await response.json();
    } catch (error) {
        console.error("[FRONT ERROR] ", error);
        throw error;
    }
}

export const fetchFirstKanji = async (signal?: AbortSignal) => {
    try {
        const response = await fetch(`${API_URL}/kanji/first-six`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal
        });
        if (!response.ok) {
            throw new Error('API request failed');
        }
        return await response.json();
    } catch (err) {
        console.error("[FRONT ERROR] ", err);
        throw err;
    }
}

export const searchKanji = async (kanjiQuery: string, signal?: AbortSignal) => {
    try {
        const response = await fetch(`${API_URL}/kanji/search?q=${encodeURIComponent(kanjiQuery.trim())}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal
        });
        if (!response.ok) {
            throw new Error('API request failed');
        }
        return await response.json();
    } catch (err) {
        console.error("[FRONT ERROR] ", err);
        throw err;
    }
}