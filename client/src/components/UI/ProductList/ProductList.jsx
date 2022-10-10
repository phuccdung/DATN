import React from 'react'
import ProductCard  from "../ProductCard/ProductCard";

const ProductList = ({data}) => {
  return (
    <>
      {data?.map(item =>(
        <ProductCard item={item}/>
      ))}
    </>
  )
}

export default ProductList  