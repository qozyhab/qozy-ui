import uuid
from persistent import Persistent

from qozyd.utils.api import ApiObject, Integer, Field, Relation, Array


class Size(Persistent, ApiObject):
    width = Integer(minimum=1, maximum=12)
    height = Integer(minimum=1, maximum=12)

    def __init__(self, width, height):
        self.width = width
        self.height = height


class Position(Persistent, ApiObject):
    column = Integer(minimum=1, maximum=12)
    row = Integer(minimum=1, maximum=12)

    def __init__(self, column, row):
        self.column = column
        self.row = row


class Control(Persistent, ApiObject):
    type = Field("string")
    settings = Field("object")


class Tile(Persistent, ApiObject):
    headline = Field("string")
    position = Relation(Position)
    size = Relation(Size)
    orientation = Field("string", required=False, nullable=True)
    controls = Array(Relation(Control))


class Dashboard(Persistent, ApiObject):
    id = Field("string")
    name = Field("string")
    size = Relation(Size)
    tiles = Array(Relation(Tile))

    def __init__(self, name):
        self.id = str(uuid.uuid4())
        self.name = name
        self.size = Size(4, 4)
        self.tiles = []
