from typing import List

from app.helper.schema import BaseSchema
from flask import request
from flask_accepts import accepts, responds
from flask_restx import Namespace, Resource

from .model import ProcessNaming
from .schema import ProcessInfoSchema, ProcessSchema
from .service import ProcessService

api = Namespace("Process")


profile_filter = api.parser()
profile_filter.add_argument(
    "profileId",
    help="Profile ID for filtering Process",
)


@api.route("/")
class ProcessResource(Resource):
    """Process resource"""

    @api.expect(profile_filter)
    @responds(schema=ProcessInfoSchema(many=True), api=api)
    def get(self) -> List[ProcessNaming]:
        """Get all Processes"""

        profile_id = profile_filter.parse_args().get("profileId")
        return ProcessService.get_all(profile_id)

    @accepts(schema=ProcessSchema, api=api)
    @responds(schema=ProcessInfoSchema, status_code=201, api=api)
    def post(self) -> ProcessNaming:
        """Create a Single Process"""

        return ProcessService.create(request.parsed_obj)


@api.route("/<int:processId>/")
@api.param("processId", "Process database ID")
class ProcessIdResource(Resource):
    """Process resource with ID"""

    @responds(schema=ProcessInfoSchema, api=api)
    def get(self, processId: int) -> ProcessNaming:
        """Get Single Process"""

        return ProcessService.get_by_id(processId)

    @accepts(schema=ProcessSchema, api=api)
    @responds(schema=ProcessInfoSchema, api=api)
    def put(self, processId: int) -> ProcessNaming:
        """Update single Process"""

        return ProcessService.update(processId, request.parsed_obj)

    @responds(schema=BaseSchema, api=api)
    def delete(self, processId: int) -> ProcessNaming:
        """Delete Single Process"""

        return ProcessService.delete(processId)
