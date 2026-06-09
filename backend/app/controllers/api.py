
from flask import Blueprint, request, jsonify, Response, current_app
from app.services.kanji_card_service import KanjiCardService
from app.services.japanese_text_service import JapaneseTextHandler
from app.services.japanese_text_service import JapaneseTextConverter
from app.utils.response import api_success, api_error
from itertools import islice
import html
MAX_CHARS = 500
FORBIDDEN_PATTERNS = [
    "<script", "javascript:", "DROP TABLE", 
    "INSERT INTO", "SELECT *", "--", "OR 1=1"
]

def is_suspicious(text):
    """Check for common SQL injection or Script injection patterns."""
    for pattern in FORBIDDEN_PATTERNS:
        if pattern.upper() in text.upper():
            return True
    return False

api = Blueprint('api', __name__)

@api.route('/')
def hello():
    return "Hello, Japanese Annotator!"

@api.route('/convert', methods=['POST'])
def convert():
    # Extract data
    data = request.json
    raw_text = data.get('text').replace('\n', '\\n') if data else None

    # Length check (OOM Prevention)
    if len(raw_text) > MAX_CHARS:
        return api_error(f"Please limit to {MAX_CHARS} words", status=413)
    
    # Security check (Injection Prevention)
    if is_suspicious(raw_text):
        return api_error("Unsafe content detected.", status=400)
    
    # HTML Escape (XSS Prevention)
    safe_text = html.escape(raw_text)

    if not safe_text:
        return api_error('You need to enter text')
    try:
        print(safe_text)
        converter = JapaneseTextConverter(safe_text)
        result = converter.convert()
        return api_success(result)
    except Exception as e:
        return api_error('Conversion Error', status=500)

@api.route('/kanji/first-six', methods=['GET'])
def get_first_six_kanji():
    try:
        cards_data = KanjiCardService.get_first_six_cards()
        return api_success(cards_data)
    except Exception as e:
        return api_error('Data retrieve Error', status=500)

""" @api.route('/sample1')
def sample1():
    answer = current_app.wakati_tagger.parse("pythonが大好きです").split()
    return answer

@api.route('/sample2')
def sample2():
    text = "今日、こんにちは"
    parsed = current_app.tagger.parse(text).splitlines()[:-1]
    return jsonify({'result': parsed})

@api.route('/annotate', methods=['POST'])
def annotate():
    text = request.json.get('text', '')
    print(text)
    if not text:
        return jsonify({'error': 'No text provided'})
    else:
        result = JapaneseTextHandler().annotate(text)
        return jsonify(result) """