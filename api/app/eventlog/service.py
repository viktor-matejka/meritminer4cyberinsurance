from datetime import datetime
import profile
from typing import Dict, List

from app import db
from app.utils.discovery import get_csv_log, get_unique_column_values
from app.utils.pandas import PandasUtils
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.objects.log.importer.xes.variants.iterparse import (
    import_from_string as xes_importer,
)
from werkzeug.datastructures import FileStorage

from .model import Eventlog as EventlogModel


class EventlogService:
    """Eventlog Service"""

    @staticmethod
    def get_all(process_id: int, profile_id: int) -> List[EventlogModel]:
        """Get all evetlog or filter for profile id or process id"""

        if profile_id:
            return EventlogModel.query.filter(
                EventlogModel.profile_id == profile_id
            ).all()

        if process_id:
            return EventlogModel.query.filter(
                EventlogModel.process_id == process_id
            ).all()

        return EventlogModel.query.all()

    @staticmethod
    def create(params: Dict[str, int | str | FileStorage]) -> EventlogModel:
        file = params.get("file")
        process_id = params.get("processId")
        profile_id = params.get("profileId")

        file_type = file.filename.split(".").pop().lower()
        new_eventlog = EventlogModel(
            process_id=process_id,
            file=file.stream.read(),
            file_name=file.filename,
            file_type=file_type,
            profile_id=profile_id,
        )
        db.session.add(new_eventlog)
        db.session.commit()
        return new_eventlog

    @staticmethod
    def get_by_id(eventlog_id: int) -> EventlogModel:
        return EventlogModel.query.get(eventlog_id)

    @staticmethod
    def get_table_view(eventlog_id: int) -> str:
        el = EventlogModel.query.get(eventlog_id)

        if el.file_type == "csv":
            df = PandasUtils.csv_to_df(el.file)
        else:
            log = xes_importer(el.file)
            df = log_converter.apply(
                log,
                variant=log_converter.Variants.TO_DATA_FRAME,
            )

        result = df.iloc[:10].to_json(orient="records")

        return {"data": result, "parameters": el}

    @staticmethod
    def delete_eventlog(eventlog_id: int) -> str:
        el = db.session.query(EventlogModel).get(eventlog_id)
        db.session.delete(el)
        db.session.commit()

        return EventlogModel.query.all()

    def get_activities(eventlog_id: int, activity: str = None):
        el = db.session.query(EventlogModel).get(eventlog_id)

        if not (activity or el.activity):
            return {
                "success": False,
                "message": "Need select parameters in Evetlog",
            }

        if el.case and el.activity and el.timestamp:
            params = {
                "case": el.case,
                "activity": el.activity,
                "timestamp": el.timestamp,
            }
        else:
            params = {}

        if el.file_type == "csv":
            log = get_csv_log(el.file, params)
        else:
            log = xes_importer(el.file)

        if activity:
            result = get_unique_column_values(log, activity)
        else:
            result = get_unique_column_values(log, el.activity)

        return {
            "success": True,
            "data": result,
        }

    @staticmethod
    def update(eventlog_id: int, params: Dict[str, str]):

        el = db.session.query(EventlogModel).get(eventlog_id)
        el.edited_at = datetime.now()

        for (key, value) in params.items():
            setattr(el, key, value)

        try:
            db.session.commit()
            return {"success": True, "message": "Updated parameters"}
        except Exception as e:
            return {"success": False, "message": e}

    @staticmethod
    def get_parameters(eventlog_id: int):

        el = EventlogModel.query.get(eventlog_id)

        if el.file_type == "csv":
            df = PandasUtils.csv_to_df(el.file)
        else:
            log = xes_importer(el.file)
            df = log_converter.apply(
                log,
                variant=log_converter.Variants.TO_DATA_FRAME,
            )
        
        return {"success": True, "data": df.keys().to_list()}
        # df = log_converter.apply(
        #     log,
        #     variant=log_converter.Variants.TO_DATA_FRAME,
        # )
