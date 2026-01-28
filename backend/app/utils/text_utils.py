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