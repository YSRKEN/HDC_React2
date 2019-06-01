import re
from typing import Dict, List, Tuple

import lxml.html
import requests

from fleet import Fleet
from fleet_type import FleetType
from weapon import Weapon
from weapon_type import WeaponType

# 深海棲艦の装備一覧のURL
ENEMY_WEAPON_DATA_URL = 'http://kancolle.wikia.com/wiki/List_of_equipment_used_by_the_enemy'

# 装備種テキストと装備種との対応表
WEAPON_TYPE_DICT: Dict[str, WeaponType] = {
    'Small Caliber Main Gun': WeaponType.SCMG,
    'Medium Caliber Main Gun': WeaponType.MCMG,
    'Large Caliber Main Gun': WeaponType.LCMG,
    'Secondary Gun': WeaponType.SG,
    'Torpedo': WeaponType.TORPEDO,
    'Midget Submarine': WeaponType.MS,
    'Carrier-based Fighter Aircraft': WeaponType.CFA,
    'Carrier-based Dive Bomber': WeaponType.CDB,
    'Seaplane Bomber': WeaponType.SB,
    'Carrier-based Torpedo Bomber': WeaponType.CTB,
    'Reconnaissance Seaplane': WeaponType.MS,
    'Small Radar': WeaponType.SR,
    'Large Radar': WeaponType.LR,
    'Engine Improvement': WeaponType.EI,
    'Anti-Aircraft Shell': WeaponType.AAS,
    'Armor Piercing Shell': WeaponType.APS,
    'Anti-Aircraft Gun': WeaponType.AAG,
    'Depth Charge': WeaponType.DC,
    'Sonar': WeaponType.SONAR,
    'Searchlight': WeaponType.S_LIGHT,
}

# 深海棲艦の一覧のURL
ENEMY_FLEET_DATA_URL = 'http://kancolle.wikia.com/wiki/Enemy_Vessels/Full'

# 艦種テキストと艦種との対応表
FLEET_TYPE_DICT: Dict[str, FleetType] = {
    'DD': FleetType.DD,
    'SS': FleetType.SS,
    'CL': FleetType.CL,
    'CLT': FleetType.CLT,
    'CA': FleetType.CA,
    'CAV': FleetType.CAV,
    'AV': FleetType.AV,
    'CVL': FleetType.CVL,
    'CV': FleetType.CV,
    'BB': FleetType.BB,
    'FBB': FleetType.FBB,
    'BBV': FleetType.BBV,
    'AP': FleetType.AP,
}


def read_weapon_name(td_tag: lxml.html.HtmlElement) -> str:
    """装備名を算出する

    Parameters
    ----------
    td_tag: lxml.html.HtmlElement
        TDタグの中身

    Returns
    -------
        装備名
    """

    link_name: str = td_tag.cssselect('a')[0].text
    name = td_tag.text_content().replace(link_name, '', 1)
    return name.strip()


def read_weapon_parameters(td_tag: lxml.html.HtmlElement) -> Dict[str, int]:

    """装備のパラメーターを読み取る

    Parameters
    ----------
    td_tag: lxml.html.HtmlElement
        TDタグの中身

    Returns
    -------
        装備のパラメーター
    """

    # アイコン情報と値情報を読み取る
    # 値情報は、各要素が必ず「+」「-」「特定の文字列」で区切れていることを利用した分割
    icon_list = [x.get('title', '') for x in td_tag.cssselect('a')]
    value_list = td_tag.text_content().replace('+', '\n+').replace('-', '\n+') \
        .replace('Very Long', '\nVL').replace('Short', '\nShort')\
        .replace('Medium', '\nMedium').replace('Long', '\nLong') \
        .replace('VL', 'Very Long').split('\n')
    value_list = [x for x in value_list if x != '']

    # 読み取った情報を連想配列に代入する
    parameters: Dict[str, int] = {}
    for icon, value in zip(icon_list, value_list):
        if icon == 'Range':
            continue
        parameters[icon] = int(value)
    return parameters


