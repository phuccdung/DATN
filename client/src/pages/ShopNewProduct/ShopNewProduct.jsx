import React,{useState,useEffect} from 'react';
import "../ShopPoroductDetail/ShopProductDetail.css";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection";
import {NotificationManager} from 'react-notifications';
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar";
import {useSelector} from "react-redux";
import {createProduct } from "../../redux/apiCall";
import {selectCurrentUser} from "../../redux/slices/userSlice";
import {  storage } from "../../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


function ShopNewProduct() {
    const currentUser=useSelector(selectCurrentUser);
    const [data,setData]=useState({});
    const [file,setFile]=useState(null);
   
    const handleChange=(e)=>{
        setData(prev=>{
          return {...prev,[e.target.name]:e.target.value};
        });
      } 

    const createNewProduct=async(body)=>{
        body={...body,"userId":currentUser.id};
        const res=await createProduct(currentUser,body);
        console.log(res);

        setData({
            title:"",
            price:"",
            desc:"",
            category:"",
            img:"",
            stock:""
        });
    }  
    const handleClick=(e)=>{
    e.preventDefault();
        if(data.category){
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
                    let body = { ...data, img: downloadURL };
                    createNewProduct(body);
                    });
                    }
                );
            }else{
                if(data.img){
                    createNewProduct(data);
                }else{
                    NotificationManager.error( "Import Image for new product","Error", 3000);
                }
            }

        }else{
            NotificationManager.error( "Choose Category","Error", 3000);
        }
        
    }
  return (
    <Helmet title="Shop Product Detail" >
        <CommonSectionfrom title='Shop Products'/>
        <div className="containerProfile">
            <Sidebar num={3}/>
            <div className="productDetail">
                <div className="top__productDetail">
                    <h1>New Product </h1>    
                </div>             
                <div className="product__container">
                    <div className="info__newProductForm">
                        <form  className="newProductForm" onSubmit={handleClick}>
                            <div className="newProductItem">
                                <label>Title</label>
                                <input className='inputItem' required  name="title" type="text" placeholder='abcd...' value={data.title} onChange={handleChange}/>
                            </div>
                            <div className="newProductItem">
                                <label>Price</label>
                                <input className='inputItem' required name='price' type="number" placeholder='1234...' value={data.price} onChange={handleChange}/>
                                
                            </div>
                            <div className="newProductItem">
                                <label>Description</label>
                                <input className='inputItem' required name="desc" type="text" placeholder='abcd...'  value={data.desc} onChange={handleChange} />
                            </div>
                            <div className="newProductItem">
                                <label>In Stock</label>
                                <input className='inputItem' required name='stock' type="number" placeholder='1234...' value={data.stock}  onChange={handleChange}/>
                            </div>
                            <div className="newProductItem">
                                <label>Category</label>
                                <select className='newProductSelect'  name="category" id="active" onChange={handleChange} >
                                    <option selected={data.category===""} value="Skin Care" >-- Choose Category --</option>
                                    <option selected={data.category==="Skin Care"} value="Skin Care" >Skin Care</option>
                                    <option selected={data.category==="Make Up" } value="Make Up" >Make Up</option>
                                    <option selected={data.category==="Body&Hair"} value="Body&Hair" >Body&Hair</option>
                                    <option selected={data.category==="Internal Body"} value="Internal Body" >Internal Body</option>
                                </select>
                            </div>
                            <div className="newProductItem">
                                <label>Image</label>
                                <input className='inputItem' name="img" type="text" placeholder='URL image'value={data.img}  onChange={handleChange} />
                                <input  type="file"  placeholder='URL image'onChange={e=>setFile(e.target.files[0])}/>
                            </div>
                            <div className="newProductItem">

                            <button type='submit' className="updateProduct" > Create Product</button>
                            </div>
                        </form>
                    </div>
                    <div className="product__img">
                       
                    </div>
                </div>
            </div>
        </div>
    </Helmet>
  )
}

export default ShopNewProduct