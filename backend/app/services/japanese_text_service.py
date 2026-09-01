from flask import current_app
from app.utils.text_utils import KanaConverter, JapaneseUtils
from app.utils.kanji_handler import KanjiSeparator
from app.models.handlers.kuromoji_handler import KuromojiHandler
from app.models.handlers.mecab_handler import MecabHandler
from app.models.handlers.exceptional_words import EXCEPTIONAL_WORDS
from app.utils.text_utils import JapaneseUtils
import traceback
import unicodedata
import string
import re
import pykakasi

class WordEntry:
    def __init__(self, original: str, hiragana: str, katakana: str, kanji_breakdown: list):
        self.original = original
        self.hiragana = hiragana
        self.katakana = katakana
        self.kanji_breakdown = kanji_breakdown
        self.word_type = self._generate_char_type()

    def _generate_char_type(self):
        unicodedata_type = unicodedata.name(self.original[0], 'None') # only accept ONE char of this method
        if 'CJK UNIFIED IDEOGRAPH' in unicodedata_type:
            return 'kanji'
        elif 'HIRAGANA' in unicodedata_type:
            return 'hiragana'
        elif 'KATAKANA' in unicodedata_type:
            return 'katakana'
        else:
            return 'other'

    def to_dict(self):
        return {
            "original": self.original,
            "hiragana": self.hiragana,
            "katakana": self.katakana,
            "kanji_breakdown": self.kanji_breakdown,
            "word_type": self.word_type
        }
    
