from marshmallow import fields, Schema

from app.helper.schema import BaseSchema

from .model import Profile


class ProfileBaseSchema(Schema):
    """Profile Base schema"""

    __model__ = Profile

    companyName = fields.String(attribute='company_name')
    industry = fields.String(attribute='industry')
    region = fields.String(attribute='region')
    businessValue = fields.Integer(attribute='business_value')
    nrEmployees = fields.Integer(attribute='number_of_employees')
    employeeTraining = fields.Integer(attribute='employee_training')
    budget = fields.Integer(attribute='budget')
    budgetWeight = fields.Integer(attribute='budget_weight')
    investedAmount = fields.Integer(
        attribute='invested_amount')
    knownVulnerabilities = fields.Integer(attribute='known_vulnerabilities')
    externalAdvisor = fields.Boolean(attribute='external_advisor')
    successfulAttacks = fields.Integer(
        attribute='successful_attacks')
    failedAttacks = fields.Integer(attribute='failed_attacks')
    

class ProfileCreateSchema(ProfileBaseSchema):
    """Profile create schema"""

    userId = fields.Integer(attribute='user_id')


class ProfileInfoSchema(ProfileBaseSchema):
    """Profile info schema"""

    userId = fields.Integer(attribute='user_id')
    id = fields.Integer(attribute='id')


class PrrofileResponseSchema(BaseSchema):

    data = fields.Nested(ProfileInfoSchema)
