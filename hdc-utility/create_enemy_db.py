from pprint import pprint

from crawling_map_data import get_fleets_pattern_list
from crawling_weapon_data import get_enemy_weapon_list
from crawling_fleet_data import get_enemy_fleet_list


def main():
    # 深海棲艦の装備の一覧を取得する
    # weapon_list, weapon_url_dict = get_enemy_weapon_list()
    # pprint(weapon_list)

    # 深海棲艦の一覧を取得する
    # fleet_list = get_enemy_fleet_list(weapon_url_dict)
    # pprint(fleet_list)

    # マップの一覧を取得する
    fleets_pattern_list = get_fleets_pattern_list()
    pprint(fleets_pattern_list)


if __name__ == '__main__':
    main()
