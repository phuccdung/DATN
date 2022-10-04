import "./widgetSm.css";
import { Visibility } from "@material-ui/icons";
import { useState,useEffect } from "react";
import axios from "axios";
import {BASE_URL} from "../../requestMethods";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/userRedux";

export default function WidgetSm() {
  const admin=useSelector(selectCurrentUser);
  const [users,setUsers]=useState([]);
  
  useEffect(()=>{
    const getUsers=async()=>{
      try{
        const res=await axios.get(BASE_URL+"users/vendor/?new=true",{
          headers: {

            Authorization: "Bearer " + admin.accessToken
  
          },
        });
        setUsers(res.data);
      }catch(err){
        console.log(err);
      }
    }
    getUsers();
  },[])
  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        {
          users.map((user,index)=>(
            <li className="widgetSmListItem" key={index}>
          <img
            src={user.img||"https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&dpr=2&w=500"}
            alt=""
            className="widgetSmImg"
          />
          <div className="widgetSmUser">
            <span className="widgetSmUsername">{user.username}</span>
            <span className="widgetSmUserTitle">Software Engineer</span>
          </div>
          <button className="widgetSmButton">
            <Visibility className="widgetSmIcon" />
            Display
          </button>
        </li>
          ))
        }
        
        
      </ul>
    </div>
  );
}
