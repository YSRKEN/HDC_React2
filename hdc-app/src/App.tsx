import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import InputKammusuSetting from './container/InputKammusuSetting';
import EnemySelector from './container/EnemySelector';
import './App.css'
import DamageInfo from './container/DamageInfo';
import { SettingContext } from './service/context';

const App: React.FC = () => {
	const [maxHp, setMaxHp] = React.useState(31);
	const [armor, setArmor] = React.useState(50);
  const [nowHp, setNowHp] = React.useState(31);
  const [finalAttackList, setFinalAttackList] = React.useState<{"key": string, "val": number}[]>([]);
  const [criticalPer, setCriticalPer] = React.useState(15);

  return (
    <SettingContext.Provider value={{
      maxHp, setMaxHp, armor, setArmor, nowHp, setNowHp,
      finalAttackList, setFinalAttackList, criticalPer, setCriticalPer
    }}>
      <Container className='my-3'>
        <Row>
          <Col xs={12} sm={10} md={8} className='mx-auto'>
            <h1 className='d-none d-md-block text-center'>艦娘大破率計算機</h1>
            <h2 className='d-block d-md-none text-center'>艦娘大破率計算機</h2>
          </Col>
          <Col xs={12} sm={10} md={8} className='mx-auto'>
            <h2 className='d-none d-md-block'>1. 艦娘の設定</h2>
            <h3 className='d-block d-md-none'>1. 艦娘の設定</h3>
            <InputKammusuSetting />
          </Col>
          <Col xs={12} sm={10} md={8} className='mx-auto mt-2'>
            <h2 className='d-none d-md-block'>2. 敵艦の設定</h2>
            <h3 className='d-block d-md-none'>2. 敵艦の設定</h3>
            <EnemySelector />
          </Col>
          <Col xs={12} sm={10} md={8} className='mx-auto mt-2'>
            <h2 className='d-none d-md-block'>3. 損傷割合</h2>
            <h3 className='d-block d-md-none'>2. 損傷割合</h3>
            <DamageInfo />
          </Col>
        </Row>
      </Container>
    </SettingContext.Provider>
  );
}

export default App;
