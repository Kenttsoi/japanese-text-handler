from flask import Blueprint, request, jsonify, Response
import json

api = Blueprint('api', __name__)

@app.route('/')
def hello():
    return "Hello, Japanese Annotator!"

@app.route('/sample1')
def sample1():
    wakati = MeCab.Tagger("-Owakati")
    answer = wakati.parse("pythonが大好きです").split()
    return answer

@app.route('/sample2')
def sample2():
    text = "今日、こんにちは"
    parsed = tagger.parse(text).splitlines()[:-1]
    return jsonify({'result': parsed})  # 返回 JSON

@app.route('/annotate', methods=['POST'])
def annotate():
    text = request.json.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'})
    parsed = tagger.parse(text).splitlines()[:-1]
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