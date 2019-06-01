import os
import pickle
from pprint import pprint

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
    pprint(weapon_list)

    # 深海棲艦の一覧を取得する
    if os.path.exists('cache/fleet_cache'):
        with open('cache/fleet_cache', 'rb') as f:
            fleet_list = pickle.load(f)
    else:
        fleet_list = get_enemy_fleet_list(weapon_url_dict)
        with open('cache/fleet_cache', 'wb') as f:
            pickle.dump(fleet_list, f)
    pprint(fleet_list)

    # マップの一覧を取得する
    if os.path.exists('cache/fleets_pattern_cache'):
        with open('cache/fleets_pattern_cache', 'rb') as f:
            fleets_pattern_list = pickle.load(f)
    else:
        fleets_pattern_list = get_fleets_pattern_list()
        with open('cache/fleets_pattern_cache', 'wb') as f:
            pickle.dump(fleets_pattern_list, f)
    pprint(fleets_pattern_list)


if __name__ == '__main__':
    main()
