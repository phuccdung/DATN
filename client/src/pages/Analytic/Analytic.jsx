import React ,{useEffect,useState}from 'react';
import "./Analytic.css";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection";
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Container,Row,Col } from 'reactstrap';
import { motion } from 'framer-motion';

import {useSelector} from "react-redux";
import { selectCurrentUser } from '../../redux/slices/userSlice';
import { getLinkById } from '../../redux/apiCall';

const Analytics = () => {
    const currentUser=useSelector(selectCurrentUser);
    
    return (
      <Helmet title="Link">
          <CommonSectionfrom title='Analytic'/>
          <div className="containerAnalytic">
              <Sidebar num={6}/>
              <div className="analytic">
                 Analytic
              </div>
          </div>
      </Helmet>
    )
  }
  
  export default Analytics