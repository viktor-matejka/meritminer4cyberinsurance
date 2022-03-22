from datetime import datetime
from typing import Dict, List

from app import db

from .model import Profile


class ProfileService:
    @staticmethod
    def get_all(user_id: int) -> List[Profile]:
        '''Return all Profiles'''

        if user_id:
            return Profile.query.filter(user_id == user_id).all()
        return Profile.query.all()

    @staticmethod
    def create(params: Dict[str, str]) -> Profile:
        '''Create new Profile'''

        new_profile = Profile(
            company_name=params.get('company_name'),
            industry=params.get('industry'),
            region=params.get('region'),
            business_value=params.get('business_value'),
            number_of_employees=params.get('number_of_employees'),
            employee_training=params.get('employee_training'),
            budget=params.get('budget'),
            budget_weight=params.get('budget_weight'),
            invested_amount=params.get('invested_amount'),
            known_vulnerabilities=params.get('known_vulnerabilities'),
            external_advisor=params.get('external_advisor'),
            successful_attacks=params.get('successful_attacks'),
            failed_attacks=params.get('failed_attacks'),
            user_id=params.get('user_id'),
        )

        db.session.add(new_profile)
        try:
            db.session.commit()
            return {"data": new_profile}
        except Exception as e:
            return {
                "success": False,
                "message": f"Company name '{params.get('company_name')}' already exists"
            }

    @ staticmethod
    def get_by_id(profile_id: int) -> Profile:
        """Get single Profile"""

        return Profile.query.get(profile_id)

    @ staticmethod
    def update(profile_id: int, params: Dict[str, str]):
        """Update single Profile"""

        profile = db.session.query(Profile).get(profile_id)
        profile.company_name = params.get('company_name')
        profile.industry = params.get('industry')
        profile.region = params.get('region')
        profile.business_value = params.get('business_value')
        profile.number_of_employees = params.get('number_of_employees')
        profile.employee_training = params.get('employee_training')
        profile.budget = params.get('budget')
        profile.budget_weight = params.get('budget_weight')
        profile.invested_amount = params.get('invested_amount')
        profile.known_vulnerabilities = params.get('known_vulnerabilities')
        profile.external_advisor = params.get('external_advisor')
        profile.successful_attacks = params.get('successful_attacks')
        profile.failed_attacks = params.get('failed_attacks')
        profile.edited_at = datetime.now()

        try:
            db.session.flush()
            db.session.commit()
        except Exception as e:
            db.session.rollback()

        return profile

    @ staticmethod
    def delete(profile_id: int) -> Dict[str, str | bool]:
        """Delete single Profile"""

        profile = db.session.query(Profile).get(profile_id)
        db.session.delete(profile)

        try:
            db.session.commit()
            return {'success': True, "message": 'Profile deleted'}
        except Exception as e:
            return {'success': True, "message": e}
