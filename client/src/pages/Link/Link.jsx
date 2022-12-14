import React from 'react';
import "./Link.css";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection";
import Moment from 'moment';
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar";
import {useSelector} from "react-redux";

const Link = () => {
  return (
    <Helmet title="Link">
        <CommonSectionfrom title='My Link'/>
        <div className="containerLink">
            <Sidebar num={5}/>
            <div className="link">
                link
            </div>
        </div>
    </Helmet>
  )
}

export default Link