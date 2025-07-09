from flask import Flask
from flask_cors import CORS
import MeCab
from .controllers.api import api
from .config import config_dict

def create_app(config_env='development'):
    app = Flask(__name__)

    # 載入指定環境配置
    if config_env not in config_dict:
        raise ValueError(f"Invaild config environment: {config_env}")
    app.config.from_object(config_dict[config_env])

    # 初始化 CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})

    # 初始化 MeCab
    app.tagger = MeCab.Tagger() # default MeCab tagger
    app.wakati_tagger = MeCab.Tagger("-Owakati") # simple one for word segmentation

    # 註冊 Blueprint
    app.register_blueprint(api, url_prefix='/api')
    
    return app