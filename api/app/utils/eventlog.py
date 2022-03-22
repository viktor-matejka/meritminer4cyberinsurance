from pm4py.objects.log.obj import EventLog

from pm4py.objects.log.importer.xes.variants.iterparse import (
    import_from_string as xes_importer,
)
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.util import constants, exec_utils

import pandas as pd

from app.utils.pandas import PandasUtils

from ..eventlog.model import Eventlog as EventlogModel


def get_log(el: EventlogModel, args) -> EventLog:
    """Get log from eventlog id"""

    timestamp = args["timestamp"] if args.get("timestamp") else el.timestamp
    activity = args["activity"] if args.get("activity") else el.activity
    case = args["case"] if args.get("case") else el.case

    if el.file_type.lower() == "xes":
        log = xes_importer(el.file)

        if timestamp:
            df = log_converter.apply(log, variant=log_converter.Variants.TO_DATA_FRAME)
            df[timestamp] = pd.to_datetime(df[timestamp])
            log = log_converter.apply(df, variant=log_converter.Variants.TO_EVENT_LOG)

    elif el.file_type.lower() == "csv":
        df = PandasUtils.csv_to_df(el.file)
        if timestamp:
            df[timestamp] = pd.to_datetime(df[timestamp])

        parameters = {}
        if activity:
            parameters.update({constants.PARAMETER_CONSTANT_ACTIVITY_KEY: activity})
        if case:
            parameters.update({constants.PARAMETER_CONSTANT_CASEID_KEY: case})
        if timestamp:
            parameters.update({constants.PARAMETER_CONSTANT_TIMESTAMP_KEY: timestamp})

        log = log_converter.apply(df, parameters=parameters)

    return log
