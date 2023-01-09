import React from 'react';

import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import Routers from "../../routers/Routers"

const Layout = () => {
  return (
    <>
      <Header/>
      <div>
        <Routers/>
      </div>
      <Footer/>
    </>
    
  )
}

export default Layout