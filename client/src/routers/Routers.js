import React from 'react';
import { Routes,Route,Navigate} from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/userSlice';

import Home from '../pages/Home/Home';
import Shop from '../pages/Shop/Shop';
import Cart from '../pages/Cart/Cart';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Checkout from '../pages/Checkout/Checkout';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import Profile from '../pages/Profile/Profile';
import MyOrder from "../pages/MyOrder/MyOrder";
import ShopProduct from "../pages/ShopProduct/ShopProduct";
import ShopOrder from "../pages/ShopOrder/ShopOrder";
import ShopProductDetail from "../pages/ShopPoroductDetail/ShopProductDetail";
import ShopNewProduct from "../pages/ShopNewProduct/ShopNewProduct";
import ImportProduct from "../pages/ImportPage/ImportPage";
import Link from "../pages/Link/Link";


const Routers = () => {

  const currentUser=useSelector(selectCurrentUser);
  return <Routes>
    <Route path="/" element={<Navigate to="home"/>}></Route>
    <Route path="/home" element={<Home/>}> </Route>
    <Route path="/shop" element={<Shop/>}> </Route>
    <Route path="/shop/:id" element={<ProductDetail/>}> </Route>
    <Route path="/cart" element={<Cart/>}> </Route>
    <Route path="/checkout" element={<Checkout/>}> </Route>
    <Route path="/login" element={currentUser?<Navigate to="/home"/>: <Login/>}> </Route>
    <Route path="/signup" element={<Signup/>}> </Route>
    <Route path="/profile" element={<Profile/>}> </Route>
    <Route path="/link" element={<Link/>}> </Route>
    <Route path="/myorder" element={<MyOrder/>}> </Route>
    {
      currentUser?.role?.Editor?
      <>
        <Route path="/shopproduct" element={<ShopProduct/>}> </Route>
        <Route path="/shoporder" element={<ShopOrder/>}> </Route>
        <Route path="/product/:id" element={<ShopProductDetail/>}> </Route>
        <Route path="/newproduct" element={<ShopNewProduct/>}> </Route>
        <Route path="/import" element={<ImportProduct/>}> </Route>
      </>
      :null
    }
    

  </Routes>
}

export default Routers