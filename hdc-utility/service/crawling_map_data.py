import re
from typing import List, Dict

import requests
import lxml.html

from model.Formation import Formation

# 陣形テキストと陣形との対応表
from model.map_position import FleetsPattern

FORMATION_DICT: Dict[str, Formation] = {
    'LineAhead': Formation.LINE_AHEAD,
    'DoubleLine': Formation.DOUBLE_LINE,
    'Diamond': Formation.DIAMOND,
    'Echelon': Formation.ECHELON,
    'LineAbreast': Formation.LINE_ABREAST,
    'Formation 3': Formation.FORMATION_3,
}


def get_fleets_pattern_list() -> List[FleetsPattern]:
    # マップ一覧を取得する
    map_dict: Dict[str, str] = {}
    map_number = 1
    while True:
        # マップ面のデータを読み込む(読み込みエラー時はその面が存在しないとみなす)
        response = requests.get(f'https://kancolle.fandom.com/wiki/World_{map_number}')
        if response.status_code >= 400:
            break

        # マップ名と対応するURLを取得
        dom: lxml.html.HtmlElement = lxml.html.fromstring(response.text)
        li_tag_list = dom.cssselect('#EventTemplate')[0].cssselect('ul > li')
        for li_tag in li_tag_list:
            a_tag: lxml.html.HtmlElement = li_tag.cssselect('a')[0]
            map_name = a_tag.text_content()
            map_url = f'http://kancolle.wikia.com{a_tag.get("href", "")}'
            map_dict[map_name] = map_url
        map_number += 1

    # 各マップにおける全マスにおける「編成と陣形」情報を取り出す
    fleets_pattern_list: List[FleetsPattern] = []
    print('読み込み開始：')
    for map_name, map_url in map_dict.items():
        print(f'  {map_name}')
        # データ取得
        response = requests.get(map_url)
        dom: lxml.html.HtmlElement = lxml.html.fromstring(response.text)

        # 「編成と陣形」情報が含まれるタグの位置がページにより多少異なるため、その対策を打つ
        scrollable_div_list = dom.cssselect('div.scrollable')
        scrollable_div_tag = None
        if len(scrollable_div_list) == 0:
            for div_tag in dom.cssselect('div'):
                style_attr = div_tag.attrib.get('style')
                if style_attr is None:
                    continue
                if 'max-height:' not in style_attr:
                    continue
                if 'overflow-y:auto' not in style_attr:
                    continue
                if 'overflow-x:hidden' not in style_attr:
                    continue
                scrollable_div_tag = div_tag
                break
        else:
            scrollable_div_tag = scrollable_div_list[0]
        if scrollable_div_tag is None:
            continue

        # 「編成と陣形」情報を順次取り込む
        for point_table_tag in scrollable_div_tag.cssselect('table'):
            # 戦闘しないテーブルは無視する
            th_text_list = [x.text_content().strip() for x in point_table_tag.cssselect('th')]
            if 'Empty Node' in th_text_list:
                continue
            if 'Resource Node' in th_text_list:
                continue
            if 'Air Raids' in th_text_list:
                continue
            boss_flg = 'Boss Battle Node' in th_text_list

            # テーブルの中でtdを持つtr一覧を取得し、マス名と敵編成を読み取る
            point_name = ''
            pattern_index = 1
            first_flg = True
            for tr_tag in point_table_tag.cssselect('tr'):
                # tdを持たないtrは無視する
                td_list = tr_tag.cssselect('td')
                if len(td_list) == 0:
                    continue

                # 最初のtrは、tdとしてマス名を含むので取得する
                if first_flg:
                    point_name = td_list[0].text_content().replace("\n", '')

                # 敵編成が記録されているtdの位置を判断する
                temp_index = -1
                for i in range(0, len(td_list)):
                    if len(td_list[i].cssselect('a.link-internal')) > 0:
                        temp_index = i
                        break
                if temp_index == -1:
                    continue

                # 余計なタグを削除する
                span_span_list = td_list[temp_index].cssselect('span > span')
                for span_tag in span_span_list:
                    span_tag.drop_tree()

                # 敵編成を読み取る
                a_list = td_list[temp_index].cssselect('a.link-internal')
                enemy_list = []
                for a_tag in a_list:
                    attributes = a_tag.attrib
                    enemy_id = int(re.sub(r'.*\((\d+)\):.*', r'\1', attributes.get('title')))
                    enemy_list.append(enemy_id)

                # ラスダンで編成が変わる場合の対策
                td_text = ','.join(list(map(lambda x: x.text_content(), td_list)))
                final_flg = '(Final)' in td_text

                # 敵の陣形を読み取る
                formation_image_tag = td_list[1 if first_flg else 0].cssselect('img')[0]
                attributes = formation_image_tag.attrib
                formation_image_alt = attributes.get('alt')
                formation = FORMATION_DICT[formation_image_alt]

                # 読み取った敵編成を登録する
                fleets_pattern = FleetsPattern(
                    map_name=map_name,
                    position_name=point_name,
                    pattern_index=pattern_index,
                    formation=formation,
                    boss_flg=boss_flg,
                    final_flg=final_flg,
                    enemy=enemy_list
                )
                fleets_pattern_list.append(fleets_pattern)

                # 次のループに向けた処理
                if first_flg:
                    first_flg = False
                pattern_index += 1

    return fleets_pattern_list
