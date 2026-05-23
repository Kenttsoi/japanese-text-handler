import os

class Config:
    """Basic Setting"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
    HOST = '0.0.0.0'
    # cors_raw = os.getenv('VITE_API_URL', 'http://localhost:5173')
    _default_origins = (
        "http://localhost:3000,"
        "http://localhost:5173,"
        "http://127.0.0.1:3000,"
        "http://127.0.0.1:5173"
    )
    _cors_raw= os.getenv('CORS_ALLOWED_ORIGINS', _default_origins)
    # CORS_ORIGINS = cors_raw.split(',')
    CORS_ORIGINS = [origin.strip() for origin in _cors_raw.split(',')]
    DEBUG = False

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        'postgresql://postgres:123456@localhost:5432'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True
    HOST = os.getenv('FLASK_RUN_HOST', '0.0.0.0')
    PORT = int(os.getenv('FLASK_RUN_PORT', 5001))

class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    HOST = '0.0.0.0'
    PORT = 5002

class ProductionConfig(Config):
    DEBUG = False
    PORT = int(os.environ.get('PORT', 5000))

config_dict = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}