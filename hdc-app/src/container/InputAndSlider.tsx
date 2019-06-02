import React from 'react';
import {InputAndSlider as IAS} from '../component/InputAndSlider';

const InputAndSlider: React.FC<{
	label: string
	value: number
	minValue: number
	maxValue: number
	setValue: (value: number) => void
}> = ({label, value, minValue, maxValue, setValue}) => {
	const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		// 入力チェック
		if (typeof(event.target.value) !== 'string') {
			return;
		}

		// 入力
		const temp = parseInt(event.target.value, 10);
		if (!isNaN(temp)) {
			setValue(Math.max(Math.min(temp, maxValue), minValue));
		} else {
			setValue(minValue + (maxValue - minValue) / 2);
		}
	}

	return (<IAS label={label} value={value} minValue={minValue} maxValue={maxValue}
		onChangeText={onChangeInput} onChangeSlider={onChangeInput}/>)
}

export default InputAndSlider;
