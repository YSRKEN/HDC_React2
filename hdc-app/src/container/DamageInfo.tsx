import React from 'react';
import { DamageInfo as DI } from '../component/DamageInfo';
import { SettingContext } from '../service/context';

const DamageInfo: React.FC = () => {
	const setting = React.useContext(SettingContext);

	const getDamageInfo = () => {
		let output = `艦娘の設定：${setting.maxHp}/${setting.armor}/${setting.nowHp}\n最終攻撃力：\n`;
		for (const record of setting.finalAttackList) {
			output += `  ${record.key}⇒${record.val}\n`;
		}
		output += `クリティカル率：${setting.criticalPer}％`;
		return output;
	}

	return (<DI damageInfo={getDamageInfo()}/>);
}

export default DamageInfo;
