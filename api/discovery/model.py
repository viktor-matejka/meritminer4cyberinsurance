from datetime import datetime
from sqlalchemy import (
    Integer,
    String,
    Column,
    ForeignKey,
    DateTime,
    Text,
    Float,
    LargeBinary,
    JSON,
)

from app import db


class Discovery(db.Model):
    __tablename__ = "discovery"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True)
    process_id = Column(Integer, ForeignKey("process_naming.id"))
    discoveries = db.relationship("ProcessNaming", backref="discovery")
    name = Column(String(128), nullable=True)
    eventlog_id = Column(Integer, ForeignKey("eventlog_files.id"))
    discoveries = db.relationship("Eventlog", backref="discoveries")
    algorithm = Column(String(128), nullable=False)
    case = Column(String(128), nullable=True)
    activity = Column(String(128), nullable=True)
    timestamp = Column(String(128), nullable=True)
    file = Column(LargeBinary, nullable=False)
    file_name = Column(String(128), nullable=False)
    file_type = Column(String(16), nullable=False)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(
        DateTime,
        default=datetime.now(),
        onupdate=datetime.now(),
    )


class Statistic(db.Model):
    id = Column(Integer, primary_key=True)
    eventlog_id = Column(
        Integer,
        ForeignKey("eventlog_files.id"),
        nullable=False,
    )
    eventlog = db.relationship("Eventlog", backref="statistics")
    median_case_duration = Column(Float, nullable=True)
    number_of_cases = Column(Integer, nullable=True)
    number_of_events = Column(Integer, nullable=True)
    number_of_variants = Column(Integer, nullable=True)
    handover_of_work = Column(JSON, nullable=True)
    rework = Column(Integer, nullable=True)
    rework_rate = Column(Float, nullable=True)
    fitness = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(
        DateTime,
        default=datetime.now(),
        onupdate=datetime.now(),
    )
