import io
import json
from datetime import datetime
from typing import Dict

from app import db
from app.discovery.model import Discovery
from app.eventlog.model import Eventlog as EventlogModel
from app.utils.conformance_checking import (
    get_conformance_checking,
    ltl_checker,
    ltl_log,
)
from app.utils.gviz import gviz_dfg
from pm4py.algo.conformance.alignments.decomposed import algorithm as decomp_alignments
from pm4py.algo.conformance.alignments.petri_net import algorithm as alignments
from pm4py.algo.conformance.tokenreplay import algorithm as token_replay
from pm4py.algo.discovery.alpha import algorithm as alpha_miner
from pm4py.algo.discovery.inductive import algorithm as inductive_miner
from pm4py.algo.discovery.temporal_profile import (
    algorithm as temporal_profile_discovery,
)
from pm4py.algo.filtering.log.auto_filter.auto_filter import apply_auto_filter
from pm4py.objects.log.exporter.xes import exporter as xes_exporter
from pm4py.objects.log.exporter.xes.variants.line_by_line import (
    export_log_line_by_line as log_to_xes,
)
from pm4py.objects.log.importer.xes.variants.iterparse import (
    import_from_string as xes_importer,
)
from pm4py.visualization.petri_net import visualizer as pn_visualizer
from pm4py.objects.bpmn.importer.variants.lxml import (
    import_from_string as bpnm_importer,
)
from pm4py.algo.evaluation.replay_fitness import algorithm as replay_fitness_evaluator

from pm4py.objects.conversion.bpmn import converter as bpmn_converter

from pm4py.visualization.process_tree import visualizer as pt_visualizer
from pm4py.objects.petri_net.importer.variants.pnml import import_petri_from_string

# from pm4py.algo.decision_mining import algorithm as decision_mining


from ..eventlog.model import Eventlog as EventlogModel
from .model import LTLRule

TBR_PARAMETERS = token_replay.Variants.TOKEN_REPLAY.value.Parameters


