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
import { updateUserById } from "../../redux/apiCall";


export default function User() {
  const location=useLocation();
  const userId=location.pathname.split("/")[2];
  const admin=useSelector(selectCurrentUser);
  const [user,setUser]=useState({});
  const [file,setFile]=useState(null);


  useEffect(()=>{
    const getProduct=async()=>{
      const res= await getUserById(userId,admin);
      setUser(res);
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
        NotificationManager.success( "Product has been update...",'Success message', 3000);
        setUser(res.data);
        setFile(null);

      }else{
        NotificationManager.error( "Error",'Success message', 3000); 
      }
    }catch(err){
      NotificationManager.error( "Error",'Success message', 3000);
    }
  };
 

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
        <Link to="/newUser">
          <button className="userAddButton">Create</button>
        </Link>
      </div>
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
