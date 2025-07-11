from app.utils.text_utils import katakana_to_hiragana
from flask import Blueprint, request, jsonify, Response, current_app
import unicodedata

api = Blueprint('api', __name__)

@api.route('/')
def hello():
    return "Hello, Japanese Annotator!"

@api.route('/sample1')
def sample1():
    answer = current_app.wakati_tagger.parse("pythonが大好きです").split()
    return answer

@api.route('/sample2')
def sample2():
    text = "今日、こんにちは"
    parsed = current_app.tagger.parse(text).splitlines()[:-1]
    return jsonify({'result': parsed})  # 返回 JSON

@api.route('/annotate', methods=['POST'])
def annotate():
    text = request.json.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'})
    parsed = current_app.tagger.parse(text).splitlines()[:-1]
    result = {'result':[], 'original': [], 'hiragana': [], 'katakana': []}
    for line in parsed:
        parts = line.split('\t')
        if len(parts) < 2:
            continue
        char_type = unicodedata.name(parts[0][0], 'None')
        if 'CJK UNIFIED IDEOGRAPH' in char_type:
            hiragana = katakana_to_hiragana(parts[1])
            result['result'].append(hiragana)
        else:
            result['result'].append(parts[0])
        result['original'].append(parts[0])
        result['katakana'].append(parts[1])
    return jsonify(result)