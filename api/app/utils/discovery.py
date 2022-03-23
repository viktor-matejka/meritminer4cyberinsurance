import base64
from faulthandler import disable
import pandas as pd
from typing import Dict, List, Tuple
import numpy as np
import json


import pm4py
from app.utils.pandas import PandasUtils
from pm4py.algo.discovery.alpha import algorithm as alpha_miner
from pm4py.algo.discovery.heuristics import algorithm as heuristics_miner
from pm4py.algo.discovery.inductive import algorithm as inductive_miner
from pm4py.algo.evaluation.replay_fitness import algorithm as replay_fitness
from pm4py.algo.evaluation.replay_fitness import algorithm as replay_fitness_evaluator
from pm4py.algo.filtering.log.variants import variants_filter
from pm4py.algo.organizational_mining.sna import algorithm as sna
from pm4py.objects.bpmn.exporter.variants.etree import get_xml_string as bpmn_exporter
from pm4py.objects.bpmn.importer.variants.lxml import (
    import_from_string as bpnm_importer,
)
from pm4py.objects.bpmn.layout import layouter
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.objects.conversion.process_tree import converter as converter_bpmn
from pm4py.objects.conversion.wf_net import converter as wf_net_converter
from pm4py.objects.log.importer.xes.variants.iterparse import (
    import_from_string as xes_importer,
)
from pm4py.objects.log.obj import EventLog
from pm4py.objects.petri_net.exporter import exporter as pnml_exporter
from pm4py.objects.petri_net.exporter.variants.pnml import export_petri_as_string
from pm4py.objects.petri_net.importer.variants.pnml import import_petri_from_string
from pm4py.visualization.petri_net import visualizer as pn_visualizer

from pm4py.objects.petri_net.obj import Marking, PetriNet
from pm4py.statistics.rework.cases.log import get as rework_cases
from pm4py.statistics.traces.generic.log import case_arrival, case_statistics
from pm4py.util import constants, exec_utils
from pm4py.visualization.bpmn import visualizer as bpmn_visualizer
from pm4py.visualization.process_tree import visualizer as pt_visualizer

from pm4py.visualization.heuristics_net import visualizer as hn_visualizer
from pm4py.visualization.sna import visualizer as sna_visualizer

from ..discovery.model import Discovery
from ..eventlog.model import Eventlog as EventlogModel
from ..utils.eventlog import get_log


def generate_pnml_file(params):
    """generate pnml bynary file"""

    eventlog = EventlogModel.query.get(params["eventlog_id"])
    if not eventlog:
        return

    log = get_log(eventlog, params)

    # Get Petri Net for save
    net, im, fm = process_discovery(
        log,
        params["activity"],
        params["algorithm"],
    )
    # Get bynary pnml
    file = export_petri_as_string(
        petrinet=net,
        marking=im,
        final_marking=fm,
    )

    el_file_name = eventlog.file_name.split(".")[0]
    file_type = "pnml"
    file_name = f"{el_file_name}_{params['algorithm']}.{file_type}"

    return file, file_type, file_name


def generate_bpmn_file(params) -> Tuple[bytes, str, str]:
    """generate bpmn bynary file"""

    eventlog = EventlogModel.query.get(params["eventlog_id"])
    if not eventlog:
        return
    log = get_log(eventlog)

    # Get Petri Net for save
    net, im, fm = process_discovery(
        log,
        params["activity"],
        params["algorithm"],
    )
    # Get binary BPMN file
    bpmn_graph = wf_net_converter.apply(
        net, im, fm, variant=wf_net_converter.Variants.TO_BPMN
    )
    file = bpmn_exporter(bpmn_graph)

    el_file_name = eventlog.file_name.split(".")[0]
    file_type = "bpmn"
    file_name = f"{el_file_name}_{params['algorithm']}.{file_type}"

    return file, file_type, file_name


