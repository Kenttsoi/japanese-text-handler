import pandas as pd
from app import create_app, db
from app.models.word import WordImport

app = create_app('development')

def seed_from_excel():
    excel_file_path = './app/data/jlpt_level/jlpt_levels_new.xlsx'

    df = pd.read_excel(excel_file_path, dtype=str, engine="openpyxl")

    word_dicts = df.to_dict(orient='records')

    words_to_insert = []
 
    for row in word_dicts:
        word_val = str(row['word']).strip() if pd.notna(row['word']) else ""
        reading_val = str(row['reading']).strip() if pd.notna(row['reading']) else ""
        meaning_ch_val = str(row['meaning_ch']).strip() if pd.notna(row['meaning_ch']) else ""

        old_jlpt = str(row['old_jlpt_level']).strip() if pd.notna(row['old_jlpt_level']) else None
        jlpt_1 = str(row['jlpt_level_1']).strip() if pd.notna(row['jlpt_level_1']) else None
        jlpt_2 = str(row['jlpt_level_2']).strip() if pd.notna(row['jlpt_level_2']) else None
        
        pos_val = str(row['pos']).strip() if pd.notna(row['pos']) else None

        if not word_val:
            continue

        word_entry = WordImport(
            word=word_val,
            reading=reading_val,
            meaning_ch=meaning_ch_val,
            old_jlpt_level=old_jlpt,
            jlpt_level_1=jlpt_1,
            jlpt_level_2=jlpt_2,
            pos=pos_val
        )
        words_to_insert.append(word_entry)

        with app.app_context():
            try:
                db.create_all()

                db.session.bulk_save_objects(words_to_insert)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                print(f"Error Occurred: {e}")
                
if __name__ == '__main__':
    seed_from_excel()