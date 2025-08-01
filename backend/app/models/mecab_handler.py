from flask import current_app
from app.utils.text_utils import KanaConverter
from app.utils.kanji_handler import KanjiSeparator
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
        """ kakasi = pykakasi.kakasi()
        kakasi.setMode("J", "H")
        kakasi.setMode("H", "a")
        converter = kakasi.getConverter()
        kanji_string = "擁する世界最大のメガシティ"
        kanji_readings = {}
        for character in kanji_string:
            kana_reading = converter.do(character)
            kanji_readings[character] = kana_reading

        for character, reading in kanji_readings.items():
            print(f"{character} is {reading}") """

        parsed = self.tagger.parse(text).splitlines()[:-1]
        result = {'result':[], 'word_type': [], 'original': [], 'hiragana': [], 'katakana': []}
        for line in parsed:
            parts = line.split('\t')
            if len(parts) < 2:
                continue
            char_type = unicodedata.name(parts[0][0], 'None')
            print('aaa', char_type, parts)
            if 'CJK UNIFIED IDEOGRAPH' in char_type:
                single_kanji = KanjiSeparator.separate_kanji(parts[0], parts[2])
                print('single kanji', single_kanji)
                hiragana = KanaConverter.katakana_to_hiragana(parts[1])
                print('hahahahahahahahaaha', hiragana)
                result['result'].append(hiragana)
                result['word_type'].append('kanji')
                result['original'].append(parts[0])
                result['katakana'].append(parts[1])
            elif 'HIRAGANA' in char_type:
                result['result'].append(parts[0])
                result['word_type'].append('hiragana')
                result['original'].append(parts[0])
                result['katakana'].append(parts[1])
            elif 'KATAKANA' in char_type:
                result['result'].append(parts[0])
                result['word_type'].append('katakana')
                result['original'].append(parts[0])
                result['katakana'].append(parts[1])
            else:
                result['result'].append(parts[0])
                result['word_type'].append('other')
                result['original'].append(parts[0])
                result['katakana'].append(parts[1])
        return result