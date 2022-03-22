from marshmallow import fields, Schema


class UserSchema(Schema):
    """User schema"""

    id = fields.Number(attribute="id")
    email = fields.String(attribute="email")
    active = fields.Boolean(attribute="active")


class UserEmailSchema(Schema):
    """User schema"""

    email = fields.String(attribute="email")