class ConformanceService:
    """Conformance"""

    @staticmethod
    def get_all(eventlog_id: int, process_id):
        """Return all LTL Rules"""

        if eventlog_id:
            return LTLRule.query.filter(
                LTLRule.eventlog_id == eventlog_id,
            ).all()
        if process_id:
            eventlogs = EventlogModel.query.filter(
                EventlogModel.process_id == process_id
            )
            if not eventlogs:
                return []

            eventlogs_id = []
            for item in eventlogs:
                eventlogs_id.append(item.id)

            return LTLRule.query.filter(LTLRule.eventlog_id.in_(eventlogs_id))

        return LTLRule.query.all()

    @staticmethod
    def create_ltl(params: Dict[str, int | str]):
        source_inssurer = {
            "A": params["activityA"],
            "B": params["activityB"],
            "C": params["activityC"],
            "D": params["activityD"],
        }
        new_ltl_rule = LTLRule(
            name=params["name"],
            rule=params["rule"],
            source_inssurer=source_inssurer,
            description=params["description"],
            eventlog_id=params["eventlogId"],
        )

        db.session.add(new_ltl_rule)
        db.session.commit()

        return new_ltl_rule

    @staticmethod
    def get_ltl(id: int):
        ltl_rule = LTLRule.query.get(id)
        el = EventlogModel.query.get(ltl_rule.eventlog_id)
        log = xes_importer(el.file)

        try:
            ltl_log = ltl_checker(log, ltl_rule.rule, ltl_rule.source_inssurer)
        except Exception as e:
            return {"data": e}

        ltl_gviz = gviz_dfg(ltl_log)

        return {"data": str(ltl_gviz)}

    # TODO delete
    @staticmethod
    def generate_ltl(params: Dict[str, int | str]):
        el = EventlogModel.query.get(params["eventlogId"])
        log = xes_importer(el.file)
        attributes = {
            "A": params["activityA"],
            "B": params["activityB"],
            "C": params["activityC"],
            "D": params["activityD"],
        }

        try:
            ltl_log = ltl_checker(log, params["rule"], attributes)
        except Exception as e:
            ltl_log = e

        ltl_gviz = gviz_dfg(ltl_log)

        return {
            "data": str(ltl_gviz),
        }

    @staticmethod
    def generate_dfg(params: Dict[str, int | str]):
        el = EventlogModel.query.get(params["eventlogId"])
        log = xes_importer(el.file)

        if params.get("ltlChecker"):
            attributes = {
                "A": params["ltlChecker"]["activityA"],
                "B": params["ltlChecker"]["activityB"],
                "C": params["ltlChecker"]["activityC"],
                "D": params["ltlChecker"]["activityD"],
            }
            try:
                rule = params["ltlChecker"]["rule"]
                log = ltl_checker(log, rule, attributes)
            except Exception as e:
                print("error", e)
        else:
            attributes = {}

        # discovery = Discovery.query.get(params["modelId"])
        # if discovery.file_type == "bpmn":
        #     bpmn_graph = bpnm_importer(discovery.file)
        #     net, im, fm = bpmn_converter.apply(bpmn_graph)
        # elif discovery.file_type == "pnml":
        #     net, im, fm = import_petri_from_string(discovery.file)

        # if params.get("graphType") == "pn":
        #     gviz = pn_visualizer.apply(net, im, fm)
        if params.get("graphType") == "tree":
            tree = inductive_miner.apply_tree(log)
            gviz = pt_visualizer.apply(tree)
        else:
            gviz = gviz_dfg(log)

        # net, im, fm = decision_mining.create_data_petri_nets_with_decisions(
        #     log, net, im, fm
        # )

        return {
            "data": str(gviz),
        }

    @staticmethod
    def get_tbr(params: Dict[str, str]):
        el = EventlogModel.query.get(params["eventlogId"])

        log = xes_importer(el.file)

        if params.get("modelId"):
            discovery = Discovery.query.get(params["modelId"])
            if discovery.file_type == "bpmn":
                bpmn_graph = bpnm_importer(discovery.file)
                net, im, fm = bpmn_converter.apply(bpmn_graph)
            elif discovery.file_type == "pnml":
                net, im, fm = import_petri_from_string(discovery.file)

        parameters_tbr = {
            TBR_PARAMETERS.DISABLE_VARIANTS: True,
            # TBR_PARAMETERS.ENABLE_PLTR_FITNESS: True,
            TBR_PARAMETERS.RETURN_NAMES: lambda x: x[0],
        }

        replayed_traces = token_replay.apply(
            log, net, im, fm, parameters=parameters_tbr
        )

        fitness = replay_fitness_evaluator.apply(
            log, net, im, fm, variant=replay_fitness_evaluator.Variants.TOKEN_BASED
        )
        return {
            "data": json.dumps(replayed_traces),
            "fitness": fitness.get("perc_fit_traces"),
        }

    @staticmethod
    def get_alignments(params: Dict[str, str]):
        el = EventlogModel.query.get(params["eventlogId"])

        log = xes_importer(el.file)

        if params.get("modelId"):
            discovery = Discovery.query.get(params["modelId"])
            if discovery.file_type == "bpmn":
                bpmn_graph = bpnm_importer(discovery.file)
                net, im, fm = bpmn_converter.apply(bpmn_graph)
            elif discovery.file_type == "pnml":
                net, im, fm = import_petri_from_string(discovery.file)

        aligned_traces = alignments.apply_log(log, net, im, fm)

        fitness = replay_fitness_evaluator.apply(
            log, net, im, fm, variant=replay_fitness_evaluator.Variants.ALIGNMENT_BASED
        )

        return {
            "data": json.dumps(aligned_traces),
            "fitness": fitness.get("percFitTraces"),
        }

    @staticmethod
    def create_log(params: Dict[str, str]):
        el = EventlogModel.query.get(params["eventlogId"])

        log = xes_importer(el.file)
        attributes = {
            "A": params["activityA"],
            "B": params["activityB"],
            "C": params["activityC"],
            "D": params["activityD"],
        }

        try:
            ltl_log = ltl_checker(log, params["rule"], attributes)
        except Exception as e:
            print("ERROR:", e)
            return

        new_eventlog = EventlogModel()

        file_obj = io.BytesIO()
        file_obj.seek(0)
        with open("new_eventlog.xes", "wb") as file:
            log_to_xes(ltl_log, file, "utf-8")

        with open("new_eventlog.xes", "rb") as file:
            file_type = "xes"
            el_name = str(el.file_name).split(".")[0]
            file_name = f'{el_name}_{params["rule"]}'
            new_eventlog.process_id = params.get("processId", el.process_id)
            new_eventlog.file = file.read()
            new_eventlog.file_name = file_name
            new_eventlog.file_type = file_type
            new_eventlog.is_uploaded = False
            new_eventlog.case = el.case
            new_eventlog.activity = el.activity
            new_eventlog.timestamp = el.timestamp

        try:
            db.session.add(new_eventlog)
            db.session.commit()
        except Exception as e:
            print("ERROR:", e)
            return

        return new_eventlog
