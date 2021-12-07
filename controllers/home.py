from flask_restful import Resource, Api

class Home(Resource):
    def get(self):
        return {'cus': 'get'}
    def post(self):
        return {'hello': 'POST'}
    def put(self):
        return {'hello': 'PUT'}
    def delete(self):
        return {'hello': 'delete'}
    