import Chart from 'chart.js';
import { createContext, useEffect, useState } from 'react';
import { ChartData } from 'react-chartjs-2';
import { CHART_COLORS, CHART_COLORS_SIZE, IKammusuSetting } from '../constant';
import { calcHeavyDamageProb } from './simulation';

type ApplicationMode = '仮想敵モード' | '大破率比較モード';

type ActionType = 'setApplicationMode' | 'setGraphName' | 'setMaxHp' | 'setArmor' | 'setNowHp' | 'addKammusuSetting'
	| 'deleteKammusuSetting' | 'setFinalAttackList' | 'setCriticalPer';

const MIN_FINAL_ATTACK = 0;
const MAX_FINAL_ATTACK = 200;
const GRAPH_BLANK = 10;

interface Action {
	type: ActionType;
	message?: string;
}

interface ISettingContext {
	maxHp: number;
	setMaxHp: (value: number) => void;
	armor: number;
	setArmor: (value: number) => void;
	nowHp: number;
	setNowHp: (value: number) => void;
	graphName: string;
	setGraphName: (value: string) => void;
	finalAttackList: { "key": string, "val": number }[];
	setFinalAttackList: (value: { "key": string, "val": number }[]) => void;
	criticalPer: number;
	setCriticalPer: (value: number) => void;
	kammusuSettingList: IKammusuSetting[];
	setKammusuSettingList: (value: IKammusuSetting[]) => void;
	maxValue: number;
	setMaxValue: (value: number) => void;
	minValue: number;
	setMinValue: (value: number) => void;
	applicationMode: ApplicationMode;
	chartData: ChartData<Chart.ChartData> | null;
	chartOption: Chart.ChartOptions | null;
	dispatch: (action: Action) => void;
}

/**
 * 艦娘の最大耐久・装甲・現在装甲から、グラフ用のデータを1本生成する
 * @param maxHp 最大耐久
 * @param armor 装甲
 * @param nowHp 現在装甲
 * @param graphName そのグラフの名称
 * @param colorIndex グラフの色
 */
const createChartDataSets = (maxHp: number, armor: number, nowHp: number,
	graphName: string, colorIndex: number = 0): Chart.ChartDataSets => {
	// 大破率を計算
	const pointList: { x: number, y: number }[] = [];
	for (let finalAttack = MIN_FINAL_ATTACK; finalAttack <= MAX_FINAL_ATTACK; ++finalAttack) {
		const per = calcHeavyDamageProb(maxHp, armor, nowHp, finalAttack);
		pointList.push({ x: finalAttack, y: per * 100 });
	}

	// グラフ出力用のデータを作成
	return {
		backgroundColor: Chart.helpers.color(CHART_COLORS[colorIndex]).alpha(0.2).rgbString(),
		borderColor: CHART_COLORS[colorIndex],
		data: pointList,
		fill: false,
		label: graphName,
		pointRadius: 0,
		showLine: true
	};
}

/**
 * 描画用グラフデータにおける、数値の最大最小値を検索する
 * @param chart 
 */
const findCropRange = (chart: Chart.ChartDataSets): { min: number, max: number } => {
	let minValue = MIN_FINAL_ATTACK;
	let maxValue = MAX_FINAL_ATTACK;
	const chartData = chart.data as Chart.ChartPoint[];
	for (let value = minValue; value < MAX_FINAL_ATTACK - GRAPH_BLANK * 2; ++value) {
		if (chartData[value].y !== chartData[value + GRAPH_BLANK].y) {
			minValue = value;
			break;
		}
	}
	for (let value = MAX_FINAL_ATTACK - 1; value >= GRAPH_BLANK * 2; --value) {
		if (chartData[value].y !== chartData[value - GRAPH_BLANK].y) {
			maxValue = value;
			break;
		}
	}
	return { min: minValue, max: maxValue }
}

/**
 * state生成用関数
 */
