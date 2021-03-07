import React, { useContext } from 'react';
import { EnemySelector as ES } from '../component/EnemySelector';
import { SettingContext } from '../service/context';

// 陣形一覧
const FORMATION_LIST = ['単縦', '複縦', '輪形', '梯形', '単横', '第三'];

const ASSET_URL = `${document.location.origin}/assets`;

type FinalAttackData = { [key: string]: { 'name': string, 'final_attack': { "key": string, "val": number }[] }; };

type FleetsPatternData = { [key: string]: { [key: string]: { 'form': string, fleet: number[] } } };

const EnemySelector: React.FC = () => {
	const [mapList, setMapList] = React.useState<string[]>([]);
	const [positionList, setPositionList] = React.useState<string[]>([]);
	const [fleetList, setFleetList] = React.useState<{ id: number; name: string; }[]>([]);
	const [formationList] = React.useState(FORMATION_LIST);
	const [attackTypeList, setAttackTypeList] = React.useState<string[]>([]);

	const [mapName, setMapName] = React.useState<string>('1-1');
	const [position, setPosition] = React.useState<string>('A-1');
	const [fleetName, setFleetName] = React.useState<{ id: number; name: string; }>({ id: 1501, name: '駆逐イ級' });
	const [formation, setFormation] = React.useState('単縦');
	const [attackType, setAttackType] = React.useState<string>('砲撃');

	const [finalAttackData, setFinalAttackData] = React.useState<FinalAttackData>({});
	const [fleetsPatternData, setFleetsPatternData] = React.useState<FleetsPatternData>({});

	const { criticalPer, finalAttackInputData, dispatch } = useContext(SettingContext);

	React.useEffect(() => {
		initialize();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		resetFinalAttackList(finalAttackData, fleetName.id, formation, attackType);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [finalAttackData, fleetName.id, formation, attackType]);

	// マス選択部分を自動設定する
	const resetPositionList = (fad: FinalAttackData, fpd: FleetsPatternData, mapName: string) => {
		// マス選択部分の修正
		const newPositionList = [];
		for (let positionName in fpd[mapName]) {
			newPositionList.push(positionName);
		}
		setPositionList(newPositionList);

		// 選択しているマスの修正
		let selectedPosition = position;
		if (!newPositionList.includes(position)) {
			selectedPosition = newPositionList[0];
			setPosition(newPositionList[0]);
		}

		// 敵艦選択部分を自動設定
		resetFleetListAndFormation(fad, fpd, mapName, selectedPosition);
	}

	// 敵艦選択部分を自動設定する
	const resetFleetListAndFormation = (fad: FinalAttackData, fpd: FleetsPatternData, mapName: string, positionName: string) => {
		// 敵艦選択部分の修正
		const newFleetList: { id: number, name: string }[] = [];
		setFormation(fpd[mapName][positionName].form);
		for (let fleetId of fpd[mapName][positionName].fleet) {
			let flg = false;
			for (let fleetData of newFleetList) {
				if (fleetData.id === fleetId) {
					flg = true;
					break;
				}
			}
			if (!flg) {
				newFleetList.push({ id: fleetId, name: fad[`${fleetId}`].name });
			}
		}
		setFleetList(newFleetList);

		// 選択している敵艦の修正
		let selectedFleetName = fleetName;
		if (!newFleetList.map(fleet => fleet.id).includes(fleetName.id)) {
			selectedFleetName = { id: newFleetList[0].id, name: newFleetList[0].name };
			setFleetName({ id: newFleetList[0].id, name: newFleetList[0].name });
		}

		// 攻撃種選択部分の修正
		resetAttackTypeList(fad, selectedFleetName.id);
	}

	// 攻撃種選択部分を自動設定する
	const resetAttackTypeList = (fad: FinalAttackData, fleetId: number) => {
		// 攻撃種選択部分の修正
		const finalAttackList = fad[`${fleetId}`]['final_attack'];
		const newAttackTypeList: string[] = [];
		for (let record of finalAttackList) {
			const attackType = record['key'].split(' ')[3];
			if (!newAttackTypeList.includes(attackType)) {
				newAttackTypeList.push(attackType);
			}
		}
		setAttackTypeList(newAttackTypeList);

		// 選択している攻撃種の修正
		if (!newAttackTypeList.includes(attackType)) {
			setAttackType(newAttackTypeList[0]);
		}
	}

	// 最終攻撃力一覧を自動設定する
	const resetFinalAttackList = (fad: FinalAttackData, fleetId: number, formation: string, attackType: string) => {
		if (`${fleetId}` in fad) {
			dispatch({
				type: 'setFinalAttackList', message: JSON.stringify(
					fad[`${fleetId}`].final_attack
						.filter(pair => pair.key.includes(formation) && pair.key.includes(attackType))
				)
			});
		}
	};

	// アセットを読み込んでSELECT用に変換する
	const initialize = async () => {
		// データを読み込む
		const data1: FinalAttackData = await (await fetch(`${ASSET_URL}/final_attack.json`)).json();
		setFinalAttackData(data1);
		const data2: FleetsPatternData = await (await fetch(`${ASSET_URL}/fleets_pattern.json`)).json();
		setFleetsPatternData(data2);

		// マップ選択部分を自動設定する
		const newMapList = [];
		for (let mapName in data2) {
			newMapList.push(mapName);
		}
		setMapList(newMapList);

		// マス選択部分を自動設定する
		resetPositionList(data1, data2, '1-1');

		// 敵艦選択部分・陣形選択部分を自動設定する
		resetFleetListAndFormation(data1, data2, '1-1', 'A-1');

		// 攻撃種選択部分を自動設定する
		resetAttackTypeList(data1, 1501);

		// 最終攻撃力の情報を転送
		resetFinalAttackList(data1, 1501, '単縦', '砲撃');
	}

	const onChangeMapName = (event: React.ChangeEvent<any>) => {
		setMapName(event.target.value);
		resetPositionList(finalAttackData, fleetsPatternData, event.target.value);
	}

	const onChangePosition = (event: React.ChangeEvent<any>) => {
		setPosition(event.target.value);
		resetFleetListAndFormation(finalAttackData, fleetsPatternData, mapName, event.target.value);
	}

	const onChangeFleetName = (event: React.ChangeEvent<any>) => {
		const fid = parseInt(event.target.value, 10);
		setFleetName({ id: fid, name: finalAttackData[event.target.value].name });
		resetAttackTypeList(finalAttackData, fid);
	}

	const onChangeAttackType = (event: React.ChangeEvent<any>) => {
		setAttackType(event.target.value);
	}

	const onChangeCriticalPer = (event: React.ChangeEvent<HTMLInputElement>) => {
		// 入力チェック
		if (typeof (event.target.value) !== 'string') {
			return;
		}

		// 入力
		const temp = parseInt(event.target.value, 10);
		if (!isNaN(temp)) {
			dispatch({ type: 'setCriticalPer', message: '' + Math.max(Math.min(temp, 100), 0) });
		} else {
			dispatch({ type: 'setCriticalPer', message: '15' });
		}
	}

	const onChangeFinalAttackInputData = (event: React.ChangeEvent<any>) => {
		dispatch({ type: 'setFinalAttackInputData', message: event.currentTarget.value });
	};

	return (<ES mapList={mapList} positionList={positionList}
		fleetList={fleetList} formationList={formationList}
		attackTypeList={attackTypeList}
		mapName={mapName} onChangeMapName={onChangeMapName}
		position={position} onChangePosition={onChangePosition}
		fleetName={fleetName} onChangeFleetName={onChangeFleetName}
		attackType={attackType} onChangeAttackType={onChangeAttackType}
		formation={formation} criticalPer={criticalPer} onChangeCriticalPer={onChangeCriticalPer}
		finalAttackInputData={finalAttackInputData} onChangeFinalAttackInputData={onChangeFinalAttackInputData} />);
}

export default EnemySelector;
