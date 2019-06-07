from enum import Enum


class FleetType(Enum):
    NONE = 0  # 不明
    DD = 1  # 駆逐艦
    SS = 2  # 潜水艦
    CL = 3  # 軽巡洋艦
    CLT = 4  # 重雷装巡洋艦
    CA = 5  # 重巡洋艦
    CAV = 6  # 航空巡洋艦
    AV = 7  # 水上機母艦
    CVL = 8  # 軽空母
    CV = 9  # 正規空母
    BB = 10  # 戦艦
    FBB = 11  # 高速戦艦
    BBV = 12  # 航空戦艦・陸上型
    AP = 13  # 輸送艦
