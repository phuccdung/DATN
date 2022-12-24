import React,{useState,useEffect} from 'react';
import {Container,Row,Col,Form,FormGroup} from "reactstrap";
import Helmet from "../../components/Helmet/Helmet";
import CommonSection from "../../components/UI/CommonSection/CommonSection";
import "./Checkout.css";
import { useSelector,useDispatch } from 'react-redux';
import {useLocation,useNavigate} from 'react-router-dom';
import { NotificationManager} from 'react-notifications';
import { selectCurrentUser } from '../../redux/slices/userSlice';
import {cartActions} from "../../redux/slices/cartSlice";
import { createOrder ,updateCart,addBehavior,getUserById,updateUserById} from '../../redux/apiCall';


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
  const [discount,setDiscount]=useState(0);
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState({});

  useEffect(()=>{
    const getInfo=async()=>{
        const res= await getUserById(currentUser);
        setData(res);
        setName(res.name);
        setPhone(res.phone);
        setAddress(res.address);
        setDiscount(Number(res.chip).toFixed(0));
    }
    getInfo();
},[])

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
            "total":(arr.reduce((sum,curr)=>sum+curr.price*curr.quantity,0)-discount/uniqueVals.length).toFixed(3),
            "discount":discount/uniqueVals.length
          }
          handleOrder(body)
        })
        await order.forEach(item=>{
          handleDelete(item);
        });
        if(currentUser){
          let body={
              chip:Number(data.chip)-discount,
              "userId":currentUser.id,
          }
          updateCart(cartItems,currentUser,order,"remove");
          await updateUserById(body,currentUser);
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
        if(currentUser){
          addBehavior({
            "find":item.productId,
            "date":new Date().getTime(),
            "status":"buy",
            "name":item.productName,
            "link":item.link,
          },currentUser);
        }
    };
    const changDiscount=(e)=>{
      let d=Number(e.currentTarget.value);
      if(currentUser){
        if(d>data.chip||d<0){
          NotificationManager.error("",'you do not have enough Chip!', 2000);
        }else{
          setDiscount(d);
        }
      }else{
        NotificationManager.error("",'You must Login!', 2000);
      }
    }
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
                    <input type="text" required placeholder='Enter your name' value={name} onChange={e=>setName(e.currentTarget.value)}/>
                  </FormGroup>

                  <FormGroup className='form__group'>
                    <input type="number" required placeholder='Enter your phone' value={phone} onChange={e=>setPhone(e.currentTarget.value)}/>
                  </FormGroup>

                  <FormGroup className='form__group'>
                    <input type="text" required placeholder='Enter your address' value={address}onChange={e=>setAddress(e.currentTarget.value)} />
                  </FormGroup>

                </Form>
              </Col>

              <Col lg='4'>
                <div className="checkout__cart">
                  <h6>Total Qty:<span>{order.reduce((sum,curr)=>sum+curr.quantity,0)} items</span> </h6>
                  <h6>Subtotal:<span>{(order.reduce((sum,curr)=>sum+curr.quantity*curr.price,0)).toFixed(3)}$</span> </h6>
                  <h6>Use Chip: 
                    <div className='div_discount'>
                      <input type="number" className='input_discount' value={discount}  onChange={e=>changDiscount(e)} />
                    </div>
                  </h6>
                  <h6>Free shipping</h6>
                  <h4>Total Cost: <span>{order.reduce((sum,curr)=>sum+curr.quantity*curr.price,0).toFixed(3)-discount}$</span> </h4>

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