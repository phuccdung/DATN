import React from 'react'
import ProductCard  from "../ProductCard/ProductCard.jsx";

const ProductList = ({data}) => {
  return (
    <>
      {data?.map((item,index) =>(
        <ProductCard item={item} key={index}/>
      ))}
    </>
  )
}

export default ProductList  