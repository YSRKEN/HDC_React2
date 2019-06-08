import * as React from 'react';

import {KammusuSettingListView as KSLV} from '../component/KammusuSettingListView';
import { SettingContext } from '../service/context';

const KammusuSettingListView: React.FC = () => {
	const setting = React.useContext(SettingContext);

	return (<KSLV kammusuSettingList={setting.kammusuSettingList}/>)
}

export default KammusuSettingListView;
