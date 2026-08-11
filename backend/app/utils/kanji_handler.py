import pykakasi
from unihan_etl.core import Packager, Options
from flask import current_app
from app.scripts.initiate_unihan import initiate_unihan
from app.utils.text_utils import KanaConverter, JapaneseUtils

class KanjiSeparator:
    # Class Attribute
    _VOICING_MAP = {
        'か': ['が'], 'き': ['ぎ'], 'く': ['ぐ'], 'け': ['げ'], 'こ': ['ご'],
        'さ': ['ざ'], 'し': ['じ'], 'す': ['ず'], 'せ': ['ぜ'], 'そ': ['ぞ'],
        'た': ['だ'], 'ち': ['ぢ'], 'つ': ['づ'], 'て': ['で'], 'と': ['ど'],
        'は': ['ば', 'ぱ'], 'ひ': ['び', 'ぴ'], 'ふ': ['ぶ', 'ぷ'], 'へ': ['べ', 'ぺ'], 'ほ': ['ぼ', 'ぽ'],
    } # 連濁
    _SOKUON_ENDINGS = {'く', 'き', 'つ', 'ち'} # 促音化
    _VOICED_CHARS = set("がぎぐげござじずぜぞだぢづでどばびぶべぼ")

    def __init__(self):
        from app.data.kanjidic2.kanjidic2_dict import kanjidic2_dict
        self.dict = kanjidic2_dict

    def _enrich_readings(self, readings: list[str], idx: int) -> list[str]:
        enriched = set(readings)

        for word in readings:
            # 促音化
            if len(word) >= 2 and word[-1] in self._SOKUON_ENDINGS:
                enriched.add(word[:-1] + 'っ')

            # 連濁
            if idx > 0 and len(word) >= 1 and not any(c in self._VOICED_CHARS for c in word):
                first_char = word[0]
                if first_char in self._VOICING_MAP:
                    for voiced in self._VOICING_MAP[first_char]:
                        enriched.add(voiced + word[1:])
                        if word[-1] in self._SOKUON_ENDINGS:
                            enriched.add(voiced + word[1:-1] + 'っ')
        return list(enriched)

    def separate_kanji(self, kanjis: str, pronunciation: str) -> None | list[str]:
        """ from app.data.kanjidic2.kanjidic2_dict import kanjidic2_dict """
        print('separate_kanji', kanjis,  pronunciation, kanjis == pronunciation)
        """ n = len(pronunciation)
        dp = [-1] * (n + 1) # 0 represents empty string
        prev = [None] * (n + 1)
        dp[0] = 0 """
        source_lists = []
        for idx, kanji in enumerate(kanjis):
            # 踊り字
            if kanji == '々' and len(source_lists) > 0:
                prev_candidates = source_lists[-1]
                odoriji_candidates = self._enrich_readings(prev_candidates, idx)
                source_lists.append(odoriji_candidates)
            # if the char in this string is kanji, then check dict, if not, just append it
            elif JapaneseUtils.is_kanji(kanji):
                kanjiInfo = self.dict.get(kanji, {})
                kanjiOfficialPronunciations_list = kanjiInfo.get('all_readings', [])
                enriched_list = self._enrich_readings(kanjiOfficialPronunciations_list, idx)
                source_lists.append(enriched_list)
            else:                
                source_lists.append([kanji])

        print(source_lists)
        print("[WHATS GOING ON]", KanjiSeparator._segment_pronunciation_by_stages(source_lists, pronunciation))
        return KanjiSeparator._segment_pronunciation_by_stages(source_lists, pronunciation)

        """ for i in range(n + 1):
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
        return result """

    @staticmethod
    def _segment_pronunciation_by_stages(source_lists: list[list], pronunciation: str) -> None | list[str]:
        n = len(pronunciation)
        k = len(source_lists)
    
        # 2D DP array: dp[stage][pos] stores prev_pos for backtracking
        dp = [[-1] * (n + 1) for _ in range(k + 1)]
        dp[0][0] = 0
    
        for stage in range(k):
            for i in range(n + 1):
                if dp[stage][i] == -1:
                    continue
                
                for word in source_lists[stage]:
                    word_len = len(word)
                    if i + word_len <= n and pronunciation[i : i + word_len] == word:
                        # State transition: record the next stage and its corresponding character boundary position
                        dp[stage + 1][i + word_len] = i
    
        if dp[k][n] == -1:
            return None
        
        # Backtracking
        result = []
        pos = n
        for stage in range(k, 0, -1):
            prev_pos = dp[stage][pos]
            result.append(pronunciation[prev_pos : pos])
            pos = prev_pos
            
        result.reverse()
        return result
    
    @staticmethod
    def _old_segment_pronunciation_by_stages(source_lists: list[list], pronunciation: str) -> None | list[str]:
        n = len(pronunciation)
        k = len(source_lists)

        dp = [-1] * (n + 1)
        prev = [None] * (n + 1)

        dp[0] = 0

        for i in range(n + 1):
            if dp[i] == -1:
                continue

            current_stage = dp[i]
            if current_stage >= k:
                continue
        
            for word in source_lists[current_stage]:
                word_len = len(word)
                if i + word_len <= n and pronunciation[i : i + word_len] == word:
                    j = i + word_len
                    new_stage = current_stage + 1

                    # update when they match at higher stage
                    if dp[j] < new_stage:
                        dp[j] = new_stage
                        prev[j] = (i, current_stage, word)

        if dp[n] != k:
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

        # verify if they are matched
        if result_string != pronunciation:
            return None

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
