import { Chart as ChartJS, registerables } from 'chart.js';
import React from 'react';
import { HeavyDamageGraph as HDG } from '../component/HeavyDamageGraph';
import { SettingContext } from '../service/context';

ChartJS.register(...registerables);
ChartJS.defaults.animation = false;

const HeavyDamageGraph: React.FC = () => {
  const { chartData, chartOption } = React.useContext(SettingContext);

  if (chartData !== null && chartOption !== null) {
    return <HDG data={chartData} options={chartOption} />;
  }

  return <></>;
};

export default HeavyDamageGraph;
