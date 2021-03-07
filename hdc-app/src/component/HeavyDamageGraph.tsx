import React, { useEffect, useState } from 'react';
import { Scatter, ChartData } from 'react-chartjs-2';
import * as chartjs from 'chart.js';
import { Form } from 'react-bootstrap';

const round = (value: number) => {
	return Math.round(value * 10) / 10;
}

const HeavyDamageGraph: React.FC<{
	data: ChartData<chartjs.ChartData>
	options: chartjs.ChartOptions
}> = ({ data, options }) => {
	const [sliderValue, setSliderValue] = useState(1);
	const [hdpList, setHdpList] = useState<string[]>([]);

	useEffect(() => {
		const output: string[] = [];
		const data2: {
			datasets: Chart.ChartDataSets[]
		} = (data as any);
		for (const record of data2.datasets) {
			const kammusuName = record.label;
			const findY = (x: number) => {
				for (const point of (record.data as chartjs.ChartPoint[])) {
					if (point.x === x) {
						return point.y as number;
					}
				}
				return -1;
			};
			const hdp = findY(sliderValue);
			if (hdp < 0) {
				const temp = (record.data as chartjs.ChartPoint[]).map(point => point.x as number);
				const minX = Math.min(...temp);
				const maxX = Math.max(...temp);
				if (sliderValue < minX) {
					output.push(`${kammusuName}：${round(findY(minX))}％`);
				} else {
					output.push(`${kammusuName}：${round(findY(maxX))}％`);
				}
			} else {
				output.push(`${kammusuName}：${round(hdp)}％`);
			}
		}
		setHdpList(output);
	}, [sliderValue, data]);

	return <>
		<Scatter data={data} options={options} />
		<Form.Label>最終攻撃力：{sliderValue}</Form.Label>
		<Form.Control type="range" value={sliderValue} min={0} max={300} onChange={(e) => {
			setSliderValue(parseInt(e.currentTarget.value, 10));
		}} />
		<ul className='border'>
			{hdpList.map((info, index) => <li key={index}>{info}</li>)}
		</ul>
	</>
};

export { HeavyDamageGraph };
