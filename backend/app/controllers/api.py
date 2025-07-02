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
    result = []
    for line in parsed:
        parts = line.split('\t')
        if len(parts) < 2:
            continue
        katakana = parts[1].split(',')
        result.append(katakana)
        
    """ result = []
    for line in parsed:
        parts = line.split('\t')
        if len(parts) < 2:
            continue
        features = parts[1].split(',')
        if len(features) > 7 and features[7] and features[7] != '*':
            result.append({'kanji': parts[0], 'reading': features[7]}) """
    
    return jsonify(result)