from typing import List

from flask_restx import Namespace, Resource
from flask_accepts import responds, accepts
from flask import request
from werkzeug.datastructures import FileStorage


from app.helper.schema import BaseSchema


from .model import Discovery
from .service import DiscoveryService
from .schema import (
    DiscoveryShema,
    DiscoveryInfoSchema,
    DiscoveryGvizSchema,
    DiscoveryStatisticsSchema,
    GvizRequestShema,
)


BASE_ROUTE = "discovery"

api = Namespace("Discovery")

discovery_filter = api.parser()
discovery_filter.add_argument("processId", help="Process Naming ID")

upload_parser = api.parser()
upload_parser.add_argument(
    "file",
    location="files",
    type=FileStorage,
    required=True,
    help="file"
)
upload_parser.add_argument(
    "processId",
    type=str,
    required=True,
    help="Process database ID"
)
upload_parser.add_argument(
    "name",
    type=str,
    required=True,
    help='name'
)
upload_parser.add_argument(
    "eventlogId",
    type=str,
    required=False,
    help="Eventlog database ID"
)
upload_parser.add_argument(
    "case",
    type=str,
    required=False,
    help="case"
)
upload_parser.add_argument(
    "activity",
    type=str,
    required=False,
    help="activity"
)
upload_parser.add_argument(
    "timestamp",
    type=str,
    required=False,
    help="timestamp"
)
upload_parser.add_argument(
    "algorithm",
    type=str,
    required=False,
    help="Selected algorithm, one of them (alpha_miner, inductive_miner, heuristics_miner)"
)


parser = api.parser()
parser.add_argument("eventlogId", help="Eventlog database ID")
parser.add_argument("algorithm", help="Selected algorithm, one of them (alpha_miner, inductive_miner, heuristics_miner)")
parser.add_argument("case", help="case")
parser.add_argument("activity", help="activity")
parser.add_argument("timestamp", help="timestamp")


@api.route("/")
class DiscoveryResource(Resource):
    """Discovery"""

    @api.expect(discovery_filter)
    @responds(schema=DiscoveryInfoSchema(many=True), api=api)
    def get(self) -> List[Discovery]:
        """Get all or filter by eventlog id"""

        process_id = discovery_filter.parse_args().get("processId")
        return DiscoveryService.get_all(process_id)

    @accepts(schema=DiscoveryShema, api=api)
    @responds(schema=DiscoveryInfoSchema, status_code=201, api=api)
    def post(self) -> Discovery:
        """Create Discovery"""

        return DiscoveryService.create(request.parsed_obj)


@api.route("/<int:discoveryId>/")
@api.param("discoveryId", "Discovery database ID")
class DiscoveryIdResource(Resource):
    """Discovery with ID"""

    @responds(schema=DiscoveryInfoSchema, api=api)
    def get(self, discoveryId: int) -> Discovery:
        """Get Single Discovery"""

        return DiscoveryService.get_by_id(discoveryId)

    @accepts(schema=DiscoveryShema, api=api)
    @responds(schema=DiscoveryInfoSchema, api=api)
    def put(self, discoveryId: int) -> Discovery:
        """Update Discovery"""

        return DiscoveryService.update(discoveryId, request.parsed_obj)

    @responds(schema=BaseSchema, api=api)
    def delete(self, discoveryId: int):
        """Delete Single Discovery"""

        return DiscoveryService.delete(discoveryId)


@api.route("/gviz/")
class DiscoveryGvizResource(Resource):
    """Get Graphviz"""

    @accepts(schema=GvizRequestShema, api=api)
    @responds(schema=DiscoveryGvizSchema, api=api)
    def post(self):
        """Get graphviz"""

        return DiscoveryService.get_gviz(request.parsed_obj)


@api.route("/statistics/")
class DiscoveryStatisticsResource(Resource):
    """Get Statistics"""

    @api.expect(parser)
    @responds(schema=DiscoveryStatisticsSchema, api=api)
    def get(self):
        """Get statistics values"""

        params = parser.parse_args()
        if not params["algorithm"]:
            params["algorithm"] = "alpha_miner"

        return DiscoveryService.get_statistics(params)


@api.route("/bpmn/")
class DiscoveryBPMNResource(Resource):
    """Upload BPNM file"""

    @api.expect(upload_parser)
    @responds(schema=DiscoveryInfoSchema, status_code=201, api=api)
    def post(self) -> Discovery:
        """Upload BPNM file"""

        return DiscoveryService.upload_bpnm_flie(upload_parser.parse_args())
