import React from 'react';
import {HeavyDamageGraph as HDG} from '../component/HeavyDamageGraph';
import { SettingContext } from '../service/context';
import { ChartData, defaults } from 'react-chartjs-2';
import { calcHeavyDamageProb } from '../service/simulation';
import Chart from 'chart.js';

const temp: any = defaults;
temp['global']['animation'] = false;

const CHART_COLORS = [
	"#FF4B00",
	"#FFF100",
	"#03AF7A",
	"#005AFF",
	"#4DC4FF",
	"#FF8082",
	"#F6AA00",
	"#990099",
	"#804000",
];

const getData = (maxHp: number, armor: number, nowHp: number): ChartData<Chart.ChartData> => {
	const pointList: {x: number, y: number}[] = [];
	for (let finalAttack = 0; finalAttack <= 200; ++finalAttack) {
		const per = calcHeavyDamageProb(maxHp, armor, nowHp, finalAttack);
		pointList.push({x: finalAttack, y: per * 100});
	}

	return {
		datasets: [{
			backgroundColor: Chart.helpers.color(CHART_COLORS[0]).alpha(0.2).rgbString(),
			borderColor: CHART_COLORS[0],
			data: pointList,
			fill: false,
			label: '入力値',
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
		<HDG data={getData(setting.maxHp, setting.armor, setting.nowHp)} options={options}/>
	);
}

export default HeavyDamageGraph;
