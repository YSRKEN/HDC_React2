import dataclasses
from typing import List

from model.Formation import Formation


@dataclasses.dataclass
class FleetsPattern:
    map_name: str  # マップ名
    position_name: str  # マス名
    pattern_index: int  # 当該マスにおけるパターン番号
    formation: Formation  # 陣形
    boss_flg: bool   # ボスマスならTrue
    final_flg: bool  # 最終編成ならTrue
    enemy: List[int]  # 深海棲艦の一覧
