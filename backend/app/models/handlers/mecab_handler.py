from flask import current_app

class MecabHandler:
    def __init__(self):
        pass

    def parse(self, text: str, mode: str="sequence") -> list[dict]:
        try:
            parsed_words: list[str] = current_app.tagger.parse(text).splitlines()[:-1]
        except Exception as e:
            print(f"Mecab Parsing occurred Error: {e}")
            return None

        if not parsed_words:
            return None
        
        if mode == "sequence":
            return self._parse_sequence(parsed_words)
        elif mode == "grouped":
            return self._parse_grouped(parsed_words)
        elif mode == "single":
            return self._parse_single(parsed_words)
        else:
            print(f"[Warning] Unknown mode '{mode}', using default 'sequence'")

    def _generate_word_dict(self, token_list: list[str | list[str]]) -> dict[str | list[str]]:
        return {
            "original": token_list[0],
            "reading_katakana": token_list[1],
            "pronunciation_mecab": token_list[2],
            "dict_form": token_list[3],
            "pos": token_list[4],
            "katsuyou1": token_list[5],
            "katsuyou2": token_list[6],
            "pitch_accent": token_list[7]
        }

    def _parse_sequence(self, parsed_words: list[str]) -> list[dict]:
        return [self._generate_word_dict(word.split('\t')) for word in parsed_words]

    def _parse_grouped(self, parsed_words):
        lookup = {}
        for word in parsed_words:
            token = word.split('\t')
            key = token[0]
            word_dict = self._generate_word_dict(token)
            lookup[key] = word_dict
        return lookup
    
    def _parse_single(self, parsed_words: list[str]) -> list[dict]:
        temp_list = [word.split('\t') for word in parsed_words]
        print('fgdfgdf', temp_list)
        final_list = [list(col) for col in zip(*temp_list)]

        if final_list:
            processed_final_list = [
            "".join(final_list[0]) if i == 0 else final_list[i]
            for i in range(len(final_list))
        ]
        else:
            processed_final_list = final_list

        return [self._generate_word_dict(processed_final_list)]

        
            
            
        