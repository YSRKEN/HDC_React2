import React from 'react';
import { DamageInfo as DI } from '../component/DamageInfo';
import { SettingContext } from '../service/context';
import { calcHeavyDamageProb } from '../service/simulation';

const ENGAGE_TYPE = ['丁有', '同航', '反航', '丁不'];

const DamageInfo: React.FC = () => {
	const setting = React.useContext(SettingContext);

	const calcHDP = (engageType: string, cl2Flg: boolean): number => {
		const clString = cl2Flg ? 'CL2' : 'CL1';
		for (const record of setting.finalAttackList) {
			if (record.key.includes(engageType) && record.key.includes(clString)) {
				return calcHeavyDamageProb(setting.maxHp, setting.armor, setting.nowHp, record.val);
			}
		}
		return 0.0;
	}

	const calcDamageInfo= (): string => {
		// クリティカル率も考慮した、各交戦形態毎の大破率を算出する
		const heavyDamagePerDict: {[key: string]: number} = {};
		for (const engageType of ENGAGE_TYPE) {
			const hDP_CL1 = calcHDP(engageType, false);
			const hDP_CL2 = calcHDP(engageType, true);
			heavyDamagePerDict[engageType] = (hDP_CL1 * (100 - setting.criticalPer) + hDP_CL2 * setting.criticalPer) / 100.0;
		}

		// 算出結果をまとめる
		let log = '';
		const round = (value: number) => {
			return Math.floor(value * 1000) / 10;
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
	};

	return (<DI damageInfo={calcDamageInfo()}/>);
}

export default DamageInfo;
