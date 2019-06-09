import * as React from 'react';

import {KammusuSettingListView as KSLV} from '../component/KammusuSettingListView';
import { SettingContext } from '../service/context';

const KammusuSettingListView: React.FC = () => {
	const setting = React.useContext(SettingContext);

	const onClickAddButton = () => {
		if (isAddButtonDisabled()) {
			return;
		}
		setting.setKammusuSettingList([...setting.kammusuSettingList, 
		{
			maxHp: setting.maxHp, armor: setting.armor,
			nowHp: setting.nowHp, graphName: setting.graphName
		}]);
	};

	const isAddButtonDisabled = () => {
		if (setting.kammusuSettingList.length <= 0) {
			return false;
		}
		if (setting.graphName.length <= 0) {
			return true;
		}
		return setting.kammusuSettingList.map(kammusu => kammusu.graphName).includes(setting.graphName);
	};

	const onClickDeleteButton = (index: number) => {
		if (index < 0 || index >= setting.kammusuSettingList.length) {
			return;
		}
		const newKammusuSettingList = [];
		for (let i = 0; i < setting.kammusuSettingList.length; ++i) {
			if (i === index) {
				continue;
			}
			newKammusuSettingList.push(JSON.parse(JSON.stringify(setting.kammusuSettingList[i])));
		}
		setting.setKammusuSettingList(newKammusuSettingList);
	};

	return (<KSLV kammusuSettingList={setting.kammusuSettingList}
		onClickAddButton={onClickAddButton}
		isAddButtonDisabled={isAddButtonDisabled()}
		onClickDeleteButton={onClickDeleteButton}/>)
}

export default KammusuSettingListView;
