from qozyd.plugins import PluginContextBuilder
from qozyd.services.service_container import Service, Reference


class UIPlugin(PluginContextBuilder):
    def services(self):
        return (
            Service("qozy_ui.controller.dashboard.DashboardController", "controller.dashboard", inject=(Reference("app_root"), Reference("plugin_root"), Reference("transaction_manager"), Reference("context"),)),
            Service("qozy_ui.controller.UIController", "controller.ui"),
        )
