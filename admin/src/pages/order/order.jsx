import React ,{ useState,useEffect } from 'react';
import "./order.css";
import { useLocation } from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/userRedux";
import { getOrderByOrderId,updateStatusOrderById} from "../../redux/apiCall"; 
import { NotificationManager} from 'react-notifications';
import {
  DateRange,
  AccountCircle,
  LocalShipping,
  LocationOn
} from "@material-ui/icons";

export default function Order() {
  const admin=useSelector(selectCurrentUser);
  const [data,setData]=useState({});
  const [reset,setReset]=useState(false);
  const location=useLocation();
  const orderId=location.pathname.split("/")[2];
  
  useEffect(()=>{
    const getData=async()=>{
      const res=await getOrderByOrderId(admin,orderId);
      if(res?.message){
        setData(res.data);
      }
    }
    getData();
  },[])

  const changStatus=async(e)=>{
    const stt=e.currentTarget.value;
    let body={
      "status":stt,
      "userId":admin.id
    }
    const res=await updateStatusOrderById(admin,body,orderId);
    console.log(res);
    if(res?.message){
      setData(res.data)
      NotificationManager.success( "Order has been update...",'Success message', 2000);
    }else{
      NotificationManager.error("",' Order can not update', 2000);
      // setReset(!reset);
    }
  }
  return (
    <div className='orderDetail'>
      <div className="orderContainer">
        <div className="orderShow">
          <div className="orderInfo">
            <div className="orderTimeInfo">
              <DateRange className='DateRange'/>
              <span>Jun ,12,39300</span>
            </div>
            <span className="orderId">Order ID: 129238273827</span>
          </div>
          <div className="changStatus">
            <span> Change Status:</span>
            <select  className='selectStatus'  onChange={(e)=>changStatus(e)}>
              <option selected={data?.status==="Cancelled"} value="Cancelled" >Cancelled </option>
              <option selected={data?.status==="Pending"} value="Pending" >Pending </option>
              <option selected={data?.status==="Accept"} value="Accept" >Accept </option>
              <option selected={data?.status==="Delivering"} value="Delivering" >Delivering </option>
              <option selected={data?.status==="Delivered"} value="Delivered" >Delivered </option>
            </select>
          </div>
        </div>
        <div className="orderInfo_Top">
          <div className="info">
            <AccountCircle className='icon'/>
            <div className="infoShow">
              <h2>Customer</h2>
              <span>Name:{" "+data?.name}</span>
              <span>Phone:{ " "+data?.phone}</span>
            </div>
          </div>
          <div className="info">
            <LocalShipping className='icon'/>
            <div className="infoShow">
              <h2>Order Info</h2>
              <span>Quantity:{" "+data?.products?.reduce((sum,curr)=>sum+curr.quantity,0)}</span>
              <span>Total: ${data?.total}</span>
            </div>
          </div>
          <div className="info">
            <LocationOn className='icon'/>
            <div className="infoShow">
              <h2>Deliver to</h2>
              <p>{data?.address}</p>
            </div>
          </div>
        </div>
        <div className="orderProducts">
          <div className="table_Product">              
            <table className='table'> 
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {
                  data?.products?.map((item,index)=>(
                    <tr key={index}>
                      <td className='td_product'>
                        <img src={item.imgUrl} alt="" />
                        <span >{item.productName} </span>
                      </td>
                      <td>{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price*item.quantity).toFixed(3)}</td>
                    </tr>
                  ))
                }
                  
              </tbody>
            </table> 
             <div className="total_order">
              <div>
                <div className="total_item">
                  <span>Subtotal:</span>
                  <span>${data?.total}</span>
                </div>
                <div className="total_item">
                  <span>Shipping cost:</span>
                  <span>$0</span>
                </div>
                <div className="total_item">
                  <span>Grand total:</span>
                  <span>$0</span>
                </div>
                <div className="total_item">
                  <span>Payment:</span>
                  {
                    data?.status==="Delivered"?
                     <span className='blue'>Payment Done</span>
                     :
                     <span className='red'>Unpaid</span>
                  }
                </div>
              </div>  
             </div>
            
                  
          </div>
          <div className="checkPayVendor">
            <button className='btn__mark'> MARK AS PAY VENDOR</button>
          </div>
        </div>
      </div>
    </div>
  )
}
