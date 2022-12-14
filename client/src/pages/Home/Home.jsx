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

import { selectCurrentUser } from '../../redux/slices/userSlice';
import { useSelector} from 'react-redux';
import { getProductHome,getProductById} from '../../redux/apiCall';



import products from "../../assets/data/products";
import countterimg from "../../assets/images/counter-timer-img.png"

const Home = () => {
  const years =new Date().getFullYear();

  const [trenProduct,setTrenProduct]=useState([]);
  const [bestProduct,setBestProduct]=useState([]);

  const [popularProduct,setPopularProduct]=useState([]);
  const [newProducts,setNewProducts]=useState([]);

  const currentUser=useSelector(selectCurrentUser);
  




  useEffect(()=>{
    const getData=async()=>{
      const res=await getProductHome();
      if(res?.message){
        setNewProducts(res.data.new);
        setBestProduct(res.data.best);
        let arr=[];
        res.data?.trending.forEach(async(item)=>{
          const p=await getProductById(item._id);
          if(p?.message){
            arr.push(p.data);
            setTrenProduct(arr);
          }
        })
      }
    };
    getData();

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
        <section className="new__arrivals">
          <Container>
            <Row>
              <Col lg="12" className="text-center mb-5">
                <h2 className="section__title">New Arrivals</h2>
              </Col>
              <ProductList data={newProducts}/>
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

        {/* <section className="popular__category">
        <Container>
            <Row>
              <Col lg="12" className="text-center mb-5">
                <h2 className="section__title">Popular in Category</h2>
              </Col>
              <ProductList data={popularProduct}/>
            </Row>
          </Container>
        </section> */}
    </Helmet>
  )
}

export default Home