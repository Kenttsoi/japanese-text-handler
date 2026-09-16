import time
from flask import jsonify, Response

def api_success(result=None, code="SUCCESS", message=None, status=200):
    return jsonify({
        "success": True,
        "code": code,
        "result": result,
        "message": message,
        "timestamp": int(time.time() * 1000)
    }), status

def api_error(message, code="BAD_REQUEST", status=400):
    return jsonify({
        "success": False,
        "code": code,
        "result": None,
        "message": message,
        "timestamp": int(time.time() * 1000)
    }), status

def api_media_success(content, mimetype="audio/wav"):
    return Response(
        content,
        mimetype=mimetype,
        headers={
            "Content-Type": mimetype, 
            "Cache-Control": "public, max-age=86400" 
        }
    )