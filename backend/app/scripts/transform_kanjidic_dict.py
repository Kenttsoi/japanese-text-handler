from pathlib import Path
from flask import current_app
import xml.etree.ElementTree as ET
from app.utils.text_utils import KanaConverter

def transform_kanjidic_dict():
    filePath = Path(current_app.root_path) / 'data' / 'kanjidic2' / 'kanjidic2.xml'
    tree = ET.parse(filePath)
    root = tree.getroot()

    kanji_dict = {}

    for char in root.findall('character'):
        literal = char.find("literal").text # The kanji character itself
        # JLPT
        jlpt_elem = char.find("misc/jlpt")
        jlpt = int(jlpt_elem.text) if jlpt_elem is not None else None

        # Pronunciations
        on_readings = []
        kun_readings = []
        nanori_readings = []
        all_readings = []

        # Meaning
        meaning_en = []

        rmgroup = char.find("reading_meaning/rmgroup")
        if rmgroup is not None:
            # on and kun readings
            for reading in rmgroup.findall("reading"):
                r_type = reading.get("r_type")
                if r_type == "ja_on":
                    hiragana_text = KanaConverter.katakana_to_hiragana(reading.text)
                    on_readings.append(hiragana_text)
                    all_readings.append(hiragana_text)
                elif r_type == "ja_kun":
                    if reading.text.startswith('-'):
                        onlyText = reading.text[1:]
                    elif reading.text.endswith('-'):
                        onlyText = reading.text[:-1]
                    elif "." in reading.text:
                        onlyText = reading.text.split(".")[0]
                    else:
                        onlyText = reading.text
                    kun_readings.append(reading.text)
                    all_readings.append(onlyText)

            """ for meaning in rmgroup.findall("meaning"):
                if meaning.get("m_lang") is None:
                    meaning_en.append(meaning.text) """

            # nanori readings
            for nanori in char.findall("reading_meaning/nanori"):
                nanori_readings.append(nanori.text)
                all_readings.append(nanori.text)

        # store into dict
        kanji_dict[literal] = {
            "jlpt": jlpt,
            "on_readings": on_readings,
            "kun_readings": kun_readings,
            "nanori_readings": nanori_readings,
            "all_readings": all_readings,
            "meaning_en": meaning_en
        }

    output_path = Path(current_app.root_path) / 'data' / 'kanjidic2' / 'kanjidic2_dict.py'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"kanjidic2_dict = {kanji_dict}")


