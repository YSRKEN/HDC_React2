import * as React from 'react';
import { Form } from 'react-bootstrap';
import InputAndSlider from './InputAndSlider';
import { SettingContext } from '../service/context';

const InputKammusuSetting: React.FC = () => {
	const setting = React.useContext(SettingContext);

	const maxHpMin = () => {
		return Math.max(1, setting.nowHp);
	};

	const nowHpMax = () => {
		return Math.min(200, setting.maxHp);
	};

	const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (typeof (e.currentTarget.value) !== 'string') {
			return;
		}
		setting.setGraphName(e.currentTarget.value);
	}

	return (
		<Form className='border p-3'>
			<Form.Group className='mb-0'>
				<InputAndSlider label='最大耐久' value={setting.maxHp} minValue={maxHpMin()} maxValue={200}
					setValue={setting.setMaxHp} />
				<InputAndSlider label='艦娘装甲' value={setting.armor} minValue={0} maxValue={200}
					setValue={setting.setArmor} />
				<InputAndSlider label='現在耐久' value={setting.nowHp} minValue={1} maxValue={nowHpMax()}
					setValue={setting.setNowHp} />
				<div className='d-flex my-1'>
					<Form.Label className='mr-3 text-nowrap mt-2'>設定名</Form.Label>
					<Form.Control type='text' value={setting.graphName} onChange={onChangeName} />
				</div>
			</Form.Group>
		</Form>
	);
}

export default InputKammusuSetting;
