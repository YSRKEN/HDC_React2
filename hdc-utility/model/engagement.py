from enum import Enum


class Engagement(Enum):
    CROSSING_T_AD = 0  # 丁字有利
    PARALLEL = 1  # 同航戦
    HEAD_ON = 2   # 反航戦
    CROSSING_T_DIS = 3  # 丁字不利
