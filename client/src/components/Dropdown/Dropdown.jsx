import React from 'react';
import "./Dropdown.css";
import {NavLink} from "react-router-dom";

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

function Dropdown() {
  return (
    <div className='dropDown_content'>
        <div className="skin_care_drop">
            <h3>Shin Care</h3>
            <ul className="link_submenu">
                {

                    shop__skin_Care.map(item=>(
                        <li key={item.path}>
                            <NavLink to={item.path} className="dropDownItem">
                                {item.display}
                            </NavLink>
                        </li>
                     )                        
                    )
                }
            </ul>
        </div>
        <div className="skin_care_drop">
            <h3>Make Up</h3>
            <ul className="link_submenu">
                {

                    shop__make_up.map(item=>(
                        <li key={item.path}>
                            <NavLink to={item.path} className="dropDownItem">
                                {item.display}
                            </NavLink>
                        </li>
                     )                        
                    )
                }
            </ul>
        </div>
    </div>
  )
}

export default Dropdown