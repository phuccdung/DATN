import React ,{useEffect,useState}from 'react';
import "./Shop.css";
import CommonSection from "../../components/UI/CommonSection/CommonSection";
import Helmet from "../../components/Helmet/Helmet";
import {Container,Row,Col} from "reactstrap";
import ProductList from "../../components/UI/ProductList/ProductList";
import { useDispatch ,useSelector} from 'react-redux';
import { selectCurrentUser } from '../../redux/slices/userSlice';
import {behaviorActions} from "../../redux/slices/behaviorSlice";
import { addBehaviorArrKey } from '../../redux/apiCall';

import {getProduct} from '../../redux/apiCall'



const Shop = () => {
  const [data,setData]=useState([]);
  const [keyWords,setKeyWords]=useState("");
  const [searchKey,setSearchKey]=useState("");
  const dispatch=useDispatch();
  const currentUser=useSelector(selectCurrentUser);
  

  const changeSearch=(e)=>{
    setSearchKey(e.currentTarget.value);
  }

  useEffect(()=>{
    const getData=async()=>{
      const res= await getProduct(keyWords);
      if(res){
        setData(res);
      }
    };
    getData();
  },[keyWords])
  const handleFilter = (e) =>{
    const filter = e.currentTarget.value;
    dispatch(behaviorActions.addKeyWords({
      "key":filter,
      "date":new Date().getTime()
    }));
    if(currentUser){
      addBehaviorArrKey([{
        "key":filter,
        "date":new Date().getTime()
      }],currentUser)
    }
    setKeyWords(filter);
  }

  const handleSearch=()=>{
    const search = searchKey ;

    dispatch(behaviorActions.addKeyWords({
      "key":search,
      "date":new Date().getTime(),
    }));
    if(currentUser){
      addBehaviorArrKey([{
        "key":search,
        "date":new Date().getTime(),
      }],currentUser)
    }
    setKeyWords(search);
  }

  return (
    <Helmet title="Shop">
      <CommonSection title="Products"/>
      <section>
        <Container>
          <Row>
            <Col lg="3" md="6">
              <div className="filter__widget">
                <select onChange={(e)=>handleFilter(e)} >
                  <option value="" >All</option>
                  <option value="Skin Care" >Skin Care</option>
                  <option value="Make Up" >Make Up</option>
                  <option value="Body&Hair" >Body&Hair</option>
                  <option value="Internal Body" >Internal Body</option>
                </select>
              </div>
            </Col>
            <Col lg="3" md="6" className='text-end'>
              <div className="filter__widget">
                <select >
                  <option value>Sort By</option>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option> 
                </select>
              </div>
            </Col>
            <Col lg="6" md="6">
              <div className="search__box">
                <input type="text" placeholder="Search....." onChange={(e)=>changeSearch(e)}  />
                <span onClick={handleSearch}>
                  <i whileTap={{scale:1.2}} class="ri-search-line"></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="pt-0">
        <Container>
          <Row>
            {
             data.length===0 ? 
             (<h1 className='text-center fs-4'>No Product are found!</h1>)
             :
            (<ProductList data={data} />)
            }
          </Row>
        </Container>
      </section>
    </Helmet>
  )
}

export default Shop