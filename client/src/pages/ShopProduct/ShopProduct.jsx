import React,{ useState,useEffect }  from 'react';
import "./ShopProduct.css";
import { motion } from 'framer-motion';
import {NotificationManager} from 'react-notifications';
import { Container,Row,Col } from 'reactstrap';
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection";
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar";
import {useSelector} from "react-redux";
import {getProductsByUserId,deleteProductById } from "../../redux/apiCall";
import {selectCurrentUser} from "../../redux/slices/userSlice";
import { Link } from 'react-router-dom';


function ShopProduct() {
  const currentUser=useSelector(selectCurrentUser);
  const [status,setStatus] = useState("");
  const [category,setCategory] = useState("");
  const [search,setSearch]=useState("");
  const [data,setData]=useState([]);
  

  useEffect(()=>{
    const getData=async()=>{
      const res=await getProductsByUserId(currentUser,status,category,"")
      if(res?.message){
        setData(res.data);
        setSearch("");
      }
    }
    getData();
  },[status,category])

  const searchProduct=async()=>{
    const res=await getProductsByUserId(currentUser,"","",search)
      if(res?.message){
        setData(res.data);
        setStatus("");
        setCategory("")
      }
  }
  const deleteProduct=async(id)=>{
    const res=await deleteProductById(id,currentUser)
    console.log(res);
    if(res.message){
      NotificationManager.success( "Product has been delete...",'Success message', 3000);
      let arr=data.filter(item=>item._id!==id);
      setData(arr);
      
    }else{
        NotificationManager.error( "Error", 3000);
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchProduct();
    }
  }
 
  return (
    <Helmet title="Shop Products" >
        <CommonSectionfrom title='Shop Products'/>
        <div className="containerProfile">
            <Sidebar num={3}/>
            <div className="productList">
              <section>
                <Container>
                  <Row>
                    <Col lg="6" md="3">
                      <div className="search__box">
                        <input type="text" value={search} placeholder="Search with name product..." onKeyDown={(e)=>handleKeyDown(e)} onChange={(e)=>setSearch(e.currentTarget.value)}  />
                        <span onClick={()=>searchProduct()}>
                          <i whileTap={{scale:1.2}} class="ri-search-line"></i>
                        </span>
                      </div>
                    </Col>
                    <Col lg="3" md="3">
                      <div className="filter__widget text-center ">
                        <select onChange={(e)=>setStatus(e.currentTarget.value)} >
                          <option selected={status===""} value="" >All</option>
                            <option selected={status==="waiting"} value="waiting" >Waiting</option>
                            <option selected={status==="sale"} value="sale" >Sale</option>
                            <option selected={status==="cancel"} value="cancel" >Cancel</option>
                            <option selected={status==="pause"} value="pause" >Pause</option>
                        </select>
                      </div>
                    </Col>
                    <Col lg="3" md="3">
                      <div className="filter__widget text-center ">
                        <select onChange={(e)=>setCategory(e.currentTarget.value)} >
                          <option selected={category===""} value="">Choose Category</option>
                          <option selected={category==="Skin Care"} value="Skin Care" >Skin Care</option>
                          <option selected={category==="Make Up"} value="Make Up" >Make Up</option>
                          <option selected={category==="Body&Hair"} value="Body&Hair" >Body&Hair</option>
                          <option selected={category==="Internal Body"} value="Internal Body" >Internal Body</option>
                        </select>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12" md="3">
                      <div className="create__new">
                        <div className="import__excel">
                          
                            <button className="btn__import" >
                              <Link to='/import'>
                                Import EXCEL
                              </Link>
                            </button>
                            <button className="create__product">
                              <Link to='/newproduct'>
                                  Create Product
                              </Link>
                            </button> 
                          
                        </div>
                        
                      </div>
                    </Col>  
                  </Row>
                </Container>
              </section>

              <section>
                <Container>
                  <Row>
                    <Col lg='12'>
                      {
                        data.length===0?
                        ( <h2 className='fs-4 text-center'>No item in the shop</h2>)
                        :
                        (
                          <table className="table bordered">
                            <thead>
                              <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                data.map((item,index)=>(
                                  <tr key={index}>
                                    <td>
                                      <img src={item.img} alt="" />
                                    </td>
                                    <td >
                                      <div className="over__title">
                                      {item.title}
                                      </div>
                                    </td>
                                    <td>{item.category}</td>
                                    <td>${item.price}</td>
                                    <td>{item.stock}</td>
                                    <td>{item.status}</td>
                                    <td>
                                      <div className="action__shop" key={index}>
                                        <motion.button whileTap={{scale:1.2}} className='btn__detail'>
                                          <Link to={`/product/${item._id}`}>Detail</Link>
                                        </motion.button>
                                        <motion.i  whileHover={{scale:2}} class="ri-delete-bin-6-line" onClick={()=>deleteProduct(item._id)}></motion.i>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        )
                      }
                    </Col>
                  </Row>
                </Container>
              </section>
            </div>
        </div>
    </Helmet>
  )
}

export default ShopProduct