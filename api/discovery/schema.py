from marshmallow import fields, Schema

from .model import Discovery


class GvizRequestShema(Schema):
    """Discovery Schema"""

    eventlogId = fields.Integer()
    eventlogId = fields.Integer(attribute="eventlog_id")
    algorithm = fields.String(attribute="algorithm")
    case = fields.String(attribute="case")
    activity = fields.String(attribute="activity")
    timestamp = fields.String(attribute="timestamp")
    processId = fields.Integer(attribute="process_id")
    id = fields.Integer(attribute="id")
    processTree = fields.Boolean()
    heuNet = fields.Boolean()
    

class DiscoveryShema(Schema):
    """Discovery Schema"""

    __model__ = Discovery

    eventlogId = fields.Integer(attribute="eventlog_id")
    algorithm = fields.String(attribute="algorithm")
    case = fields.String(attribute="case")
    activity = fields.String(attribute="activity")
    timestamp = fields.String(attribute="timestamp")
    name = fields.String(attribute="name")
    processId = fields.Integer(attribute="process_id")
    id = fields.Integer(attribute="id")


class DiscoveryInfoSchema(DiscoveryShema):
    """Discovery Info Schema"""

    id = fields.Integer(attribute="id")
    fileName = fields.String(attribute="file_name")
    fileType = fields.String(attribute="file_type")
    createdAt = fields.DateTime(attribute="created_at")
    updatedAt = fields.DateTime(attribute="updated_at")


class DiscoveryGvizSchema(Schema):
    """Discovery Gviz schema"""

    gviz = fields.String()
    png = fields.String()


class DiscoveryStatisticsSchema(Schema):
    """Discovery Statistics schema"""

    statistics = fields.Raw()
