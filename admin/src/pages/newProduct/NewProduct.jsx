import "./newProduct.css";
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {BASE_URL} from "../../requestMethods";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/userRedux";
import axios from "axios";
import { useState } from "react";
import {  storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


export default function NewProduct() {
  const admin=useSelector(selectCurrentUser);
  const [input,setInput]=useState({});
  const [file,setFile]=useState(null);

  const handleChange=(e)=>{
    setInput(prev=>{
      return {...prev,[e.target.name]:e.target.value};
    });
  }
  const createNewProduct =async (body) => {
    try{
      const res= await axios({
        method: 'post',
        url: BASE_URL+`products`,
        headers: { 
          Authorization: "Bearer " + admin.accessToken,
        }, 
        data: 
          body
        
      });
      if(res.data.message){
        NotificationManager.success( res.data.success,'Success message', 3000);
      }
    }catch(err){
      NotificationManager.error( "Error",'Success message', 3000);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if(input.userId &&input.title &&input.price &&input.category &&input.desc&&file ){
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
            const product = { ...input, img: downloadURL };
            console.log(product);
            createNewProduct(product);
          });
        }
      );
    }else{
      NotificationManager.error( 'Not enough information','Error message', 3000);
    }
    
  };
 
  return (
    <div className="newProduct">
      <NotificationContainer/>
      <h1 className="addProductTitle">New Product</h1>
      <form className="addProductForm">
      <div className="addProductItem">
          <label>Id of vendor</label>
          <input name="userId" type="text" placeholder="ID..." onChange={handleChange} />
        </div>  
        <div className="addProductItem">
          <label>Image</label>
          <input type="file" id="file"  onChange={e=>setFile(e.target.files[0])}/>
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input name="title" type="text" placeholder="Title of new product" onChange={handleChange}  />
        </div>
        <div className="addProductItem">
          <label>Category</label>
          <select name="category" id="active" onChange={handleChange} >
              <option value="" >choose</option>
              <option value="Skin Care" >Skin Care</option>
              <option value="Make Up" >Make Up</option>
              <option value="Body&Hair" >Body&Hair</option>
              <option value="Internal Body" >Internal Body</option>
          </select>
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input name="desc" type="text" placeholder="Description..." onChange={handleChange}  />
        </div>
        <div className="addProductItem">
          <label>Price</label>
          <input name="price" type="number" placeholder="Price" onChange={handleChange}  />
        </div>
        <div className="addProductItem">
          <label>In Stock</label>
          <input name="stock" type="number" placeholder="123" onChange={handleChange}  />
        </div>
        <div className="addProductItem">
          <label>Status</label>
          <select name="status" id="active" onChange={handleChange} >
              <option value="waiting" >Waiting</option>
              <option value="sale" >Sale</option>
              <option value="cancel" >Cancel</option>
              <option value="pause" >Pause</option>
          </select>
        </div>
        <button onClick={handleClick} className="addProductButton">Create</button>
      </form>
    </div>
  );
}
