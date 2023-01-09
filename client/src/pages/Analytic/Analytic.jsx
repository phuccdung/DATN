import React ,{useEffect,useState}from 'react';
import "./Analytic.css";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection.jsx";
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { Container,Row,Col } from 'reactstrap';
import Chart from "../../components/UI/Chart/Chart.jsx";
import Moment from 'moment';
import user_icon from "../../assets/images/user-icon.png"

import {useSelector} from "react-redux";
import { selectCurrentUser } from '../../redux/slices/userSlice';
import { incomeIdVendor,countOrderVendor,getLinkById } from '../../redux/apiCall';

const Analytics = () => {
    const currentUser=useSelector(selectCurrentUser);
    const [fromDate,setFromDate]=useState(Moment().startOf('month').format("YYYY-MM-DD"));
    const [toDate,setToDate]=useState(Moment().endOf('day').format("YYYY-MM-DD"));
    const [data,setData]=useState();
    const [dataLink,setDataLink]=useState();
    const [orderAnalytic,setOrderAnalytic]=useState([]);
    const [topAffi,setTopAffi]=useState([]);
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
        const res3=await getLinkById(currentUser,true);
        if(res3?.message){
          setTopAffi(res3.data);
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
                            <span> {data?.quantity?data?.quantity:0}</span>
                          </div>
                          <div className="analytic_card_3">
                          <h3>Revenue</h3>
                            <span>{data?.number? (Number(data?.number)+Number(data?.dis)).toFixed(0):0} $</span>
                          </div>
                          <div className="analytic_card_3">
                            <h3> Sales By Link</h3>
                            <span>{dataLink?.total? Number(dataLink?.total).toFixed(0):0} $</span>
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

                <section>
                  <Container>
                  <Row>
                      <Col lg='3' >
                        <h3 className=''>Top Affiliate</h3>
                      </Col>

                      
                    </Row>
                    <Row>
                      <Col lg='12'>
                        <table className='table_analytic' >
                          <thead>
                            <tr>
                              <th>User</th>
                              <th>Image</th>
                              <th >Title</th>
                              <th>Sold</th>
                              <th>View</th>
                              <th>Total Chip</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              topAffi.map((item,index)=>(
                                <tr key={index}>
                                  <td className='text_start '>
                                    <span className='text_user_analytic'> {item.username}</span>
                                  </td>
                                  <td>
                                    <img src={item.img} alt="" />
                                  </td>
                                  <td className='text_start '>
                                    <span >{item.title}</span>
                                  </td>
                                  <td>{item.sold}</td>
                                  <td>{item.view}</td>
                                  <td>{Number(item.chip).toFixed(1)} $</td>

                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
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