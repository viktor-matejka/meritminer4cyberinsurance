from typing import List

from app.helper.schema import BaseSchema
from flask import request
from flask_accepts import accepts, responds
from flask_restx import Namespace, Resource

from .model import Profile
from .schema import (ProfileBaseSchema, ProfileCreateSchema, ProfileInfoSchema,
                     PrrofileResponseSchema)
from .service import ProfileService

api = Namespace("Profile")

user_filter = api.parser()
user_filter.add_argument("userId", help="User ID for filter Profile")


@api.route("/")
class ProfileResource(Resource):
    """Eventlog"""

    @api.expect(user_filter)
    @responds(schema=ProfileInfoSchema(many=True), api=api)
    def get(self) -> List[Profile]:
        """Get all Profile or filter by user"""

        user_id = user_filter.parse_args().get("userId")
        return ProfileService.get_all(user_id)

    @accepts(schema=ProfileCreateSchema, api=api)
    @responds(schema=PrrofileResponseSchema, status_code=201, api=api)
    def post(self) -> Profile:
        """Create a Single Profile"""

        return ProfileService.create(request.parsed_obj)


@api.route("/<int:profileId>/")
@api.param("profileId", "Profile database ID")
class ProfileIdResource(Resource):
    """Profile with ID"""

    @responds(schema=ProfileInfoSchema, api=api)
    def get(self, profileId: int) -> Profile:
        """Get Single Profile"""

        return ProfileService.get_by_id(profileId)

    @accepts(schema=ProfileBaseSchema, api=api)
    @responds(schema=ProfileInfoSchema, api=api)
    def put(self, profileId: int) -> Profile:
        """Update Singlie Profile"""

        return ProfileService.update(profileId, request.parsed_obj)

    @responds(schema=BaseSchema, api=api)
    def delete(self, profileId: int) -> Profile:
        """Delete Single Profile"""

        return ProfileService.delete(profileId)
