import pandas as pd
import json
import re
import MeCab

# setting
OLD_EXCEL_FILE = "../data/jlpt_level/jlpt_levels_old.xlsx"
NEW_EXCEL_FILE = "../data/jlpt_level/jlpt_levels_new.xlsx"
JSON_FILE = "../data/jlpt_level/jlpt_new_level_1_wkei.json"
WORD_COLUMN = "word"
READING_COLUMN = "reading"
NEW_JLPT_COLUMN = "jlpt_level_1"

READING_COL = "reading"
WORD_COL = "word"
MEANING_COL = "meaning_ch"
OLD_JLPT_COL = "old_jlpt_level"
NEW_JLPT_COL_1 = "jlpt_level_1"
NEW_JLPT_COL_2 = "jlpt_level_2"
SWITCH_COL = "is_same_pronunciation_only"

print("1. Loading Excel file")

try:
    df_old = pd.read_excel(OLD_EXCEL_FILE, dtype=str, engine="openpyxl")
except FileNotFoundError:
    print(f"ERROR：Cannot find Excel file: '{OLD_EXCEL_FILE}', Please check the file name")
    exit()

print("2. Reformatting file")
# divide the japaense words with same pronunciation

def split_row(row):
    word_text = str(row[WORD_COL]).strip() if pd.notna(row[WORD_COL]) else ""
    switch_val = str(row[SWITCH_COL]).strip().lower() if pd.notna(row[SWITCH_COL]) else ""

    if switch_val == "y" and any(symbol in word_text for symbol in ["、", "・"]):
        word_list = re.split(r'[、/・]', word_text)
        return [w.strip() for w in word_list if w.strip()]
    return [word_text] if word_text else []

df_old[WORD_COL] = df_old.apply(split_row, axis=1)

df_clean = df_old.explode(WORD_COL).dropna(subset=[WORD_COL])
df_clean = df_clean[df_clean[WORD_COL] != ""]

columns_order = [READING_COL, WORD_COL, MEANING_COL, OLD_JLPT_COL, NEW_JLPT_COL_1, NEW_JLPT_COL_2]
df_clean = df_clean[columns_order]

print(f"4. export to '{NEW_EXCEL_FILE}'...")
df_clean.to_excel(NEW_EXCEL_FILE, index=False, engine="openpyxl")

print("Clean")
print(f"Original File：{len(df_old)} Words -> after separating: {len(df_clean)} words")

def clean_word_for_lookup(text):
    if pd.isna(text):
        return ""
    text_str = str(text).strip()
    split_chars = r'[、・/／（）\(\)\[\]［］「」\s]'
    parts = re.split(split_chars, text_str)
    first_part = parts[0] if parts else text_str

    final_word = first_part.replace("~", "").replace("〜", "").strip()
    return final_word

def is_english(text):
    if not text:
        return False
    return bool(re.match(r'^[A-Za-z0-9\s\-\_]+$', text))

try:
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        json_1_array = json.load(f)
except FileNotFoundError:
    print(f"ERROR：Cannot find JSON file: '{JSON_FILE}', Please check the file name")
    exit()

df = pd.read_excel(NEW_EXCEL_FILE, dtype=str, engine="openpyxl")

with open(JSON_FILE, "r", encoding="utf-8") as f:
    json_array = json.load(f)

fast_lookup_dict = {}

for item in json_array:
    if "word" in item and "level" in item:
        raw_json_word = item["word"]
        clean_json_word = clean_word_for_lookup(raw_json_word)
        
        raw_level = str(item["level"]).strip().upper()
        standard_level = raw_level if raw_level.startswith("N") else f"N{raw_level}"
        
        if not clean_json_word:
            continue
            
        if clean_json_word in fast_lookup_dict:
            existing_level = fast_lookup_dict[clean_json_word]
            if not existing_level.startswith("N") and standard_level.startswith("N"):
                fast_lookup_dict[clean_json_word] = standard_level
        else:
            fast_lookup_dict[clean_json_word] = standard_level

print("3. Compare")

