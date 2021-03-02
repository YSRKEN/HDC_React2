import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import InputAndSlider from './InputAndSlider';
import { SettingContext } from '../service/context';

const InputKammusuSetting: React.FC = () => {
	const { nowHp, armor, maxHp, graphName, dispatch } = useContext(SettingContext);

	const maxHpMin = () => {
		return Math.max(1, nowHp);
	};

	const nowHpMax = () => {
		return Math.min(200, maxHp);
	};

	const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch({ type: 'setGraphName', message: e.currentTarget.value });
	}

	const onChangeMaxHp = (value: number) => {
		dispatch({ type: 'setMaxHp', message: '' + value });
	}

	const onChangeArmor = (value: number) => {
		dispatch({ type: 'setArmor', message: '' + value });
	}

	const onChangeNowHp = (value: number) => {
		dispatch({ type: 'setNowHp', message: '' + value });
	}

	return (
		<Form className='border p-3'>
			<Form.Group className='mb-0'>
				<InputAndSlider label='最大耐久' value={maxHp} minValue={maxHpMin()} maxValue={200}
					setValue={onChangeMaxHp} />
				<InputAndSlider label='艦娘装甲' value={armor} minValue={0} maxValue={200}
					setValue={onChangeArmor} />
				<InputAndSlider label='現在耐久' value={nowHp} minValue={1} maxValue={nowHpMax()}
					setValue={onChangeNowHp} />
				<div className='d-flex my-1'>
					<Form.Label className='mr-3 text-nowrap mt-2'>設定名</Form.Label>
					<Form.Control type='text' value={graphName} onChange={onChangeName} />
				</div>
			</Form.Group>
		</Form>
	);
}

export default InputKammusuSetting;
