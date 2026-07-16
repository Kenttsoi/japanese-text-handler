
from flask import Blueprint, request, jsonify, Response, current_app
from app.services.kanji_card_service import KanjiCardService
from app.services.japanese_text_service import JapaneseTextHandler
from app.services.japanese_text_service import JapaneseTextConverter
from app.utils.response import api_success, api_error, api_media_success
from itertools import islice
import html
import requests
import os
import hashlib

api = Blueprint('api', __name__)

MAX_CHARS = 500

FORBIDDEN_PATTERNS = [
    "<script", "javascript:", "DROP TABLE", 
    "INSERT INTO", "SELECT *", "--", "OR 1=1"
]

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "data", "audio_cache"))
os.makedirs(CACHE_DIR, exist_ok=True)
VOICEVOX_URL = "http://127.0.0.1:50021"

def is_suspicious(text):
    """Check for common SQL injection or Script injection patterns."""
    for pattern in FORBIDDEN_PATTERNS:
        if pattern.upper() in text.upper():
            return True
    return False

@api.before_request
def validate_and_sanitize_incoming_request():
    if request.is_json and request.method in ['POST', 'PUT', 'PATCH']:
        data = request.json or {}

        for key, value in data.items():
            if isinstance(value, str):

                # Length check (OOM Prevention)
                if len(value) > MAX_CHARS:
                    return api_error(f"Please limit to {MAX_CHARS} characters", status=413)

                # Security check (Injection Prevention)
                if is_suspicious(value):
                    return api_error("Unsafe content detected.", status=400)

                # HTML Escape (XSS Prevention)
                safe_text = html.escape(value)

        if 'text' in data:
            request.environ['CLEAN_TEXT'] = safe_text

        print('passed')
        
    if request.method == 'GET':
        for key, value in request.args.items():
            if len(value) > 50:
                return api_error("error: Query too long", status=400)
        print('passed')

@api.route('/')
def hello():
    return "Hello, Japanese Annotator!"

@api.route('/convert', methods=['POST'])
def convert():
    # Extract data
    passage_text = request.environ.get('CLEAN_TEXT')
    if not passage_text:
        return api_success([])
    handled_text = passage_text.replace('\n', '\\n') if passage_text else None

    if not handled_text:
        return api_error('You need to enter text')
    try:
        print(handled_text)
        converter = JapaneseTextConverter(handled_text)
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

@api.route('/kanji/search', methods=['GET'])
def search_kanji():
    try:
        query = request.args.get('q', '').strip()

        if not query:
            return api_error("Query parameter 'q' is required", status=400)
        
        results = KanjiCardService.search_kanji(query)

        return api_success(results)
    except Exception as e:
        return api_error('Search operation failed', status=500)

@api.route('/pronounce', methods=['GET'])
def get_pronunciation():
    text = request.args.get('text', 'こんにちは')
    if not text:
        return api_error('Text is required', status=400)

    text_hash = hashlib.md5(text.encode('utf-8')).hexdigest()
    cache_file_path = os.path.join(CACHE_DIR, f"{text_hash}.wav")

    if os.path.exists(cache_file_path):
        with open(cache_file_path, "rb") as f:
            cached_audio = f.read()
        return api_media_success(cached_audio, mimetype="audio/wav")

    try:
        speaker_id = 29 # 11 for otoko
        query_payload = {"text": text, "speaker": speaker_id}
        query_res = requests.post(f"{VOICEVOX_URL}/audio_query", params=query_payload, timeout=5)
        
        if query_res.status_code != 200:
            return api_error('Failed to query VOICEVOX', status=500)

        synth_res = requests.post(
            f"{VOICEVOX_URL}/synthesis",
            params={"speaker": speaker_id},
            json=query_res.json()
        )

        if synth_res.status_code != 200:
            return api_error('Failed to synthesize audio', status=500)

        with open(cache_file_path, "wb") as f:
            f.write(synth_res.content)

        return api_media_success(synth_res.content, mimetype="audio/wav")

    except Exception as e:
        return api_error('Voice service unavailable', status=500)

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