import React,{useState} from "react";
import "./topbar.css";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import {logout} from"../../redux/userRedux";
import {useHistory} from 'react-router-dom'

export default function Topbar() {
  const [isShowDrop,setIsShowDrop]=useState(false);
  const navigate=useHistory();
  const dispatch=useDispatch();
  const logOut=()=>{
    dispatch(logout());
    navigate.push("/login");
  }
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">lamaadmin</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>
          <div className="topbarIconContainer" onMouseEnter={()=>setIsShowDrop(true)}>
           <img src="https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" className="topAvatar" />
           <div className={isShowDrop?"setting_content":"btn_none"} onMouseLeave={()=>setIsShowDrop(false)}>
            <span className="btn_logout" onClick={()=>logOut()}> Logout</span>
           </div>
          </div>
        </div>
      </div>
    </div>
  );
}
