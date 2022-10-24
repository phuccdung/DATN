import React from 'react';
import { NotificationManager} from 'react-notifications';
import {motion} from "framer-motion"
import { Col } from 'reactstrap';
import {Link} from "react-router-dom";
import "./ProductCard.css";

import {useDispatch,useSelector} from "react-redux";
import { selectCurrentUser } from '../../../redux/slices/userSlice';
import {cartActions} from "../../../redux/slices/cartSlice";
import { updateCart } from '../../../redux/apiCall';

const ProductCard = ({item}) => {

  const dispatch=useDispatch();
  const currentUser=useSelector(selectCurrentUser);
  const cart=useSelector(state=>state.cart.cartItems);
  const addToCart=()=>{
    dispatch(cartActions.addItem({
      "item":{
      id:item.id,
      productName:item.productName,
      price:item.price,
      imgUrl:item.imgUrl,
      },
      qty:1
     }));
    NotificationManager.success("",'Product added successfully', 2000);
    if(currentUser){
      updateCart(cart,currentUser,{
        "productId":item.id,
        "quantity":1,
        "price":item.price,
        "imgUrl":item.imgUrl,
        "productName":item.productName,
      });
    }
  }

  return (


    <Col lg="3" md="4" className="mb-2">
      <div className="product__item">
        <div className="product__img">
          <motion.img whileHover={{scale:0.9}} img src={item.imgUrl} alt="" />
        </div>
        <div className="p-2 product__info">
          <h3 className="product__name">
            <Link to={`/shop/${item.id}`}>
              {item.productName}
            </Link> 
          </h3>
          <span >{item.category}</span>
        </div>
        <div className="product__card-bottom d-flex align-item-center justify-content-between p-2">
          <span className="price">${item.price}</span>
          <motion.span  whileTap={{scale:1.2}} onClick={addToCart} ><i class="ri-add-line" ></i></motion.span>
        </div>
      </div>
    </Col>
  )
}

export default ProductCard