def process_row_matching(row):
    excel_word = str(row[WORD_COL]).strip() if pd.notna(row[WORD_COL]) else ""
    excel_reading = str(row[READING_COL]).strip() if pd.notna(row[READING_COL]) else ""
    
    target_search_word = excel_word
    
    if is_english(excel_word):
        if excel_reading:
            target_search_word = excel_reading
        else:
            return "Unknown (English with no reading)"
            
    final_search_key = clean_word_for_lookup(target_search_word)
    
    if final_search_key in fast_lookup_dict:
        return fast_lookup_dict[final_search_key]
        
    return "Unknown"

df[NEW_JLPT_COL_1] = df.apply(process_row_matching, axis=1)

print("4. write Excel")
df.to_excel(NEW_EXCEL_FILE, index=False, engine="openpyxl")

success_count = (df[NEW_JLPT_COL_1].str.startswith("N", na=False)).sum()
print(f"==================================================")
print(f"{success_count} words is adding new JLPT level")
print(f"==================================================")


print("1. Initializing MeCab...")

NEW_POS_COLUMN = "pos"

try:
    tagger = MeCab.Tagger()
except Exception as e:
    print(f"MeCab Initialization failed. Please check environment variables or configuration. Error.: {e}")
    exit()

def parse_mecab_pos(target_text):
    if not target_text:
        return "Unknown"
    
    raw_list = tagger.parse(str(target_text).strip()).splitlines()[:-1]
    print(raw_list)
    parsed_words = [token for token in raw_list[0].split('\t') if token.strip()]

    print("REACH", parsed_words, len(parsed_words))

    if len(parsed_words) < 5:
        return "unknown"

    pos_segments = []
    pos_segments.append(parsed_words[4])

    if len(parsed_words) > 5 and parsed_words[5].strip() and not parsed_words[5].strip().isdigit():
        pos_segments.append(parsed_words[5])

    if len(parsed_words) > 6 and parsed_words[6].strip() and not parsed_words[6].strip().isdigit():
        pos_segments.append(parsed_words[6])

    full_pos_str = "-".join(pos_segments)

    if "動詞" in full_pos_str:
        if "助動詞" in full_pos_str:
            return "助動詞"
        return "動詞"
        
    elif "形容詞" in full_pos_str:
        return "い形容詞"
        
    elif "形状詞" in full_pos_str or "形容動詞" in full_pos_str:
        return "な形容詞"
        
    elif "名詞" in full_pos_str:
        return "名詞"
        
    elif "副詞" in full_pos_str:
        return "副詞"
        
    elif "感動詞" in full_pos_str:
        return "感動詞"
        
    elif "助詞" in full_pos_str:
        return "助詞"
    
    return parsed_words[4]

def row_pos_decision(row):
    word_val = str(row[WORD_COLUMN]).strip() if pd.notna(row[WORD_COLUMN]) else ""
    reading_val = str(row[READING_COLUMN]).strip() if pd.notna(row[READING_COLUMN]) else ""
    
    target_to_query = word_val

    if target_to_query.startswith("〜"):
        target_to_query = target_to_query[1:].strip()

    if is_english(target_to_query):
        if reading_val:
            target_to_query = reading_val
        else:
            return "Unknown"
            
    return parse_mecab_pos(target_to_query)

# testing cases
""" print("final pos", parse_mecab_pos("書かない"))
print("final pos", parse_mecab_pos("書きます"))
print("final pos", parse_mecab_pos("書く"))
print("final pos", parse_mecab_pos("書け"))
print("final pos", parse_mecab_pos("書けば"))
print("final pos", parse_mecab_pos("書こう"))
print("final pos", parse_mecab_pos("食べる"))
print("final pos", parse_mecab_pos("乗り換える"))
print("final pos", parse_mecab_pos("名詞"))
print("final pos", parse_mecab_pos("熱い"))
print("final pos", parse_mecab_pos("眠い"))
print("final pos", parse_mecab_pos("静か"))
print("final pos", parse_mecab_pos("嫌い"))
print("final pos", parse_mecab_pos("大切"))
print("final pos", parse_mecab_pos("ありがとう")) """

print("2. Loading data from Excel...")
df = pd.read_excel(NEW_EXCEL_FILE, dtype=str, engine="openpyxl")

print("3. Labelling")

df[NEW_POS_COLUMN] = df.apply(row_pos_decision, axis=1)

print(f"4. Saving to '{NEW_EXCEL_FILE}'...")
df.to_excel(NEW_EXCEL_FILE, index=False, engine="openpyxl")

print("Completed the excel file")