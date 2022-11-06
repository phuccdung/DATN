import React ,{ useState,useEffect } from 'react';
import "./ShopOrder.css";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection";
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Container,Row,Col } from 'reactstrap';
import Moment from 'moment';
import { getOrderByVendor,getOrderByVendorWithKey} from "../../redux/apiCall";
import {selectCurrentUser} from "../../redux/slices/userSlice";
import {useSelector} from "react-redux";

function ShopOrder() {
  const currentUser=useSelector(selectCurrentUser);
    const [data,setData]=useState([]);
    const [status,setStatus] = useState("Pending");
    const [search,setSearch]=useState("");
    const [fromDate,setFromDate]=useState(Moment().startOf('day').subtract(3,"day").format("YYYY-MM-DD"));
    const [toDate,setToDate]=useState(Moment().endOf('day').format("YYYY-MM-DD"));

    useEffect(()=>{
      const getData=async()=>{
       const res=await getOrderByVendor(currentUser,fromDate,Moment(toDate).endOf('day').toString(),status);
       if(res.message){
         setData(res.data);
         setSearch("")
       }else{
         setSearch("")
         setData([]);
       } 
     }
     getData();
    },[fromDate,toDate,status])
    
    const searchKey=async()=>{
      const res=await getOrderByVendorWithKey(currentUser,search);
      if(res.message){
        setData(res.data);
      }else{
       setData([]);
      }
    }
  return (
    <Helmet title="Shop Order">
        <CommonSectionfrom title='Shop Order'/>
        <div className="containerOrder">
            <Sidebar num={4}/>
            <div className="order">
              <section>
                <Container>
                  <Row>
                    <Col lg="3" md="6">
                      <div className="search__box">
                        <input
                          type="date"
                          value={fromDate}
                          onChange={e=>setFromDate(e.currentTarget.value)}
                        />
                        <input
                          type="date"
                          value={toDate}
                          onChange={e=>setToDate(e.currentTarget.value)}
                        />
                      </div>
                    </Col>
                    <Col lg="6" md="3">
                      <div className="search__box">
                        <input value={search} type="text" placeholder="Search with name product..." onChange={e=>setSearch(e.currentTarget.value)}  />
                        <span onClick={searchKey}>
                          <i whileTap={{scale:1.2}} class="ri-search-line"></i>
                        </span>
                      </div>
                    </Col>
                    <Col lg="3" md="6">
                      <div className="filter__widget text-center ">
                        <select  onChange={e=>setStatus(e.currentTarget.value)}>
                          <option selected={status===""} value="" >All</option>
                          <option selected={status==="Pending"} value="Pending" >Pending</option>
                          <option selected={status==="Accept"} value="Accept" >Delivering</option>
                          <option selected={status==="Delivering"} value="Delivering" >Delivering</option>
                          <option selected={status==="Delivered"} value="Delivered" >Delivered</option>
                          <option selected={status==="Cancelled"} value="Cancelled" >Cancelled</option>
                        </select>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </section>

              <Container>
                <Row>
                  <Col lg='9'>
                    {
                      
                      data.length===0?
                      ( <h2 className='fs-4 text-center'>No item added to the cart</h2>)
                      :
                      (
                        data.map((order)=>(
                          <div className="OrderItem">
                            <div className="topOrderDetail">
                              <div className="leftDetail">
                                <span className="vendorName">Name: {order.name}:</span>
                                <span className="totalOrder"> ${order.total}</span>
                              </div>

                              <div className="rightDetail">
                                <span className="status"> {order.status}</span>
                                {
                                  order.status==="Pending"?
                                    (
                                      <>
                                      <button className="updateOrder">
                                        Cancel
                                      </button>
                                      <button className="updateOrder">
                                        Accept
                                      </button>
                                     </>
                                    )
                                  :
                                  
                                    order.status==="Accept"?
                                    (
                                      
                                      <button className="updateOrder">
                                        Delivering
                                      </button>
                                      
                                    )
                                    :
                                    order.status==="Delivering"?
                                    (
                                      
                                      <button className="updateOrder">
                                        Delivered
                                      </button>
                                      
                                    )
                                    :
                                    null
                                }
                                
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

export default ShopOrder