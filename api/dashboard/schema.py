from marshmallow import fields, Schema
from .model import Policy, Underwriting, Risk, Coverage, ConfidenceFactor
from ..conformance.schema import LTLInfoSchema


class StatisticsItemSchema(Schema):
    """Statistics Item schema"""

    key = fields.String()
    value = fields.Raw()


class DashboardShema(Schema):
    """Discovery info schema"""

    data = fields.List(fields.Nested(StatisticsItemSchema))


class UnderwritingSchema(Schema):
    """Underwriting create schema"""

    __model__ = Underwriting

    profileId = fields.Integer(attribute="profile_id")
    assessmentName = fields.String(attribute="assessment_name")
    eventlogId = fields.Integer(attribute="eventlog_id")


class UnderwritingInfoSchema(UnderwritingSchema):
    """Underwriting info schema"""

    id = fields.Integer(attribute="id")


class PolicySchema(Schema):
    """Policy create schema"""

    __model__ = Policy

    name = fields.String(attribute="name")
    insurer_name = fields.String(attribute="insurer_name")
    inssurer_id = fields.Number(attribute="inssurer_id")
    description = fields.String(attribute="description")
    underwriting_id = fields.Number(attribute="underwriting_id")


class PolicyInfoSchema(PolicySchema):
    """Policy info schema"""

    id = fields.Number(attribute="id")


class RiskSchema(Schema):
    """Eventlog create schema"""

    __model__ = Risk

    name = fields.String(attribute="name")
    rating = fields.Float(attribute="rating")
    policy_id = fields.Number(attribute="policy_id")


class RiskInfoSchema(RiskSchema):
    """Eventlog info schema"""

    id = fields.Number(attribute="id")


class CoverageSchema(Schema):
    """Coverage create schema"""

    __model__ = Coverage

    name = fields.String(attribute="name")
    description = fields.String(attribute="description")
    policy_id = fields.Number(attribute="policy_id")


class CoverageInfoSchema(CoverageSchema):
    """Coverage info schema"""

    id = fields.Number(attribute="id")


class ConfidenceFactorSchema(Schema):
    """ConfidenceFactor create schema"""

    __model__ = ConfidenceFactor

    name = fields.String(attribute="name")
    description = fields.String(attribute="description")
    rating = fields.Float(attribute="rating")
    coverage_id = fields.Number(attribute="coverage_id")


class ConfidenceFactorInfoSchema(ConfidenceFactorSchema):
    """ConfidenceFactor info schema"""

    id = fields.Number(attribute="id")


class DashboardLTLDataShema(Schema):
    """Statistics Item schema"""

    rule = fields.String()
    fitness = fields.Float()


class DashboardDataShema(Schema):
    """Statistics Item schema"""

    overallFitness = fields.Float()
    risks = fields.List(fields.Nested(RiskSchema))
    coverages = fields.List(fields.Nested(CoverageSchema))
    ltlRules = fields.List(fields.Nested(DashboardLTLDataShema))
