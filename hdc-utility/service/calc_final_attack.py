from typing import Dict

from model.fleet import Fleet
from model.weapon import Weapon


def calc_final_attack(fleet: Fleet, weapon_dict: Dict[id, Weapon]) -> Dict[str, int]:
    """最終攻撃力を算出する

    Parameters
    ----------
    fleet: Fleet
        艦船データ
    weapon_dict: Dict[id, Weapon]
        装備データ一覧

    Returns
    -------
        dict[シチュエーション]=最終攻撃力
    """
    return {}
