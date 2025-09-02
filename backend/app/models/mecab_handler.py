from flask import current_app
from app.utils.text_utils import KanaConverter
from app.utils.kanji_handler import KanjiSeparator
import unicodedata
import pykakasi

class WordEntry:
    def __init__(self, original, hiragana, katakana, char_type=""):
        self.original = original
        self.hiragana = hiragana
        self.katakana = katakana
        self.char_type = char_type

    def to_dict(self):
        return {
            "original": self.original,
            "hiragana": self.hiragana,
            "katakana": self.katakana,
            "word_type": self._generate_char_type()
        }
    
    def _generate_char_type(self):
        if 'CJK UNIFIED IDEOGRAPH' in self.char_type:
            return 'kanji'
        elif 'HIRAGANA' in self.char_type:
            return 'hiragana'
        elif 'KATAKANA' in self.char_type:
            return 'katakana'
        else:
            return 'other'

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
        
        # Library 1: pykakasi: return list[dict], has orig, hira, kana and romaji, but no 詞性 and no english if kana
        print('--------------------------------------------------------------------------------')
        kakasi = pykakasi.kakasi()
        parsed1 = kakasi.convert(text)
        print('[001]: pykakasi', parsed1)

        # Library 2: MeCab: return all the morphological analysis results, but sometimes kanji readings are wrong
        parsed2 = self.tagger.parse(text)
        print('[002]: MeCab', parsed2)

        parsed = self.tagger.parse(text).splitlines()[:-1]
        print('[003]: MeCab Original code logic', parsed)
        result = {'result':[], 'word_type': [], 'original': [], 'hiragana': [], 'katakana': []}
        resultList = []

        # test for pykakasi
        for line in parsed1:
            print('[004]: pykakasi', line)
            if len(parsed1) < 2:
                continue
            char_type = unicodedata.name(line['orig'][0], 'None') # only accept ONE char of this method
            print('[005]: pykakasi char_type', char_type)
            wordResult = WordEntry(
                original=line['orig'],
                hiragana=line['hira'],
                katakana=line['kana'],
                char_type=char_type
            )
            print('[006]', wordResult.to_dict())
            """ if 'CJK UNIFIED IDEOGRAPH' in char_type:
            elif 'HIRAGANA' in char_type:
            elif 'KATAKANA' in char_type:
            else: """

        print('[007 result list of dicts]', resultList)
        

        for line in parsed:
            parts = line.split('\t')
            if len(parts) < 2:
                continue
            print('222', parts)
            char_type = unicodedata.name(parts[0][0], 'None')
            print('333', char_type, parts)
            if 'CJK UNIFIED IDEOGRAPH' in char_type:
                single_kanji = KanjiSeparator.separate_kanji(parts[0], parts[2])
                print('444 single kanji', single_kanji)
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