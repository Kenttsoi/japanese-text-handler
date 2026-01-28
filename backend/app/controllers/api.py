from flask import Blueprint, request, jsonify, Response, current_app
from app.models.japanese_text_handler import JapaneseTextHandler
from app.models.japanese_text_handler import JapaneseTextConverter
from app.handlers.kuromoji_handler import KuromojiHandler
from app.utils.response import api_success, api_error

api = Blueprint('api', __name__)

@api.route('/')
def hello():
    return "Hello, Japanese Annotator!"

@api.route('/convert', methods=['POST'])
def convert():
    data = request.json
    text = data.get('text') if data else None
    if not text:
        return api_error('You need to enter text')
    try:
        print(text)
        converter = JapaneseTextConverter(text)
        result = converter.convert()
        return api_success(result)
    except Exception as e:
        return api_error('Conversion Error', status=500)

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
    print(text)
    if not text:
        return jsonify({'error': 'No text provided'})
    else:
        result = JapaneseTextHandler().annotate(text)
        return jsonify(result)