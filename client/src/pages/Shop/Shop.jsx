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


import products from "../../assets/data/products";


const Shop = () => {

  const [filterProductData,setFilterProduct]=useState(products)
  const [keyWords,setKeyWords]=useState("");
  const dispatch=useDispatch();
  const currentUser=useSelector(selectCurrentUser);
  
  const keys=useSelector(state=>state.behavior.keywords);
  
  console.log(keys);

  const changeSearch=(e)=>{
    setKeyWords(e.currentTarget.value);
  }

  useEffect(()=>{
    console.log(keyWords);
  },[keyWords,])
  const handleFilter = (e) =>{
    const filter = e.currentTarget.value;
    const destination=new Date().getTime();
    dispatch(behaviorActions.addKeyWords({
      "key":filter,
      "date":destination
    }));
    if(currentUser){
      addBehaviorArrKey([{
        "key":filter,
        "date":destination
      }],currentUser)
    }
    let filterProduct;
    switch(filter) {
      case "sofa":
        {
          filterProduct=products.filter(item=> item.category==='sofa')
          setFilterProduct(filterProduct);
          break;
        }
      case "mobile":
       {
          filterProduct=products.filter(item=> item.category==='mobile')
          setFilterProduct(filterProduct);
          break;
          
       }
       case "chair":
       {
          filterProduct=products.filter(item=> item.category==='chair')
          setFilterProduct(filterProduct);
          break;
        
       }
       case "watch":
       {
          filterProduct=products.filter(item=> item.category==='watch')
          setFilterProduct(filterProduct);
          break;
       }
       case "wireless":
       {
          filterProduct=products.filter(item=> item.category==="wireless")
          setFilterProduct(filterProduct);
          break; 
       }
      default:
        {
          setFilterProduct(products);
          break;
        }
    }
  }

  const handleSearch=()=>{
    const search = keyWords ;
    const destination=new Date().getTime();
    dispatch(behaviorActions.addKeyWords({
      "key":search,
      "date":destination
    }));
    if(currentUser){
      addBehaviorArrKey([{
        "key":search,
        "date":destination
      }],currentUser)
    }
    const searchedProduct=products.filter(item=>
      item.productName.toLowerCase().includes(search.toLowerCase()));

    setFilterProduct(searchedProduct);
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
                <option value="">Filter By Category</option>
                  <option value="sofa">Sofa</option>
                  <option value="mobile">Mobile</option>
                  <option value="chair">Chair</option>
                  <option value="watch">Watch</option>
                  <option value="wireless">Wireless</option>
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
             filterProductData.length===0 ? 
             (<h1 className='text-center fs-4'>No Product are found!</h1>)
             :
            (<ProductList data={filterProductData} />)
            }
          </Row>
        </Container>
      </section>
    </Helmet>
  )
}

export default Shop