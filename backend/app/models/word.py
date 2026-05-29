from app import db

class WordImport(db.Model):
    __tablename__ = 'word_entries'

    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(255), nullable=False, index=True)
    reading = db.Column(db.String(255), nullable=False, index=True)
    meaning_ch = db.Column(db.Text)
    
    old_jlpt_level = db.Column(db.String(50), nullable=True, index=True)
    jlpt_level_1 = db.Column(db.String(50), nullable=True, index=True)
    jlpt_level_2 = db.Column(db.String(50), nullable=True, index=True)

    pos = db.Column(db.String(100), nullable=False, index=True)

    def __repr__(self):
        return f"<Word {self.word} ({self.pos})>"