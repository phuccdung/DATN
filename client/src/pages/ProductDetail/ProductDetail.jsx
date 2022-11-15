import React,{useState,useRef,useEffect} from 'react';
import "./ProductDetail.css"
import { NotificationManager} from 'react-notifications';
import { Container,Row,Col } from 'reactstrap';
import { useParams } from 'react-router-dom';
import Helmet from "../../components/Helmet/Helmet";
import CommonSection from "../../components/UI/CommonSection/CommonSection";
import { motion } from 'framer-motion';
import ProductList from "../../components/UI/ProductList/ProductList";
import { useDispatch ,useSelector} from 'react-redux';
import{cartActions} from "../../redux/slices/cartSlice";
import { updateCart,addBehavior,getProductById } from '../../redux/apiCall';
import { selectCurrentUser } from '../../redux/slices/userSlice';
import {behaviorActions} from "../../redux/slices/behaviorSlice";

import products from "../../assets/data/products";

const ProductDetail = () => {

  const [tab,setTab]=useState('desc');
  const reviewUser=useRef('');
  const reviewMsg=useRef('');
  const dispatch=useDispatch();
  const currentUser=useSelector(selectCurrentUser);
  const cart=useSelector(state=>state.cart.cartItems);
  const [rating,setRating]=useState(null);
  const {id}=useParams();
  const [counter, setCounter] = React.useState(0);
  const [behavior,setBehavior]=useState(false);
  const [dataProduct,setDataProduct] = useState({});
  const [dataOther,setDataOther] = useState([]);
  const product=products.find(item=> item.id==="08");
  const {
    avgRating,
    reviews,
    description,
  }=product;


  const submitHandler=(e)=>{
    e.preventDefault();
    const reviewUserName=reviewUser.current.value;
    const reviewUserMsg=reviewMsg.current.value;

    const reviewObj={
      userName:reviewUserName,
      text:reviewUserMsg,
      rating
    };

    NotificationManager.success("",'Review successfully', 2000);
    console.log(reviewObj);
  }

  const addToCart=()=>{
    dispatch(cartActions.addItem({
      item:{
      id,
      "productName":dataProduct.title,
      "price":dataProduct.price,
      "imgUrl":dataProduct.img,
      "vendorId":dataProduct.userId,
      },
      qty:1
    }));
    NotificationManager.success("",'Product added successfully', 2000);
    if(currentUser){
      updateCart(cart,currentUser,{
        "productId":id,
        "quantity":1,
        "price":dataProduct.price,
        "imgUrl":dataProduct.img,
        "productName":dataProduct.title,
        "vendorId":dataProduct.userId,
      });
      addBehavior({
        "find":id,
        "date":new Date().getTime(),
        "status":"want"
      },currentUser)
    }else{
      dispatch(behaviorActions.addAction({
        "find":id,
        "date":new Date().getTime(),
        "status":"want"
      }));
    }
  };

  useEffect(()=>{
    window.scrollTo(0,0);
    const getData=async ()=>{
      const res= await getProductById(id,4);
      if(res?.message){
        setDataProduct(res.data);
        setDataOther(res.otherProducts);
      }
    }
    getData();
    setCounter(0);
    setBehavior(false);
  },[id])  

  useEffect(() => {
    counter < 6 ? setTimeout(() => setCounter(counter +1), 1000)
                : setBehavior(true);
    
  }, [counter]);

  useEffect(() => {
    if(counter>0){
      if(currentUser){
        addBehavior({
          "find":id,
          "date":new Date().getTime(),
          "status":"view"
        },currentUser)
      }else{
        dispatch(behaviorActions.addAction({
          "find":id,
          "date":new Date().getTime(),
          "status":"view"
        }));
      }  
    }
  }, [behavior]);

  const changTab=(tab)=>{
    setTab(tab);
    if(currentUser){
      addBehavior({
        "find":id,
        "date":new Date().getTime(),
        "status":"care"
      },currentUser)
    }else{
      dispatch(behaviorActions.addAction({
        "find":id,
        "date":new Date().getTime(),
        "status":"care"
      }));
    } 
  }

  return (
    <Helmet title={dataProduct.title}>
      <CommonSection title={dataProduct.title} />

      <section className='pt-0'>
        <Container>
          <Row>
            <Col lg='6' >
              <img src={dataProduct.img} alt="" />
            </Col>
            <Col lg='6'>
              <div className="product__details">
                <h2>{dataProduct.title}</h2>
                <div className="product__rating d-flex align-items-center gap-5 mb-3">
                  <div className="">
                    <span><i class="ri-star-fill"></i></span>
                    <span><i class="ri-star-fill"></i></span>
                    <span><i class="ri-star-fill"></i></span>
                    <span><i class="ri-star-fill"></i></span>
                    <span><i class="ri-star-half-line"></i></span>
                  </div>

                  <p>
                    ( <span>{avgRating}</span> ratings)
                  </p>
                </div>
                <div className="d-flex align-items-center gap-5">
                 <span className='product__price'>${dataProduct.price}</span>
                 <span>Category: {dataProduct.category}</span>
                </div>
                <p className='mt-3' >{dataProduct.desc}</p>

                <motion.button  whileTap={{scale:1.2}} className="buy__btn" onClick={addToCart}>Add to Cart</motion.button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>


      <section>
        <Container>
          <Row>
            <Col lg='12'>
              <div className="tab__wrapper d-flex align-items-center gap-5">
                <h6 className={`${tab==='desc'?'active__tab':''}` } onClick={()=>changTab("desc")}>Description</h6>
                <h6 className={`${tab==='rev'?'active__tab':''}`} onClick={()=>changTab("rev")}>Reviews ({reviews.length})</h6>
              </div>
              {
                tab==="desc"?
                (
                  <div className="tab__content mt-5">
                    <p>{description}</p>
                  </div>
                )
                :
                (
                  <div className="product__review mt-5"> 
                    <div className="review__wrapper">
                      <ul>
                        {
                          reviews?.map((item,index)=>(
                            <li key={index} className='mb-4'>
                              <h6>Phucc</h6>
                              <span>{item.rating} (rating)</span>
                              <p>{item.text}</p>
                            </li>
                          ))
                        }
                      </ul>

                      <div className="review__form">
                        <h4>Leave your experience</h4>
                        <form action="" onSubmit={submitHandler}>
                          <div className="form__group">
                            <input required type="text" placeholder='Enter name' ref={reviewUser}/>
                          </div>

                          <div className="form__group d-flex align-items-center gap-5 rating__group">
                          <motion.span whileTap={{scale:1.2}} onClick={()=>setRating(1)}>1<i class="ri-star-fill"></i></motion.span>
                          <motion.span whileTap={{scale:1.2}} onClick={()=>setRating(2)}>2<i class="ri-star-fill"></i></motion.span>
                          <motion.span whileTap={{scale:1.2}} onClick={()=>setRating(3)}>3<i class="ri-star-fill"></i></motion.span>
                          <motion.span whileTap={{scale:1.2}} onClick={()=>setRating(4)}>4<i class="ri-star-fill"></i></motion.span>
                          <motion.span whileTap={{scale:1.2}} onClick={()=>setRating(5)}>5<i class="ri-star-fill"></i></motion.span>
                          </div>

                          <div className="form__group">
                            <textarea required rows={4} type="text" placeholder='Review Message....' ref={reviewMsg} />
                          </div>

                          <motion.button whileHover={{scale:1.2}} type='submit' className="buy__btn">Submit</motion.button>
                        </form>
                      </div>
                    </div>
                  </div>
                )
              }
            </Col>

            <Col lg='12' className='mt-5'>
              <h2 className='related__title'>You might also like</h2>
            </Col>

            <ProductList data={dataOther}/>
          </Row>
        </Container>
      </section>
    </Helmet>
  )
}

export default ProductDetail