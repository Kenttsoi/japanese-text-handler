import os
from app import create_app

env = os.environ.get('FLASK_CONFIG') or 'default'
app = create_app(env)

if __name__ == '__main__':
    app.run(host=app.config['HOST'], port=app.config['PORT'], debug=app.config['DEBUG'])