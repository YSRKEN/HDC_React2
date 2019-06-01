from crawling_data import get_enemy_weapon_dict


def main():
    # 深海棲艦の装備の一覧を取得する
    weapon_dict = get_enemy_weapon_dict()

    from pprint import pprint
    pprint(weapon_dict)


if __name__ == '__main__':
    main()
