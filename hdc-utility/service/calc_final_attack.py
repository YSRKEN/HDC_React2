import math
from typing import Dict, List

from model.Formation import Formation
from model.attack_type import AttackType
from model.engagement import Engagement
from model.fleet import Fleet
from model.fleet_type import FleetType
from model.weapon import Weapon
from model.weapon_type import WeaponType

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


def all_attack(fleet: Fleet, weapon_dict: Dict[id, Weapon]) -> int:
    """艦船の総攻撃力を計算する

    Parameters
    ----------
    fleet: Fleet
        艦船データ
    weapon_dict: Dict[id, Weapon]
        装備データ一覧

    Returns
    -------
        艦船の総攻撃力
    """
    return fleet.attack + sum([weapon_dict[x[1]].attack for x in fleet.slot])


def all_torpedo(fleet: Fleet, weapon_dict: Dict[id, Weapon]) -> int:
    """艦船の総雷装を計算する

    Parameters
    ----------
    fleet: Fleet
        艦船データ
    weapon_dict: Dict[id, Weapon]
        装備データ一覧

    Returns
    -------
        艦船の総雷装
    """
    return fleet.torpedo + sum([weapon_dict[x[1]].torpedo for x in fleet.slot])


def all_bomber(fleet: Fleet, weapon_dict: Dict[id, Weapon]) -> int:
    """艦船の総爆装を計算する

    Parameters
    ----------
    fleet: Fleet
        艦船データ
    weapon_dict: Dict[id, Weapon]
        装備データ一覧

    Returns
    -------
        艦船の総爆装
    """
    return sum([weapon_dict[x[1]].bomber for x in fleet.slot])


def calc_air_strike(fleet: Fleet, weapon_dict: Dict[id, Weapon]) -> float:
    """艦船の開幕航空攻撃を計算する

    Parameters
    ----------
    fleet: Fleet
        艦船データ
    weapon_dict: Dict[id, Weapon]
        装備データ一覧

    Returns
    -------
        艦船の開幕航空攻撃
    """

    sum_attack = 0.0
    for slot_size, weapon_id in fleet.slot:
        # 搭載数が0のスロットはダメージに寄与しない
        if slot_size == 0:
            continue

        # 装備種により係数と参照するパラメーターが異なるので場合分け
        weapon_data = weapon_dict[weapon_id]
        if weapon_data.type == WeaponType.CTB:
            sum_attack += 1.5 * (weapon_data.torpedo * math.sqrt(slot_size) + 15)
        elif weapon_data.type == WeaponType.CDB or weapon_data.type == WeaponType.SB:
            sum_attack += 1.0 * (weapon_data.bomber * math.sqrt(slot_size) + 15)
    return sum_attack


def calc_anti_sub(fleet: Fleet, weapon_dict: Dict[id, Weapon]) -> float:
    """艦船の対潜攻撃を計算する

    Parameters
    ----------
    fleet: Fleet
        艦船データ
    weapon_dict: Dict[id, Weapon]
        装備データ一覧

    Returns
    -------
        艦船の対潜攻撃
    """

    # 基本的な攻撃力を出す
    sum_attack = 2 * math.sqrt(fleet.anti_sub)
    dc_flg = False
    sonar_flg = False
    for _, weapon_id in fleet.slot:
        weapon_data = weapon_dict[weapon_id]
        if weapon_data.type == WeaponType.DC:
            dc_flg = True
            sum_attack += 1.5 * weapon_data.anti_sub
        elif weapon_data.type == WeaponType.SONAR:
            sonar_flg = True
            sum_attack += 1.5 * weapon_data.anti_sub
    if fleet.type == FleetType.AV or fleet.type == FleetType.CVL or fleet.type == FleetType.CAV or fleet.type \
            == FleetType.BBV:
        sum_attack += 8
    else:
        sum_attack += 13

    # 対潜シナジー補正を考慮する
    if dc_flg and sonar_flg:
        sum_attack *= 1.15
    return sum_attack


def calc_basic_attack(fleet: Fleet, weapon_dict: Dict[id, Weapon], formation: Formation, attack_type: AttackType) -> float:
    """基本攻撃力を算出する

    Parameters
    ----------
    fleet: Fleet
        艦船データ
    weapon_dict: Dict[id, Weapon]
        装備データ一覧
    formation: Formation
        陣形
    attack_type: AttackType
        攻撃種別

    Returns
    -------
        基本攻撃力
    """

    if attack_type == AttackType.SHELL_ATTACK:
        # 深海棲艦が連合艦隊だった場合も、昼戦砲撃に補正が掛かるらしい。
        # しかしその度合は英Wikiにもほぼ書かれていなかったのであえて省いた
        if fleet.type == FleetType.CVL or fleet.type == FleetType.CV:
            # 記号は英Wiki準拠
            fs = all_attack(fleet, weapon_dict)
            ts = all_torpedo(fleet, weapon_dict)
            ds = all_bomber(fleet, weapon_dict)
            return 55 + math.floor(1.5 * (fs + ts + math.floor(1.3 * ds)))
        else:
            return all_attack(fleet, weapon_dict) + 5
    elif attack_type == AttackType.TORPEDO_ATTACK:
        return all_torpedo(fleet, weapon_dict) + 5
    elif attack_type == AttackType.AIR_STRIKE:
        # 艦攻によるダメージは下ブレ(80%)ではなく上ブレ(150%)を引いたときのものとする
        return calc_air_strike(fleet, weapon_dict)
    elif attack_type == AttackType.ANTI_SUB_ATTACK:
        return calc_anti_sub(fleet, weapon_dict)
    elif attack_type == AttackType.NIGHT_ATTACK:
        # 深海棲艦の夜戦攻撃は、たとえ空母であろうとも空母用式ではなく通常式が使用される
        # また、深海棲艦から夜偵は飛ばさないものとする
        return all_attack(fleet, weapon_dict) + all_torpedo(fleet, weapon_dict)
    else:
        return 0.0


def calc_final_attack_impl(fleet: Fleet, weapon_dict: Dict[id, Weapon],
                           cl2_flg: bool, formation: Formation,
                           engagement: Engagement, attack_type: AttackType) -> float:

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

    # 基本攻撃力を出す
    basic_attack = calc_basic_attack(fleet, weapon_dict, formation, attack_type)


    return basic_attack


def calc_final_attack(fleet: Fleet, weapon_dict: Dict[id, Weapon]) -> Dict[str, float]:
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
