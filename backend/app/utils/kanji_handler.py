import pykakasi
from unihan_etl.core import Packager, Options
from flask import current_app
from app.scripts.initiate_unihan import initiate_unihan
from app.utils.text_utils import KanaConverter

class KanjiSeparator:
    @staticmethod
    def separate_kanji(kanjis, pronunciation):
        """
        Separate kanji characters from the rest of the text.
        
        Args:
            text (str): Input text containing kanji characters.
        
        Returns:
            list: A list of kanji characters found in the text.
        """
        print('bbb', kanjis, pronunciation)
        print('bbb2', KanaConverter.katakana_to_hiragana(pronunciation))
        

        kakasi = pykakasi.kakasi()
        kakasi.setMode("J", "H")
        converter = kakasi.getConverter()
        kana_translations = []
        print(converter.do(kanjis))
        for char in kanjis:
            kana = converter.do(char)
            kana_translations.append(kana)

        return kana_translations