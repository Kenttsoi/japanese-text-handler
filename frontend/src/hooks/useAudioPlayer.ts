import { useState } from 'react';
import { fetchPronunciation } from '@/services/api';

const globalAudioCache: Record<string, string> = {};

export const useAudioPlayer = () => {
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const playFallbackSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;

      const voices = window.speechSynthesis.getVoices();
      const jpVoice = voices.find(v => v.lang.startsWith('ja'));
      if (jpVoice) utterance.voice = jpVoice;

      utterance.onend = () => setPlayingWord(null);
      utterance.onerror = () => setPlayingWord(null);

      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingWord(null);
    }
  }

  const speak = async (word: string) => {
    if (playingWord) return;
    setPlayingWord(word);

    if (globalAudioCache[word]) {
      const cachedAudio = new Audio(globalAudioCache[word]);
      cachedAudio.play()
        .then(() => { cachedAudio.onended = () => setPlayingWord(null); })
        .catch(() => {
          delete globalAudioCache[word];
          setPlayingWord(null);
          speak(word);
        });
      return;
    }

    try {
      const blob = await fetchPronunciation(word);
      const audioUrl = URL.createObjectURL(blob);

      globalAudioCache[word] = audioUrl;

      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingWord(null);
      await audio.play();

    } catch (error) {
      playFallbackSpeech(word);
    }
  }

  return {
    speak,
    playingWord,
  };
}