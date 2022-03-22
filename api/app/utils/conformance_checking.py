from typing import Dict, List

from pm4py.algo.conformance.alignments.petri_net import algorithm as alignments
from pm4py.algo.conformance.tokenreplay import algorithm as token_replay
from pm4py.algo.filtering.log.ltl import ltl_checker as ltl_checker_log

from pm4py.objects.log.obj import EventLog


def get_conformance_checking(log, net, initial_marking, final_marking):
    replayed_traces = replayed_traces(log, net, initial_marking, final_marking)

    aligned_traces = aligned_traces(log, net, initial_marking, final_marking)

    return {
        "replayed_traces": replayed_traces,
        "alignments": aligned_traces,
    }


def replayed_traces(log, net, initial_marking, final_marking):
    return token_replay.apply(log, net, initial_marking, final_marking)


def aligned_traces(log, net, initial_marking, final_marking):
    return alignments.apply_log(log, net, initial_marking, final_marking)


def ltl_checker(log: EventLog, rule: str, params: Dict[str, str]) -> EventLog:
    if rule == "A_eventually_B":
        return ltl_checker_log.A_eventually_B(log, params["A"], params["B"])
    elif rule == "A_eventually_B_eventually_C":
        return ltl_checker_log.A_eventually_B_eventually_C(
            log, params["A"], params["B"], params["C"]
        )
    elif rule == "A_eventually_B_eventually_C_eventually_D":
        return ltl_checker_log.A_eventually_B_eventually_C_eventually_D(
            log, params["A"], params["B"], params["C"], params["D"]
        )
    elif rule == "A_next_B_next_C":
        return ltl_checker_log.A_next_B_next_C(
            log, params["A"], params["B"], params["C"]
        )
    elif rule == "four_eyes_principle":
        return ltl_checker_log.four_eyes_principle(log, params["A"], params["B"])
    elif rule == "attr_value_different_persons":
        return ltl_checker_log.attr_value_different_persons(log, params["A"])


def ltl_log(log, params: Dict[str, str]):
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

    return ltl_log
