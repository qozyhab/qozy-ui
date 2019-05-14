from aiohttp import web
from qozyd.controller import Controller, static_file_handler


class UIController(Controller):
    def routes(self):
        return [
            web.route("*", "/{path:.*}",
                      static_file_handler(package="qozy_ui", base_path="web/dist", directory_index="index.html"))
        ]
