from datetime import datetime
import enum
from sqlalchemy import Integer, String, Boolean, Column, LargeBinary, ForeignKey, DateTime

from app import db

# class Industry(enum):
#     'AUTOMOTIVE'
#     'HEALTHCARE',
#     'ECOMMERCE',
#     'TELECOM',
#     'FINANCIAL SERVICES',
#     'EDUCATION',
#     'OTHER'

# Levels {
#     'LOW',
#     'MEDIUM',
#     'HIGH'
# }

# Regions {
#     'EUROPE',
#     'NORTH AMERICA',
#     'SOUTH AMERICA',
#     'AFRICA',
#     'ASIA'
# }


class Profile(db.Model):
    '''Enterprise profile'''

    __tablename__ = "profile"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True)
    company_name = Column(String(128), unique=True, nullable=False)
    industry = Column(String(128), nullable=False)
    region = Column(String(128), nullable=False)
    business_value = Column(Integer, nullable=True)
    number_of_employees = Column(Integer, nullable=False, default=1)
    employee_training = Column(Integer, nullable=False, default=1)
    budget = Column(Integer, nullable=True)
    budget_weight = Column(Integer, nullable=False, default=1)

    invested_amount = Column(Integer, nullable=True)
    known_vulnerabilities = Column(Integer, nullable=True)
    external_advisor = Column(Boolean, default=False, server_default='false')
    successful_attacks = Column(Integer, nullable=True, default=0)
    failed_attacks = Column(Integer, nullable=True, default=0)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    users = db.relationship("User", backref="profiles")
    
    underwritings = db.relationship("Underwriting", back_populates="profile")

    created_at = Column(DateTime, default=datetime.now())
    edited_at = Column(DateTime, default=datetime.now())
