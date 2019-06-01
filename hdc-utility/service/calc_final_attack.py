from typing import Dict, List

from model.Formation import Formation
from model.attack_type import AttackType
from model.engagement import Engagement
from model.fleet import Fleet
from model.fleet_type import FleetType
from model.weapon import Weapon


CL2_STR = {True: 'CL2', False: 'CL1'}

FORMATION_STR = {
    Formation.LINE_AHEAD: '単縦',
    Formation.DOUBLE_LINE: '複縦',
    Formation.DIAMOND: '輪形',
    Formation.ECHELON: '梯形',
    Formation.LINE_ABREAST: '単横',
    Formation.FORMATION_3: '第三'
}

ENGAGEMENT_STR = {
    Engagement.CROSSING_T_AD: '丁有',
    Engagement.PARALLEL: '同航',
    Engagement.HEAD_ON: '反航',
    Engagement.CROSSING_T_DIS: '丁不'
}

ATTACK_TYPE_STR = {
    AttackType.SHELL_ATTACK: '砲撃',
    AttackType.TORPEDO_ATTACK: '雷撃',
    AttackType.AIR_STRIKE: '航空',
    AttackType.ANTI_SUB_ATTACK: '対潜',
    AttackType.NIGHT_ATTACK: '夜戦'
}

def find_attack_type(fleet_type: FleetType) -> List[AttackType]:
    """艦種から攻撃タイプを調べる

    Parameters
    ----------
    fleet_type: FleetType
        艦種

    Returns
    -------
        可能な攻撃タイプ一覧
    """

    if fleet_type == FleetType.NONE:
        return []

    attack_type_list: List[AttackType] = []

    # 砲撃戦(対水上)
    if fleet_type != FleetType.SS:
        attack_type_list.append(AttackType.SHELL_ATTACK)
    # 雷撃戦
    if fleet_type not in [FleetType.CVL, FleetType.CV, FleetType.BB, FleetType.FBB,
                          FleetType.BBV, FleetType.AP]:
        attack_type_list.append(AttackType.TORPEDO_ATTACK)
    # 開幕航空戦
    if fleet_type in [FleetType.CAV, FleetType.AV, FleetType.CVL, FleetType.CV, FleetType.BBV]:
        attack_type_list.append(AttackType.AIR_STRIKE)
    # 対潜攻撃
    if fleet_type in [FleetType.DD, FleetType.CL, FleetType.CLT, FleetType.CAV,
                      FleetType.AV, FleetType.CVL, FleetType.BBV]:
        attack_type_list.append(AttackType.ANTI_SUB_ATTACK)
    # 夜戦
    attack_type_list.append(AttackType.NIGHT_ATTACK)
    return attack_type_list


def calc_final_attack_impl(fleet: Fleet, weapon_dict: Dict[id, Weapon],
                           cl2_flg: bool, formation: Formation,
                           engagement: Engagement, attack_type: AttackType) -> int:
    """最終攻撃力を算出する

    Parameters
    ----------
    fleet: Fleet
        艦船データ
    weapon_dict: Dict[id, Weapon]
        装備データ一覧
    cl2_flg: bool
        CL2ダメージならTrue
    formation: Formation
        陣形
    engagement: Engagement
        交戦形態
    attack_type: AttackType
        攻撃種別

    Returns
    -------
        最終攻撃力
    """

    return 0


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

    for cl2_flg in [False, True]:
        for formation in [Formation.LINE_AHEAD, Formation.DOUBLE_LINE,
                          Formation.DIAMOND, Formation.ECHELON,
                          Formation.LINE_ABREAST, Formation.FORMATION_3]:
            for engagement in [Engagement.CROSSING_T_AD, Engagement.PARALLEL,
                               Engagement.HEAD_ON, Engagement.CROSSING_T_DIS]:
                for attack_type in find_attack_type(fleet.type):
                    final_attack = calc_final_attack_impl(fleet, weapon_dict, cl2_flg, formation, engagement, attack_type)
                    print(f'　{CL2_STR[cl2_flg]} {FORMATION_STR[formation]} {ENGAGEMENT_STR[engagement]} '
                          f'{ATTACK_TYPE_STR[attack_type]} {final_attack}')
    return {}
