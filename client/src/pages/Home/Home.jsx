import React ,{useEffect,useState}from 'react';
import "./home.css"

import { Link } from 'react-router-dom';
import{motion} from 'framer-motion'
import {Container,Row,Col} from "reactstrap";

import heroImg from "../../assets/images/hero-img.png";
import Helmet from "../../components/Helmet/Helmet";
import Services from "../../services/services";
import ProductList from "../../components/UI/ProductList/ProductList";
import Clock from "../../components/UI/Clock/Clock"


import products from "../../assets/data/products";
import countterimg from "../../assets/images/counter-timer-img.png"

const Home = () => {
  const years =new Date().getFullYear();

  const [trenProduct,setTrenProduct]=useState([]);
  const [bestProduct,setBestProduct]=useState([]);
  const [mobileProduct,setMobileProduct]=useState([]);
  const [wirelessProduct,setWirelessProduct]=useState([]);
  const [popularProduct,setPopularProduct]=useState([]);




  useEffect(()=>{
    const filterProduct1=products.filter(product=> {return product.category==="chair"})
    const filterProduct2=products.filter(product=> {return product.category==="sofa"})
    const filterProduct3=products.filter(product=> {return product.category==="wireless"})
    const filterProduct4=products.filter(product=> {return product.category==="mobile"})
    const filterProduct5=products.filter(product=> {return product.category==="watch"})

    setTrenProduct(filterProduct1);
    setBestProduct(filterProduct2);
    setWirelessProduct(filterProduct3);
    setMobileProduct(filterProduct4);
    setPopularProduct(filterProduct5);

  },[])
  return ( 
    <Helmet title={"Home"}>
        <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content">
                <p className="hero__subtitle">
                  Trending product in {years}
                </p>
                <h2>
                  Make Your Interior More Minimalistic & Modern
                </h2>
                <p>
                The all-round RF radio frequency regenerating beauty device is equipped with the unique DYHP (Dynamic Hyper Pulse) ultra-pulse penetration technology to penetrate the skin care ingredients into the stratum corneum
                </p>
                <motion.button whileTap={{scale:1.2}} className="buy__btn"><Link to="/shop"> SHOP NOW</Link> </motion.button>
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="hero__img">
                <img src={heroImg} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
        </section>
        <Services/>
        <section className="trending__products">
            <Container>
                <Row>
                    <Col lg="12" className="text-center">
                        <h2 className="section__title"> Trending Products</h2>
                    </Col>
                    <ProductList data={trenProduct}/>
                </Row>
            </Container>
        </section>

        <section className="best__sales">
            <Container>
                <Row>
                    <Col lg="12" className="text-center">
                        <h2 className="section__title"> Best Sales</h2>
                    </Col>
                    <ProductList data={bestProduct}/>
                </Row>
            </Container>
        </section>

        <section className="timer__count">
          <Container>
            <Row>
              <Col lg="6" md="6">
                <div className="clock__top-content">
                  <h4 className="text-white fs-6 mb-2"> Limited offers </h4>
                  <h3 className="text-white fs-5 mb-3">Quality Armchair</h3>
                </div>
                <Clock/>
                <motion.button whileTap={{scale:1.2}} className="buy__btn store__btn">
                  <Link to="/shop" > Visit Store</Link> 
                </motion.button>
              </Col>

              <Col lg="6" md="12" className="text-end count__img">
                <img src={countterimg} alt="" />
              </Col>
            </Row>
          </Container>
        </section>

        <section className="new__arrivals">
          <Container>
            <Row>
              <Col lg="12" className="text-center mb-5">
                <h2 className="section__title">new Arrivals</h2>
              </Col>
              <ProductList data={mobileProduct}/>
              <ProductList data={wirelessProduct}/>
            </Row>
          </Container>
        </section>

        <section className="popular__category">
        <Container>
            <Row>
              <Col lg="12" className="text-center mb-5">
                <h2 className="section__title">Popular in Category</h2>
              </Col>
              <ProductList data={popularProduct}/>
            </Row>
          </Container>
        </section>
    </Helmet>
  )
}

export default Home