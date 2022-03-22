from marshmallow import fields, Schema


class BaseSchema(Schema):
    """Base schema"""

    success = fields.Boolean()
    message = fields.String()
