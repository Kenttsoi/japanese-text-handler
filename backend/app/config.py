import os

class Config:
    """Basic Setting"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
    CORS_ORIGINS = ['http://localhost:5173']

class DevelopmentConfig(Config):
    DEBUG = True
    HOST = '0.0.0.0'
    PORT = 5001

class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    HOST = '0.0.0.0'
    PORT = 5002

class ProductionConfig(Config):
    DEBUG = False
    HOST = '0.0.0.0'
    PORT = 5001

config_dict = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig
}