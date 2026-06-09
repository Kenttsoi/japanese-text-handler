class KanjiModel:
    @staticmethod
    def get_all_kanji_raw():
        from app.data.kanjidic2.kanjidic2_dict import kanjidic2_dict

        return kanjidic2_dict