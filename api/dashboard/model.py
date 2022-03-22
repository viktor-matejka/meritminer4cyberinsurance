from datetime import datetime
from sqlalchemy import Integer, String, Column, ForeignKey, DateTime, Text, Float

from app import db


class Underwriting(db.Model):
    __tablename__ = "underwritings"

    id = Column(Integer, primary_key=True)
    assessment_name = Column(String(128))
    eventlog_id = Column(Integer, ForeignKey("eventlog_files.id"))
    eventlog = db.relationship("Eventlog", backref="underwritings")
    profile_id = Column(Integer, ForeignKey("profile.id"))
    profile = db.relationship("Profile", back_populates="underwritings")
    user_id = Column(Integer, ForeignKey("users.id"))
    users = db.relationship("User", backref="underwritings")
    created_at = Column(DateTime, default=datetime.now())
    edited_at = Column(
        DateTime,
        default=datetime.now(),
        onupdate=datetime.now(),
    )


class Policy(db.Model):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True)
    name = Column(String(128))
    insurer_name = Column(String(128))
    inssurer_id = Column(Integer)
    description = Column(Text)
    underwriting_id = Column(Integer, ForeignKey("underwritings.id"))
    underwritings = db.relationship("Underwriting", backref="policies")
    created_at = Column(DateTime, default=datetime.now())


class Coverage(db.Model):
    __tablename__ = "coverages"

    id = Column(Integer, primary_key=True)
    name = Column(String(128))
    description = Column(Text)
    policy_id = Column(Integer, ForeignKey("policies.id"))
    policies = db.relationship("Policy", backref="coverages")
    created_at = Column(DateTime, default=datetime.now())


class ConfidenceFactor(db.Model):
    __tablename__ = "confidence_factors"

    id = Column(Integer, primary_key=True)
    name = Column(String(128))
    description = Column(Text)
    rating = Column(Float)
    coverage_id = Column(Integer, ForeignKey("coverages.id"))
    coverages = db.relationship("Coverage", backref="confidence_factors")
    created_at = Column(DateTime, default=datetime.now())


class Risk(db.Model):
    __tablename__ = "risks"

    id = Column(Integer, primary_key=True)
    name = Column(String(128))
    rating = Column(Float)
    policy_id = Column(Integer, ForeignKey("policies.id"))
    policies = db.relationship("Policy", backref="risks")
    created_at = Column(DateTime, default=datetime.now())
