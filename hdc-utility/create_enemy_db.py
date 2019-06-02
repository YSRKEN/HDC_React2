import os
import pickle
from pprint import pprint
from typing import List, Dict, Tuple

from model.fleet import Fleet
from model.map_position import FleetsPattern
from model.weapon import Weapon
from service.calc_final_attack import calc_final_attack
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
    pprint(fleets_pattern_list)
    for enemy_id in enemy_id_list:
        print(fleet_dict[enemy_id])
        pprint(final_attack_dict[enemy_id])


if __name__ == '__main__':
    main()
