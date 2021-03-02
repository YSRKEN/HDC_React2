import * as React from 'react';

import { KammusuSettingListView as KSLV } from '../component/KammusuSettingListView';
import { SettingContext } from '../service/context';

const KammusuSettingListView: React.FC = () => {
	const { kammusuSettingList, graphName, dispatch } = React.useContext(SettingContext);

	const onClickAddButton = () => {
		dispatch({ type: 'addKammusuSetting' });
	};

	const isAddButtonDisabled = () => {
		if (kammusuSettingList.length <= 0) {
			return false;
		}
		if (graphName.length <= 0) {
			return true;
		}
		return kammusuSettingList.map(kammusu => kammusu.graphName).includes(graphName);
	};

	const onClickDeleteButton = (index: number) => {
		dispatch({ type: 'deleteKammusuSetting', message: '' + index });
	};

	return (<KSLV kammusuSettingList={kammusuSettingList}
		onClickAddButton={onClickAddButton}
		isAddButtonDisabled={isAddButtonDisabled()}
		onClickDeleteButton={onClickDeleteButton} />)
}

export default KammusuSettingListView;
