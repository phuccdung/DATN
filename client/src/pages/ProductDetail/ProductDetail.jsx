import React,{useState,useEffect} from 'react';
import "./ProductDetail.css"

import { useParams } from 'react-router-dom';
import Helmet from "../../components/Helmet/Helmet";
import CommonSection from "../../components/UI/CommonSection/CommonSection";

import { getProductById} from '../../redux/apiCall';



const ProductDetail = () => {
  const {id}=useParams();
  const [dataProduct,setDataProduct] = useState({});


  useEffect(()=>{
    window.scrollTo(0,0);
    const getData=async ()=>{
      const res= await getProductById(id,4);
      if(res?.message){
        setDataProduct(res.data);
        console.log(res.data);
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