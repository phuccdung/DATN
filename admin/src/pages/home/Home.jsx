import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import {selectCurrentUser}from "../../redux/userRedux"
import { useSelector } from "react-redux";
import {Redirect} from "react-router-dom";
import {useEffect,useMemo,useState} from "react";
import { analyticsUser ,analyticsFind,analyticsKey} from "../../redux/apiCall";

export default function Home() {
  const admin=useSelector(selectCurrentUser);
  const [userStats, setUserStats] = useState([]);
  const [findStats,setFindStats] = useState([]);
  const [status,setStatus] = useState("");
  const [date,setDate] = useState("7");
  const [dateKey,setDatekey] = useState("7");
  const [keyStats,setKeyStats] = useState([]);

  


  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      
      const res=await analyticsUser(admin);
      res.map((item) =>
        setUserStats((prev) => [
          ...prev,
          { name: MONTHS[item._id - 1], "Active User": item.total },
        ])
      )
    };
    getStats();
  }, [MONTHS]);
  useEffect(()=>{
    const getStats = async () => {
    const res=await analyticsFind(admin,date,status);  
    console.log(res); 
    if(res?.message){
      let arr= res.data.map((item) =>{
        return {name:item._id,"Active Product": item.total}
      })
      setFindStats(arr);
    }
    };
    getStats();
  },[date,status])
  useEffect(()=>{
    const getStats = async () => {
    const res=await analyticsKey(admin,dateKey);  
    console.log(res); 
    if(res?.message){
      let arr= res.data.map((item) =>{
        return {name:item._id,"Active KeyWord": item.total}
      })
      setKeyStats(arr);
    }
    };
    getStats();
  },[dateKey])
  const handleFilterDay=(e) => {
    setDate(e.currentTarget.value);
  }
  const handleFilterStatus=(e) => {
    setStatus(e.currentTarget.value);
  }
  const handleFilterDayK=(e) => {
    setDatekey(e.currentTarget.value);
  }

 
  return (
    <div className="home">
      {!admin?.role.Admin&&(<Redirect to="/login" ></Redirect>)}
      <FeaturedInfo />
      <Chart data={userStats} title="User Analytics" grid dataKey="Active User"/>
      <div className="">
      <div className="filter__widget">
        <select onChange={(e)=>handleFilterDay(e)} >
          <option value="7">One week</option>
          <option value="30">One Month</option>
          <option value="90">Three Month</option>
          <option value="365">One year</option>
        </select>
        <select onChange={(e)=>handleFilterStatus(e)} >
          <option value="">ALL</option>
          <option value="view">View Product</option>
          <option value="care">Care to Product</option>
          <option value="want">Want to buy Product</option>
          <option value="buy">Buy Product</option>
        </select>
      </div>
        <Chart data={findStats} title="Product Behavior Analytics" grid dataKey="Active Product"/>
      </div>
      <div className="">
      <div className="filter__widget">
        <select onChange={(e)=>handleFilterDayK(e)} >
          <option value="7">One week</option>
          <option value="30">One Month</option>
          <option value="90">Three Month</option>
          <option value="365">One year</option>
        </select>
      </div>
        <Chart data={keyStats} title="KeyWords Analytics" grid dataKey="Active KeyWord"/>
      </div>
      <div className="homeWidgets">
        <WidgetSm/>
        <WidgetLg/>
      </div>
    </div>
  );
}
