from flask import Flask
from flask_restful import Resource, Api

from controllers.home import Home

app = Flask(__name__)
api = Api(app)


api.add_resource(Home, '/')

if __name__ == '__main__':
    app.run(host="0.0.0.0" , port=8081 , debug=True)