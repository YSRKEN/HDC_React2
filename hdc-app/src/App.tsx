import React from 'react';
import { Alert, Container, Row, Col } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import InputAndSlider from './container/InputAndSlider';

const App: React.FC = () => {
  const data = {
    labels: ['Red', 'Green', 'Yellow'],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  };

  const [maxHp, setMaxHp] = React.useState(50);

  return (
    <Container>
      <Row>
        <Col xs={12} sm={10} md={8} className='mx-auto'>
          <Alert variant='primary' className='m-3'>サンプルアラート</Alert>
          <Alert variant='info' className='m-3'>サンプルアラート</Alert>
          <Alert variant='danger' className='m-3'>サンプルアラート</Alert>
        </Col>
        <Col xs={12} sm={10} md={8} className='mx-auto'>
          <Doughnut data={data} />
        </Col>
        <Col xs={12} sm={10} md={8} className='mx-auto'>
          <InputAndSlider label='最大耐久' value={maxHp} minValue={0} maxValue={200} setValue={setMaxHp}/>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
