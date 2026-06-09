from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import MeCab
from .controllers.api import api
from .config import config_dict
from .scripts.initiate_unihan import initiate_unihan
from .scripts.transform_unihan_dict import transform_unihan_dict
from .scripts.kanjidic_loader import load_kanjidic
from .scripts.transform_kanjidic_dict import transform_kanjidic_dict

# db = SQLAlchemy()

def create_app(config_env='development'):
    app = Flask(__name__)

    # load configuration
    if config_env not in config_dict:
        raise ValueError(f"Invaild config environment: {config_env}")
    app.config.from_object(config_dict[config_env])

    # register CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})

    # initiate database
    # db.init_app(app)

    # register MeCab taggers
    app.tagger = MeCab.Tagger() # default MeCab tagger
    app.wakati_tagger = MeCab.Tagger("-Owakati") # simple one for word segmentation
    
    # register Blueprint
    app.register_blueprint(api, url_prefix='/api')
    
    # Initiate data packaging
    try:
        with app.app_context():
            # db.create_all()
            # initiate_unihan() # Deprecated
            # transform_unihan_dict() # Deprecated
            load_kanjidic()
            transform_kanjidic_dict()
    except Exception as e:
        app.logger.error(f"Error during data processing: {e}")
        raise RuntimeError(f"Failed to initiate data: {e}")
    
    return app