class JapaneseTextConverter:
    def __init__(self, text: str):
        self.text = text
        self._exceptional_words = EXCEPTIONAL_WORDS.copy()
        self._mecab_handler = MecabHandler()
        self._kuromoji_handler = KuromojiHandler()
        self.results = []

    def convert(self) -> list:
        print('[Start converting]----------------------------------')
        print(self.text)
        text_arabic_num_pos = self._arabic_number_pos()
        print(text_arabic_num_pos)
        try:
            text_parts, is_exc_flags, override_readings = self._split_text_by_exceptional_words()
        except Exception as e:
            print(f"_split_text_by_exceptional_words: {e}")
        try:
            for index, text_item in enumerate(text_parts):
                text_parts[index] = JapaneseUtils.arabic_number_to_kanji(text_item)
        except Exception as e:
            print(f"{e}")
        print('arabic number?', text_parts)
        print(text_parts, is_exc_flags, override_readings)
        results: list[dict] = []
        
        for part, is_exceptional, override_reading in zip(text_parts, is_exc_flags, override_readings):
            if part:
                try:
                    if part == "\\n":
                        results.append(WordEntry(part, part, part, []).to_dict())
                    elif is_exceptional:
                        mecab_tokens: list[dict] = self._mecab_handler.parse(part, "single")
                        finalized_token = self._parse_token(mecab_tokens, override_reading, True)
                        results.extend(finalized_token)
                    else:
                        """ kuromoji_tokens: list[dict] = KuromojiHandler().tokenize(part) """
                        kuromoji_tokens: list[dict] = self._kuromoji_handler.tokenize(part)
                        for kuromoji_token in kuromoji_tokens:
                            if kuromoji_token['pos'].startswith('記号') or kuromoji_token['original_text'] in string.punctuation:
                                results.append(WordEntry(kuromoji_token['original_text'], kuromoji_token['original_text'], kuromoji_token['original_text'], []).to_dict())
                                continue
                            mecab_from_kuromoji_token: list[dict] = self._mecab_handler.parse(kuromoji_token["original_text"], "sequence")
                            finalized_token = self._parse_token(mecab_from_kuromoji_token, kuromoji_token["reading"])
                            results.extend(finalized_token)
                except Exception as e:
                    print(f"Calling API occurred Error: {e}")
                    traceback.print_exc()
        print('RESULT RESULT RESULT RESULT RESULT', results)
        try:
            unmask_arabic_number_result = self.restore_tokens_for_number(results, text_arabic_num_pos)
        except Exception as e:
            print(f"Unmask Arabic Number method error: {e}")
        return unmask_arabic_number_result
    
    """ def _split_text_by_exceptional_words(self) -> list:
        pattern = "(" + "|".join(map(re.escape, self._exceptional_words)) + ")"
        return re.split(pattern, self.text) """

    def _arabic_number_pos(self) -> str:
        if not self.text:
            return ''
        
        text_arabic_number_pos = ''

        for char in self.text:
            if char.isdigit():
                text_arabic_number_pos += '1'
            else:
                text_arabic_number_pos += '0'
        return text_arabic_number_pos


    def _split_text_by_exceptional_words(self) -> tuple[list[str], list[bool], list[str | None]]:
        kanji_nums = "一二三四五六七八九十"
        safe_lookbehind = rf'(?<![0-9{kanji_nums}])'

        day_one = rf'{safe_lookbehind}(?:1日|一日)'
        prefix_month = rf'(?:[0-9]+|[{kanji_nums}]+|毎|今|来|先)月'
        pattern_day_one_month = rf'{prefix_month}{day_one}' 

        suffix_particles = r'(?=(?:に|から|までに?|は|頃|ごろ|過ぎ|直前))'
        pattern_day_one_particles = rf'{day_one}{suffix_particles}'
        pattern_tsuitachi = f"(?:{pattern_day_one_month}|{pattern_day_one_particles})"

        wain_dates_map = {
            "2日": "フツカ", "二日": "フツカ", "3日": "ミッカ", "三日": "ミッカ",
            "4日": "ヨッカ", "四日": "ヨッカ", "5日": "イツカ", "五日": "イツカ",
            "6日": "ムイカ", "六日": "ムイカ", "7日": "ナノカ", "七日": "ナノカ",
            "8日": "ヨウカ", "八日": "ヨウカ", "9日": "ココノカ", "九日": "ココノカ",
            "10日": "トオカ", "十日": "トオカ", "14日": "ジュウヨッカ", "十四日": "ジュウヨッカ",
            "20日": "ハツカ", "二十日": "ハツカ", "24日": "ニジュウヨッカ", "二十四日": "ニジュウヨッカ",
        }
        pattern_wain_dates = "|".join([rf'{safe_lookbehind}{re.escape(k)}' for k in wain_dates_map.keys()])

        sorted_exceptional = sorted(self._exceptional_words.keys(), key=len, reverse=True)
        pattern_user_words = "|".join(map(re.escape, sorted_exceptional)) if sorted_exceptional else ""

        all_patterns = [p for p in [pattern_tsuitachi, pattern_wain_dates, pattern_user_words] if p]
        combined_pattern = "(" + "|".join(all_patterns) + ")"

        if not re.search(combined_pattern, self.text):
            return [self.text], [False], [None]

        raw_split = re.split(combined_pattern, self.text)
        temp_list = [x for x in raw_split if x]

        final_text_list = []
        is_exceptional_list = []
        override_readings = []

        for token in temp_list:
            if re.fullmatch(pattern_day_one_month, token):
                final_text_list.extend([token[:-2], token[-2:]])
                is_exceptional_list.extend([False, True])
                override_readings.extend([None, "ツイタチ"])

            elif re.fullmatch(pattern_day_one_particles, token):
                final_text_list.append(token)
                is_exceptional_list.append(True)
                override_readings.append("ツイタチ")

            elif token in wain_dates_map:
                final_text_list.append(token)
                is_exceptional_list.append(True)
                override_readings.append(wain_dates_map[token])

            elif token in self._exceptional_words:
                final_text_list.append(token)
                is_exceptional_list.append(True)
                override_readings.append(self._exceptional_words[token])

            else:
                final_text_list.append(token)
                is_exceptional_list.append(False)
                override_readings.append(None)

        return final_text_list, is_exceptional_list, override_readings

    
    def _parse_token(self, tokens: list[dict], kuromoji_pronunciation: str, is_exceptional: bool = False) -> list[dict]:
        separated_single_kanjis_tokens = self.parse_to_single_kanji(tokens, kuromoji_pronunciation)
        
        """ for token in tokens:
            token.setdefault('kanji_breakdown', [])
            print('[why list and list again!]', token)
            
            if self._is_kanji_inside(tokens):
                token = self.parse_to_single_kanji(tokens, kuromoji_pronunciation)
            separated_single_kanjis_tokens.extend(token)
        print("kanji DONE", separated_single_kanjis_tokens) """
        
        # 3. format the token (generate hiragana, katakana etc.)
        formatted_tokens = self._annotate_tokens(separated_single_kanjis_tokens)
        if is_exceptional:
            exceptional_token_dict = formatted_tokens[0]
            if not exceptional_token_dict.get("kanji_breakdown"):
                exceptional_token_dict["kanji_breakdown"] = [kuromoji_pronunciation]
                formatted_tokens = [exceptional_token_dict]

        return formatted_tokens
        
        for token in tokens:
            token["kanjiBreakdown"] = []
            hiragana = KanaConverter.katakana_to_hiragana(matching_pronunciation)
            print(hiragana)
            print("where is my token", token)
            single_kanjis = KanjiSeparator.separate_kanji(token["original"], hiragana)
            token["kanjiBreakdown"].extend(single_kanjis["separated_kanjis"])
            """ if not single_kanjis["separated_kanjis"]:
                token["kanjiBreakdown"] = []
                return tokens """
            matching_pronunciation = matching_pronunciation[single_kanjis["part_length"]:]
            print("[HIHIHIHIHI]", single_kanjis, matching_pronunciation)

        
        self._annotate_tokens()
        return tokens
    
    def _is_kanji_inside(self, token: dict) -> bool:
        if not token['original']:
            return False
        for char in token['original']:
            if JapaneseUtils.is_kanji(char):
                return True
        return False

    def parse_to_single_kanji(self, tokens: list[dict], kuromoji_pronunciation: str):
        combined_kanjis = ""
        words_log = []
        for token in tokens:
            temp_word = token.get("original", "")
            combined_kanjis += temp_word
            words_log.append(temp_word)

        
        kuromoji_pronunciation_hiragana_form = KanaConverter.katakana_to_hiragana(kuromoji_pronunciation)
        kanji_separator = KanjiSeparator()
        single_kanjis: list[str] | None = kanji_separator.separate_kanji(combined_kanjis, kuromoji_pronunciation_hiragana_form)
        # deal with all kanji cannot be matched, including exceptional ones
        if single_kanjis is None:
            if len(tokens) == 1:
                tokens[0]['kanji_breakdown'] = [kuromoji_pronunciation_hiragana_form]
                tokens[0]['reading_katakana'] = [kuromoji_pronunciation]
            return tokens
        
        if len(single_kanjis) == len(combined_kanjis):
            for i, token in enumerate(tokens):
                times = len(token['original'])
                this_time = single_kanjis[:times]
                tokens[i]["kanji_breakdown"] = this_time
                del single_kanjis[:times]
        return tokens

    def _annotate_tokens(self, tokens: list[dict]) -> list[dict]:
        annotated_tokens = []
        for token in tokens:
            katakana_string_form: str = "".join(token['reading_katakana']) if isinstance(token["reading_katakana"], list) else token["reading_katakana"]
            annotated_tokens.append(WordEntry(
                original = token['original'],
                hiragana = KanaConverter.katakana_to_hiragana(katakana_string_form),
                katakana = katakana_string_form,
                kanji_breakdown = token.get("kanji_breakdown", [])
            ).to_dict())
        return annotated_tokens

    @staticmethod
    def restore_tokens_for_number(tokens_list: list[dict], mask_str: str) -> list[dict]:
        cursor = 0

        REV_DIGIT_MAP = {
            '零': '0', '一': '1', '二': '2', '三': '3', '四': '4',
            '五': '5', '六': '6', '七': '7', '八': '8', '九': '9'
        }

        for item in tokens_list:
            original_text = item['original']
            text_len = len(original_text)

            sub_mask = mask_str[cursor : cursor + text_len]
            new_chars = []
            for char, mask_char in zip(original_text, sub_mask):
                if mask_char == '1' and char in REV_DIGIT_MAP:
                    new_chars.append(REV_DIGIT_MAP[char])
                else:
                    new_chars.append(char)

            item["original"] = "".join(new_chars)
            cursor += text_len
        return tokens_list

