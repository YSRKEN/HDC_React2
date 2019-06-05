import React from 'react';
import { DamageInfo as DI } from '../component/DamageInfo';
import { SettingContext } from '../service/context';

const DamageInfo: React.FC = () => {
	const setting = React.useContext(SettingContext);

	const getDamageInfo = () => {
		return `艦娘の設定：${setting.maxHp}/${setting.armor}/${setting.nowHp}`;
	}

	return (<DI damageInfo={getDamageInfo()}/>);
}

export default DamageInfo;
