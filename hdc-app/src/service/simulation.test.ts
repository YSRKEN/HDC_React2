import { calcHeavyDamageProb } from './simulation';

describe('calcHeavyDamageProb', () => {
  it('既に大破域なら100%になる', () => {
    const result = calcHeavyDamageProb(31, 50, 7, 100);
    expect(result).toBe(1);
  });

  it('出力値は0〜1の範囲に収まる', () => {
    const result = calcHeavyDamageProb(31, 50, 31, 80);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });

  it('最終攻撃力が上がると大破率は下がらない', () => {
    const weakAttack = calcHeavyDamageProb(31, 50, 31, 40);
    const strongAttack = calcHeavyDamageProb(31, 50, 31, 120);
    expect(strongAttack).toBeGreaterThanOrEqual(weakAttack);
  });
});
