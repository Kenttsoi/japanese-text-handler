from app.models.kanji_model import KanjiModel
from itertools import islice

class KanjiCardService:
    @staticmethod
    def get_first_six_cards():
        raw_dict = KanjiModel.get_all_kanji_raw()

        if not raw_dict:
            return []
        
        first_six_items = islice(raw_dict.items(), 6)

        formatted_results = []

        for literal, info in first_six_items:
            formatted_results.append({
                "literal": literal,
                "on_readings": ", ".join(info.get("on_readings", [])),
                "kun_readings": ", ".join(info.get("kun_readings", [])),
                "meaning_en": ", ".join(info.get("meaning_en", [])),
            })
        
        return formatted_results
