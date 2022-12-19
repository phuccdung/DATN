import React ,{useEffect,useState}from 'react';
import "./Link.css";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection";
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Container,Row,Col } from 'reactstrap';
import { motion } from 'framer-motion';

import {useSelector} from "react-redux";
import { selectCurrentUser } from '../../redux/slices/userSlice';
import { getLinkById } from '../../redux/apiCall';

const Link = () => {
  const currentUser=useSelector(selectCurrentUser);
  const [data,setData]=useState([])
  useEffect(()=>{
    const getData=async()=>{
      const res=await getLinkById(currentUser,false);
      if(res?.message){
        setData(res.data);
      }
    }
    getData();
  },[])
  const copyLink=(index)=>{
    navigator.clipboard.writeText(`http://localhost:3000/shop/${data[index]._id}?${data[index].link}`)
  }
  return (
    <Helmet title="Link">
        <CommonSectionfrom title='My Link'/>
        <div className="containerLink">
            <Sidebar num={5}/>
            <div className="link">
            <section>
              <Container>
                <Row>
                  <Col lg='12'>
                    <div className="top_analytic">
                      <div className="analytic_card">
                        <h4>Links</h4>
                        <span> {data.length}</span>
                      </div>
                      <div className="analytic_card">
                      <h4>Sales</h4>
                        <span>{Array.isArray(data)? data?.reduce((sum,curr)=>sum+curr?.sold,0):0}</span>
                      </div>
                      <div className="analytic_card">
                        <h4>Views</h4>
                        <span>{Array.isArray(data)? data?.reduce((sum,curr)=>sum+curr?.view,0):0}</span>
                      </div>
                      <div className="analytic_card">
                        <h4>Total Chip</h4>
                        <span>{Array.isArray(data)?data?.reduce((sum,curr)=>sum+curr?.chip,0).toFixed(0):0} $</span>
                      </div>
                    </div>
                  </Col>

                  <Col lg='12'>
                    {
                      data.length===0?
                      ( <h2 className='fs-4 text-center'>No item added to the cart</h2>)
                      :
                      (
                        <table className="table bordered">
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Title</th>
                              <th>Sale</th>
                              <th>View</th>
                              <th className='Title_chip'>Total Chip</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            { Array.isArray(data)?
                              data?.map((item,index)=>(
                                <tr key={index}>
                                  
                                  <td>
                                    <img src={item.img} alt="" />
                                  </td>
                                  <td>{item.title}</td>
                                  <td>{item.sold}</td>
                                  <td>{item.view}</td>
                                  <td>{(item.chip).toFixed(0)}$</td>
                                  <td>
                                    <motion.button whileHover={{scale:1.5}} className='btn_copy' onClick={()=>copyLink(index)}>Copy</motion.button>
                                    {/* <motion.i onClick={()=>handleDelete(item.id,index)} whileHover={{scale:1.5}} class="ri-delete-bin-6-line"></motion.i> */}
                                  </td>
                                </tr>
                              ))
                              :null
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

export default Link