export const useSettingState = (): ISettingContext => {
	const [maxHp, setMaxHp] = useState(31);
	const [armor, setArmor] = useState(50);
	const [nowHp, setNowHp] = useState(31);
	const [graphName, setGraphName] = useState('吹雪改二');
	const [finalAttackList, setFinalAttackList] = useState<{ "key": string, "val": number }[]>([]);
	const [criticalPer, setCriticalPer] = useState(15);
	const [kammusuSettingList, setKammusuSettingList] = useState<IKammusuSetting[]>([
		{ graphName: '神風改', maxHp: 23, armor: 38, nowHp: 23 },
		{ graphName: '睦月改二', maxHp: 27, armor: 43, nowHp: 27 },
		{ graphName: '綾波改二', maxHp: 32, armor: 54, nowHp: 32 },
		{ graphName: '暁改二', maxHp: 31, armor: 50, nowHp: 31 },
	]);
	const [maxValue, setMaxValue] = useState(0);
	const [minValue, setMinValue] = useState(200);
	const [applicationMode, setApplicationMode] = useState<ApplicationMode>('大破率比較モード');
	const [chartData, setChartData] = useState<ChartData<Chart.ChartData> | null>(null);
	const [chartOption, setChartOption] = useState<Chart.ChartOptions | null>(null);

	/**
	 * グラフデータを更新するための処理
	 */
	useEffect(() => {
		let chartDataSetList: Chart.ChartDataSets[] = [];

		// グラフで選択している艦向けのデータを作成する
		const primaryChartDataSets = createChartDataSets(
			maxHp, armor, nowHp, graphName);
		chartDataSetList.push(primaryChartDataSets);

		// それ以外の艦向けのデータを作成する
		for (let colorIndex = 1; colorIndex < CHART_COLORS_SIZE; ++colorIndex) {
			const kammusuIndex = colorIndex - 1;
			if (kammusuSettingList.length <= kammusuIndex) {
				break;
			}
			const kammusuSetting = kammusuSettingList[kammusuIndex];
			const secondaryChartDataSets = createChartDataSets(
				kammusuSetting.maxHp, kammusuSetting.armor,
				kammusuSetting.nowHp, kammusuSetting.graphName, colorIndex);
			chartDataSetList.push(secondaryChartDataSets);
		}

		// グラフをクロップする上限・下限の範囲を算出する
		const newRanges = chartDataSetList.map(data => findCropRange(data));
		setMinValue(Math.min(...newRanges.map(pair => pair.min)));
		setMaxValue(Math.max(...newRanges.map(pair => pair.max)));

		// グラフ出力用のデータを作成する
		setChartData({
			datasets: chartDataSetList
		});
	}, [maxHp, armor, nowHp, graphName, kammusuSettingList]);

	/**
	 * グラフ設定を更新するための処理
	 */
	useEffect(() => {
		setChartOption({
			elements: { line: { tension: 0 } },
			scales: {
				xAxes: [{
					scaleLabel: { display: true, labelString: '最終攻撃力' },
					ticks: { min: minValue, max: maxValue }
				}],
				yAxes: [{ scaleLabel: { display: true, labelString: '大破率(％)' }, }]
			},
			showLines: true
		});
	}, [minValue, maxValue]);

	/** 判定用 */
	const isAddButtonDisabled = () => {
		if (kammusuSettingList.length <= 0) {
			return false;
		}
		if (graphName.length <= 0) {
			return true;
		}
		return kammusuSettingList.map(kammusu => kammusu.graphName).includes(graphName);
	};

	/**
	 * dispatch関数
	 * @param action アクション
	 */
	const dispatch = (action: Action) => {
		switch (action.type) {
			case 'setApplicationMode':
				setApplicationMode(action.message as ApplicationMode);
				break;
			case 'setGraphName':
				setGraphName(action.message as string);
				break;
			case 'setMaxHp':
				setMaxHp(parseInt(action.message as string, 10));
				break;
			case 'setArmor':
				setArmor(parseInt(action.message as string, 10));
				break;
			case 'setNowHp':
				setNowHp(parseInt(action.message as string, 10));
				break;
			case 'setFinalAttackList':
				setFinalAttackList(JSON.parse(action.message as string) as ({ "key": string, "val": number }[]));
				break;
			case 'setCriticalPer':
				setCriticalPer(parseInt(action.message as string, 10));
				break;
			case 'addKammusuSetting':
				if (!isAddButtonDisabled()) {
					setKammusuSettingList([...kammusuSettingList,
					{
						maxHp: maxHp, armor: armor,
						nowHp: nowHp, graphName: graphName
					}]);
				}
				break;
			case 'deleteKammusuSetting': {
				const index: number = parseInt(action.message as string, 10);
				if (index < 0 || index >= kammusuSettingList.length) {
					break;
				}
				const newKammusuSettingList = [];
				for (let i = 0; i < kammusuSettingList.length; ++i) {
					if (i === index) {
						continue;
					}
					newKammusuSettingList.push(JSON.parse(JSON.stringify(kammusuSettingList[i])));
				}
				setKammusuSettingList(newKammusuSettingList);
				break;
			}
		}
	}

	return {
		maxHp, setMaxHp, armor, setArmor, nowHp, setNowHp, graphName, setGraphName,
		finalAttackList, setFinalAttackList, criticalPer, setCriticalPer,
		kammusuSettingList, setKammusuSettingList, maxValue, setMaxValue,
		minValue, setMinValue, applicationMode, chartData, chartOption, dispatch
	};
};

export const SettingContext = createContext<ISettingContext>({} as ISettingContext);
