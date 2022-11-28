import React,{useEffect,useState} from 'react';
import './Cart.css';
import Helmet from "../../components/Helmet/Helmet";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection"
import { Container,Row,Col } from 'reactstrap';
import { motion } from 'framer-motion';
import {cartActions} from "../../redux/slices/cartSlice";
import { useSelector,useDispatch } from 'react-redux';
import { Link,useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../../redux/slices/userSlice';
import { updateCart } from '../../redux/apiCall';

const Cart = () => {

  const cartItems=useSelector(state=>state.cart.cartItems);
  const [cart,setCart]=useState([])
  const totalAmount=useSelector(state=>state.cart.totalAmount);
  const currentUser=useSelector(selectCurrentUser);
  const [orderDetail,setOrderDetail]=useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const handleDelete = async(id,index) => {
      await dispatch(cartActions.deleteItem(id));
      let arr=cart.filter(item => item.id!==id);
      setCart(arr);
      if(currentUser){
        updateCart(cartItems,currentUser,cartItems[index],"remove");
      }
    };

  useEffect(()=>{
    let arr=cartItems.map(item=>{
      return {...item,checked:false}
    });
    setCart(arr);
  },[])
  const handleCheck=(e,index) => {
    let arr=[...cart]
    let order=[...orderDetail]
    if(e.currentTarget.checked){
      arr[index].checked=true;
      var orderItem={
        productId:arr[index].id,
        productName: arr[index].productName,
        vendorId:arr[index].vendorId,
        quantity:arr[index].quantity,
        price:arr[index].price,
        imgUrl:arr[index].imgUrl,
        link:arr[index].link
      }
      order.push(orderItem);
    }else{
      arr[index].checked=false;
      order=order.filter(item=>item.productId!==arr[index].id)
    }
    setCart(arr);
    setOrderDetail(order)

  }  

  const toCheckout=()=>{
    navigate('/checkout',{state:orderDetail});
  }
  return (
    <Helmet title="Cart">
      <CommonSectionfrom title='Shopping Cart'/>
      <section>
        <Container>
          <Row>
            <Col lg='9'>
              {
                cart.length===0?
                ( <h2 className='fs-4 text-center'>No item added to the cart</h2>)
                :
                (
                  <table className="table bordered">
                    <thead>
                      <tr>
                        <th>Check</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        cart.map((item,index)=>(
                          <tr key={index}>
                            <td>
                              <input type="checkbox" checked={item.checked} onChange={(e)=>handleCheck(e,index)}/>
                            </td>
                            <td>
                              <img src={item.imgUrl} alt="" />
                            </td>
                            <td>{item.productName}</td>
                            <td>${item.price}</td>
                            <td>{item.quantity}px</td>
                            <td>
                              <motion.i onClick={()=>handleDelete(item.id,index)} whileHover={{scale:1.5}} class="ri-delete-bin-6-line"></motion.i>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                )
              }
            </Col>
            <Col lg='3'>
              <div >
                <h6 className='d-flex align-items-center justify-content-between'>
                  Subtotal
                  <span className='fs-4 fw-bold'>${(orderDetail.reduce((sum,curr)=>sum+curr.quantity*curr.price,0)).toFixed(3)}</span>
                </h6>
              </div>
              <p className='fs-6 mt-2'>taxes and shipping will calculate in checkout</p>
              <div>
                <button className='buy__btn w-100 ' onClick={toCheckout}>
                  
                  Checkout
                </button>
                <button className='buy__btn w-100 mt-3'>
                  <Link to='/shop'> Continuue Shopping</Link>
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  )
}

export default Cart