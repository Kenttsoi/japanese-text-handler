from flask import current_app
from app.utils.text_utils import KanaConverter
import unicodedata

class MecabHandler:
    def __init__(self):
        self.tagger = current_app.tagger

    def annotate(self, text):
        """
        Annotate the given text using MeCab.
        separates text into characters, returns hiragana.
        :param text: str, input Japanese text
        """
        parsed = self.tagger.parse(text).splitlines()[:-1]
        result = {'result':[], 'original': [], 'hiragana': [], 'katakana': []}
        for line in parsed:
            parts = line.split('\t')
            if len(parts) < 2:
                continue
            char_type = unicodedata.name(parts[0][0], 'None')
            if 'CJK UNIFIED IDEOGRAPH' in char_type:
                hiragana = KanaConverter.katakana_to_hiragana(parts[1])
                result['result'].append(hiragana)
            else:
                result['result'].append(parts[0])
            result['original'].append(parts[0])
            result['katakana'].append(parts[1])
        return result