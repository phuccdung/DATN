import React from 'react';
import "./Sidebar.css";
import {Link} from 'react-router-dom'
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from "../../redux/slices/userSlice"; 

function Sidebar({num}) {
  const currentUser=useSelector(selectCurrentUser);
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Profile</h3>
          <ul className="sidebarList">
            <motion.li whileTap={{scale:1.2}} className={num===1?"sidebarListItem  active":"sidebarListItem "}>
              <Link to="/profile">
               My Information
              </Link>
            </motion.li>
            <motion.li whileTap={{scale:1.2}} className={num===2?"sidebarListItem  active":"sidebarListItem "}>
              <Link to="/myorder">
               My Order
              </Link>
            </motion.li>
            <motion.li whileTap={{scale:1.2}} className={num===5?"sidebarListItem  active":"sidebarListItem "}>
              <Link to="/link">
               My Link
              </Link>
            </motion.li>
          </ul>
        </div>
        {
          currentUser?.role?.Editor?
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Shop</h3>
            <ul className="sidebarList">
              <motion.li whileTap={{scale:1.2}} className={num===3?"sidebarListItem  active":"sidebarListItem "}>
                <Link to="/shopproduct">
                  Products
                </Link>
              </motion.li>
              <motion.li whileTap={{scale:1.2}}  className={num===4?"sidebarListItem  active":"sidebarListItem "}>
                <Link to="/shoporder">
                  Orders
                </Link>
              </motion.li>
              <motion.li whileTap={{scale:1.2}}  className={num===6?"sidebarListItem  active":"sidebarListItem "}>
                <Link to="/analytic">
                  Analytics
                </Link>
              </motion.li>
            </ul>
          </div>
          : null
        }
      </div>
    </div>
  )
}

export default Sidebar