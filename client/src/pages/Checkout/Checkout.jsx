import React,{useState} from 'react';
import {Container,Row,Col,Form,FormGroup} from "reactstrap";
import Helmet from "../../components/Helmet/Helmet";
import CommonSection from "../../components/UI/CommonSection/CommonSection";
import "./Checkout.css";
import { useSelector,useDispatch } from 'react-redux';
import {useLocation,useNavigate} from 'react-router-dom';
import { NotificationManager} from 'react-notifications';
import { selectCurrentUser } from '../../redux/slices/userSlice';
import {cartActions} from "../../redux/slices/cartSlice";
import { createOrder ,updateCart} from '../../redux/apiCall';


const Checkout = () => {

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order=location.state;
  const cartItems=useSelector(state=>state.cart.cartItems);
  const currentUser=useSelector(selectCurrentUser);
  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [address,setAddress] = useState("");
  const [loading,setLoading]=useState(false);


    const handleClick=async (e)=>{
      e.preventDefault();
      if(!name||!phone||!address){
        NotificationManager.error("",'Enter Your Information!', 2000);
      }else{
        setLoading(true);
        let uniqueVals = [];  
        await order.forEach((i) => {  
            var existingVals = uniqueVals.filter((j) => {  
                return (i['vendorId'] === j)  
            });  
            if (existingVals.length === 0) {  
                uniqueVals.push(i['vendorId']);  
            }  
        }); 
        await uniqueVals.forEach(item=>{
          let arr=order.filter(orderItem=>orderItem.vendorId===item);
          let body={
            "userId":currentUser?.id,
            "name":name,
            "phone":phone,
            "address":address,
            "vendorId":item,
            "products":arr,
            "total":arr.reduce((sum,curr)=>sum+curr.price*curr.quantity,0)
          }
          handleOrder(body)
        })
        await order.forEach(item=>{
          handleDelete(item);
        });
        if(currentUser){
          updateCart(cartItems,currentUser,order,"remove");
        }
        setLoading(false);
        navigate('/cart');
      }
    }
  
    const handleOrder=async(body)=>{
      const res= await createOrder(body);
      if(res){
        NotificationManager.success(res.data,"ID Your Order:" ,4000);
      }
    }

    const handleDelete = async(item) => {
        dispatch(cartActions.deleteItem(item.productId));
    };
  return (
    <Helmet title='Checkout'>
      <CommonSection title='Checkout'/>
      <section>
        <Container>
          <Row>
            {
              loading?
              <Col lg='12' className='text-center'>
                <h5 className='fw-bold'> Loading.....</h5>
              </Col>
              :
              <>
              <Col lg='8'>
                <h6 className='mb-4 fw-bold'>
                  Billing Information
                </h6>
                <Form className='billing__form' >
                  <FormGroup className='form__group'>
                    <input type="text" required placeholder='Enter your name' onChange={e=>setName(e.currentTarget.value)}/>
                  </FormGroup>

                  {/* <FormGroup className='form__group'>
                    <input type="email" placeholder='Enter your email' />
                  </FormGroup> */}

                  <FormGroup className='form__group'>
                    <input type="number" required placeholder='Enter your phone' onChange={e=>setPhone(e.currentTarget.value)}/>
                  </FormGroup>

                  <FormGroup className='form__group'>
                    <input type="text" required placeholder='Enter your address'onChange={e=>setAddress(e.currentTarget.value)} />
                  </FormGroup>

                </Form>
              </Col>

              <Col lg='4'>
                <div className="checkout__cart">
                  <h6>Total Qty:<span>{order.reduce((sum,curr)=>sum+curr.quantity,0)} items</span> </h6>
                  <h6>Subtotal:<span>${order.reduce((sum,curr)=>sum+curr.quantity*curr.price,0)}</span> </h6>
                  <h6>Shipping: <br/>
                      free shipping
                    <span>$0</span> 
                  </h6>
                  <h6>Free shipping</h6>
                  <h4>Total Cost: <span>${order.reduce((sum,curr)=>sum+curr.quantity*curr.price,0)}</span> </h4>

                  <button onClick={handleClick} className="order__btn">
                  Place an order
                  </button>
                </div>
                
              </Col>
              </>
            }
          </Row>
        </Container>
      </section>
    </Helmet>
  )
}

export default Checkout