class JapaneseTextHandler:
    def __init__(self):
        self.tagger = current_app.tagger

    def annotate(self, text):
        # Library 1: pykakasi: return list[dict], has orig, hira, kana and romaji, but no Part of speech and no english if kana
        print('--------------------------------------------------------------------------------')
        kakasi = pykakasi.kakasi()
        parsed1 = kakasi.convert(text)
        print('[001]: pykakasi', parsed1)

        # Library 2: MeCab: return all the morphological analysis results
        parsed2 = self.tagger.parse(text).splitlines()[:-1]
        lookup = {}
        for word in parsed2:
            token = word.split('\t')
            print('[002A]', token)
            word_dict = {
                "original": token[0],
                "reading_katakana": token[1],
                "pronunciation": token[2],
                "dict_form": token[3],
                "pos": token[4],
                "katsuyou1": token[5],
                "katsuyou2": token[6],
                "pitch_accent": token[7]
            }
            lookup[token[0]] = word_dict
        print('[002]: MeCab', lookup)

        """ parsed = self.tagger.parse(text).splitlines()[:-1]
        print('[003]: MeCab Original code logic', parsed)
        result = {'result':[], 'word_type': [], 'original': [], 'hiragana': [], 'katakana': []} """
        
        resultList = []
        # test for pykakasi
        for line in parsed1:
            print('[004]: pykakasi', line)
            if line['orig'] == "\n":
                wordResult = WordEntry(
                    original=line['orig'],
                    hiragana=line['orig'],
                    katakana=line['orig'],
                    char_type="NEWLINE"
                )
                resultList.append(wordResult.to_dict())
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
            if 'CJK UNIFIED IDEOGRAPH' in char_type:
                single_kanjis = KanjiSeparator.separate_kanji(line['orig'], line['hira'])
                print('[009] single kanji', single_kanjis)
                for index, eachKanji in enumerate(single_kanjis[0]):
                    wordResult = WordEntry(
                        original=eachKanji,
                        hiragana=single_kanjis[1][index],
                        katakana=KanaConverter.hiragana_to_katakana(single_kanjis[1][index]),
                        char_type=char_type
                    )
                    resultList.append(wordResult.to_dict())
            else:
                wordResult = WordEntry(
                    original=line['orig'],
                    hiragana=line['hira'],
                    katakana=line['kana'],
                    char_type=char_type
                )
                resultList.append(wordResult.to_dict())

        print('[010 result list of dicts]', resultList)
        return resultList
        

        """ 
        # Old logic for Meca only
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
        return result """