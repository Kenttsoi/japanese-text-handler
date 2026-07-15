from flask import jsonify, Response

def api_success(result):
    return jsonify({"success": True, "result": result})

def api_error(message, status=400):
    return jsonify({"success": False, "message": message}), status

def api_media_success(content, mimetype="audio/wav"):
    return Response(
        content,
        mimetype=mimetype,
        headers={
            "Content-Type": mimetype, 
            "Cache-Control": "public, max-age=86400" 
        }
    )