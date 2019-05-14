from aiohttp import web
from qozyd.controller import Controller
from qozyd.http.decorator import json_response, json_validate
from qozyd.http.utils import get_or_404
from qozyd.utils.json import JsonSchema, json_encode

from qozy_ui.models import Dashboard


class DashboardController(Controller):
    def __init__(self, app_root, plugin_root, transaction_manager, context):
        self.app_root = app_root
        self.plugin_root = plugin_root
        self.transaction_manager = transaction_manager
        self.context = context

    @json_response
    async def dashboards(self, request):
        return list(self.plugin_root.keys())

    @json_response
    async def dashboard(self, request):
        dashboard_id = request.match_info.get("dashboard_id")

        return get_or_404(self.plugin_root, dashboard_id)

    @json_response
    async def remove_dashboard(self, request):
        dashboard_id = request.match_info.get("dashboard_id")

        with self.transaction_manager:
            del self.plugin_root[dashboard_id]

        return True

    @json_response
    @json_validate(
        JsonSchema.object(
            properties=JsonSchema.properties(
                name=JsonSchema.string(),
            ),
            required=["name"])
    )
    async def add_dashboard(self, request):
        settings = await request.json()

        dashboard = Dashboard(settings["name"])
        with self.transaction_manager:
            self.plugin_root[dashboard.id] = dashboard

        return dashboard.id

    @json_response
    async def patch_dashboard(self, request):
        dashboard_id = request.match_info.get("dashboard_id")

        dashboard = get_or_404(self.plugin_root, dashboard_id)

        with self.transaction_manager as transaction:
            json_data = await request.json()
            dashboard.patch(json_data)

            if not dashboard.is_valid():
                errors = dashboard.validation_errors()
                transaction.abort()

                raise web.HTTPUnprocessableEntity(text=json_encode(errors), content_type="application/json")

        return dashboard

    def routes(self):
        return [
            web.get("/api/dashboard", self.dashboards),
            web.post("/api/dashboard", self.add_dashboard),
            web.get("/api/dashboard/{dashboard_id}", self.dashboard),
            web.delete("/api/dashboard/{dashboard_id}", self.remove_dashboard),
            web.patch("/api/dashboard/{dashboard_id}", self.patch_dashboard),
        ]
