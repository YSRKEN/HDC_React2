import React from 'react';
import {HeavyDamageGraph as HDG} from '../component/HeavyDamageGraph';
import { SettingContext, ISettingContext } from '../service/context';
import { ChartData, defaults } from 'react-chartjs-2';
import { calcHeavyDamageProb } from '../service/simulation';
import Chart from 'chart.js';
import { CHART_COLORS, CHART_COLORS_SIZE } from '../constant';

const temp: any = defaults;
temp['global']['animation'] = false;

const MIN_FINAL_ATTACK = 0;
const MAX_FINAL_ATTACK = 200;
const GRAPH_BLANK = 10;

const createChartDataSets = (maxHp: number, armor: number, nowHp: number,
	graphName: string, colorIndex: number = 0): Chart.ChartDataSets => {
	// 大破率を計算
	const pointList: {x: number, y: number}[] = [];
	for (let finalAttack = MIN_FINAL_ATTACK; finalAttack <= MAX_FINAL_ATTACK; ++finalAttack) {
		const per = calcHeavyDamageProb(maxHp, armor, nowHp, finalAttack);
		pointList.push({x: finalAttack, y: per * 100});
	}

	// グラフ出力用のデータを作成
	return {
		backgroundColor: Chart.helpers.color(CHART_COLORS[colorIndex]).alpha(0.2).rgbString(),
		borderColor: CHART_COLORS[colorIndex],
		data: pointList,
		fill: false,
		label: graphName,
		pointRadius: 0
	};
}

const findCropRange = (chart: Chart.ChartDataSets): {min: number, max: number} => {
	let minValue = MIN_FINAL_ATTACK;
	let maxValue = MAX_FINAL_ATTACK;
	const chartData = chart.data as Chart.ChartPoint[];
	for (let value = minValue; value < MAX_FINAL_ATTACK - GRAPH_BLANK * 2; ++value) {
		if (chartData[value].y != chartData[value + GRAPH_BLANK].y) {
			minValue = value;
			break;
		}
	}
	for (let value = MAX_FINAL_ATTACK - 1; value >= GRAPH_BLANK * 2; --value) {
		if (chartData[value].y != chartData[value - GRAPH_BLANK].y) {
			maxValue = value;
			break;
		}
	}
	return {min: minValue, max: maxValue}
}

const getData = (setting: ISettingContext): ChartData<Chart.ChartData> => {
	let chartDataSetList: Chart.ChartDataSets[] = [];

	// グラフで選択している艦向けのデータを作成する
	const primaryChartDataSets = createChartDataSets(
		setting.maxHp, setting.armor, setting.nowHp, setting.graphName);
	chartDataSetList.push(primaryChartDataSets);

	// それ以外の艦向けのデータを作成する
	for (let colorIndex = 1; colorIndex < CHART_COLORS_SIZE; ++colorIndex) {
		const kammusuIndex = colorIndex - 1;
		if (setting.kammusuSettingList.length <= kammusuIndex) {
			break;
		}
		const kammusuSetting = setting.kammusuSettingList[kammusuIndex];
		const secondaryChartDataSets = createChartDataSets(
			kammusuSetting.maxHp, kammusuSetting.armor,
			kammusuSetting.nowHp, kammusuSetting.graphName, colorIndex);
		chartDataSetList.push(secondaryChartDataSets);
	}

	// グラフをクロップする上限・下限の範囲を算出する
	const newRanges = chartDataSetList.map(data => findCropRange(data));
	setting.setMinValue(Math.min(...newRanges.map(pair => pair.min)));
	setting.setMaxValue(Math.max(...newRanges.map(pair => pair.max)));

	// グラフ出力用のデータを作成する
	return {
		datasets: chartDataSetList
	};
};

const HeavyDamageGraph: React.FC = () => {
	const setting = React.useContext(SettingContext);

	const getOptions = (minV: number, maxV: number): Chart.ChartOptions => {
		return {
			elements: { line: { tension: 0 } },
			scales: {
				xAxes: [{
					scaleLabel: { display: true, labelString: '最終攻撃力' },
					ticks: { min: minV, max: maxV }
				}],
				yAxes: [{ scaleLabel: { display: true, labelString: '大破率(％)' }, }]
			},
			showLines: true
		};
	};

	return (
		<HDG data={getData(setting)} options={getOptions(setting.minValue, setting.maxValue)}/>
	);
}

export default HeavyDamageGraph;
