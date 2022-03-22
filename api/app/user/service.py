from app import db
from typing import List
from .model import User

class UserService:
    @staticmethod
    def get_all() -> List[User]:
        return User.query.all()

    @staticmethod
    def create(email: str) -> User:
        new_user = User(email=email)

        db.session.add(new_user)
        db.session.commit()

        return new_user
