import React from 'react';
import { IKammusuSetting } from '../constant';
import { ListGroup } from 'react-bootstrap';

const KammusuSettingListView: React.FC<{
	kammusuSettingList: IKammusuSetting[]
}> = ({kammusuSettingList}) => (
	<ListGroup>
		{
			kammusuSettingList.map((setting, index) => {
				const text = `${setting.graphName}(${setting.maxHp}/${setting.armor}/${setting.nowHp})`;
				return (
					<ListGroup.Item key={index}>{text}</ListGroup.Item>
				);
			})
		}
	</ListGroup>
);

export {KammusuSettingListView};
