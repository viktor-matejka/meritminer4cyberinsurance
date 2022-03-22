from typing import List

from app.eventlog.model import Eventlog as EventlogModel
from app.eventlog.schema import EventlogInfoSchema
from flask import request
from flask_accepts import accepts, responds
from flask_restx import Namespace, Resource, reqparse

from .schema import (
    CreteLogSchema,
    LTLCreateSchema,
    LTLInfoSchema,
    LTLRequestSchema,
    LTLResponseSchema,
    TBRSchema,
    DFGSchema,
)
from .service import ConformanceService

api = Namespace("Conformance")

ltl_parser = api.parser()
ltl_parser.add_argument("eventlogId", help="Eventlog database ID")
ltl_parser.add_argument("rule", help="LTL rule")
ltl_parser.add_argument("activityA", help="activity A")
ltl_parser.add_argument("activityB", help="activity B")
ltl_parser.add_argument("activityC", help="activity C")
ltl_parser.add_argument("activityD", help="activity D")

ltl_filter = api.parser()
ltl_filter.add_argument("eventlogId", help="Eventlog database ID")
ltl_filter.add_argument("processId", help="Process database ID")


@api.route("/log/")
class LogResource(Resource):
    """Creaate EventLog"""

    @accepts(schema=CreteLogSchema, api=api)
    @responds(schema=EventlogInfoSchema, api=api)
    def post(self) -> EventlogModel:
        """Create eventlog with LTL rule"""

        return ConformanceService.create_log(request.parsed_obj)


@api.route("/ltl/")
class LTLResource(Resource):
    """Generate and create LTL"""

    @api.expect(ltl_filter)
    @responds(schema=LTLInfoSchema(many=True), api=api)
    def get(self):
        """Filtering LTL by eventlog id or process id"""

        eventlog_id = ltl_filter.parse_args().get("eventlogId")
        process_id = ltl_filter.parse_args().get("processId")
        return ConformanceService.get_all(eventlog_id, process_id)

    @accepts(schema=LTLCreateSchema, api=api)
    @responds(schema=LTLInfoSchema, api=api)
    def post(self):
        """Create LTL"""

        return ConformanceService.create_ltl(request.parsed_obj)


@api.route("/ltl/<int:eventlogId>/")
@api.param("eventlogId", "Eventlog database ID")
class LTLIdResource(Resource):
    """Single LTL"""

    @accepts(schema=LTLRequestSchema, api=api)
    @responds(schema=LTLResponseSchema, api=api)
    def post(self, eventlogId: int):
        """Get Single LTL"""

        return ConformanceService.get_ltl(eventlogId)


@api.route("/ltl/generate/")
class LTLGenerateResource(Resource):
    """Generate Directly-Follows Graphs"""

    @accepts(schema=LTLRequestSchema, api=api)
    @responds(schema=LTLResponseSchema, api=api)
    def post(self):
        """Generate Directly-Follows Graphs"""

        return ConformanceService.generate_dfg(request.parsed_obj)


@api.route("/dfg/")
class DFGResource(Resource):
    """Generate Directly-Follows Graphs"""

    @accepts(schema=DFGSchema, api=api)
    @responds(schema=LTLResponseSchema, api=api)
    def post(self):
        """Generate Directly-Follows Graphs"""

        return ConformanceService.generate_dfg(request.parsed_obj)


@api.route("/tbr/")
class TokenResource(Resource):
    """Conformance Token-based replay"""

    @accepts(schema=TBRSchema, api=api)
    @responds(schema=LTLResponseSchema, api=api)
    def post(self):
        """Get Token-based replay"""

        return ConformanceService.get_tbr(request.parsed_obj)


@api.route("/alignment/")
class AlignmentsResource(Resource):
    """Aligments"""

    @accepts(schema=TBRSchema, api=api)
    @responds(schema=LTLResponseSchema, api=api)
    def post(self):
        """Get Aligments"""

        return ConformanceService.get_alignments(request.parsed_obj)
