// 装甲乱数における最小値と範囲と最大値の倍率(％)
const MIN_ARMOR_PER = 70;
const RANGE_ARMOR_PER = 60;

// カスダメにおける最小値と範囲の倍率(％)
const MIN_VERY_LIGHT_PER = 6;
const RANGE_VERY_LIGHT_PER = 8;

// 轟沈ストッパーにおける最小値と範囲の倍率(％)
const MIN_STOPPER_PER = 50;
const RANGE_STOPPER_PER = 30;

// カスダメ時の大破率を算出する
const calcVerylightDamageProb = (nowHp: number, heavyDamageHp: number): number => {
  // 大破した回数をカウントする
  let count = 0;
  for (let hi = 0; hi < nowHp; ++hi) {
    // カスダメ時のダメージ
    const damage = Math.floor((MIN_VERY_LIGHT_PER * nowHp + RANGE_VERY_LIGHT_PER * hi) / 100.0);

    // カスダメ時の残耐久
    const leaveHp = nowHp - damage;

    // 大破判定
    if (leaveHp <= heavyDamageHp) {
      ++count;
    }
  }

  // カウントから大破率を計算する
  return 1.0 * count / nowHp;
}

// 轟沈ストッパー時の大破率を算出する
const calcStopperDamageProb = (nowHp: number, heavyDamageHp: number): number => {
  // 大破した回数をカウントする
  let count = 0;
  for (let hi = 0; hi < nowHp; ++hi) {
    // 轟沈ストッパー時のダメージ
    const damage = Math.floor((MIN_STOPPER_PER * nowHp + RANGE_STOPPER_PER * hi) / 100.0);

    // 轟沈ストッパー時の残耐久
    const leaveHp = nowHp - damage;

    // 大破判定
    if (leaveHp <= heavyDamageHp) {
      ++count;
    }
  }

  // カウントから大破率を計算する
  return 1.0 * count / nowHp;
}

// 最終攻撃力に対する大破率を計算する
export const calcHeavyDamageProb = (maxHp: number, armor: number, nowHp: number, finalAttack: number) => {
  // 大破判定を受ける最大の耐久値(heavyDamageHp)を計算する
  const heavyDamageHp = Math.floor(maxHp / 4);

  // heavyDamageHp≧現耐久(nowHp)ならば、大破率100％として扱う
  if (heavyDamageHp >= nowHp) {
    return 1.0;
  }

  // 先にカスダメ時および轟沈ストッパー時の大破率を計算しておく
  const verylightProb = calcVerylightDamageProb(nowHp, heavyDamageHp);
  const stopperProb = calcStopperDamageProb(nowHp, heavyDamageHp);

  // 各装甲乱数について、大破するかしないかを算出する
  let heavyDamageProbSum = 0.0;
  for (let ai = 0; ai < armor; ++ai) {
    // 装甲乱数込みの装甲値
    const armorRandom = (MIN_ARMOR_PER * armor + RANGE_ARMOR_PER * ai) / 100.0;

    // カスダメか？
    const damage = Math.floor(finalAttack - armorRandom);
    if (damage <= 0) {
      heavyDamageProbSum += verylightProb;
      continue;
    }

    // 轟沈ストッパーか？
    const leaveHp = nowHp - damage;
    if (leaveHp <= 0) {
      heavyDamageProbSum += stopperProb;
      continue;
    }

    // 通常のダメージ処理
    if (leaveHp <= heavyDamageHp) {
      heavyDamageProbSum += 1.0;
    }
  }

  // 大破率を算出する
  const heavyDamageProb = heavyDamageProbSum / armor;
  return heavyDamageProb;
}