def get_or_create_bpmn(params):
    if params.get("id") and params.get("id") != 0:
        discovery = Discovery.query.get(params.get("id"))
    else:
        discovery = Discovery.query.filter(
            # Discovery.activity == params["activity"],
            # Discovery.case == params["case"],
            # Discovery.timestamp == params["timestamp"],
            Discovery.algorithm == params["algorithm"],
            Discovery.eventlog_id == params["eventlog_id"],
        ).first()

    heu_net = params["algorithm"] == "inductive_miner" and params.get("processTree")
    tree = params["algorithm"] == "inductive_miner" and params.get("processTree")

    if discovery:
        if discovery.file_type == "bpmn":
            bpmn_graph = bpnm_importer(discovery.file)
            return bpmn_to_pn_gviz(bpmn_graph)
        elif discovery.file_type == "pnml":

            return pnml_to_pn_gviz(discovery.file, tree)

    file, _, _ = generate_pnml_file(params)

    return pnml_to_pn_gviz(file, tree)


def get_heu_net(params):
    heu_file = "heu_map.png"

    eventlog = EventlogModel.query.get(params["eventlog_id"])

    if not eventlog:
        return

    log = get_log(eventlog, params)
    heu_map = pm4py.discover_heuristics_net(log)
    heu_gviz = hn_visualizer.apply(heu_map)
    hn_visualizer.save(heu_gviz, heu_file)

    with open(heu_file, "rb") as f:
        png_file = f.read()
        encoded_string = base64.b64encode(png_file)

        return encoded_string


def process_discovery(
    log: EventLog, activity: str, algorithm: str = "alpha_miner"
) -> Tuple[PetriNet, Marking, Marking]:

    if "alpha_miner" == algorithm:
        if activity:
            parameters = {
                alpha_miner.Variants.ALPHA_VERSION_CLASSIC.value.Parameters.ACTIVITY_KEY: activity
            }
        else:
            parameters = {}
        net, initial_marking, final_marking = alpha_miner.apply(
            log, parameters=parameters
        )
    elif "inductive_miner" == algorithm:
        if activity:
            parameters = {
                inductive_miner.Variants.IMd.value.Parameters.ACTIVITY_KEY: activity
            }
        else:
            parameters = {}
        net, initial_marking, final_marking = inductive_miner.apply(
            log, parameters=parameters
        )
    elif "heuristics_miner" == algorithm:
        if activity:
            parameters = {
                heuristics_miner.Variants.CLASSIC.value.Parameters.ACTIVITY_KEY: activity,
            }
        else:
            parameters = {}
        net, initial_marking, final_marking = heuristics_miner.apply(
            log, parameters=parameters
        )

    return net, initial_marking, final_marking


def bpmn_to_pn_gviz(bpmn_graph):
    """Return GVIZ from BPMN"""
    parameters = bpmn_visualizer.Variants.CLASSIC.value.Parameters
    gviz = bpmn_visualizer.apply(bpmn_graph, parameters={parameters.FORMAT: "png"})
    return gviz


def pnml_to_pn_gviz(pnml_graph, tree=False):
    """Return GVIZ from PNML"""

    net, im, fm = import_petri_from_string(pnml_graph)

    if tree:
        tree = wf_net_converter.apply(net, im, fm)
        gviz = pt_visualizer.apply(
            tree,
            # parameters={"format": "svg"},
            # variant=pt_visualizer.Variants.FREQUENCY_ANNOTATION,
        )
    else:
        gviz = pn_visualizer.apply(net, im, fm)

    return gviz


def get_csv_log(file: bytes, params: Dict[str, str]) -> EventLog:
    df = PandasUtils.csv_to_df(file)
    parameters = {
        constants.PARAMETER_CONSTANT_CASEID_KEY: params["case"],
        constants.PARAMETER_CONSTANT_ACTIVITY_KEY: params["activity"],
        constants.PARAMETER_CONSTANT_TIMESTAMP_KEY: params["timestamp"],
    }
    event_log = log_converter.apply(df, parameters=parameters)
    return event_log


