from enum import Enum


class WeaponType(Enum):
    NONE = 0  # 不明
    SCMG = 1  # 小口径主砲
    MCMG = 2  # 中口径主砲
    LCMG = 3  # 大口径主砲
    SG = 4  # 副砲
    TORPEDO = 5  # 魚雷
    MS = 6  # 特殊潜航艇
    CFA = 7  # 艦上戦闘機
    CDB = 8  # 艦上爆撃機
    SB = 9  # 水上爆撃機
    CTB = 10  # 艦上攻撃機
    RS = 11  # 水上偵察機
    SR = 12  # 小型電探
    LR = 13  # 大型電探
    EI = 14  # 機関・タービン
    AAS = 15  # 三式弾
    APS = 16  # 徹甲弾
    AAG = 17  # 対空機銃
    DC = 18  # 爆雷
    SONAR = 19  # ソナー
    S_LIGHT = 20  # 探照灯
