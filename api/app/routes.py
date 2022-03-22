def register_routes(api, app, root="api"):
    from app.user import register_routes as attach_user
    from app.eventlog import register_routes as attach_eventlog
    from app.discovery import register_routes as attach_discovery
    from app.conformance import register_routes as attach_conformance
    from app.dashboard import register_routes as attach_dashboard
    from app.profile import register_routes as attach_profile
    from app.process import register_routes as attach_process

    # Add routes
    attach_eventlog(api, app)
    attach_user(api, app)
    attach_discovery(api, app)
    attach_conformance(api, app)
    attach_dashboard(api, app)
    attach_profile(api, app)
    attach_process(api, app)
