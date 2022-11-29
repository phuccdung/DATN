import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@material-ui/icons";
import { Link,useLocation } from "react-router-dom";
import "./user.css";
import { NotificationManager} from 'react-notifications';
import Moment from 'moment';

import { useState,useEffect } from "react";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/userRedux";
import { getUserById } from "../../redux/apiCall";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {  storage } from "../../firebase";
import { updateUserById,analyticsBehaviorByUserId,toVendor,analyticsOrder } from "../../redux/apiCall";
import Chart from "../../components/chart/Chart";

export default function User() {
  const location=useLocation();
  const userId=location.pathname.split("/")[2];
  const admin=useSelector(selectCurrentUser);
  const [user,setUser]=useState({});
  const [file,setFile]=useState(null);
  const [actionDataStats,setActionDataStats]=useState([]);
  const [keyDataStats,setKeyDataStats]=useState([]);
  const [orderStats, setOrderStats] = useState([]);


  useEffect(()=>{
    const getProduct=async()=>{
      const res= await getUserById(userId,admin);
      setUser(res);
      console.log(res);
      if(res.roles?.Editor){
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
        const res2=await analyticsOrder(admin); 
        let i=0;
        res2.data.map((item) =>
        setOrderStats((prev) => {
          let arr=[];
          if(item._id===res2.dataLink[i]._id){
          arr= [...prev,{ name: month[item._id - 1], "Total Sales": item.total,"Sale By Link": res2.dataLink[i]?.total }];
          i=i+1;
          }else{
            arr= [...prev,{ name: month[item._id - 1], "Total Sales": item.total,"Sale By Link": 0 }];
          }
          return arr;
        })
        )
      }else{
        const analytics=await analyticsBehaviorByUserId(admin,userId);
        if(analytics?.message){
          let arr1= analytics.data.action.map((item) =>{
            return {name:item._id,"Active Product": item.total}
          });
          setActionDataStats(arr1);
          let arr2= analytics.data.search.map((item) =>{
            return {name:item._id,"Active KeyWord": item.total}
          });
          setKeyDataStats(arr2);
        }
      }
    }
    getProduct();
  },[]);
  
 

  const handleChange=(e)=>{
    setUser(prev=>{
      return {...prev,[e.target.name]:e.target.value};
    });
  } 
  const handleClick = (e) => {
    e.preventDefault();
    
        let body={
            "name":user.name,
            "phone":user.phone,
            "birthday":Moment(user.birthday).format("YYYY-MM-DD"),
            "address":user.address,
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
                     updateUser(body);
                  });
                }
              );
        }else{
          updateUser(body);
        } 
  };
  const updateUser =async (body) => {
    try{
      const res= await updateUserById(user._id,body,admin);
      console.log(res);
      if(res.message){
        NotificationManager.success( "User has been update...",'Success message', 3000);
        setUser(res.data);
        setFile(null);

      }else{
        NotificationManager.error( "Error",'Error message', 3000); 
      }
    }catch(err){
      NotificationManager.error( "Error",'Error message', 3000);
    }
  };
 const becomeVendor=async()=>{
  const res=await toVendor(user._id,admin);
  if(res){
    NotificationManager.success( "User has been update...",'Success message', 3000);
    setUser(prev=>{
      return {...prev,roles:{
        "Editor": 1984,
        "User": 2001
   }};
    });
  }else{
    NotificationManager.error( "Error",'Error message', 3000);
  }
 }
  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Profile User</h1>
        {
          user.roles?.Editor?
          null
          :
          <button className="userAddButton" onClick={()=>becomeVendor()}>Become Vendor</button>
          
        }
      </div>
      {
        user.roles?.Editor?
        (
          <>
            <div className="inputDateToSearch">
              
            </div>
            <div className="analyticsTop">
              <div className="chartLeft">
              <Chart data={orderStats} dataKey="Total Sales" title="Sales Performance"/>
              </div>
            </div>
          </>
        )
        :
        (
          <div className="analyticsTop">
            <div className="chartLeft">
            <Chart data={actionDataStats} title="Product Behavior Analytics" grid dataKey="Active Product"/>
            </div>
            <div className="chartLeft">
            <Chart data={keyDataStats} title="KeyWord Analytics" grid dataKey="Active KeyWord"/>
            </div>
          </div>
        )
      }
      
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src={user.img||"https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{user.name}</span>
              <span className="userShowUserTitle">{user.roles?.Editor?"Vendor":"Customer"}</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">{user._id}</span>
            </div>
            <div className="userShowInfo">
              <CalendarToday className="userShowIcon" />
              <span className="userShowInfoTitle">
                {Moment(user.birthday).format("DD/MM/YYYY")}
              </span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon" />
              <span className="userShowInfoTitle">{user.phone}</span>
            </div>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">{user.username}</span>
            </div>
            <div className="userShowInfo">
              <LocationSearching className="userShowIcon" />
              <span className="userShowInfoTitle">{user.address}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>User Id</label>
                <input
                  disabled
                  type="text"
                  value={user._id}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Full Name</label>
                <input
                  name="name"
                  type="text"
                  value={user.name}
                  className="userUpdateInput"
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  disabled
                  type="text"
                  value={user.username}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Birthday</label>
                <input
                  name="birthday"
                  type="date"
                  value={user.birthday}
                  className="userUpdateInput"
                  onChange={handleChange}
                  
                />
              </div>
              <div className="userUpdateItem">
                <label>Phone</label>
                <input
                  name="phone"
                  type="text"
                  value={user.phone}
                  className="userUpdateInput"
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Address</label>
                <input
                  name="address"
                  type="text"
                  value={user.address}
                  className="userUpdateInput"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src={user.img||"https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                  alt=""
                />
                <label htmlFor="file">
                  <Publish className="userUpdateIcon" />
                </label>
                <input type="file" id="file" style={{ display: "none" }} onChange={e=>setFile(e.target.files[0])}/>
              </div>
              <button className="userUpdateButton" onClick={handleClick}>Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
