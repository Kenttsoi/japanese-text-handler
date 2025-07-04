const API_URL = import.meta.env.VITE_API_URL || '/api';

export const annotateText = async (text: any) => {
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