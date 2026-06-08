from app.data.kanjidic2.kanjidic2_dict import kanjidic2_dict

class KanjiModel:
    @staticmethod
    def get_all_kanji_raw():
        return kanjidic2_dict