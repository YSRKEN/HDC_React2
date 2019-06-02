import json
import os
import pickle
from pprint import pprint
from typing import List, Dict, Tuple
from collections import OrderedDict

from model.fleet import Fleet
from model.map_position import FleetsPattern
from model.weapon import Weapon
from service.calc_final_attack import calc_final_attack, FORMATION_STR
from service.crawling_map_data import get_fleets_pattern_list
from service.crawling_weapon_data import get_enemy_weapon_list
from service.crawling_fleet_data import get_enemy_fleet_list


def main():
    # 深海棲艦の装備の一覧を取得する
    if os.path.exists('cache/weapon_cache'):
        with open('cache/weapon_cache', 'rb') as f:
            cache_data = pickle.load(f)
            weapon_list = cache_data['weapon_list']
            weapon_url_dict = cache_data['weapon_url_dict']
    else:
        weapon_list, weapon_url_dict = get_enemy_weapon_list()
        with open('cache/weapon_cache', 'wb') as f:
            cache_data = {
                'weapon_list': weapon_list,
                'weapon_url_dict': weapon_url_dict
            }
            pickle.dump(cache_data, f)
    # pprint(weapon_list)

    # 深海棲艦の一覧を取得する
    if os.path.exists('cache/fleet_cache'):
        with open('cache/fleet_cache', 'rb') as f:
            fleet_list = pickle.load(f)
    else:
        fleet_list = get_enemy_fleet_list(weapon_url_dict)
        with open('cache/fleet_cache', 'wb') as f:
            pickle.dump(fleet_list, f)
    # pprint(fleet_list)

    # マップの一覧を取得する
    if os.path.exists('cache/fleets_pattern_cache'):
        with open('cache/fleets_pattern_cache', 'rb') as f:
            fleets_pattern_list = pickle.load(f)
    else:
        fleets_pattern_list = get_fleets_pattern_list()
        with open('cache/fleets_pattern_cache', 'wb') as f:
            pickle.dump(fleets_pattern_list, f)
    fleets_pattern_list: List[FleetsPattern] = fleets_pattern_list
    # pprint(fleets_pattern_list)

    # マップで使用されている敵艦の一覧を算出する
    enemy_id_set = set()
    for fleets_pattern in fleets_pattern_list:
        enemy_id_set = enemy_id_set | set(fleets_pattern.enemy)
    enemy_id_list = sorted(list(enemy_id_set))

    # 算出されたそれぞれの敵艦について、最終攻撃力を算出する
    weapon_dict: Dict[id, Weapon] = {}
    for weapon in weapon_list:
        weapon_dict[weapon.id] = weapon
    fleet_dict: Dict[id, Fleet] = {}
    for fleet in fleet_list:
        fleet_dict[fleet.id] = fleet
    final_attack_dict: Dict[id, List[Tuple[str, int]]] = {}
    for enemy_id in enemy_id_list:
        enemy_data = fleet_dict[enemy_id]
        final_attack_dict[enemy_id] = calc_final_attack(enemy_data, weapon_dict)

    # 算出した最終攻撃力とマップの情報を編纂し、JSONとして書き出す
    output_data = OrderedDict()
    for fleets_pattern in fleets_pattern_list:
        map_name = fleets_pattern.map_name
        if map_name not in output_data:
            output_data[map_name] = OrderedDict()
        pattern_name = f'{fleets_pattern.position_name}-{fleets_pattern.pattern_index}'
        if pattern_name not in output_data[map_name]:
            output_data[map_name][pattern_name] = OrderedDict()
        formation_name = FORMATION_STR[fleets_pattern.formation]
        for enemy_id in fleets_pattern.enemy:
            if enemy_id in output_data[map_name][pattern_name]:
                continue
            final_attack_data = [{'key': x[0].replace(f' {formation_name}', ''), 'val': x[1]} for x in final_attack_dict[enemy_id] if formation_name in x[0]]
            output_data[map_name][pattern_name][enemy_id] = final_attack_data
    with open('final_attack.json', 'w', encoding='UTF-8') as f:
        json.dump(output_data, f, ensure_ascii=False)


if __name__ == '__main__':
    main()
