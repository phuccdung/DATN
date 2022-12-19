import React ,{useEffect,useState}from 'react';
import "./Analytic.css";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection";
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Container,Row,Col } from 'reactstrap';
import Chart from "../../components/UI/Chart/Chart";
import Moment from 'moment';

import {useSelector} from "react-redux";
import { selectCurrentUser } from '../../redux/slices/userSlice';
import { incomeIdVendor,countOrderVendor } from '../../redux/apiCall';

const Analytics = () => {
    const currentUser=useSelector(selectCurrentUser);
    const [fromDate,setFromDate]=useState(Moment().startOf('month').format("YYYY-MM-DD"));
    const [toDate,setToDate]=useState(Moment().endOf('day').format("YYYY-MM-DD"));

    const [data,setData]=useState();
    const [dataLink,setDataLink]=useState();

    const [orderAnalytic,setOrderAnalytic]=useState([])
    useEffect(()=>{
      const getData=async()=>{
        const res=await incomeIdVendor(currentUser,fromDate);
        if(res?.message){
          setData(res?.data[0]);
          setDataLink(res?.dataLink[0]);
        }
        const res2=await countOrderVendor(currentUser,fromDate,toDate); 
        if(res2?.message){
          let arr=[];
          res2.data.forEach((item)=>{
            let totalLink=res2.dataLink.filter((i)=>{return i._id===item._id.productId});
            if(totalLink.length>0){
              arr.push({ name: item._id.productId, "Total Sales": item.total,"Sale By Link": totalLink[0].total,"Title":item._id.productName})
            }else{
              arr.push({ name: item._id.productId, "Total Sales": item.total,"Sale By Link": 0,"Title":item._id.productName})
            }

          })
          setOrderAnalytic(arr);
        } 
      }
      getData();
    },[])
    
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
                          <div className="analytic_card_3">
                            <h3>Total Order</h3>
                            <span> {data?.quantity}</span>
                          </div>
                          <div className="analytic_card_3">
                          <h3>Revenue</h3>
                            <span>{(Number(data?.number)+Number(data?.dis)).toFixed(0)} $</span>
                          </div>
                          <div className="analytic_card_3">
                            <h3> Sales By Link</h3>
                            <span>{Number(dataLink?.total).toFixed(0)} $</span>
                          </div>
                          
                        </div>
                      </Col>

                      
                    </Row>
                  </Container>
                </section>
                <section>
                  <Container>
                    <Row>
                      <Col lg="3" md="3">
                        <div className="search__box">
                          <input
                            type="date"
                            value={fromDate}
                            onChange={e=>setFromDate(e.currentTarget.value)}
                          />
                          <input
                            type="date"
                            value={toDate}
                            onChange={e=>setToDate(e.currentTarget.value)}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>                    
                      <Col lg="12" md="3">
                        <Chart data={orderAnalytic} title="Product Analytics"  dataKey="Total Sales" grid />
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