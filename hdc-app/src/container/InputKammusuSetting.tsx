import * as React from 'react';
import {Form, FormControlProps} from 'react-bootstrap';
import InputAndSlider from './InputAndSlider';
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers';

const InputKammusuSetting: React.FC = () => {
	const [maxHp, setMaxHp] = React.useState(31);
	const [armor, setArmor] = React.useState(50);
	const [nowHp, setNowHp] = React.useState(31);
	const [graphName, setGraphName] = React.useState('吹雪改二');

	const maxHpMin = () => {
		return Math.max(1, nowHp);
	};

	const nowHpMax = () => {
		return Math.min(200, maxHp);
	};

	const onChangeName = (e: React.FormEvent<ReplaceProps<'input', BsPrefixProps<'input'> & FormControlProps>>) => {
		if (typeof (e.currentTarget.value) !== 'string') {
			return;
		}
		setGraphName(e.currentTarget.value);
	}

	return (
		<Form className='border p-3'>
			<Form.Group className='mb-0'>
				<InputAndSlider label='最大耐久' value={maxHp} minValue={maxHpMin()} maxValue={200} setValue={setMaxHp}/>
				<InputAndSlider label='艦娘装甲' value={armor} minValue={0} maxValue={200} setValue={setArmor}/>
				<InputAndSlider label='現在耐久' value={nowHp} minValue={1} maxValue={nowHpMax()} setValue={setNowHp}/>
				<div className='d-flex my-1'>
					<Form.Label className='mr-3 text-nowrap mt-2'>設定名</Form.Label>
					<Form.Control type='text' value={graphName} onChange={onChangeName} />
				</div>
			</Form.Group>
		</Form>
	);
}

export default InputKammusuSetting;
