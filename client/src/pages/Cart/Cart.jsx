import React,{useEffect,useState} from 'react';
import './Cart.css';
import Helmet from "../../components/Helmet/Helmet";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection"
import { Container,Row,Col } from 'reactstrap';
import { motion } from 'framer-motion';
import {cartActions} from "../../redux/slices/cartSlice";
import { useSelector,useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../../redux/slices/userSlice';
import { updateCart } from '../../redux/apiCall';

const Cart = () => {

  const cartItems=useSelector(state=>state.cart.cartItems);
  const totalAmount=useSelector(state=>state.cart.totalAmount);
  const currentUser=useSelector(selectCurrentUser);
  const [orderDetail,setOrderDetail]=useState([]);
  const dispatch = useDispatch();
    const handleDelete = (id,index) => {
      dispatch(cartActions.deleteItem(id));
      if(currentUser){
        updateCart(cartItems,currentUser,cartItems[index],"remove");
      }
    };

  const handleCheck=(e,index) => {
    if(e.currentTarget.checked){
      console.log(cartItems[index]);
    }else{
      console.log(cartItems[index]);
    }
  }  
  return (
    <Helmet title="Cart">
      <CommonSectionfrom title='Shopping Cart'/>
      <section>
        <Container>
          <Row>
            <Col lg='9'>
              {
                cartItems.length===0?
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
                        cartItems.map((item,index)=>(
                          <tr key={index}>
                            <td>
                              <input type="checkbox"  onChange={(e)=>handleCheck(e,index)}/>
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
                  <span className='fs-4 fw-bold'>${totalAmount}</span>
                </h6>
              </div>
              <p className='fs-6 mt-2'>taxes and shipping will calculate in checkout</p>
              <div>
                <button className='buy__btn w-100 '>
                  <Link to='/checkout'> Checkout</Link>
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