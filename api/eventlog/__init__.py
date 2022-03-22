from .model import Eventlog
# from .schema import WidgetSchema

BASE_ROUTE = "eventlog"


def register_routes(api, app, root="api"):
    from .controller import api as eventlog_api

    api.add_namespace(eventlog_api, path=f"/{root}/{BASE_ROUTE}")
