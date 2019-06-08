import React from 'react';
import {HeavyDamageGraph as HDG} from '../component/HeavyDamageGraph';
import { SettingContext } from '../service/context';
import { ChartData, defaults } from 'react-chartjs-2';
import { calcHeavyDamageProb } from '../service/simulation';
import Chart from 'chart.js';
import { CHART_COLORS } from '../constant';

const temp: any = defaults;
temp['global']['animation'] = false;

const MIN_FINAL_ATTACK = 0;
const MAX_FINAL_ATTACK = 200;

const getData = (maxHp: number, armor: number, nowHp: number, graphName: string): ChartData<Chart.ChartData> => {
	// 大破率を計算
	const pointList: {x: number, y: number}[] = [];
	for (let finalAttack = MIN_FINAL_ATTACK; finalAttack <= MAX_FINAL_ATTACK; ++finalAttack) {
		const per = calcHeavyDamageProb(maxHp, armor, nowHp, finalAttack);
		pointList.push({x: finalAttack, y: per * 100});
	}

	// グラフ出力用のデータを作成する
	return {
		datasets: [{
			backgroundColor: Chart.helpers.color(CHART_COLORS[0]).alpha(0.2).rgbString(),
			borderColor: CHART_COLORS[0],
			data: pointList,
			fill: false,
			label: graphName,
			pointRadius: 0
		}]
	};
};

const HeavyDamageGraph: React.FC = () => {
	const setting = React.useContext(SettingContext);

	const options: Chart.ChartOptions = {
		elements: { line: { tension: 0 } },
		scales: {
			xAxes: [{ scaleLabel: { display: true, labelString: '最終攻撃力' }, }],
			yAxes: [{ scaleLabel: { display: true, labelString: '大破率(％)' }, }]
		},
		showLines: true
	};

	return (
		<HDG data={getData(setting.maxHp, setting.armor, setting.nowHp, setting.graphName)} options={options}/>
	);
}

export default HeavyDamageGraph;
