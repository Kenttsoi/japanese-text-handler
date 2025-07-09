from app.utils.text_utils import katakana_to_hiragana
from flask import Blueprint, request, jsonify, Response, current_app
import json

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
    result = {'original': [], 'hiragana': [], 'katakana': []}
    for line in parsed:
        parts = line.split('\t')
        if len(parts) < 2:
            continue
        hiragana = katakana_to_hiragana(parts[1])
        result['original'].append(parts[0])
        result['hiragana'].append(hiragana)
        result['katakana'].append(parts[1])
    return jsonify(result)