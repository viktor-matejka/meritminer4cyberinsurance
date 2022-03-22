from marshmallow import Schema, fields

from .model import ProcessNaming


class ProcessSchema(Schema):
    """Process schema"""

    __model__ = ProcessNaming

    title = fields.String(attribute="title")
    description = fields.String(attribute="description")
    profileId = fields.Integer(attribute="profile_id")


class ProcessInfoSchema(ProcessSchema):
    """Process info schema"""

    id = fields.Integer(attribute="id")
