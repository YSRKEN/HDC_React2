import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import InputKammusuSetting from './container/InputKammusuSetting';
import EnemySelector from './container/EnemySelector';
import './App.css'
import DamageInfo from './container/DamageInfo';
import { SettingContext, useSettingState } from './service/context';
import SelectButtonGroup from './container/SelectButtonGroup';
import HeavyDamageGraph from './container/HeavyDamageGraph';
import KammusuSettingListView from './container/KammusuSettingListView';

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
  const state = useSettingState();

  const setApplicationModeFunc = (value: string) => {
    if (['仮想敵モード', '大破率比較モード'].includes(value)) {
      state.dispatch({ type: 'setApplicationMode', message: value });
    }
  }

  return (
    <SettingContext.Provider value={state}>
      <Container className='my-3'>
        <Row>
          <Col xs={12} md={10} lg={8} className='mx-auto'>
            <h1 className='d-none d-md-block text-center'>艦娘大破率計算機(改)</h1>
            <h2 className='d-block d-md-none text-center'>艦娘大破率計算機(改)</h2>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <span className="d-inline-block mr-3">最終更新：2021/03/07</span>
            <span className="d-inline-block mr-3"><a href="https://github.com/YSRKEN/HDC_React2" rel="noreferrer" target="_blank">GitHub</a> </span>
            <span><a href="https://twitter.com/YSRKEN" rel="noreferrer" target="_blank">作者のTwitter</a></span>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={10} lg={8} className='mx-auto'>
            <h2 className='d-none d-md-block'>1. 艦娘の設定</h2>
            <h3 className='d-block d-md-none'>1. 艦娘の設定</h3>
            <InputKammusuSetting />
          </Col>
          <Col xs={12} md={10} lg={8} className='mx-auto mt-2'>
            <SelectButtonGroup className='w-100 my-3' nameList={['仮想敵モード', '大破率比較モード']}
              firstSelectName={state.applicationMode} callback={setApplicationModeFunc} />
          </Col>
        </Row>
        <Row>
          {
            state.applicationMode === '仮想敵モード' ? <VirtualEnemy /> : <ComparePercent />
          }
        </Row>
      </Container>
    </SettingContext.Provider >
  );
}

export default App;
