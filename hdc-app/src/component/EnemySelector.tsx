import React from 'react';
import { Form } from 'react-bootstrap';
import { InputAndSlider } from './InputAndSlider';

const EnemySelector: React.FC<{
	mapList: string[],
	positionList: string[],
	fleetList: {id: number, name: string}[],
	formationList: string[],
	attackTypeList: string[],
	formation: string,
	criticalPer: number
	onChangeCriticalPer: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = ({mapList, positionList, fleetList, formationList, attackTypeList, formation, criticalPer, onChangeCriticalPer}) => (
	<Form className='border p-3'>
		<Form.Group className='mb-0'>
			<div className='d-flex mb-3'>
				<Form.Control as='select' className='w-auto mr-3'>
					{mapList.map(mapName => (
						<option key={mapName} value={mapName}>{mapName}</option>
					))}
				</Form.Control>
				<Form.Control as='select' className='w-auto mr-3'>
					{positionList.map(position => (
						<option key={position} value={position}>{position}</option>
					))}
				</Form.Control>
				<Form.Control as='select' className='w-auto mr-3'>
					{fleetList.map(fleet => (
						<option key={fleet.id} value={fleet.id}>{fleet.name}</option>
					))}
				</Form.Control>
				<Form.Control as='select' className='w-auto mr-3' value={formation} disabled>
					{formationList.map(formation => (
						<option key={formation} value={formation}>{formation}</option>
					))}
				</Form.Control>
				<Form.Control as='select' className='w-auto'>
					{attackTypeList.map(attackType => (
						<option key={attackType} value={attackType}>{attackType}</option>
					))}
				</Form.Control>
			</div>
			<InputAndSlider label='クリティカル率(％)' value={criticalPer} minValue={0} maxValue={100}
				onChangeSlider={onChangeCriticalPer} onChangeText={onChangeCriticalPer}/>
		</Form.Group>
	</Form>
);

export {EnemySelector};
