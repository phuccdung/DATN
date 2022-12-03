import "./widgetLg.css";
import Moment from 'moment';
import { useState,useEffect } from "react";
import {selectCurrentUser} from "../../redux/userRedux";
import {useSelector} from "react-redux";
import { getOrder } from "../../redux/apiCall";

export default function WidgetLg() {
  const fromDate=Moment().startOf("day").format();
  const toDate=Moment().endOf("day").format();
  const admin=useSelector(selectCurrentUser);
  const [data,setDate]=useState([]);
  useEffect(()=>{
    const getData=async()=>{
      const res=await getOrder(admin,fromDate,toDate,true);
      console.log(res);
      if(res?.message){
        setDate(res.data);
      }
    }
    getData()
  },[])
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };
  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest transactions</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Customer</th>
          <th className="widgetLgTh">Address</th>
          <th className="widgetLgTh">Date</th>
          <th className="widgetLgTh">Amount</th>
          <th className="widgetLgTh">Status</th>
        </tr>
        {
          data.map((item,index)=>(
            <tr className="widgetLgTr" key={index}>
              <td className="widgetLgUser">
                {/* <img
                  src="https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt=""
                  className="widgetLgImg"
                /> */}
                <span className="widgetLgName">{item.name}</span>
              </td>
              <td className="widgetLgDate">{item.address   }</td>
              <td className="widgetLgDate">{Moment(item.createdAt).format("DD//MM/YYYY")   }</td>
              <td className="widgetLgAmount">${item.total}</td>
              <td className="widgetLgStatus">
                <Button type={item.status} />
          </td>
        </tr>
          ))
        }
        
      </table>
    </div>
  );
}
