import React ,{ useState,useEffect } from 'react';
import "./MyOrder.css";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection";
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar";
import Moment from 'moment';
import { motion } from 'framer-motion';
import { Container,Row,Col } from 'reactstrap';
import { getMyOrderByUserId,getOrderByNameOrderItem} from "../../redux/apiCall";
import {selectCurrentUser} from "../../redux/slices/userSlice";
import {useSelector} from "react-redux";
import { NotificationManager} from 'react-notifications';


import axios from "axios";
function MyOrder() {
    const currentUser=useSelector(selectCurrentUser);
    const [data,setData]=useState([]);
    const [status,setStatus] = useState("");
    const [search,setSearch]=useState("");
    useEffect(()=>{
      const getData=async()=>{
        const res = await getMyOrderByUserId(currentUser,status);
        setData(res.data);
      }
      getData();
    },[status])
    const searcherOrder= async()=>{
        const res=await getOrderByNameOrderItem(currentUser,status,search)
        if(res?.message){
          setData(res.data);
          setSearch("");
        }else{
          NotificationManager.error("",'No Order can find', 2000);
        }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        searcherOrder();
      }
    }
  return (
    <Helmet title="My Order">
        <CommonSectionfrom title='My Order'/>
        <div className="containerOrder">
            <Sidebar num={2}/>
            <div className="order">
              <section>
                <Container>
                  <Row>
                    <Col lg="6" md="3">
                      <div className="search__box">
                        <input type="text" placeholder="Search with name product..." onKeyDown={(e)=>handleKeyDown(e)} onChange={(e)=>setSearch(e.currentTarget.value)}  />
                        <span onClick={searcherOrder}>
                          <i whileTap={{scale:1.2}} class="ri-search-line"></i>
                        </span>
                      </div>
                    </Col>
                    <Col lg="3" md="6">
                      <div className="filter__widget text-center ">
                        <select onChange={(e)=>setStatus(e.currentTarget.value)} >
                          <option value="" >All</option>
                          <option value="Pending" >Pending</option>
                          <option value="Delivering" >Delivering</option>
                          <option value="Delivered" >Delivered</option>
                          <option value="Cancelled" >Cancelled</option>
                        </select>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </section>

              
              <Container>
                <Row>
                  <Col lg="9">
                    {
                      
                      data.length===0?
                      ( <h2 className='fs-4 text-center'>No item added to the cart</h2>)
                      :
                      (
                        data.map((order)=>(
                          <div  className="OrderItem">
                            <div className="infoDetail">
                              <div className="topOrderDetail">
                                <div className="leftDetail">
                                  <span className="vendorName">Phuc Shop:</span>
                                  <span className="totalOrder"> ${order.total}</span>
                                </div>

                                <div className="rightDetail">
                                  <span className="status"> {order.status}</span>
                                  {
                                    order.status==="Delivered"?
                                    (
                                      <button className="updateOrder">
                                        Delivered
                                      </button>
                                    )
                                    :
                                    order.status==="Pending"?
                                    (
                                      <button className="updateOrder">
                                        Cancel
                                      </button>
                                    ):null
                                  }
                                  
                                </div>
                              </div>
                              <div className="moreInfo">
                                  <span className="addressOrder">Address:{order.address}</span>
                                  <span className="phoneOrder"> Phone:{order.phone}</span>
                              </div>
                            </div>
                            
                            { order.products.map(item=>(
                              <div className="detailItem">
                               <img src={item.imgUrl} alt="" />
                               <div className="detailItemInfo">
                                  <span className="titleDetailItem"> {item.productName}</span>
                                  <span className="priceDetailItem"> ${item.price}</span>
                                  <span className="quantityDetailItem"> x{item.quantity}</span>
                               </div>
                            </div>
                            ))}
                           
                            
                          </div>
                        ))
                      )
                    }
                  </Col>
                </Row>
              </Container>
              
            </div>
        </div>
    </Helmet>
  )
}

export default MyOrder