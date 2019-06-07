from enum import Enum


class AttackType(Enum):
    SHELL_ATTACK = 0  # 砲撃戦(対水上)
    TORPEDO_ATTACK = 1  # 雷撃戦
    AIR_STRIKE = 2  # 開幕航空戦
    ANTI_SUB_ATTACK = 3  # 対潜攻撃
    NIGHT_ATTACK = 4  # 夜戦
