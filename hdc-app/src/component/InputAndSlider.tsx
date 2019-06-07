import React from 'react';

const InputAndSlider: React.FC<{
	label: string
	value: number
	minValue: number
	maxValue: number
	onChangeText: (event: React.ChangeEvent<HTMLInputElement>) => void
	onChangeSlider: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = ({label, value, minValue, maxValue, onChangeText, onChangeSlider}) => (
	<div className='d-flex my-1'>
		<label className='text-nowrap mt-1'>{label}</label>
		<input type='text' className='mx-2 px-1 col-2 col-md-1' value={value} onChange={onChangeText} />
		<input type='range' className='custom-range mt-1' min={minValue} max={maxValue} value={value} onChange={onChangeSlider} />
	</div>
);

export {InputAndSlider};
