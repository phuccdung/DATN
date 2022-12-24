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
import { useLocation } from 'react-router-dom';
import {getProduct} from '../../redux/apiCall'



const Shop = () => {
  const [data,setData]=useState([]);
  const [filterData,setFilterData]=useState([]);
  const dispatch=useDispatch();
  const currentUser=useSelector(selectCurrentUser);
  const location=useLocation();
  const keyWord=location.search.split("?")[1]||"";
  const [searchKey,setSearchKey]=useState("");
  

  const changeSearch=(e)=>{
    setSearchKey(e.currentTarget.value);
  }

  useEffect(()=>{
    const getData=async()=>{
      const res= await getProduct("sale");
      if(res){
        setData(res);
        console.log(res)
        if(keyWord){
          if(currentUser){
            addBehaviorArrKey([{
              "key":keyWord,
              "date":new Date().getTime(),
              "sysKey":1
            }],currentUser)
          }
          const dataResult=res.filter(item=>{
            if(item.title.includes(keyWord)
            ){
              return item
            }
            return;
          });
          setFilterData(dataResult);

        }else{
          setFilterData(res)
        }
      }
    };
    getData();
  },[keyWord])

  const handleFilter = (e) =>{
    let filter = e.currentTarget.value;
    if(filter){
      const dataResult=data.filter(item=>item.category===filter)
      setFilterData(dataResult);
      if(currentUser){
        addBehaviorArrKey([{
          "key":filter,
          "date":new Date().getTime(),
          "sysKey":1
        }],currentUser)
      }
    }else{
      setFilterData(data);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }
  const handleSearch=()=>{
    let search = searchKey ;

    if(search){
      
      const dataResult=data.filter(item=>{
        if(item.title.toLowerCase().includes(search.toLowerCase())||
          item.category.toLowerCase().includes(search.toLowerCase())||
          item.name.toLowerCase().includes(search.toLowerCase())
        ){
          return item
        }
        return;
      });
      setFilterData(dataResult);
      if(currentUser){
        addBehaviorArrKey([{
          "key":search,
          "date":new Date().getTime(),
        }],currentUser)
      }
    }else{
      setFilterData(data);
    }
  }
  const sortPrice=(e)=>{
    let arr=[...filterData]
    if(e.currentTarget.value==="ascending"){
       arr.sort((a,b)=>{return a.price-b.price});
      
    }
    if(e.currentTarget.value==="descending"){
       arr.sort((a,b)=>{return b.price-a.price});
    }
    setFilterData(arr)
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
                <select  onChange={(e)=>sortPrice(e)}>
                  <option value >Sort By</option>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option> 
                </select>
              </div>
            </Col>
            <Col lg="6" md="6">
              <div className="search__box">
                <input type="text" placeholder="Search....."onKeyDown={e=>handleKeyDown(e)} onChange={(e)=>changeSearch(e)}  />
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
             filterData.length===0 ? 
             (<h1 className='text-center fs-4'>No Product are found!</h1>)
             :
            (<ProductList data={filterData} />)
            }
          </Row>
        </Container>
      </section>
    </Helmet>
  )
}

export default Shop