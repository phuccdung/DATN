import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/userRedux";
import { useState,useEffect } from "react";
import { income } from "../../redux/apiCall";
import Moment from 'moment';

export default function FeaturedInfo() {
  const admin=useSelector(selectCurrentUser);
  const lastMonth=Moment().subtract(1,"months").startOf("month").format("YYYY-MM-DD");
  const [data,setData]=useState([]);
  const [dataLink,setDataLink]=useState([]);
  const [revenue,setRevenue]=useState(0);
  const [saleLink,setSaleLink]=useState(0);
  const [total,setTotal]=useState(0);
  const [discount,setDiscount]=useState(0);
  useEffect(()=>{
    const getData=async()=>{
      const res=await income(admin,lastMonth);
      if(res?.message){
        setData(res.data);
        setDataLink(res.dataLink)
        setRevenue((res.data[1].number*100)/res.data[0].number-100);
        setTotal((res.data[1].quantity*100)/res.data[0].quantity-100);
        setDiscount((res.data[1].dis*100)/res.data[0].dis-100);
        setSaleLink((res.dataLink[1].total*100)/res.dataLink[0].total-100);
      }
    }
    getData()
  },[])
  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Total Order</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{data[1]?.quantity}/</span>
          <span className="featuredMoneyLast">{data[0]?.quantity}</span>

          <span className="featuredMoneyRate">
          {total.toFixed(3)}%
            {
              total>0?
              <ArrowUpward className="featuredIcon"/>
              :
              <ArrowDownward  className="featuredIcon negative"/>
            }
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Revenue</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${Number(data[1]?.number).toFixed(0)}/</span>
          <span className="featuredMoneyLast">{Number(data[0]?.number).toFixed(0)}</span>
          <span className="featuredMoneyRate">
            {revenue.toFixed(3)}%
            {
              revenue>0?
              <ArrowUpward className="featuredIcon"/>
              :
              <ArrowDownward  className="featuredIcon negative"/>
            } 
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Discount</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${Number(data[1]?.dis).toFixed(0)}/</span>
          <span className="featuredMoneyLast">{Number(data[0]?.dis).toFixed(0)}</span>
          <span className="featuredMoneyRate">
          {discount.toFixed(3)}%
            {
              discount>0?
              <ArrowUpward className="featuredIcon"/>
              :
              <ArrowDownward  className="featuredIcon negative"/>
            }
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>      
      <div className="featuredItem">
        <span className="featuredTitle">Sale By Link</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${Number(dataLink[1]?.total).toFixed(0)}/</span>
          <span className="featuredMoneyLast">{Number(dataLink[0]?.total).toFixed(0)}</span>
          <span className="featuredMoneyRate">
            {saleLink.toFixed(3)}%
            {
              saleLink>0?
              <ArrowUpward className="featuredIcon"/>
              :
              <ArrowDownward  className="featuredIcon negative"/>
            } 
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
}
