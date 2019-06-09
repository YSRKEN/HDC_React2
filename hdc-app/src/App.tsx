import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import InputKammusuSetting from './container/InputKammusuSetting';
import EnemySelector from './container/EnemySelector';
import './App.css'
import DamageInfo from './container/DamageInfo';
import { SettingContext } from './service/context';
import SelectButtonGroup from './container/SelectButtonGroup';
import HeavyDamageGraph from './container/HeavyDamageGraph';
import { IKammusuSetting } from './constant';
import KammusuSettingListView from './container/KammusuSettingListView';

type ApplicationMode = '仮想敵モード' | '大破率比較モード';

const VirtualEnemy: React.FC = () => (<>
  <Col xs={12} md={10} lg={8} className='mx-auto mt-2'>
    <h2 className='d-none d-md-block'>2. 敵艦の設定</h2>
    <h3 className='d-block d-md-none'>2. 敵艦の設定</h3>
    <EnemySelector />
  </Col>
  <Col xs={12} md={10} lg={8} className='mx-auto mt-2'>
    <h2 className='d-none d-md-block'>3. 大破率</h2>
    <h3 className='d-block d-md-none'>3. 大破率</h3>
    <DamageInfo />
  </Col>
</>);

const ComparePercent: React.FC = () => (<>
  <Col xs={12} md={10} lg={8} className='mx-auto mt-2'>
    <h2 className='d-none d-md-block'>2. 比較対象の設定</h2>
    <h3 className='d-block d-md-none'>2. 比較対象の設定</h3>
    <KammusuSettingListView />
  </Col>
  <Col xs={12} md={10} lg={8} className='mx-auto mt-2'>
    <h2 className='d-none d-md-block'>3. 大破率</h2>
    <h3 className='d-block d-md-none'>3. 大破率</h3>
    <HeavyDamageGraph />
  </Col>
</>);

const App: React.FC = () => {
	const [maxHp, setMaxHp] = React.useState(31);
	const [armor, setArmor] = React.useState(50);
  const [nowHp, setNowHp] = React.useState(31);
  const [graphName, setGraphName] = React.useState('吹雪改二');
  const [finalAttackList, setFinalAttackList] = React.useState<{"key": string, "val": number}[]>([]);
  const [criticalPer, setCriticalPer] = React.useState(15);
  const [kammusuSettingList, setKammusuSettingList] = React.useState<IKammusuSetting[]>([
    {graphName: '神風改', maxHp: 23, armor: 38, nowHp: 23},
    {graphName: '睦月改二', maxHp: 27, armor: 43, nowHp: 27},
    {graphName: '綾波改二', maxHp: 32, armor: 54, nowHp: 32},
    {graphName: '暁改二', maxHp: 31, armor: 50, nowHp: 31},
  ]);
  const [maxValue, setMaxValue] = React.useState(0);
  const [minValue, setMinValue] = React.useState(200);
  const [applicationMode, setApplicationMode] = React.useState<ApplicationMode>('大破率比較モード');

  const setApplicationModeFunc = (value: string) => {
    if (['仮想敵モード', '大破率比較モード'].includes(value)) {
      setApplicationMode(value as ApplicationMode);
    }
  }

  return (
    <SettingContext.Provider value={{
      maxHp, setMaxHp, armor, setArmor, nowHp, setNowHp, graphName, setGraphName,
      finalAttackList, setFinalAttackList, criticalPer, setCriticalPer,
      kammusuSettingList, setKammusuSettingList, maxValue, setMaxValue,
      minValue, setMinValue
    }}>
      <Container className='my-3'>
        <Row>
          <Col xs={12} md={10} lg={8} className='mx-auto'>
            <h1 className='d-none d-md-block text-center'>艦娘大破率計算機(改)</h1>
            <h2 className='d-block d-md-none text-center'>艦娘大破率計算機(改)</h2>
          </Col>
          <Col xs={12} md={10} lg={8} className='mx-auto'>
            <h2 className='d-none d-md-block'>1. 艦娘の設定</h2>
            <h3 className='d-block d-md-none'>1. 艦娘の設定</h3>
            <InputKammusuSetting />
          </Col>
          <Col xs={12} md={10} lg={8} className='mx-auto mt-2'>
            <SelectButtonGroup className='w-100 my-3' nameList={['仮想敵モード', '大破率比較モード']}
              firstSelectName={applicationMode} callback={setApplicationModeFunc}/>
          </Col>
          {
            applicationMode === '仮想敵モード' ? <VirtualEnemy /> : <ComparePercent />
          }
        </Row>
      </Container>
    </SettingContext.Provider>
  );
}

export default App;
