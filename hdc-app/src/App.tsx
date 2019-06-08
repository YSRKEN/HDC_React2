import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import InputKammusuSetting from './container/InputKammusuSetting';
import EnemySelector from './container/EnemySelector';
import './App.css'
import DamageInfo from './container/DamageInfo';
import { SettingContext } from './service/context';
import SelectButtonGroup from './container/SelectButtonGroup';
import HeavyDamageGraph from './container/HeavyDamageGraph';

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
  const [finalAttackList, setFinalAttackList] = React.useState<{"key": string, "val": number}[]>([]);
  const [criticalPer, setCriticalPer] = React.useState(15);
  const [applicationMode, setApplicationMode] = React.useState<ApplicationMode>('大破率比較モード');

  const setApplicationModeFunc = (value: string) => {
    if (['仮想敵モード', '大破率比較モード'].includes(value)) {
      setApplicationMode(value as ApplicationMode);
    }
  }

  return (
    <SettingContext.Provider value={{
      maxHp, setMaxHp, armor, setArmor, nowHp, setNowHp,
      finalAttackList, setFinalAttackList, criticalPer, setCriticalPer
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
            applicationMode == '仮想敵モード' ? <VirtualEnemy /> : <ComparePercent />
          }
        </Row>
      </Container>
    </SettingContext.Provider>
  );
}

export default App;
