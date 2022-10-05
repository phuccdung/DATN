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

export default function Product() {
    const admin=useSelector(selectCurrentUser);
    const location=useLocation();
    const productId=location.pathname.split("/")[2];
    const [product,setProduct]=useState({});
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
      },[])
  return (
    <div className="product">
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
                  <input type="text" placeholder={product.title} />
                  <label>Product Description</label>
                  <input type="text" placeholder={product.desc} />
                  <label>Price</label>
                  <input type="text" placeholder={product.price} />
                  <label>In Stock</label>
                  <input type="text" placeholder={product.stock} />
                  <label>Status</label>
                  <select name="active" id="active">
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
                      <input type="file" id="file" style={{display:"none"}} />
                  </div>
                  <button className="productButton">Update</button>
              </div>
          </form>
      </div>
    </div>
  );
}
