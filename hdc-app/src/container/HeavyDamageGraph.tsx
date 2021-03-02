import React from 'react';
import { HeavyDamageGraph as HDG } from '../component/HeavyDamageGraph';
import { SettingContext } from '../service/context';
import { defaults } from 'react-chartjs-2';

const temp: any = defaults;
temp['global']['animation'] = false;

const HeavyDamageGraph: React.FC = () => {
	const { chartData, chartOption } = React.useContext(SettingContext);

	if (chartData !== null && chartOption !== null) {
		return <HDG data={chartData} options={chartOption} />;
	} else {
		return <></>;
	}
}

export default HeavyDamageGraph;
