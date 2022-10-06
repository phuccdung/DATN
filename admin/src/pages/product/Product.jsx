import { Link,useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart"
import {productData} from "../../dummyData"
import { Publish } from "@material-ui/icons";
import { useState,useEffect } from "react";
import {BASE_URL} from "../../requestMethods";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/userRedux";
import axios from "axios";
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications'
import {  storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


export default function Product() {
    const admin=useSelector(selectCurrentUser);
    const location=useLocation();
    const productId=location.pathname.split("/")[2];
    const [product,setProduct]=useState({});
    const [file,setFile]=useState(null);
    useEffect(()=>{
        const getProduct=async()=>{
          try{
            const res=await axios.get(BASE_URL+`products/${productId}`);
            setProduct(res.data.data);
            // console.log(res.data)
          }catch(err){
            console.log(err);
          }
        }
        getProduct();
    },[]);
    const updateProduct =async (body) => {
        try{
          const res= await axios({
            method: 'put',
            url: BASE_URL+`products/${productId}`,
            headers: { 
              Authorization: "Bearer " + admin.accessToken,
            }, 
            data: 
              body
            
          });
          if(res.data.message){
            NotificationManager.success( "Product has been update...",'Success message', 3000);
            setProduct(res.data.data);
            setFile(null);

          }else{
            NotificationManager.error( "Error",'Success message', 3000); 
          }
        }catch(err){
          NotificationManager.error( "Error",'Success message', 3000);
        }
      };
    const handleChange=(e)=>{
        setProduct(prev=>{
          return {...prev,[e.target.name]:e.target.value};
        });
      } 
      const handleClick = (e) => {
        e.preventDefault();
        if( product.title &&product.price &&product.desc ){
            let body={
                title: product.title,
                price: product.price,
                desc: product.desc,
                status: product.status,
                category: product.category,
                stock: product.stock,
                userId:admin.id
            }
            if(file){
                  const name = new Date().getTime() + file.name;
                  const storageRef = ref(storage, name);
                  const uploadTask = uploadBytesResumable(storageRef, file);
                  uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                      const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      console.log("Upload is " + progress + "% done");
                      switch (snapshot.state) {
                        case "paused":
                          NotificationManager.info("Upload is paused");
                          break;
                        case "running":
                          NotificationManager.info("Upload is running");

                          break;
                        default:
                          break;
                      }
                    },
                    (error) => {
                      console.log(error);
                    },
                    () => {
                      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                         body = { ...body, img: downloadURL };
                        updateProduct(body);
                      });
                    }
                  );
            }else{
            updateProduct(body);
            } 
        }else{
          NotificationManager.error( 'Not enough information','Error message', 3000);
        }
        
      };

  return (
    <div className="product">
      <NotificationContainer/>
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        <Link to="/newproduct">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
          <div className="productTopLeft">
              <Chart data={productData} dataKey="Sales" title="Sales Performance"/>
          </div>
          <div className="productTopRight">
              <div className="productInfoTop">
                  <img src={product.img} alt="" className="productInfoImg" />
                  <span className="productName">{product.title}</span>
              </div>
              <div className="productInfoBottom">
                  <div className="productInfoItem">
                      <span className="productInfoKey">id:</span>
                      <span className="productInfoValue">  { product._id}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">sales:</span>
                      <span className="productInfoValue">{product.price}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">active:</span>
                      <span className="productInfoValue">{product.status}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">in stock:</span>
                      <span className="productInfoValue">{product.stock}</span>
                  </div>
              </div>
          </div>
      </div>
      <div className="productBottom">
          <form className="productForm">
              <div className="productFormLeft">
                  <label>Product Name</label>
                  <input name="title" type="text" value={product.title} onChange={handleChange} />
                  <label>Category</label>
                  <select name="category" id="active" onChange={handleChange} >
                    <option value="Skin Care"  selected={product.status === "Skin Care" }>Skin Care</option>
                    <option value="Make Up"  selected={product.status === "Make Up"}>Make Up</option>
                    <option value="Body&Hair"  selected={product.status === "Body&Hair"}>Body&Hair</option>
                    <option value="Internal Body" selected={product.status === "Internal Body"} >Internal Body</option>
                  </select>
                  <label>Product Description</label>
                  <input name="desc" type="text" value={product.desc} onChange={handleChange}/>
                  <label>Price</label>
                  <input type="text" value={product.price} onChange={handleChange}/>
                  <label>In Stock</label>
                  <input name="stock" type="text" value={product.stock} onChange={handleChange}/>
                  <label>Status</label>
                  <select  name="status" id="active" onChange={handleChange}>
                      <option value="waiting" selected={product.status === "waiting"}>Waiting</option>
                      <option value="sale" selected={product.status === "sale"}>Sale</option>
                      <option value="cancel" selected={product.status === "cancel"}>Cancel</option>
                      <option value="pause" selected={product.status === "pause"}>Pause</option>
                  </select>
              </div>
              <div className="productFormRight">
                  <div className="productUpload">
                      <img src={product.img} alt="" className="productUploadImg" />
                      <label for="file">
                          <Publish/>
                      </label>
                      <input type="file" id="file" style={{display:"none"}} onChange={e=>setFile(e.target.files[0])} />
                  </div>
                  <button onClick={handleClick} className="productButton">Update</button>
              </div>
          </form>
      </div>
    </div>
  );
}
