
from flask import request
from flask_accepts import accepts, responds
from flask_restx import Namespace, Resource
from typing import List

from .service import UserService
from .model import User
from .schema import UserSchema, UserEmailSchema

BASE_ROUTE = "user"

ns = Namespace("User")

@ns.route("/")
class UserResource(Resource):
    """User"""

    @responds(schema=UserSchema(many=True), api=ns)
    def get(self) -> List[User]:
        """Get all User"""

        return UserService.get_all()

    @accepts(schema=UserEmailSchema, api=ns)
    @responds(schema=UserSchema, api=ns)
    def post(self) -> User:
        """Create a Single User"""
        return UserService.create(request.parsed_obj.get('email'))