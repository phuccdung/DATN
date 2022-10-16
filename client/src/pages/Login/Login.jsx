import React from 'react';
import "./Login.css";
import Helmet from "../../components/Helmet/Helmet";
import { Container,Row,Col,Form,FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <Helmet title='Login'>
      <section>
        <Container>
          <Row>
            <Col lg='6' className='m-auto text-center'>
              <h3 className='fw-bold fs-4'>Login</h3>

              <Form className='auth__form'>
                <FormGroup className='form__group'>
                  <input type="email" placeholder='Enter Your Email' />
                </FormGroup>
                <FormGroup className='form__group'>
                  <input type="password" placeholder='Enter Your Password' />
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  )
}

export default Login