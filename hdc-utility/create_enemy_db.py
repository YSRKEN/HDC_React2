from crawling_fleet_data import get_enemy_fleet_dict
from crawling_weapon_data import get_enemy_weapon_dict


def main():
    # 深海棲艦の装備の一覧を取得する
    weapon_dict, weapon_url_dict = get_enemy_weapon_dict()

    # 深海棲艦の一覧を取得する
    fleet_dict = get_enemy_fleet_dict(weapon_url_dict)

    # マップの一覧を取得する


    from pprint import pprint
    pprint(weapon_dict)
    pprint(fleet_dict)


if __name__ == '__main__':
    main()
