import React from 'react';
import "./HistoryLink.css";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection.jsx";
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { Container,Row,Col } from 'reactstrap';
import { motion } from 'framer-motion';

const HistoryLink = () => {
  return (
    <Helmet title="History">
        <CommonSectionfrom title='History Link'/>
        <div className="containerLink">
            <Sidebar num={5}/>
            <div className="link">
            <section>
              <Container>
                <Row>
                  
                </Row>
              </Container>
            </section>
            </div>
        </div>
    </Helmet>
  )
}

export default HistoryLink