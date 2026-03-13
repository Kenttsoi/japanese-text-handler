import jaconv
import unicodedata
class KanaConverter:
    vowel_mapping = {
        'a': 'あ',
        'i': 'い',
        'u': 'う',
        'e': 'い',
        'o': 'う',
        'A': 'あ',
        'I': 'い',
        'U': 'う',
        'E': 'い',
        'O': 'う',
    }
    
    @staticmethod
    def katakana_to_hiragana(text: str) -> str:
        """
        Convert a string from Katakana to Hiragana.

        Args:
            text (str): A string in Katakana.

        Returns:
            str: The converted string in Hiragana.
        """
        result = ""
        hiragana = jaconv.kata2hira(text)
        if len(hiragana) > 1:
            for i, char in enumerate(hiragana):
                if char == 'ー':
                    vowel = unicodedata.name(hiragana[i - 1])[-1]
                    result += KanaConverter.vowel_mapping.get(vowel, vowel)
                else:
                    result += char
        else:
            return jaconv.kata2hira(text)
        return result
    
    @staticmethod
    def romaji_to_hiragana(romaji):
        return jaconv.alphabet2kana(romaji)
    
    @staticmethod
    def hiragana_to_katakana(text):
        return jaconv.hira2kata(text)

    @staticmethod
    def is_kana(char: str) -> bool:
        if KanaConverter._is_hiragana(char):
            return True
        
        if KanaConverter._is_katakana(char):
            return True
        
        return False

    @staticmethod
    def _is_hiragana(char: str) -> bool:
        if len(char) != 1:
            return False
        return (
            '\u3040' <= char <= '\u309F' or    # Hiragana
            '\u1B000' <= char <= '\u1B0FF' or   # Kana Supplement (very rare)
            '\u1B100' <= char <= '\u1B12F'      # Kana Extended-A (very rare)
        )
    
    @staticmethod
    def _is_katakana(char: str) -> bool:
        if len(char) != 1:
            return False
        return (
            '\u30A0' <= char <= '\u30FF' or     # Katakana
            '\u31F0' <= char <= '\u31FF' or     # Katakana Phonetic Extensions
            '\uFF65' <= char <= '\uFF9F' or     # Halfwidth Katakana
            '\u1B000' <= char <= '\u1B0FF'      # also contains some katakana-like
        )
    
    @staticmethod
    def is_kanji(char: str) -> bool:
        pass