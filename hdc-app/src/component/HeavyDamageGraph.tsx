import React from 'react';
import { Scatter, ChartData } from 'react-chartjs-2';
import * as chartjs from 'chart.js';

const HeavyDamageGraph: React.FC<{
	data: ChartData<chartjs.ChartData>
	options: chartjs.ChartOptions
}> = ({data, options}) => (
	<Scatter data={data} options={options}/>
);

export {HeavyDamageGraph};
