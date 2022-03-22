from datetime import datetime

from app import db
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    LargeBinary,
    String,
    Boolean,
)


class Eventlog(db.Model):
    __tablename__ = "eventlog_files"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True)
    file = Column(LargeBinary)
    file_name = Column(String(128), nullable=False)
    file_type = Column(String(16), nullable=False)
    process_id = Column(Integer, ForeignKey("process_naming.id"))
    eventlogs = db.relationship("ProcessNaming", backref="eventlog_files")
    profile_id = Column(Integer, ForeignKey("profile.id"), nullable=True)
    eventlogs_prof = db.relationship("Profile", backref="eventlog_files")
    case = Column(String(128), nullable=True)
    activity = Column(String(128), nullable=True)
    timestamp = Column(String(128), nullable=True)
    is_uploaded = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.now())
    edited_at = Column(
        DateTime,
        default=datetime.now(),
        onupdate=datetime.now(),
    )
