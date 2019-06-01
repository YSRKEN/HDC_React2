import dataclasses

from model.weapon_type import WeaponType


@dataclasses.dataclass
class Weapon:
    id: int
    name: str
    type: WeaponType
    attack: int
    torpedo: int
    anti_air: int
    anti_sub: int
