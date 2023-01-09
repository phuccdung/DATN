import React,{ useState,useEffect }  from 'react';
import "./ImportPage.css";
import { motion } from 'framer-motion';
import {NotificationManager} from 'react-notifications';
import { Container,Row,Col } from 'reactstrap';
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection.jsx";
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import {useSelector} from "react-redux";
import {createProduct} from "../../redux/apiCall";
import {selectCurrentUser} from "../../redux/slices/userSlice";
import {createDownLoadData} from "./DownloadFile.jsx";
import * as XLSX from "xlsx";

function ImportPage() {
    const currentUser=useSelector(selectCurrentUser);
    const [file,setFile]=useState("");
    const [products,setProducts]=useState([]);

    const handleFile=async(e)=>{
        const f=e.target.files[0];
       setFile(f.name);
      let extension = f.name.match(/(?<=\.)\w+$/g)[0].toLowerCase();
      if(extension==="xlsx"){
        const reader = new FileReader();
        reader.onload = (e) => { // evt = on_file_select event
        /* Parse data */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, {type:'binary'});
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, {header:"A"});
        const sliceData = data.slice(1);
        /* Update state */
        let productsList=[];

        sliceData.forEach(item=>{
            if(typeof item.B==="number"&&typeof item.B==="number"&&item.A!==""){
                let body={
                    title:item.A,
                    price:item.B,
                    desc:item.C,
                    category:item.E,
                    img:item.F,
                    stock:item.D,
                    "userId":currentUser.id 
                }
                productsList.push(body);
            }
        })
        setProducts(productsList);
        };
        reader.readAsBinaryString(f);

      }else{
        NotificationManager.error("Please enter the file with the format .xlsx ", "Error", 3000);
      }
    }

    const createNewProduct=async(body)=>{
      
      const res=await createProduct(currentUser,body);
      if(res?.message){
          NotificationManager.success( res.success,'Success message', 3000);
          
      }else{
          NotificationManager.error( body.title,"Error", 3000);
          
      }

      
  } 
    const createProducts=async()=>{
      products.forEach(item=>{
        createNewProduct(item)
      });
      setFile("");
      setProducts([]);
    }
    const deleteItem=(index)=>{
      let arr=[...products];
      arr.splice(index,1);
      setProducts(arr);
    }
  return (
    <Helmet title="Import Products" >
        <CommonSectionfrom title='Import Products'/> 
        <div className="containerProfile">
            <Sidebar num={3}/>
            <div className="productList">
              <section>
                <Container>
                  <Row>
                    <Col lg="6" md="3">
                        <button  className='btn__download btn_in_importPage' onClick={()=>createDownLoadData()}>
                            DowLoad example file
                        </button>
                        <input className="custom-file-input" type="file" onChange={(e)=>handleFile(e)} />
                    </Col>
                    <Col lg="3" md="3">
                        <div className="search__box">
                         <input type="text" disabled value={file}/>
                        </div>
                        
                    </Col>
                    {
                      products.length>0?
                      <Col lg="3" md="3">
                          <button className='btn__import btn_in_importPage' onClick={()=>createProducts()}>
                            Import
                          </button>   
                      </Col>
                      :
                      null
                    }
                    
                  </Row>
                </Container>
              </section>

              <section>
                <Container>
                  <Row>
                    <Col lg='12'>
                      {
                        products.length===0?
                        ( <h2 className='fs-4 text-center'>No item </h2>)
                        :
                        (
                          <table className="table bordered">
                            <thead>
                              <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>stock</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                products.map((item,index)=>(
                                  <tr key={index}>
                                    <td>
                                      <img src={item.img} alt="" />
                                    </td>
                                    <td >
                                      <div className="over__title">
                                      {item.title}
                                      </div>
                                    </td>
                                    <td>{item.category}</td>
                                    <td>${item.price}</td>
                                    <td>{item.stock}</td>
                                    <td>
                                      <div  key={index}>
                                        <motion.i  whileHover={{scale:2}} class="ri-delete-bin-6-line" onClick={()=>deleteItem(index)}></motion.i>
                                      </div>
                                    </td>
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

export default ImportPage