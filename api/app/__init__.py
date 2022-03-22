from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_restx import Api
from flask_migrate import Migrate

db = SQLAlchemy()




def create_app(env=None):
    from app.config import config_by_name
    from app.routes import register_routes

    app = Flask(__name__)
    app.config.from_object(config_by_name[env or "test"])
    api = Api(app, title="Flask API", version="0.1.0")
    CORS(app, support_credentials=True)
    
    register_routes(api, app)
    db.init_app(app)
    
    Migrate(app, db, compare_type=True)

    return app