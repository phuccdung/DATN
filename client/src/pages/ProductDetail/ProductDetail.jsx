import React,{useState,useEffect} from 'react';
import "./ProductDetail.css"
import { NotificationManager} from 'react-notifications';
import { Container,Row,Col } from 'reactstrap';
import { useParams,useLocation } from 'react-router-dom';
import Helmet from "../../components/Helmet/Helmet";
import CommonSection from "../../components/UI/CommonSection/CommonSection.jsx";
import { motion } from 'framer-motion';
import ProductList from "../../components/UI/ProductList/ProductList.jsx";
import { useDispatch ,useSelector} from 'react-redux';
import{cartActions} from "../../redux/slices/cartSlice";
import { updateCart,addBehavior,getProductById,addComment,getComment,checkBehaviorLink,createLinks,addChipView } from '../../redux/apiCall';
import { selectCurrentUser } from '../../redux/slices/userSlice';
import {behaviorActions} from "../../redux/slices/behaviorSlice";
import {
  FacebookShareButton,
  FacebookIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";


const ProductDetail = () => {

  const [quantityProduct,setQuantityProduct]=useState(1);
  const location=useLocation();
  const [tab,setTab]=useState('desc');
  const [reviewMsg,setReviewMsg]=useState('');
  const dispatch=useDispatch();
  const currentUser=useSelector(selectCurrentUser);
  const cart=useSelector(state=>state.cart.cartItems);
  const [rating,setRating]=useState(5);
  const [star,setStar]=useState({});
  const {id}=useParams();
  const [counter, setCounter] = React.useState(0);
  const [behavior,setBehavior]=useState(false);
  const [dataProduct,setDataProduct] = useState({});
  const [dataOther,setDataOther] = useState([]);
  const [comments,setComments]=useState([]);
  const linkReC=location.search.split("?")[1]||"";
  const actionItems=useSelector(state=>state.behavior.actions);
  const submitHandler= async(e)=>{
    e.preventDefault();
    const reviewObj={
      userId:currentUser?.username,
      productId:id,
      text:reviewMsg,
      star:rating
    };
    if(currentUser){
      const res=await addComment(reviewObj,currentUser);
      if(res?.message){
        NotificationManager.success("",'Review successfully', 2000);
        setRating(5);
        setReviewMsg("");
        setStar(res.data);
        const resCmt= await getComment(id);
        if(resCmt?.message){
          setComments(resCmt.data)
          console.log()
        }
      }else{
        NotificationManager.error("",'Error', 2000);
      }
    }else{
      NotificationManager.error("You must Login ",'Error', 2000);
    }
  }
  const addToCart= async()=>{
    let link=linkReC||"";
     if(link===""){
      const exisItem=actionItems.find(item=>item.find===id);
      if(exisItem){
        link=exisItem.link;
      }
    }
    NotificationManager.success("",'Product added successfully', 2000);
    if(currentUser){
      if(link===""){
        const res=await checkBehaviorLink(currentUser.id,id,currentUser)
        if(res?.message){
          const linkBehavior=res.data.find(item=>item.link!=="");
          link=linkBehavior?.link;
        }
      }
      updateCart(cart,currentUser,{
        "productId":id,
        "quantity":quantityProduct,
        "price":dataProduct.price,
        "imgUrl":dataProduct.img,
        "productName":dataProduct.title,
        "vendorId":dataProduct.userId,
        "link":link||"",
      });
      addBehavior({
        "find":id,
        "date":new Date().getTime(),
        "status":"want",
        "name":dataProduct.title,
        "link":link||"",
      },currentUser);
      dispatch(cartActions.addItem({
        item:{
        id,
        "productName":dataProduct.title,
        "price":dataProduct.price,
        "imgUrl":dataProduct.img,
        "vendorId":dataProduct.userId,
        "link":link||"",
        },
        qty:quantityProduct
      }));
    }else{
      dispatch(behaviorActions.addAction({
        "find":id,
        "date":new Date().getTime(),
        "status":"want",
        "name":dataProduct.title,
        "link":link||"",
      }));
      dispatch(cartActions.addItem({
        item:{
        id,
        "productName":dataProduct.title,
        "price":dataProduct.price,
        "imgUrl":dataProduct.img,
        "vendorId":dataProduct.userId,
        "link":link||"",
        },
        qty:quantityProduct
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
        setStar(res.data.ratings);
      }
      const resCmt= await getComment(id);
      if(resCmt?.message){
        setComments(resCmt.data)
      }
    }
    getData();
    setCounter(0);
    setBehavior(false);
  },[id])  
  useEffect(() => {
    counter < 5 ? setTimeout(() => setCounter(counter +1), 1000)
                : setBehavior(true); 
  }, [counter]);
  useEffect(() => {
    if(counter>0){
      if(linkReC){
        addChipView(linkReC);
      }
      if(currentUser){
        addBehavior({
          "find":id,
          "date":new Date().getTime(),
          "status":"view",
          "name":dataProduct.title,
          "link":linkReC,
        },currentUser)
      }else{
        dispatch(behaviorActions.addAction({
          "find":id,
          "date":new Date().getTime(),
          "status":"view",
          "name":dataProduct.title,
          "link":linkReC,
        }))
      }  
    }
  }, [behavior]);
  const changTab=(tab)=>{
    setTab(tab);
      if(currentUser){
        addBehavior({
          "find":id,
          "date":new Date().getTime(),
          "status":"care",
          "name":dataProduct.title,
          "link":linkReC,
        },currentUser)
      } 
  }
  const showStar=()=>{
    var indents =[  ]
    for(let i=0;i<Math.floor(star?.total/star?.count);i++){
      indents.push(<span key={i}> <i class="ri-star-fill"> </i> </span>);
    }
    if((star?.total/star?.count)-Math.floor(star?.total/star?.count)>0){
      indents.push(<span > <i class="ri-star-half-line"> </i> </span>);
    }
    return (
      <div >
        {indents}
      </div>
    );
  }
  const CreateLink=async()=>{
    let body={
      userId:currentUser?.id,
      productId:id
    }
    if(currentUser){
      const res=await createLinks(body,currentUser)
      if(res?.message){
        navigator.clipboard.writeText(`http://localhost:3000${location.pathname}?${res.data}`)
        NotificationManager.success('Copied!',"Success", 2000);
      }else{
        NotificationManager.error('Error!', 2000);
      }
    }else{
      NotificationManager.error("You must Login ",'Error', 2000);
    }
  }
  const changeQty=(e)=>{
    let quantityE=e.currentTarget.value;
    if(quantityE>0){
      setQuantityProduct(quantityE);
    }
  }
  return (
    <Helmet title={dataProduct.title}>
      <CommonSection title={dataProduct.title} />
      <section className='pt-0'>
        <Container>
          <Row>
            <Col lg='6' >
              <img src={dataProduct?.img} alt="" />
            </Col>
            <Col lg='6'>
              <div className="product__details">
                <h2>{dataProduct.title}</h2>
                <div className="product__rating d-flex align-items-center gap-5 mb-3">
                  {showStar()}
                  <p>
                    ( <span>{(star?.total/star?.count).toFixed(1)}</span> ratings)
                  </p>
                </div>
                <div className="d-flex align-items-center gap-5">
                 <span className='product__price'>${dataProduct.price}</span>
                 <span>Category: {dataProduct.category}</span>
                 <span>Sales: {dataProduct.sold}</span>
                </div>
                <p className='mt-3' >{dataProduct.desc}</p>
                <div className="">
                  <input type="number" className='input__qty' value={quantityProduct} onChange={e=>changeQty(e)}/>
                  <motion.button  whileTap={{scale:1.2}} className="buy__btn" onClick={addToCart}>Add to Cart</motion.button>
                </div>
                <div className="share__link">
                  <span>Share:</span>
                  <FacebookShareButton 
                    url={`http://multi-mart.shop${location.pathname}`}
                    quote={dataProduct.title}
                    hashtag={"#MultiMart"}
                    className='icon_share'
                  >
                    <FacebookIcon size={30} round={true}/>
                  </FacebookShareButton>
                  <FacebookMessengerShareButton 
                    url={`http://multi-mart.shop${location.pathname}`}
                    quote={dataProduct.title}
                    hashtag={"#MultiMart"}
                    className='icon_share'

                  >
                    <FacebookMessengerIcon size={30} round={true}/>
                  </FacebookMessengerShareButton>
                  <TwitterShareButton 
                    url={`http://multi-mart.shop/${location.pathname}`}
                    quote={dataProduct.title}
                    hashtag={"#MultiMart"}
                    className='icon_share'

                  >
                    <TwitterIcon size={30} round={true}/>
                  </TwitterShareButton>
                  <motion.button  whileTap={{scale:1.2}} className="link__btn" onClick={CreateLink}>Link</motion.button>
                </div>
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
                <h6 className={`${tab==='rev'?'active__tab':''}`} onClick={()=>changTab("rev")}>Reviews ({comments.length})</h6>
              </div>
              {
                tab==="desc"?
                (
                  <div className="tab__content mt-5">
                    <p>{dataProduct.desc}</p>
                  </div>
                )
                :
                (
                  <div className="product__review mt-5"> 
                    <div className="review__wrapper">
                      <ul>
                        {
                          comments?.map((item,index)=>(
                            <li key={index} className='mb-4'>
                              <h6>{item.username}</h6>
                              <span>{item.rating} <i class="ri-star-fill"></i></span>
                              <p>{item.text}</p>
                            </li>
                          ))
                        }
                      </ul>

                      <div className="review__form">
                        <h4>Leave your experience</h4>
                        <form action="" onSubmit={submitHandler}>
                          <div className="form__group d-flex align-items-center gap-5 rating__group">
                          <motion.span whileTap={{scale:1.2}} onClick={()=>setRating(1)}>1<i class={rating<1?"ri-star-fill" :"ri-star-fill start__coral"} ></i></motion.span>
                          <motion.span whileTap={{scale:1.2}} onClick={()=>setRating(2)}>2<i class={rating<2?"ri-star-fill" :"ri-star-fill start__coral"}></i></motion.span>
                          <motion.span whileTap={{scale:1.2}} onClick={()=>setRating(3)}>3<i class={rating<3?"ri-star-fill" :"ri-star-fill start__coral"}></i></motion.span>
                          <motion.span whileTap={{scale:1.2}} onClick={()=>setRating(4)}>4<i class={rating<4?"ri-star-fill" :"ri-star-fill start__coral"}></i></motion.span>
                          <motion.span whileTap={{scale:1.2}} onClick={()=>setRating(5)}>5<i class={rating<5?"ri-star-fill" :"ri-star-fill start__coral"}></i></motion.span>
                          </div>

                          <div className="form__group">
                            <textarea required rows={4} type="text" value={reviewMsg} placeholder='Review Message....' onChange={(e)=>setReviewMsg(e.currentTarget.value)} />
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