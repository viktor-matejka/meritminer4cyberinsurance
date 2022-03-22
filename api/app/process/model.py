from datetime import datetime

from app import db
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String


class ProcessNaming(db.Model):
    __tablename__ = "process_naming"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True)
    title = Column(String(128), nullable=False)
    description = Column(String(512))
    profile_id = Column(Integer, ForeignKey("profile.id"))
    profilees = db.relationship("Profile", backref="process")
    created_at = Column(DateTime, default=datetime.now())
    edited_at = Column(
        DateTime,
        default=datetime.now(),
        onupdate=datetime.now(),
    )
