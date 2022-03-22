from datetime import datetime
import enum
from sqlalchemy import Integer, String, Column, Enum, ForeignKey, DateTime, Text, JSON

from app import db


class Rule(enum.Enum):
    A_eventually_B = "A_eventually_B"
    A_eventually_B_eventually_C = "A_eventually_B_eventually_C"
    A_eventually_B_eventually_C_eventually_D = (
        "A_eventually_B_eventually_C_eventually_D"
    )
    A_next_B_next_C = "A_next_B_next_C"
    four_eyes_principle = "four_eyes_principle"
    attr_value_different_persons = "attr_value_different_persons"


class LTLRule(db.Model):
    __tablename__ = "ltl_rule"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True)
    name = Column(String(128), nullable=False)
    rule = Column(String(128), nullable=False)
    source_inssurer = Column(JSON)
    description = Column(Text)
    eventlog_id = Column(Integer, ForeignKey("eventlog_files.id"))
    eventlogs = db.relationship("Eventlog", backref="ltl_rules")
    edited_at = Column(DateTime, default=datetime.now())
    created_at = Column(DateTime, default=datetime.now())
