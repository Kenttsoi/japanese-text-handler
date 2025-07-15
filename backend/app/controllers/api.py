from flask import Blueprint, request, jsonify, Response, current_app
from app.models.mecab_handler import MecabHandler

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
    else:
        result = MecabHandler().annotate(text)
        return jsonify(result)