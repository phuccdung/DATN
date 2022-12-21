import React,{useState,useRef,useEffect} from 'react';
import "./ShopProductDetail.css";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection";
import {NotificationManager} from 'react-notifications';
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar";
import Chart from "../../components/UI/Chart/Chart";
import {useSelector} from "react-redux";
import {getProductById,updateProductById ,analyticsProductId} from "../../redux/apiCall";
import {selectCurrentUser} from "../../redux/slices/userSlice";
import {Link, useParams } from 'react-router-dom';
import {  storage } from "../../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


function ShopProductDetail() {
    const currentUser=useSelector(selectCurrentUser);
    const [data,setData]=useState({});
    const {id}=useParams();
    const [file,setFile]=useState(null);
    const [orderStats, setOrderStats] = useState([]);
    useEffect(()=>{
        let month=[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
        const getData=async()=>{
            const res =await getProductById(id,"");
            if(res?.message){
                setData(res.data);
            }
            const res2=await analyticsProductId(currentUser,id); 
            console.log(res2);
            let i=0;
            if(res2?.message){
                
                let arr=[];
                res2.data.forEach(item=>{
                    if(item._id===res2.dataLink[i]?._id){
                        arr.push({name: month[item._id - 1], "Total Sales": item.total,"Sale By Link": res2.dataLink[i]?.total});
                        i=i+1;
                    }else{
                        arr.push({ name: month[item._id - 1], "Total Sales": item.total,"Sale By Link": 0 });
                    }
                })
                setOrderStats(arr);
            }
        }
        getData();
    },[])
    const handleChange=(e)=>{
        setData(prev=>{
          return {...prev,[e.target.name]:e.target.value};
        });
      } 

    const updateProduct=async(body)=>{
        console.log(body);
        const res=await updateProductById(currentUser,body,id);
        if(res.message){
            NotificationManager.success( "Product has been update...",'Success message', 3000);
            setData(res.data); 
            setFile(null);
        }else{
            NotificationManager.error( "Error", 3000);
        }
    }  
    const handleClick=(e)=>{
    e.preventDefault();
    if(file)
    {
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
               let body = { ...data, img: downloadURL,userIdChange:currentUser.id };
               updateProduct(body);
            });
            }
        );
    }else{
        updateProduct({...data,userIdChange:currentUser.id})
    }
    }
  return (
    <Helmet title="Shop Product Detail" >
        <CommonSectionfrom title='Shop Products'/>
        <div className="containerProfile">
            <Sidebar num={3}/>
            <div className="productDetail">
                <div className="top__productDetail">
                    <h1> Product Detail</h1>
                    <button className="create__new_product">
                        <Link to='/newproduct'>
                            Create Product
                        </Link>
                    </button>    
                </div> 
                <div className="chart_product_detail">
                <Chart data={orderStats} dataKey="Total Sales" title="Sales Performance"/>
                </div>            
                <div className="product__container">
                    <div className="info__newProductForm">
                        <form  className="newProductForm">
                            <div className="newProductItem">
                                <label>Title</label>
                                <input className='inputItem' name="title" type="text"  value={data.title} onChange={handleChange}/>
                            </div>
                            <div className="newProductItem">
                                <label>Price</label>
                                <input className='inputItem' name='price' type="number" value={data.price} onChange={handleChange}/>
                                
                            </div>
                            <div className="newProductItem">
                                <label>Description</label>
                                <input className='inputItem' name="desc" type="text" value={data.desc} onChange={handleChange} />
                            </div>
                            <div className="newProductItem">
                                <label>In Stock</label>
                                <input className='inputItem' name='stock' type="number"  value={data.stock} onChange={handleChange}/>
                            </div>
                            <div className="newProductItem">
                                <label>Category</label>
                                <select className='newProductSelect' name="category" id="active" onChange={handleChange} >
                                    <option selected={data.category==="Skin Care"} value="Skin Care" >Skin Care</option>
                                    <option selected={data.category==="Make Up" } value="Make Up" >Make Up</option>
                                    <option selected={data.category==="Body&Hair"} value="Body&Hair" >Body&Hair</option>
                                    <option selected={data.category==="Internal Body"} value="Internal Body" >Internal Body</option>
                                </select>
                            </div>
                            <div className="newProductItem">
                                <label>Status</label>
                                <select className='newProductSelect' name="status" id="active" onChange={handleChange} >
                                    {
                                        (data.status==="waiting"||data.status==="cancel")?(
                                        <option value={data.status} >{data.status}</option>
                                        )
                                        :
                                        (   
                                            <>
                                            <option selected={data.status==="sale"} value="sale" >Sale</option>
                                            <option selected={data.status==="pause"} value="pause" >Pause</option>
                                            </>
                                        
                                        )
                                    }
                                </select>
                            </div>
                            <div className="newProductItem">
                                <label>Image</label>
                                <input className='inputItem' name="img" type="text" placeholder='URL image' value={data.img} onChange={handleChange} />
                                <input name="file" type="file" value={file} placeholder='URL image'onChange={e=>setFile(e.target.files[0])}/>
                            </div>
                        </form>
                        <button className="updateProduct" onClick={handleClick}> Update</button>
                    </div>
                    <div className="product__img">
                        <img src={data.img} alt="" />
                    </div>
                </div>
            </div>
        </div>
    </Helmet>
  )
}

export default ShopProductDetail