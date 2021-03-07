import React, { useContext } from 'react';
import { DamageInfo as DI } from '../component/DamageInfo';
import { SettingContext } from '../service/context';
import { calcHeavyDamageProb } from '../service/simulation';

const ENGAGE_TYPE = ['丁有', '同航', '反航', '丁不'];

const DamageInfo: React.FC = () => {
	const { finalAttackList, maxHp, armor, nowHp, criticalPer, finalAttackInputData } = useContext(SettingContext);

	const calcHDP = (engageType: string, cl2Flg: boolean): number => {
		const clString = cl2Flg ? 'CL2' : 'CL1';
		for (const record of finalAttackList) {
			if (record.key.includes(engageType) && record.key.includes(clString)) {
				return calcHeavyDamageProb(maxHp, armor, nowHp, record.val);
			}
		}
		return 0.0;
	}

	const calcDamageInfo = (): string => {
		if (finalAttackInputData !== '') {
			// 最終攻撃力が入力されているので、交戦形態やクリティカル率などといった要素は無視される
			// そのため、装甲乱数から算出された大破率を記録する
			try {
				const finalAttackInputDataInt = parseInt(finalAttackInputData, 10);
				if (finalAttackInputDataInt < 1) {
					return 'エラー：最終攻撃力には1以上の整数を入力してください。';
				}
				const heavyDamagePer = calcHeavyDamageProb(maxHp, armor, nowHp, finalAttackInputDataInt);
				const round = (value: number) => {
					return Math.round(value * 1000) / 10;
				}
				return `大破率：${round(heavyDamagePer)}％`;
			} catch {
				return 'エラー：最終攻撃力には1以上の整数を入力してください。';
			}
		} else {
			// クリティカル率も考慮した、各交戦形態毎の大破率を算出する
			const heavyDamagePerDict: { [key: string]: number } = {};
			for (const engageType of ENGAGE_TYPE) {
				const hDP_CL1 = calcHDP(engageType, false);
				const hDP_CL2 = calcHDP(engageType, true);
				heavyDamagePerDict[engageType] = (hDP_CL1 * (100 - criticalPer) + hDP_CL2 * criticalPer) / 100.0;
			}

			// 算出結果をまとめる
			let log = '';
			const round = (value: number) => {
				return Math.round(value * 1000) / 10;
			}
			log += `丁字有利⇒${round(heavyDamagePerDict[ENGAGE_TYPE[0]])}％\n`;
			log += `同航戦⇒${round(heavyDamagePerDict[ENGAGE_TYPE[1]])}％\n`;
			log += `反航戦⇒${round(heavyDamagePerDict[ENGAGE_TYPE[2]])}％\n`;
			log += `丁字不利⇒${round(heavyDamagePerDict[ENGAGE_TYPE[3]])}％\n`;
			const mixedHDP1 = (
				heavyDamagePerDict[ENGAGE_TYPE[0]] * 15 +
				heavyDamagePerDict[ENGAGE_TYPE[1]] * 45 +
				heavyDamagePerDict[ENGAGE_TYPE[2]] * 40 +
				heavyDamagePerDict[ENGAGE_TYPE[3]] * 0
			) / 100;
			const mixedHDP2 = (
				heavyDamagePerDict[ENGAGE_TYPE[0]] * 15 +
				heavyDamagePerDict[ENGAGE_TYPE[1]] * 45 +
				heavyDamagePerDict[ENGAGE_TYPE[2]] * 30 +
				heavyDamagePerDict[ENGAGE_TYPE[3]] * 10
			) / 100;
			log += `彩雲あり⇒${round(mixedHDP1)}％\n`;
			log += `彩雲なし⇒${round(mixedHDP2)}％`;
			return log;
		}
	};

	return (<DI damageInfo={calcDamageInfo()} />);
}

export default DamageInfo;
