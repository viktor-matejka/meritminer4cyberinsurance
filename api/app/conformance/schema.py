from marshmallow import fields, Schema, validate

from app.eventlog.schema import EventlogParametersSchema

from .model import LTLRule


class LTLCheckerSchema(Schema):
    """LTL checker Schema"""

    activityA = fields.String()
    activityB = fields.String()
    activityC = fields.String()
    activityD = fields.String()
    rule = fields.String()


class TBRSchema(Schema):
    """LTL Request Schema"""

    eventlogId = fields.Number()
    modelId = fields.Number()
    # ltlChecker = fields.Nested(LTLCheckerSchema)


class DFGSchema(TBRSchema):
    """LTL Request Schema"""

    eventlogId = fields.Number()
    modelId = fields.Number()
    ltlChecker = fields.Nested(LTLCheckerSchema)
    graphType = fields.String()
    parameters = fields.Nested(EventlogParametersSchema)


class LTLRequestSchema(Schema):
    """LTL Request Schema"""

    eventlogId = fields.Integer()
    activityA = fields.String()
    activityB = fields.String()
    activityC = fields.String()
    activityD = fields.String()
    rule = fields.String()


class CreteLogSchema(LTLRequestSchema):
    """Create log with LTL rule Schema"""

    processId = fields.Integer()
    profileId = fields.Inferred()


class LTLCreateSchema(LTLRequestSchema):
    """LTL Create Schema"""

    name = fields.String()
    description = fields.String()


class LTLResponseSchema(Schema):
    """LTL Response Schema"""

    data = fields.String()
    fitness = fields.Number()


class LTLInfoSchema(Schema):
    """LTL Response Schema"""

    __model__ = LTLRule

    id = fields.String(attribute="id")
    name = fields.String(attribute="name")
    description = fields.Str(attribute="description")
    rule = fields.String(data_key="rule")
    eventlogId = fields.Integer(data_key="eventlog_id")
    source_inssurer = fields.Field(data_key="source_inssurer")

    class Meta:
        fields = ("id", "name", "description", "rule", "eventlog_id", "source_inssurer")


class LTLListScheme(Schema):
    """LTL List Response Schema"""

    data = fields.List(fields.Nested(LTLInfoSchema))
