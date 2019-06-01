from enum import Enum


class Formation(Enum):
    LINE_AHEAD = 0    # 単縦陣
    DOUBLE_LINE = 1   # 複縦陣
    DIAMOND = 2       # 輪形陣
    ECHELON = 3       # 梯形陣
    LINE_ABREAST = 4  # 単横陣
    FORMATION_3 = 5   # 第3陣形(第三警戒航行序列(輪形陣))
