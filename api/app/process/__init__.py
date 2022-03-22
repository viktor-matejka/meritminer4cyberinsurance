BASE_ROUTE = "process_naming"


def register_routes(api, app, root="api"):
    from .controller import api as process_api

    api.add_namespace(process_api, path=f"/{root}/{BASE_ROUTE}")
