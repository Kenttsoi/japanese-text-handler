import pykakasi
from unihan_etl.core import Packager, Options
from flask import current_app
from app.scripts.initiate_unihan import initiate_unihan
from app.utils.text_utils import KanaConverter
from app.data.kanjidic2.kanjidic2_dict import kanjidic2_dict
class KanjiSeparator:
    @staticmethod
    def separate_kanji_old(kanjis, pronunciation):
        """
        Separate kanji characters from the rest of the text.
        
        Args:
            text (str): Input text containing kanji characters.
        
        Returns:
            list: A list of kanji characters found in the text.
        """
        """ print('bbb2', KanaConverter.katakana_to_hiragana(pronunciation))
        print('[008]', KanaConverter.romaji_to_hiragana('kaku')) """

        kakasi = pykakasi.kakasi()
        kakasi.setMode("J", "H")
        converter = kakasi.getConverter()
        kana_translations = []
        print(converter.do(kanjis))
        for char in kanjis:
            kana = converter.do(char)
            kana_translations.append(kana)
        return kana_translations
    
    @staticmethod
    def separate_kanji(kanjis, pronunciations):
        print(['007 NEW separate kanji entered'], kanjis, pronunciations)
        kanjis_list = []
        pronunciations_list = []
        pos = 0
        for kanji in kanjis:
            kanjis_list.append(kanji)
            kanjiInfo = kanjidic2_dict.get(kanji, {})
            kanjiOfficialPronunciations_list = kanjiInfo.get('all_readings', [])
            print("[008]", kanjiOfficialPronunciations_list)
            if not kanjiOfficialPronunciations_list:
                return [[kanjis], [pronunciations]]
            isMatch = False
            for eachPronunciation in kanjiOfficialPronunciations_list:
                print('~~~~~~~~~~~~~~~~~~~~~', eachPronunciation)
                if pronunciations.startswith(eachPronunciation, pos):
                    print('MATCHED', pronunciations.startswith(eachPronunciation, pos), eachPronunciation)
                    pos = pos + len(eachPronunciation)
                    isMatch = True
                    pronunciations_list.append(eachPronunciation)
                    break
            if not isMatch:
                return [[kanjis], [pronunciations]]
        if "".join(pronunciations_list) != pronunciations:
            return [[kanjis], [pronunciations]]
        return [kanjis_list, pronunciations_list]
        

            
            
            
