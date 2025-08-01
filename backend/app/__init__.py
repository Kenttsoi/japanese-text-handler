from flask import Flask
from flask_cors import CORS
import MeCab
from .controllers.api import api
from .config import config_dict
from .scripts.initiate_unihan import initiate_unihan
from .scripts.transform_unihan_dict import transform_unihan_dict

def create_app(config_env='development'):
    app = Flask(__name__)

    # load configuration
    if config_env not in config_dict:
        raise ValueError(f"Invaild config environment: {config_env}")
    app.config.from_object(config_dict[config_env])

    # register CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})

    # register MeCab taggers
    app.tagger = MeCab.Tagger() # default MeCab tagger
    app.wakati_tagger = MeCab.Tagger("-Owakati") # simple one for word segmentation

    # Initiate Unihan data packaging
    with app.app_context():
        initiate_unihan()
        transform_unihan_dict()

    # register Blueprint
    app.register_blueprint(api, url_prefix='/api')
    
    return app