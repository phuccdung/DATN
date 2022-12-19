import React ,{useEffect,useState}from 'react';
import "./Analytic.css";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection";
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Container,Row,Col } from 'reactstrap';

import {useSelector} from "react-redux";
import { selectCurrentUser } from '../../redux/slices/userSlice';
import { incomeIdVendor } from '../../redux/apiCall';

const Analytics = () => {
    const currentUser=useSelector(selectCurrentUser);
    const [data,setData]=useState([])
    useEffect(()=>{
      const getData=async()=>{
        const res=await incomeIdVendor(currentUser);
        console.log(res);
      }
      getData();
    })
    
    return (
      <Helmet title="Link">
          <CommonSectionfrom title='Analytic'/>
          <div className="containerAnalytic">
              <Sidebar num={6}/>
              <div className="analytic">
              <section>
              <Container>
                <Row>
                  <Col lg='12'>
                    <div className="top_analytic">
                      <div className="analytic_card">
                        <h4>Total Order</h4>
                        <span> 12</span>
                      </div>
                      <div className="analytic_card">
                      <h4>Revenue</h4>
                        <span>$20</span>
                      </div>
                      <div className="analytic_card">
                        <h4> Sales By Link</h4>
                        <span>$20</span>
                      </div>
                      
                    </div>
                  </Col>

                  
                </Row>
              </Container>
            </section>
              </div>
          </div>
      </Helmet>
    )
  }
  
  export default Analytics