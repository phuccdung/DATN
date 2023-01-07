import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import {selectCurrentUser}from "../../redux/userRedux"
import { useSelector } from "react-redux";
import {Redirect} from "react-router-dom";
import {useEffect,useState} from "react";
import { analyticsUser ,analyticsFind,analyticsKey,analyticsOrder} from "../../redux/apiCall";

export default function Home() {
  const admin=useSelector(selectCurrentUser);
  const [userStats, setUserStats] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [findStats,setFindStats] = useState([]);
  const [status,setStatus] = useState("");
  const [date,setDate] = useState("7");

  useEffect(() => {
    let month=[
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
    ];
    const getStats = async () => {  
      const res=await analyticsUser(admin);
      
      res?.map((item) =>
        setUserStats((prev) => [
          ...prev,
          { name: month[item._id - 1], "User Register": item.total },
        ])
      )
      const res2=await analyticsOrder(admin); 
      let i=0;
        res2.data.map((item) =>
        setOrderStats((prev) => {
          let arr=[];
          if(item._id===res2.dataLink[i]?._id){
           arr= [...prev,{ name: month[item._id - 1], "Total Item": item.total,"Sale By Link": res2.dataLink[i]?.total }];
           i=i+1;
          }else{
            arr= [...prev,{ name: month[item._id - 1], "Total Item": item.total,"Sale By Link": 0 }];
          }
          return arr;
        })
        )
    };
    getStats();
  }, []);

  useEffect(()=>{
    const getStats = async () => {
    let res;
    if(status==="key_Ex"||status==="key_In"){
       res=await analyticsKey(admin,date,status); 
    }else{
      res=await analyticsFind(admin,date,status);  
    }
    if(res?.message){
      let arr=[];
      if(status==="key_Ex"||status==="key_In"){
        arr= res.data.map((item) =>{
          return {name:item._id,"Active Product": item.total}
         })
      }else{
        arr= res.data.map((item) =>{
         return {name:item._id.id,"Active Product": item.total,"Title":item._id.name||""}
        })
      }
      setFindStats(arr);
    }
    };
    getStats();
  },[date,status])
  const handleFilterDay=(e) => {
    setDate(e.currentTarget.value);
  }
  const handleFilterStatus=(e) => {
    setStatus(e.currentTarget.value);
  }
  return (
    <div className="home">
      {!admin?.role.Admin&&(<Redirect to="/login" ></Redirect>)}
      <FeaturedInfo />
      <Chart data={orderStats} title="Order Analytics" grid dataKey="Total Item" line={true}/>
      <Chart data={userStats} title="User Analytics" grid dataKey="User Register" line={true}/>
      <div className="">
      <div className="filter__widget">
        <select onChange={(e)=>handleFilterDay(e)} >
          <option value="7">One week</option>
          <option value="30">One Month</option>
          <option value="90">Three Months</option>
        </select>
        <select onChange={(e)=>handleFilterStatus(e)} >
          <option value="">ALL</option>
          <option value="view">View Product</option>
          <option value="care">Concern Product</option>
          <option value="want">Want To Buy Product</option>
          <option value="buy">Buy Product</option>
          <option value="key_Ex">Existent KeyWords</option>
          <option value="key_In">Inexistent KeyWords</option>
        </select>
      </div>
        <Chart data={findStats} title="Behavior Analytics" grid dataKey="Active Product"/>
      </div>
      <div className="homeWidgets">
        <WidgetSm/>
        <WidgetLg/>
      </div>
    </div>
  );
}
