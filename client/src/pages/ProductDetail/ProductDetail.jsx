import React,{useState,useEffect} from 'react';
import "./ProductDetail.css"
import { NotificationManager} from 'react-notifications';
import { Container,Row,Col } from 'reactstrap';
import { useParams,useLocation } from 'react-router-dom';
import Helmet from "../../components/Helmet/Helmet";
import CommonSection from "../../components/UI/CommonSection/CommonSection";
import { motion } from 'framer-motion';
import ProductList from "../../components/UI/ProductList/ProductList";
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
  const {id}=useParams();
  const [dataProduct,setDataProduct] = useState({});

  useEffect(()=>{
    window.scrollTo(0,0);
    const getData=async ()=>{
      const res= await getProductById(id,4);
      if(res?.message){
        setDataProduct(res.data);
      }
      
    }
    getData();
  },[id])  
 
  return (
    <Helmet title={dataProduct.title}>
      <CommonSection title={dataProduct.title} />
    </Helmet>
  )
}

export default ProductDetail