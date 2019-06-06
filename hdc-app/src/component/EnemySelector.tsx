import React from 'react';
import { Form } from 'react-bootstrap';
import { InputAndSlider } from './InputAndSlider';

const EnemySelector: React.FC<{
	mapList: string[],
	positionList: string[],
	fleetList: {id: number, name: string}[],
	formationList: string[],
	attackTypeList: string[],
	mapName: string,
	onChangeMapName: (event: React.ChangeEvent<any>) => void,
	position: string,
	onChangePosition: (event: React.ChangeEvent<any>) => void,
	fleetName: {id: number, name: string},
	onChangeFleetName: (event: React.ChangeEvent<any>) => void,
	attackType: string,
	onChangeAttackType: (event: React.ChangeEvent<any>) => void,
	formation: string,
	criticalPer: number
	onChangeCriticalPer: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = ({mapList, positionList, fleetList, formationList, attackTypeList,
	mapName, onChangeMapName, position, onChangePosition,
	fleetName, onChangeFleetName, attackType, onChangeAttackType,
	formation, criticalPer, onChangeCriticalPer}) => (
	<Form className='border p-3'>
		<Form.Group className='mb-0'>
			<div className='d-block d-md-none'>
				<div className='d-flex'>
					<Form.Control as='select' className='w-auto mb-3 mr-3' value={mapName} onChange={onChangeMapName}>
						{mapList.map(mapName => (
							<option key={mapName} value={mapName}>{mapName}</option>
						))}
					</Form.Control>
					<Form.Control as='select' className='w-auto mb-3' value={position} onChange={onChangePosition}>
						{positionList.map(position => (
							<option key={position} value={position}>{position}</option>
						))}
					</Form.Control>
				</div>
				<Form.Control as='select' className='w-auto mb-3' value={`${fleetName.id}`} onChange={onChangeFleetName}>
					{fleetList.map(fleet => (
						<option key={fleet.id} value={fleet.id}>{fleet.name}</option>
					))}
				</Form.Control>
				<div className='d-flex'>
					<Form.Control as='select' className='w-auto mb-3 mr-3' value={formation} disabled>
						{formationList.map(formation => (
							<option key={formation} value={formation}>{formation}</option>
						))}
					</Form.Control>
					<Form.Control as='select' className='w-auto' value={attackType} onChange={onChangeAttackType}>
						{attackTypeList.map(attackType => (
							<option key={attackType} value={attackType}>{attackType}</option>
						))}
					</Form.Control>
				</div>
			</div>

			<div className='d-none d-md-block'>
				<div className='d-flex mb-3'>
					<Form.Control as='select' className='w-auto mr-3' value={mapName} onChange={onChangeMapName}>
						{mapList.map(mapName => (
							<option key={mapName} value={mapName}>{mapName}</option>
						))}
					</Form.Control>
					<Form.Control as='select' className='w-auto mr-3' value={position} onChange={onChangePosition}>
						{positionList.map(position => (
							<option key={position} value={position}>{position}</option>
						))}
					</Form.Control>
					<Form.Control as='select' className='w-auto mr-3' value={`${fleetName.id}`} onChange={onChangeFleetName}>
						{fleetList.map(fleet => (
							<option key={fleet.id} value={fleet.id}>{fleet.name}</option>
						))}
					</Form.Control>
					<Form.Control as='select' className='w-auto mr-3' value={formation} disabled>
						{formationList.map(formation => (
							<option key={formation} value={formation}>{formation}</option>
						))}
					</Form.Control>
					<Form.Control as='select' className='w-auto' value={attackType} onChange={onChangeAttackType}>
						{attackTypeList.map(attackType => (
							<option key={attackType} value={attackType}>{attackType}</option>
						))}
					</Form.Control>
				</div>
			</div>
			<InputAndSlider label='クリティカル率(％)' value={criticalPer} minValue={0} maxValue={100}
				onChangeSlider={onChangeCriticalPer} onChangeText={onChangeCriticalPer}/>
		</Form.Group>
	</Form>
);

export {EnemySelector};
