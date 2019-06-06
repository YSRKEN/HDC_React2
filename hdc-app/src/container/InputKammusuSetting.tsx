import * as React from 'react';
import {Form, FormControlProps} from 'react-bootstrap';
import InputAndSlider from './InputAndSlider';
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers';
import { SettingContext } from '../service/context';

const InputKammusuSetting: React.FC = () => {
	const [graphName, setGraphName] = React.useState('吹雪改二');

	const setting = React.useContext(SettingContext);

	const maxHpMin = () => {
		return Math.max(1, setting.nowHp);
	};

	const nowHpMax = () => {
		return Math.min(200, setting.maxHp);
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
				<InputAndSlider label='最大耐久' value={setting.maxHp} minValue={maxHpMin()} maxValue={200}
					setValue={setting.setMaxHp}/>
				<InputAndSlider label='艦娘装甲' value={setting.armor} minValue={0} maxValue={200}
					setValue={setting.setArmor}/>
				<InputAndSlider label='現在耐久' value={setting.nowHp} minValue={1} maxValue={nowHpMax()}
					setValue={setting.setNowHp}/>
				<div className='d-flex my-1'>
					<Form.Label className='mr-3 text-nowrap mt-2'>設定名</Form.Label>
					<Form.Control type='text' value={graphName} onChange={onChangeName} />
				</div>
			</Form.Group>
		</Form>
	);
}

export default InputKammusuSetting;
