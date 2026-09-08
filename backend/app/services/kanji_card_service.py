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
    
    @staticmethod
    def search_kanji(query: str, offset: int = 0, limit: int = 0):
        raw_dict = KanjiModel.get_all_kanji_raw()
        
        if not raw_dict:
            return {"items": [], "total": 0}

        results = []
        query_lower = query.lower().strip()

        for literal, info in raw_dict.items():
            on_readings = " ".join(info.get("on_readings", []))
            kun_readings = " ".join(info.get("kun_readings", []))
            meanings = " ".join(info.get("meaning_en", []))

            if (query_lower in literal.lower() or 
                query_lower in on_readings.lower() or 
                query_lower in kun_readings.lower() or 
                query_lower in meanings.lower()):

                results.append({
                    "literal": literal,
                    "on_readings": ", ".join(info.get("on_readings", [])),
                    "kun_readings": ", ".join(info.get("kun_readings", [])),
                    "meaning_en": ", ".join(info.get("meaning_en", [])),
                })

        total = len(results)

        paged_results = results[offset : offset + limit]

        return {
            "items": paged_results,
            "total": total
        }