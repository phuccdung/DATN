import React,{useState,useEffect} from 'react';
import "./ProductDetail.css"
import { Container,Row,Col } from 'reactstrap';
import { useParams,useLocation } from 'react-router-dom';
import Helmet from "../../components/Helmet/Helmet";
import CommonSection from "../../components/UI/CommonSection/CommonSection";
import { motion } from 'framer-motion';
import ProductList from "../../components/UI/ProductList/ProductList";
import { useDispatch ,useSelector} from 'react-redux';
import {getProductById,getComment } from '../../redux/apiCall';
import { selectCurrentUser } from '../../redux/slices/userSlice';
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
  const [rating,setRating]=useState(5);
  const [star,setStar]=useState({});
  const {id}=useParams();
  const [dataProduct,setDataProduct] = useState({});
  const [dataOther,setDataOther] = useState([]);
  const [comments,setComments]=useState([]);

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
  },[id])  

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
                  <input type="number" className='input__qty' value={quantityProduct} />
                  <motion.button  whileTap={{scale:1.2}} className="buy__btn" >Add to Cart</motion.button>
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
                  <motion.button  whileTap={{scale:1.2}} className="link__btn" >Link</motion.button>

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
                <h6 className={`${tab==='desc'?'active__tab':''}` } >Description</h6>
                <h6 className={`${tab==='rev'?'active__tab':''}`} >Reviews ({comments.length})</h6>
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
                        <form action="" >
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