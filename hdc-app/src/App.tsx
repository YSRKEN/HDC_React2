import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Alert, Container, Row, Col } from 'react-bootstrap';

const App: React.FC = () => {
  return (
    <Container>
      <Row>
        <Col xs={12} sm={10} md={8} className='mx-auto'>
          <Alert variant='primary' className='m-3'>サンプルアラート</Alert>
          <Alert variant='info' className='m-3'>サンプルアラート</Alert>
          <Alert variant='danger' className='m-3'>サンプルアラート</Alert>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
