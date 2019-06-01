from typing import Dict, List

import lxml.html
import requests

from fleet import Fleet
from fleet_type import FleetType

# 深海棲艦の一覧のURL
ENEMY_FLEET_DATA_URL = 'https://kancolle.fandom.com/wiki/Enemy_Vessels/Full'

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


def get_enemy_fleet_list(weapon_url_dict: Dict[str, int]) -> List[Fleet]:
    """深海棲艦の一覧を取得する

    Returns
    -------
        fleet_list[index] = 艦船情報
    """

    # URLを読み取り、HTMLをパースする
    response = requests.get(ENEMY_FLEET_DATA_URL)
    dom: lxml.html.HtmlElement = lxml.html.fromstring(response.text)

    # テーブルの各行を読み取り、艦船データとしてfleet_dictに代入する
    fleet_list: List[Fleet] = []
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
        fleet_list.append(fleet)

    return fleet_list
