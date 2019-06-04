import React from 'react';
import {EnemySelector as ES} from '../component/EnemySelector';

// 陣形一覧
const FORMATION_LIST = ['単縦', '複縦', '輪形', '梯形', '単横', '第三'];

// 攻撃種一覧
const ATTACK_TYPE_LIST = ['砲撃', '雷撃', '航空', '対潜', '夜戦'];

const ASSET_URL = `${document.location.origin}/assets`;

type FinalAttackData = {[key: string]: {'name': string, 'final_attack': {"key": string, "val": number}[]};};

type FleetsPatternData = {[key: string]: {[key: string]: {'form': string, fleet: number[]}}};

const EnemySelector: React.FC = () => {
	const [mapList, setMapList] = React.useState<string[]>([]);
	const [positionList, setPositionList] = React.useState<string[]>([]);
	const [fleetList, setFleetList] = React.useState<{ id: number; name: string; }[]>([]);
	const [formationList] = React.useState(FORMATION_LIST);
	const [attackTypeList, setAttackTypeList] = React.useState<string[]>([]);
	const [formation, setFormation] = React.useState(FORMATION_LIST[0]);
	const [criticalPer, setCriticalPer] = React.useState(15);
	const [finalAttackData, setFinalAttackData] = React.useState<FinalAttackData>({});
	const [fleetsPatternData, setFleetsPatternData] = React.useState<FleetsPatternData>({});

	React.useEffect(() => {
		initialize();
	}, []);

	// マス選択部分を自動設定する
	const resetPositionList = (fpd: FleetsPatternData, mapName: string) => {
		const newPositionList = [];
		for (let positionName in fpd[mapName]) {
			newPositionList.push(positionName);
		}
		setPositionList(newPositionList);
	}

	// 敵艦選択部分を自動設定する
	const resetFleetListAndFormation = (fad: FinalAttackData, fpd: FleetsPatternData, mapName: string, positionName: string) => {
		const newFleetList: {id: number, name: string}[] = [];
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
				newFleetList.push({id: fleetId, name: fad[`${fleetId}`].name});
			}
		}
		setFleetList(newFleetList);
	}

	const resetAttackTypeList = (fad: FinalAttackData, fleetId: number) => {
		const finalAttackList = fad[`${fleetId}`]['final_attack'];
		const newAttackTypeList: string[] = [];
		for (let record of finalAttackList) {
			const attackType = record['key'].split(' ')[3];
			if (!newAttackTypeList.includes(attackType)) {
				newAttackTypeList.push(attackType);
			}
		}
		setAttackTypeList(newAttackTypeList);
	}

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
		resetPositionList(data2, '1-1');

		// 敵艦選択部分・陣形選択部分を自動設定する
		resetFleetListAndFormation(data1, data2, '1-1', 'A-1');

		// 攻撃種選択部分を自動設定する
		resetAttackTypeList(data1, 1501);
	}

	const onChangeCriticalPer = (event: React.ChangeEvent<HTMLInputElement>) => {
		// 入力チェック
		if (typeof(event.target.value) !== 'string') {
			return;
		}

		// 入力
		const temp = parseInt(event.target.value, 10);
		if (!isNaN(temp)) {
			setCriticalPer(Math.max(Math.min(temp, 100), 0));
		} else {
			setCriticalPer(15);
		}
	}

	return (<ES mapList={mapList} positionList={positionList}
		fleetList={fleetList} formationList={formationList}
		attackTypeList={attackTypeList} formation={formation}
		criticalPer={criticalPer}
		onChangeCriticalPer={onChangeCriticalPer}/>);
}

export default EnemySelector;
