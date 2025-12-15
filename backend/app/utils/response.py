from flask import jsonify

def api_success(result):
    return jsonify({"success": True, "result": result})

def api_error(message, status=400):
    return jsonify({"success": False, "message": message}), status