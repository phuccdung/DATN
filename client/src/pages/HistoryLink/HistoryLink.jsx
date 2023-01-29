import React ,{useEffect,useState}from 'react';
import { useParams } from 'react-router-dom';
import Moment from 'moment';
import "./HistoryLink.css";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection.jsx";
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { Container,Row,Col } from 'reactstrap';

import {useSelector} from "react-redux";
import { selectCurrentUser } from '../../redux/slices/userSlice';
import { getHistoryLink } from '../../redux/apiCall';

const HistoryLink = () => {
  const currentUser=useSelector(selectCurrentUser);
  const [data,setData]=useState([]);
  const {id}=useParams();

  useEffect(()=>{
    const getData=async()=>{
      const res=await getHistoryLink(currentUser,id);
      console.log(res)
      if(res?.message){
        setData(res.data.history);
        console.log(res.data.history)
      }
    }
    getData();
  },[])
  return (
    <Helmet title="History">
        <CommonSectionfrom title='History Link'/>
        <div className="containerLink">
            <Sidebar num={5}/>
            <div className="link">
            <section>
              <Container>
                <Row>
                  <Col lg='12'>
                    {
                      data.length===0?
                      ( <h2 className='fs-4 text-center'>No row in history</h2>)
                      :
                      (
                        <table className="table bordered">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Order ID</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>Bonus</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              data.map((item,index)=>(
                                <tr key={index}>
                                  <td>{Moment(item.date).format('lll')}</td>
                                  <td>{item.orderId}</td>
                                  <td>{item.price}</td>
                                  <td>{item.quantity}</td>
                                  <td>{item.discount} %</td>
                                  <td>{Number(item.price*item.quantity*item.discount/100).toFixed(1)}</td>
                                 
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      )
                    }
                  </Col>
                </Row>
              </Container>
            </section>
            </div>
        </div>
    </Helmet>
  )
}

export default HistoryLink