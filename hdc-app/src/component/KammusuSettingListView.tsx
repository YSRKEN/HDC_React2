import React from 'react';
import { IKammusuSetting } from '../constant';
import { ListGroup, Button } from 'react-bootstrap';

const KammusuSettingListView: React.FC<{
	kammusuSettingList: IKammusuSetting[],
	isAddButtonDisabled: boolean,
	onClickAddButton: () => void,
	onClickDeleteButton: (value: number) => void
}> = ({kammusuSettingList, onClickAddButton, isAddButtonDisabled, onClickDeleteButton}) => (
	<>
	<Button className='w-100 mb-3' onClick={onClickAddButton} disabled={isAddButtonDisabled}>データを追加</Button>
	<ListGroup>
		{
			kammusuSettingList.map((setting, index) => {
				const text = `${setting.graphName}(${setting.maxHp}/${setting.armor}/${setting.nowHp})`;
				const onclick = () => {
					onClickDeleteButton(index);
				}
				return (
					<ListGroup.Item key={index}>
						{text}
						<Button className='ml-3' onClick={onclick} key={index}>削除</Button>
					</ListGroup.Item>
				);
			})
		}
	</ListGroup>
	</>
);

export {KammusuSettingListView};
