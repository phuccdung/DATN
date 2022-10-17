import React,{useState} from 'react';
import "./Login.css";
import Helmet from "../../components/Helmet/Helmet";
import { Container,Row,Col,Form,FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';

const Login = () => {

  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');


  return (
    <Helmet title='Login'>
      <section>
        <Container>
          <Row>
            <Col lg='6' className='m-auto text-center'>
              <h3 className='fw-bold mb-4'>Login</h3>

              <Form className='auth__form'>
                <FormGroup className='form__group'>
                  <input
                   value={email} onChange={e=>setEmail(e.currentTarget.value)}
                   type="email" placeholder='Enter Your Email' />
                </FormGroup>
                <FormGroup className='form__group'>
                  <input 
                  value={password} onChange={e=>setPassword(e.currentTarget.value)}
                  type="password" placeholder='Enter Your Password' />
                </FormGroup>

                <button type='submit' className="buy__btn auth__btn">
                  Login
                </button>
                <p>Don't have an account?{" "} <Link to='/signup'>Create an account</Link> </p>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  )
}

export default Login