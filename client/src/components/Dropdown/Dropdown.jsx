import React from 'react';
import "./Dropdown.css";
import {NavLink} from "react-router-dom";
import{motion} from "framer-motion";

const shop__skin_Care=[
    {
      path:"shop?Serum",
      display:"Serum"
    },
    {
      path:"shop?Cleanser",
      display:"Facial Cleanser"
    },
    {
      path:"shop?Sunscreen",
      display:"Sunscreen"
    },
    {
      path:"shop?Men",
      display:"For Men"
    }
  ]
const shop__make_up=[
    {
      path:"shop?Lip",
      display:"Lip"
    },
    {
      path:"shop?Face",
      display:"Face"
    },
    {
      path:"shop?Eye",
      display:"Eye"
    }
  ]
  const shop__Body=[
    {
      path:"shop?Body",
      display:"Body Care"
    },
    {
      path:"shop?Hair",
      display:"Hair Care"
    },
    {
      path:"shop?Hand",
      display:"Hand Care"
    }
  ]
  const shop__internal=[
    {
      path:"shop?Tea",
      display:"Tea"
    },
  ]

function Dropdown() {
  return (
    <div className='dropDown_content'>
        <div className="skin_care_drop">
            <h3>SKIN CARE</h3>
            <ul className="link_submenu">
                {

                    shop__skin_Care.map(item=>(
                        <motion.li key={item.path} whileHover={{scale:1.2}}>
                            <NavLink to={item.path} className="dropDownItem">
                                {item.display}
                            </NavLink>
                        </motion.li>
                     )                        
                    )
                }
            </ul>
        </div>
        <div className="skin_care_drop">
            <h3>MAKE UP</h3>
            <ul className="link_submenu">
                {

                    shop__make_up.map(item=>(
                        <motion.li key={item.path} whileHover={{scale:1.2}}>
                            <NavLink to={item.path} className="dropDownItem">
                                {item.display}
                            </NavLink>
                        </motion.li>
                     )                        
                    )
                }
            </ul>
        </div>
        <div className="skin_care_drop">
            <h3>BODY & HAIR</h3>
            <ul className="link_submenu">
                {

                    shop__Body.map(item=>(
                        <motion.li key={item.path} whileHover={{scale:1.2}}>
                            <NavLink to={item.path} className="dropDownItem" >
                                {item.display}
                            </NavLink>
                        </motion.li>
                     )                        
                    )
                }
            </ul>
        </div>
        <div className="skin_care_drop">
            <h3>INTERNAL BODY</h3>
            <ul className="link_submenu">
                {

                    shop__internal.map(item=>(
                        <motion.li key={item.path} whileHover={{scale:1.2}}>
                            <NavLink to={item.path} className="dropDownItem">
                                {item.display}
                            </NavLink>
                        </motion.li>
                     )                        
                    )
                }
            </ul>
        </div>
    </div>
  )
}

export default Dropdown