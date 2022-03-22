import base64
from typing import Dict, List
import datetime
from app.utils.discovery import get_heu_net
from app.utils.discovery import generate_pnml_file
from app.utils.eventlog import get_log
from app import db
from app.discovery.model import Statistic
from app.eventlog.model import Eventlog as EventlogModel
from app.utils.discovery import (
    generate_bpmn_file,
    get_csv_log,
    get_or_create_bpmn,
    get_statistics,
)
from pm4py.objects.log.importer.xes.variants.iterparse import (
    import_from_string as xes_importer,
)
from pm4py.algo.discovery.alpha import algorithm as alpha_miner
from pm4py.algo.discovery.inductive import algorithm as inductive_miner
from pm4py.algo.discovery.heuristics import algorithm as heuristics_miner
from pm4py.visualization.heuristics_net import visualizer as hn_visualizer
from pm4py.visualization.petri_net import visualizer as pn_visualizer
import pm4py


from .model import Discovery

# from pm4py.objects.bpmn.importer.variants.lxml import \
#     import_from_string as bpnm_importer
# from pm4py.objects.petri_net.exporter.variants.pnml import \
#     export_petri_as_string


class DiscoveryService:
    """Discovery Services"""

    @staticmethod
    def get_all(process_id: int) -> List[Discovery]:
        """Get all Discovery or filter by eventlog_id"""

        if process_id:
            return Discovery.query.filter(
                Discovery.process_id == process_id,
            ).all()
        return Discovery.query.all()

    @staticmethod
    def create(params: Dict[str, str | int]) -> Discovery:
        """Create Discovery"""

        file, file_type, file_name = generate_pnml_file(params)

        new_discovery = Discovery(
            file=file,
            file_name=file_name,
            file_type=file_type,
            **params,
        )

        db.session.add(new_discovery)
        db.session.commit()

        return new_discovery

    @staticmethod
    def upload_bpnm_flie(params: Dict[str, str | int]) -> Discovery:
        """Upload BPMN file"""

        file = params.get("file")
        file_type = file.filename.split(".").pop().lower()
        new_discovery = Discovery(
            file=file.stream.read(),
            file_name=file.filename,
            file_type=file_type,
            process_id=params.get("processId"),
            name=params.get("name"),
            timestamp=params.get("timestamp"),
            activity=params.get("activity"),
            case=params.get("case"),
            algorithm=params.get("algorithm"),
            eventlog_id=params.get("eventlogId"),
        )

        db.session.add(new_discovery)
        db.session.commit()

        return new_discovery

    @staticmethod
    def get_by_id(discovery_id: int) -> Discovery:
        """Get single Discovery by ID"""

        return Discovery.query.get(discovery_id)

    @staticmethod
    def update(discovery_id: int, params: Dict[str, str | int]) -> Discovery:
        """Update Discovery"""

        file, _, file_name = generate_bpmn_file(params)

        discovery = db.session.query(Discovery).get(discovery_id)
        discovery.file = file
        discovery.file_name = file_name
        discovery.algorithm = params["algorithm"]
        discovery.case = params["case"]
        discovery.activity = params["activity"]
        discovery.timestamp = params["timestamp"]

        db.session.commit()

        return discovery

    @staticmethod
    def delete(discovery_id: int) -> Discovery:
        """Delete Discovery by ID"""

        discovery = db.session.query(Discovery).get(discovery_id)

        try:
            db.session.delete(discovery)
            db.session.commit()
            return {"success": True, "message": "Success deleted"}
        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": str(e)}

    @staticmethod
    def get_gviz(params: Dict[str, str]) -> Dict[str, str]:
        """Get GVIZ"""

        if params.get("heuNet"):
            png_file = get_heu_net(params)
            return {"gviz": None, "png": png_file.decode("utf-8")}

        gviz = get_or_create_bpmn(params)
        return {"gviz": str(gviz), "png": None}

    @staticmethod
    def get_statistics(params: Dict[str, str]) -> EventlogModel:
        eventlog_id = params["eventlogId"]

        el = db.session.query(EventlogModel).get(eventlog_id)

        log = get_log(el, params)

        stat = (
            db.session.query(Statistic)
            .filter(
                Statistic.eventlog_id == eventlog_id,
            )
            .first()
        )

        if (
            stat
            and stat.median_case_duration
            and stat.number_of_cases
            and stat.number_of_events
            and stat.number_of_variants
            and stat.rework
            and stat.rework_rate
            and stat.fitness
            and stat.handover_of_work
        ):
            stat_dict = [
                {
                    "key": "Median Case Duration",
                    "value": stat.median_case_duration,
                },
                {
                    "key": "Number of Cases",
                    "value": stat.number_of_cases,
                },
                {
                    "key": "Number of Events",
                    "value": stat.number_of_events,
                },
                {
                    "key": "Number of Variants",
                    "value": stat.number_of_variants,
                },
                {
                    "key": "Rework (cases)",
                    "value": stat.rework,
                },
                {
                    "key": "Rework rate",
                    "value": stat.rework_rate,
                },
                {
                    "key": "Average Trace Fitness",
                    "value": stat.fitness,
                },
                {
                    "key": "Handover of Work",
                    "value": stat.handover_of_work,
                },
            ]
            return {"statistics": stat_dict}

        statistics = get_statistics(log, params)

        if stat:
            stat.eventlog_id = eventlog_id
            stat.median_case_duration = statistics[0]["value"]
            stat.number_of_cases = statistics[1]["value"]
            stat.number_of_events = statistics[2]["value"]
            stat.number_of_variants = statistics[3]["value"]
            stat.rework = statistics[4]["value"]
            stat.rework_rate = statistics[5]["value"]
            stat.fitness = statistics[6]["value"]
            stat.handover_of_work = statistics[7]["value"]
        else:
            stat = Statistic(
                eventlog_id=eventlog_id,
                median_case_duration=statistics[0]["value"],
                number_of_cases=statistics[1]["value"],
                number_of_events=statistics[2]["value"],
                number_of_variants=statistics[3]["value"],
                rework=statistics[4]["value"],
                rework_rate=statistics[5]["value"],
                fitness=statistics[6]["value"],
                handover_of_work=statistics[7]["value"],
            )
            db.session.add(stat)

        db.session.commit()

        if statistics[0].get("value"):
            statistics[0]["value"] = str(
                datetime.timedelta(seconds=statistics[0]["value"])
            )

        return {"statistics": statistics}
