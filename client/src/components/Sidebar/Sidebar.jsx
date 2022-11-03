import React from 'react';
import "./Sidebar.css";
import { motion } from 'framer-motion';

function Sidebar({num}) {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Profile</h3>
          <ul className="sidebarList">
            <motion.li whileTap={{scale:1.2}} className={num===1?"sidebarListItem  active":"sidebarListItem "}>
              My Information
            </motion.li>
            <motion.li whileTap={{scale:1.2}} className="sidebarListItem">
              My Order
            </motion.li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Shop</h3>
          <ul className="sidebarList">
            <motion.li whileTap={{scale:1.2}} className="sidebarListItem">
               Products
            </motion.li>
            <motion.li whileTap={{scale:1.2}} className="sidebarListItem">
               Order
            </motion.li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar