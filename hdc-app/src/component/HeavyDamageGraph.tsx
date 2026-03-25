import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Form } from 'react-bootstrap';

type ScatterPoint = { x: number; y: number };

const round = (value: number) => Math.round(value * 10) / 10;

const findYByX = (points: ScatterPoint[], x: number): number => {
  const found = points.find(point => point.x === x);
  return found?.y ?? -1;
};

const HeavyDamageGraph: React.FC<{
  data: ChartData<'scatter', ScatterPoint[]>;
  options: ChartOptions<'scatter'>;
}> = ({ data, options }) => {
  const [sliderValue, setSliderValue] = useState(1);
  const [hdpList, setHdpList] = useState<string[]>([]);

  useEffect(() => {
    const output: string[] = [];
    const datasets = (data.datasets ?? []) as ChartDataset<'scatter', ScatterPoint[]>[];

    for (const record of datasets) {
      const kammusuName = record.label ?? '';
      const pointList = (record.data ?? []) as ScatterPoint[];
      const hdp = findYByX(pointList, sliderValue);

      if (hdp < 0 && pointList.length > 0) {
        const xValues = pointList.map(point => point.x);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        if (sliderValue < minX) {
          output.push(`${kammusuName}：${round(findYByX(pointList, minX))}％`);
        } else {
          output.push(`${kammusuName}：${round(findYByX(pointList, maxX))}％`);
        }
      } else {
        output.push(`${kammusuName}：${round(hdp)}％`);
      }
    }

    setHdpList(output);
  }, [sliderValue, data]);

  return (
    <>
      <Scatter data={data} options={options} />
      <Form.Label>最終攻撃力：{sliderValue}</Form.Label>
      <Form.Control
        type="range"
        value={sliderValue}
        min={0}
        max={300}
        onChange={event => {
          setSliderValue(parseInt(event.currentTarget.value, 10));
        }}
      />
      <ul className="border">
        {hdpList.map((info, index) => (
          <li key={index}>{info}</li>
        ))}
      </ul>
    </>
  );
};

export { HeavyDamageGraph };
