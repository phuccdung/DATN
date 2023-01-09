import React from 'react';
import { Routes,Route,Navigate} from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/userSlice';

import Home from '../pages/Home/Home.jsx';
import Shop from '../pages/Shop/Shop.jsx';
import Cart from '../pages/Cart/Cart.jsx';
import ProductDetail from '../pages/ProductDetail/ProductDetail.jsx';
import Checkout from '../pages/Checkout/Checkout.jsx';
import Login from '../pages/Login/Login.jsx';
import Signup from '../pages/Signup/Signup.jsx';
import Profile from '../pages/Profile/Profile.jsx';
import MyOrder from "../pages/MyOrder/MyOrder.jsx";
import ShopProduct from "../pages/ShopProduct/ShopProduct.jsx";
import ShopOrder from "../pages/ShopOrder/ShopOrder.jsx";
import ShopProductDetail from "../pages/ShopPoroductDetail/ShopProductDetail.jsx";
import ShopNewProduct from "../pages/ShopNewProduct/ShopNewProduct.jsx";
import ImportProduct from "../pages/ImportPage/ImportPage.jsx";
import Link from "../pages/Link/Link.jsx";
import Analytics from '../pages/Analytic/Analytic.jsx';


const Routers = () => {

  const currentUser=useSelector(selectCurrentUser);
  return <Routes>
    <Route exact path="/" element={<Home/>}></Route>
    <Route path="/home" element={<Home/>}> </Route>
    <Route path="/client" element={<Home/>}> </Route>
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
        <Route path="/analytic" element={<Analytics/>}> </Route>
      </>
      :null
    }
    

  </Routes>
}

export default Routers