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
	const [mapList] = React.useState([
		'1-1', '1-2', '1-3'
	]);
	const [positionList] = React.useState([
		'A-1', 'A-2', 'B-1'
	]);
	const [fleetList] = React.useState([
		{id: 1501, name: '駆逐イ級'},
		{id: 1502, name: '駆逐ロ級'},
		{id: 1503, name: '駆逐ハ級'},
	]);
	const [formationList] = React.useState(FORMATION_LIST);
	const [attackTypeList] = React.useState(ATTACK_TYPE_LIST);
	const [criticalPer, setCriticalPer] = React.useState(15);
	const [finalAttackData, setFinalAttackData] = React.useState<FinalAttackData>({});
	const [fleetsPatternData, setFleetsPatternData] = React.useState<FleetsPatternData>({});

	// アセットを読み込んで蓄えておく
	const readAssetData = async () => {
		const data1: FinalAttackData = await (await fetch(`${ASSET_URL}/final_attack.json`)).json();
		setFinalAttackData(data1);
		const data2: FleetsPatternData = await (await fetch(`${ASSET_URL}/fleets_pattern.json`)).json();
		setFleetsPatternData(data2);
		console.log(data1);
		console.log(data2);
	};

	React.useEffect(() => {
		// アセットを読み込む
		readAssetData();
	}, []);

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
		attackTypeList={attackTypeList} criticalPer={criticalPer}
		onChangeCriticalPer={onChangeCriticalPer}/>);
}

export default EnemySelector;
