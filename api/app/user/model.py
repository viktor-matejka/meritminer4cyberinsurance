from sqlalchemy import Integer, Column, String, Boolean

from app import db


class User(db.Model):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(128), unique=True, nullable=False)
    active = Column(Boolean(), default=True, nullable=False)

    def __init__(self, email):
        self.email = email