def get_statistics(log: EventLog, params: Dict[str, str]):
    case = params["case"]
    activity = params["activity"]
    timestamp = params["timestamp"]

    df = log_converter.apply(
        log,
        variant=log_converter.Variants.TO_DATA_FRAME,
    )
    unique_values = df.nunique()

    if case:
        cases_count = str(unique_values[case])
    else:
        cases_count = None

    if activity:
        events_count = str(unique_values[activity])
    else:
        events_count = None

    try:
        median_case_duration = case_statistics.get_median_caseduration(
            log,
            parameters={
                case_statistics.Parameters.TIMESTAMP_KEY: timestamp,
            },
        )
    except Exception as e:
        print("Median Case Duration. ERROR:", e)
        median_case_duration = None

    try:
        variants_count = len(case_statistics.get_variant_statistics(log))
    except Exception as e:
        print("Number of Variants. ERROR:", e)
        variants_count = None

    try:
        parameters = {
            sna.Parameters.ACTIVITY_KEY: activity,
            sna.Parameters.RESOURCE_KEY: activity,
        }
        hw_values = sna.apply(
            log, variant=sna.Variants.HANDOVER_LOG, parameters=parameters
        )
        hw_values = get_network_data(hw_values)

    except Exception as e:
        print("Handover of Work. ERROR: ", e)
        hw_values = None

    try:
        dictio = rework_cases.apply(log)
        dictio_count = get_rework_count(dictio)
    except Exception as e:
        print("Rework (cases). ERROR: ", e)
        dictio_count = None

    net, im, fm = process_discovery(log, activity)
    try:
        fitness = replay_fitness_evaluator.apply(
            log,
            net,
            im,
            fm,
            variant=replay_fitness_evaluator.Variants.TOKEN_BASED,
        )
    except Exception as e:
        print("Average Trace Fitness. ERROR: ", e)
        fitness = {}

    try:
        rework_rate = round(dictio_count / int(cases_count), 2)
    except Exception as e:
        rework_rate = None
        print("Rework rate. ERROR: ", e)

    result = [
        {"key": "Median Case Duration", "value": median_case_duration},
        {"key": "Number of Cases", "value": cases_count},
        {"key": "Number of Events", "value": events_count},
        {"key": "Number of Variants", "value": variants_count},
        {"key": "Rework (cases)", "value": dictio_count},
        {"key": "Rework rate", "value": rework_rate},
        {
            "key": "Average Trace Fitness",
            "value": fitness.get("average_trace_fitness"),
        },
        {"key": "Handover of Work", "value": json.dumps(hw_values)},
    ]
    return result


def get_heu_net_png(params):
    el = EventlogModel.query.get(params["eventlog_id"])

    return


def get_rework_count(data):
    rework_count = 0
    for item in data:
        if data[item]["rework"] > 0:
            rework_count += 1
    return rework_count


def get_rework_percent(data):
    activity_count = 0
    rework_count = 0
    for item in data:
        activity_count += data[item]["number_activities"]
        rework_count += data[item]["rework"]
    return round((rework_count / activity_count) * 100, 2)


def get_unique_column_values(log: EventLog, column: str) -> List[str]:
    df = log_converter.apply(log, variant=log_converter.Variants.TO_DATA_FRAME)
    return df[column].unique()


def get_network_data(metric_values, parameters=None):

    if parameters is None:
        parameters = {}

    weight_threshold = exec_utils.get_param_value("weight_threshold", parameters, 0)

    rows, cols = np.where(metric_values[0] > weight_threshold)
    edges = zip(rows.tolist(), cols.tolist())

    edges_result = []
    for item in edges:
        temp = {"from": item[0], "to": item[1]}
        edges_result.append(temp)

    nodes = []
    for index, item in enumerate(metric_values[1]):
        temp = {"id": index, "label": item}
        nodes.append(temp)

    result = {"nodes": nodes, "edges": list(edges_result)}

    return result
