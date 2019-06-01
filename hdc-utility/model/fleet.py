import dataclasses
from typing import List, Tuple

from model.fleet_type import FleetType


@dataclasses.dataclass
class Fleet:
    id: int
    name: str
    type: FleetType
    attack: int
    torpedo: int
    anti_air: int
    anti_sub: int
    slot: List[Tuple[int, int]]
