from datetime import datetime
from typing import Dict, List

from app import db
from app.utils.discovery import get_csv_log, get_unique_column_values
from app.utils.pandas import PandasUtils
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.objects.log.importer.xes.variants.iterparse import (
    import_from_string as xes_importer,
)

from .model import ProcessNaming


class ProcessService:
    """Eventlog Service"""

    @staticmethod
    def get_all(profile_id: int) -> List[ProcessNaming]:
        """Get all process or filter for profile id"""

        if profile_id:
            return ProcessNaming.query.filter(ProcessNaming.profile_id == profile_id).all()

        return ProcessNaming.query.all()

    @staticmethod
    def create(params: Dict[str, int | str]) -> ProcessNaming:
        """Create single process"""
        
        new_process = ProcessNaming(
            title=params.get("title"),
            description=params.get("description"),
            profile_id=params.get("profile_id"),
        )
        db.session.add(new_process)
        db.session.commit()
        return new_process

    @staticmethod
    def get_by_id(process_id: int) -> ProcessNaming:
        """Get single process"""

        return ProcessNaming.query.get(process_id)

    @staticmethod
    def delete(process_id: int):
        """Delete singele process"""

        process = db.session.query(ProcessNaming).get(process_id)

        try:
            db.session.delete(process)
            db.session.commit()
            return {"success": True, "message": "Success delete Process"}
        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": str(e)}

    @staticmethod
    def update(process_id: int, params: Dict[str, str]):

        process = db.session.query(ProcessNaming).get(process_id)
        # process.edited_at = datetime.now()

        for (key, value) in params.items():
            setattr(process, key, value)

        try:
            db.session.commit()
            return {"success": True, "message": "Updated parameters"}
        except Exception as e:
            return {"success": False, "message": e}
