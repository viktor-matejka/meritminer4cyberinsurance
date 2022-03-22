import profile
from typing import List

from flask import request
from flask_accepts import accepts, responds
from flask_restx import Namespace, Resource
from werkzeug.datastructures import FileStorage

from .model import Eventlog
from .schema import (
    EventlogActivitiesSchema,
    EventlogInfoSchema,
    EventlogUpdateSchema,
    EventlogViewSchema,
)
from .service import EventlogService


api = Namespace("Eventlog")

upload_parser = api.parser()
upload_parser.add_argument(
    "file", location="files", type=FileStorage, required=True, help="File"
)
upload_parser.add_argument("processId", type=int, required=True, help="Process ID")
upload_parser.add_argument("profileId", type=int, required=False, help="Profile ID")

activity_parser = api.parser()
activity_parser.add_argument(
    "activity", help="Set custom activity"
)

eventlog_filter = api.parser()
eventlog_filter.add_argument(
    "processId",
    help="Process ID for filtering Eventlog",
)
eventlog_filter.add_argument(
    "profileId",
    help="Profile ID for filtering Eventlog",
)


@api.route("/")
class EventlogResource(Resource):
    """Eventlog"""

    @api.expect(eventlog_filter)
    @responds(schema=EventlogInfoSchema(many=True), api=api)
    def get(self) -> List[Eventlog]:
        """Get all Eventlog"""

        process_id = eventlog_filter.parse_args().get("processId")
        profile_id = eventlog_filter.parse_args().get("profileId")
        return EventlogService.get_all(process_id, profile_id)

    @api.expect(upload_parser)
    @responds(schema=EventlogInfoSchema, status_code=201, api=api)
    def post(self) -> Eventlog:
        """Create a Single Eventlog"""

        return EventlogService.create(upload_parser.parse_args())


@api.route("/<int:eventlogId>/")
@api.param("eventlogId", "Eventlog database ID")
class EventlogIdResource(Resource):
    """Eventlog with ID"""

    @responds(schema=EventlogInfoSchema, api=api)
    def get(self, eventlogId: int) -> Eventlog:
        """Get Single Eventlog"""

        return EventlogService.get_by_id(eventlogId)

    @accepts(schema=EventlogUpdateSchema, api=api)
    @responds(schema=EventlogInfoSchema, api=api)
    def put(self, eventlogId: int) -> Eventlog:
        """Update Eventlog"""

        return EventlogService.update(eventlogId, request.parsed_obj)

    @responds(schema=EventlogInfoSchema(many=True), api=api)
    def delete(self, eventlogId: int) -> Eventlog:
        """Delete Single Eventlog"""

        return EventlogService.delete_eventlog(eventlogId)


@api.route("/<int:eventlogId>/view/")
@api.param("eventlogId", "Eventlog database ID")
class EventlogIdViewResource(Resource):
    """Eventlog with ID and activity"""

    
    @responds(schema=EventlogViewSchema, api=api)
    def get(self, eventlogId: int) -> List[str]:
        """Get Eventlog Activities"""

        return EventlogService.get_table_view(eventlogId)


@api.route("/<int:eventlogId>/activity/")
@api.param("eventlogId", "Eventlog database ID")
class EventlogIdActivitiesResource(Resource):
    """Eventlog with ID and activity"""

    @api.expect(activity_parser)
    @responds(schema=EventlogActivitiesSchema, api=api)
    def get(self, eventlogId: int) -> List[str]:
        """Get Eventlog Activities"""

        activity = activity_parser.parse_args().get("activity")
        return EventlogService.get_activities(eventlogId, activity)


@api.route("/<int:eventlogId>/parameters/")
@api.param("eventlogId", "Eventlog database ID")
class EventlogIdParametersResource(Resource):
    """Eventlog with ID and activity"""

    @responds(schema=EventlogActivitiesSchema, api=api)
    def get(self, eventlogId: int) -> List[str]:
        """Get Eventlog Parameters"""

        return EventlogService.get_parameters(eventlogId)
