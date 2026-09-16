from app.extensions import db
from sqlalchemy import Index, text
from sqlalchemy.dialects.postgresql import TSVECTOR

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

    fts_vector = db.Column(
        TSVECTOR,
        db.Computed(
            text("to_tsvector('simple', coalesce(word, '')) || "
                 "to_tsvector('simple', coalesce(reading, '')) || "
                 "to_tsvector('simple', replace(replace(coalesce(meaning_ch, ''), '、', ' '), '，', ' '))"),
            persisted=True
        )
    )

    __table_args__ = (
        Index('idx_word_entries_fts', 'fts_vector', postgresql_using='gin'),
    )

    def __repr__(self):
        return f"<Word {self.word} ({self.pos})>"