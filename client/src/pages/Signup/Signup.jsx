import React,{useState} from 'react';
import "../Login/Login.css";
import Helmet from "../../components/Helmet/Helmet";
import { Container,Row,Col,Form,FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import { NotificationManager} from 'react-notifications';
import {  storage } from "../../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {Register,createCart} from "../../redux/apiCall";


const Signup = () => {

  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [file,setFile]=useState(null);
  const [loading,setLoading]=useState(false);

  const regiterAccount= async(body)=>{
    let res=await Register(body);
    if(res){
      await createCart({"username":email})
      NotificationManager.success("","New Account has created", 2000);
      
    }else{
      NotificationManager.error("",'Email has been used register', 2000);
    }
    setLoading(false);
    setFile(null);
  }

  const handleClick = (e) => {
    e.preventDefault();
    setLoading(true);
    if(file){
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          setLoading(false);
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const body = { name:username,user:email,pwd:password, img: downloadURL };
            regiterAccount(body);
          });
        }
      );
    }else{
      const body = { name:username,user:email,pwd:password, img: null };
            regiterAccount(body);
    }
    
  };

  return (
    <Helmet title='Signup'>
      <section>
        <Container>
          <Row>
            
            {
              loading?
              <Col lg='12' className='text-center'>
                <h5 className='fw-bold'> Loading.....</h5>
              </Col>
              :
              <Col lg='6' className='m-auto text-center'>
              <h3 className='fw-bold mb-4'>Signup</h3>

              <Form className='auth__form' onSubmit={handleClick}>
                  <FormGroup className='form__group'>
                    <input
                    value={username} onChange={e=>setUsername(e.currentTarget.value)}
                    type="text" placeholder='Name' required/>
                  </FormGroup>
                  <FormGroup className='form__group'>
                    <input
                    value={email} onChange={e=>setEmail(e.currentTarget.value)}
                    type="email" placeholder='Enter Your Email' required />
                  </FormGroup>
                  <FormGroup className='form__group'>
                    <input 
                    value={password} onChange={e=>setPassword(e.currentTarget.value)}
                    type="password" placeholder='Enter Your Password' required />
                  </FormGroup>
                  <FormGroup className='form__group'>
                    <input 
                    onChange={e=>setFile(e.target.files[0])}
                    type="file"  />
                  </FormGroup>

                  <button type='submit' className="buy__btn auth__btn">
                    Create an Account
                  </button>
                  <p>Already have an account?{" "} <Link to='/login'>Login</Link> </p>
                </Form>
              </Col>
            }
          </Row>
        </Container>
      </section>
    </Helmet>
  )
}

export default Signup