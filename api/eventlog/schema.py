from app.helper.schema import BaseSchema
from marshmallow import Schema, fields

from .model import Eventlog


class EventlogParametersSchema(Schema):
    """Eventlog parameters Schema"""

    __model__ = Eventlog

    case = fields.String(attribute="case")
    activity = fields.String(attribute="activity")
    timestamp = fields.String(attribute="timestamp")


class EventlogUpdateSchema(EventlogParametersSchema):
    """Eventlog update Schema"""

    title = fields.String(attribute="title")


class EventlogInfoSchema(EventlogUpdateSchema):
    """Eventlog info schema"""

    id = fields.Number(attribute="id")
    file_name = fields.String(attribute="file_name")
    file_type = fields.String(attribute="file_type")
    processId = fields.Integer(attribute="process_id")
    profileId = fields.Integer(attribute="profile_id")
    isUploaded = fields.Boolean(attribute="is_uploaded")
    editedAt = fields.Date(attribute="edited_at")
    createdAt = fields.Date(attribute="created_at")


class EventlogViewSchema(Schema):
    """Eventlog info schema"""

    data = fields.String()
    parameters = fields.Nested(EventlogParametersSchema)


class EventlogActivitiesSchema(BaseSchema):
    """Eventlog List Activities"""

    data = fields.List(fields.String())
