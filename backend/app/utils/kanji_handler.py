import pykakasi
from unihan_etl.core import Packager, Options
from flask import current_app
from app.scripts.initiate_unihan import initiate_unihan
from app.utils.text_utils import KanaConverter
from app.data.kanjidic2.kanjidic2_dict import kanjidic2_dict
class KanjiSeparator:
    def separate_kanji(kanjis: str, pronunciation: str) -> None | list[str]:
        n = len(pronunciation)
        dp = [-1] * (n + 1) # 0 represents empty string
        prev = [None] * (n + 1)
        dp[0] = 0
        source_lists = []
        for kanji in kanjis:
            kanjiInfo = kanjidic2_dict.get(kanji, {})
            kanjiOfficialPronunciations_list = kanjiInfo.get('all_readings', [])
            source_lists.append(kanjiOfficialPronunciations_list)
        for i in range(n + 1):
            stage = dp[i]
            if dp[i] == -1:
                continue
            if stage >= len(source_lists):
                continue
            for word in source_lists[stage]:
                if word == pronunciation[i: i + len(word)]:
                    j = i + len(word)
                    new_stage = stage + 1
                    print("MATCH", word)
                    if dp[j] == -1:
                        dp[j] = new_stage
                        prev[j] = (i, stage, word)
            
        print('[DP]', dp)
        print('[PREV]', prev)    

        if dp[n] != len(source_lists):
            return None
        
        # Backtracking
        result = []
        pos = n
        while pos > 0:
            prev_pos, stage, word = prev[pos]
            result.append(word)
            pos = prev_pos
        result.reverse()
        result_string = ''.join(result)
        if result_string != pronunciation:
            return None
        print('result_string', result_string)
        print('[RESULT]', result)
        return result

    @staticmethod
    def separate_kanji_old_old(kanjis, pronunciation):
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
    def separate_kanji_old(kanjis: str, pronunciations: str):
        print(['007 NEW separate kanji entered'], kanjis, pronunciations)
        """ kanjis_list = []
        pronunciations_list = [] """
        results = { "separated_kanjis": [], "part_length": 0 }
        log_kanji_result_info = { "separated_kanjis": [] }
        all_success = True
        pronunciations_length = 0
        pos = 0
        for kanji in kanjis:
            item = { "char": kanji, "pronunciation": "" }
            """ kanjis_list.append(kanji) """
            kanjiInfo = kanjidic2_dict.get(kanji, {})
            kanjiOfficialPronunciations_list = kanjiInfo.get('all_readings', [])
            print("[008]", kanjiOfficialPronunciations_list)
            if not kanjiOfficialPronunciations_list:
                print("REACH 1")
                all_success = False
                item["separate_failed_info"] = "001"
                log_kanji_result_info["separated_kanjis"].append(item)
                continue
            isMatch = False
            for eachPronunciation in kanjiOfficialPronunciations_list:
                print('~~~~~~~~~~~~~~~~~~~~~', eachPronunciation)
                if pronunciations.startswith(eachPronunciation, pos):
                    print('MATCHED', pronunciations.startswith(eachPronunciation, pos), eachPronunciation)
                    pos = pos + len(eachPronunciation)
                    isMatch = True
                    """ pronunciations_list.append(eachPronunciation) """
                    item["pronunciation"] = eachPronunciation
                    pronunciations_length += len(eachPronunciation)
                    results["separated_kanjis"].append(item)
                    log_kanji_result_info["separated_kanjis"].append(item)
                    break
            if not isMatch:
                print("REACH 2")
                all_success = False
                item["separate_failed_info"] = "002"
                log_kanji_result_info["separated_kanjis"].append(item)
                continue
        """ if "".join(pronunciations_list) != pronunciations:
            return [[kanjis], [pronunciations]] """
        # return [kanjis_list, pronunciations_list]
        results["part_length"] = pronunciations_length
        print("[separate_kanji_results]", log_kanji_result_info)
        if not all_success:
            return { "separated_kanjis": [], "part_length": 0 }
        else:
            return results
