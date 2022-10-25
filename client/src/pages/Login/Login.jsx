import React,{useState} from 'react';
import "./Login.css";
import Helmet from "../../components/Helmet/Helmet";
import { NotificationManager} from 'react-notifications';
import { Container,Row,Col,Form,FormGroup } from 'reactstrap';
import { Link,useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from "react-redux";
import {login} from "../../redux/apiCall";


const Login = () => {

  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [user,setUsername]=useState("");
  const [pwd,setPassword]=useState("");
  const cart=useSelector(state=>state.cart.cartItems);
  const behavior=useSelector(state=>state.behavior)


  const handleClick=async (e)=>{
    e.preventDefault();
     let isLogin=await login(dispatch,{user,pwd},cart,behavior);
     if(isLogin){
      navigate("/home")
     }else{
      NotificationManager.error("",'Email or password is not correct', 2000);
     }
  };


  return (
    <Helmet title='Login'>
      <section>
        <Container>
          <Row>
            <Col lg='6' className='m-auto text-center'>
              <h3 className='fw-bold mb-4'>Login</h3>

              <Form className='auth__form' onSubmit={handleClick}>
                <FormGroup className='form__group'>
                  <input
                   value={user} required onChange={e=>setUsername(e.currentTarget.value)}
                   type="email" placeholder='Enter Your Email' />
                </FormGroup>
                <FormGroup className='form__group'>
                  <input 
                  value={pwd} required onChange={e=>setPassword(e.currentTarget.value)}
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