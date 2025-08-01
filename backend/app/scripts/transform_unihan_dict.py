import json
import pickle
from pathlib import Path
from flask import current_app

def transform_unihan_dict():
    json_path = Path(current_app.static_folder) / 'unihan' / 'unihan_output.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        raw_list = json.load(f)
    data_dict = {
        entry["char"]: {
            **{k: v for k, v in entry.items() if k != "char"},
            "kJapaneseAll": entry.get("kJapaneseKun", []) + entry.get("kJapaneseOn", [])
        }
        for entry in raw_list
    }
    
    pickle_path = Path(current_app.static_folder) / 'unihan' / 'data_dict.pkl'
    with open(pickle_path, "wb") as f:
        pickle.dump(data_dict, f)

    with open(pickle_path, "rb") as f:
        data_dict = pickle.load(f)
        print(data_dict["中"]["kJapaneseAll"])