def get_enemy_weapon_dict() -> Tuple[Dict[int, Weapon], Dict[str, int]]:
    """深海棲艦の装備の一覧を取得する

    Returns
    -------
        weapon_dict[装備ID] = 装備情報
        weapon_url_dict[装備URL] = 装備ID
    """

    # URLを読み取り、HTMLをパースする
    response = requests.get(ENEMY_WEAPON_DATA_URL)
    dom: lxml.html.HtmlElement = lxml.html.fromstring(response.text)

    # テーブルの各行を読み取り、装備データとしてweapon_dictに代入する
    weapon_dict: Dict[int, Weapon] = {0: Weapon(
        id=0,
        name='',
        type=WeaponType.NONE,
        attack=0,
        torpedo=0,
        anti_air=0,
        anti_sub=0)}
    weapon_url_dict: Dict[str, int] = {}
    for tr_tag in dom.cssselect('table.wikitable tr'):
        # テーブルなので列毎にバラせる
        tr_tag: lxml.html.HtmlElement = tr_tag
        td_tag_list: List[lxml.html.HtmlElement] = tr_tag.cssselect('td')
        if len(td_tag_list) < 6:
            continue

        # 装備IDを読み取る
        weapon_id = int(td_tag_list[0].text)

        # 装備名を読み取る
        weapon_name = read_weapon_name(td_tag_list[2])

        # 装備URLを読み取る
        weapon_url = td_tag_list[2].cssselect('a')[0].get('href', '')
        weapon_url_dict[weapon_url] = weapon_id

        # 装備種を読み取る
        raw_weapon_type = td_tag_list[3].text.strip()
        weapon_type = WEAPON_TYPE_DICT.get(raw_weapon_type, WeaponType.NONE)

        # 他のパラメーターを読み取る
        parameters = read_weapon_parameters(td_tag_list[4])
        weapon_attack = parameters.get('Firepower', 0)
        weapon_torpedo = parameters.get('Torpedo', 0)
        weapon_antiair = parameters.get('AA', 0)
        weapon_anti_sub = parameters.get('ASW', 0)

        # 装備情報を作成し、代入する
        weapon = Weapon(
            id=weapon_id,
            name=weapon_name,
            type=weapon_type,
            attack=weapon_attack,
            torpedo=weapon_torpedo,
            anti_air=weapon_antiair,
            anti_sub=weapon_anti_sub)
        weapon_dict[weapon_id] = weapon

    return weapon_dict, weapon_url_dict


def read_fleet_param(text: str) -> int:
    """艦船のパラメーターを読み取る

    Parameters
    ----------
    text: str
        テキスト

    Returns
    -------
        数値(nilは0とする)
    """

    if 'nil' in text:
        return 0
    return int(text)


def read_fleet_slot_size(text: str) -> List[int]:
    """艦船の搭載数を読み取る

    Parameters
    ----------
    text: str
        テキスト

    Returns
    -------
        List[int]でスロットごとの搭載数を返す
    """
    if ',' in text:
        return [int(x) for x in text.split(',')]
    else:
        return []


def get_enemy_fleet_dict(weapon_url_dict: Dict[str, int]) -> Dict[int, Fleet]:
    """深海棲艦の一覧を取得する

    Returns
    -------
        fleet_dict[艦船ID] = 艦船情報
    """

    # URLを読み取り、HTMLをパースする
    response = requests.get(ENEMY_FLEET_DATA_URL)
    dom: lxml.html.HtmlElement = lxml.html.fromstring(response.text)

    # テーブルの各行を読み取り、艦船データとしてfleet_dictに代入する
    fleet_dict: Dict[int, Fleet] = {}
    for tr_tag in dom.cssselect('table.wikitable tr'):
        # テーブルなので列毎にバラせる
        tr_tag: lxml.html.HtmlElement = tr_tag
        td_tag_list: List[lxml.html.HtmlElement] = tr_tag.cssselect('td')
        if len(td_tag_list) < 20:
            continue

        # 艦船IDを読み取る
        fleet_id = int(td_tag_list[1].text)

        # 艦船名を読み取る
        fleet_name = td_tag_list[4].text_content().strip()

        # 艦種を読み取る
        raw_fleet_type = td_tag_list[0].text.strip()
        fleet_type = FLEET_TYPE_DICT.get(raw_fleet_type, FleetType.NONE)

        # 搭載数を読み取る
        if '?' in td_tag_list[18].text:
            continue
        fleet_slot_size = read_fleet_slot_size(td_tag_list[18].text)

        # 装備を読み取る
        fleet_weapon_url_list = [weapon_url_dict.get(x.get('href', ''), 0) for x in td_tag_list[19].cssselect('a')]

        # 他のパラメーターを読み取る
        fleet_attack = read_fleet_param(td_tag_list[7].text)
        fleet_torpedo = read_fleet_param(td_tag_list[8].text)
        fleet_anti_air = read_fleet_param(td_tag_list[9].text)
        fleet_anti_sub = read_fleet_param(td_tag_list[11].text)

        # 装備情報を作成し、代入する
        fleet = Fleet(
            id=fleet_id,
            name=fleet_name,
            type=fleet_type,
            attack=fleet_attack,
            torpedo=fleet_torpedo,
            anti_air=fleet_anti_air,
            anti_sub=fleet_anti_sub,
            slot=list(zip(fleet_slot_size, fleet_weapon_url_list)))
        fleet_dict[fleet_id] = fleet

    return fleet_dict
