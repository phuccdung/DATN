import React ,{ useState,useEffect } from 'react';
import "./Profile.css";
import CommonSectionfrom  from "../../components/UI/CommonSection/CommonSection.jsx";
import Moment from 'moment';
import Helmet from "../../components/Helmet/Helmet";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import {useSelector} from "react-redux";
import { getUserById ,updateUserById} from "../../redux/apiCall";
import {selectCurrentUser} from "../../redux/slices/userSlice"
import user_icon from "../../assets/images/user-icon.png";
import { NotificationManager} from 'react-notifications';
import {  storage } from "../../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


function Profile() {
    const currentUser=useSelector(selectCurrentUser);
    const [data,setData]=useState({});
    const [file,setFile] = useState(null)
    useEffect(()=>{
        const getInfo=async()=>{
            const res= await getUserById(currentUser);
            setData(res);
        }
        getInfo();
    },[])
    const handleChange=(e)=>{
        setData(prev=>{
          return {...prev,[e.target.name]:e.target.value};
        });
      }
   
    
    const handleClick = (e) => {
        e.preventDefault();
            let body={
                "name":data.name,
                "phone":data.phone,
                "birthday":Moment(data.birthday).format("YYYY-MM-DD"),
                "address":data.address,
                "userId":currentUser.id,
                "gender":data.gender,
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
          const res= await updateUserById(body,currentUser);
          console.log(res);
          if(res.message){
            NotificationManager.success( "User has been update...",'Success message', 3000);
            setData(res.data);
            setFile(null);
    
          }else{
            NotificationManager.error( "Error",'Success message', 3000); 
          }
        }catch(err){
          NotificationManager.error( "Error",'Success message', 3000);
        }
      };

  return (
    <Helmet title="Profile" >
        <CommonSectionfrom title='My Information'/>
        <div className="containerProfile">
            <Sidebar num={1}/>
            <div className="user">
                <div className="userTitleContainer">
                    <div className="userTitle">User Information</div>
                    {/* <button className="userChangePassword">Become Vendor</button> */}
                </div>
                <div className="userContainer">
                    <div className="userShow">
                        <div className="userShowTop">
                            <img
                                className="userShowImg" 
                                src={data.img||user_icon} alt="" />  
                            <div className="userShowTopTitle">
                                <div className="userShowUsername">{data.name}</div>
                                <div className="userShowTypeCustomer">{Number(data.chip).toFixed(1)} Chip</div>
                            </div>
                        </div>
                        
                    </div>
                    <form action="" className="userForm">
                        <div className="userItem">
                            <label>Email</label>
                            <input type="email" disabled value={data.username} placeholder="Email" />
                        </div>
                        <div className="InputAvata">
                            <label>Avatar</label>
                            <input type="file" id="file"  onChange={e=>setFile(e.target.files[0])}/>
                        </div>
                        <div className="userItem">
                            <label>Full Name</label>
                            <input name="name" type="text" onChange={handleChange} value={data.name} placeholder="Tan Phuc" />
                        </div>
                        {/* <div className="userItem">
                            <label>New password</label>
                            <input type="password" placeholder="Tan Phuc" />
                        </div> */}
                        <div className="userItem">
                            <label>Birthday</label>
                            <input type="date" onChange={handleChange}  name="birthday" value={data.birthday}  placeholder="+08373516" />
                        </div>
                        <div className="userItem">
                            <label>Phone</label>
                            <input type="number" onChange={handleChange} name="phone" value={data.phone}  placeholder="+08373516" />
                        </div>
                        <div className="userItem">
                            <label>Address</label>
                            <input type="text" name="address" onChange={handleChange} value={data.address} placeholder="30,Đặng Văn Bi,Thủ Đức,Hồ Chí Minh" />
                        </div>
                        <div className="userItem">
                            <label>Gender</label>
                            <div className="userGender">
                                <input type="radio" name="gender" onChange={handleChange} checked={data.gender==="male"} id="male" value="male"/>
                                <label for="male">Male</label>
                                <input type="radio" name="gender"  onChange={handleChange}checked={data.gender==="female"} id="female" value="female"/>
                                <label for="female">Female</label>
                            </div>
                        </div>
                        <button onClick={handleClick} className="updateUser">Update</button>
                    </form>
                </div>
            </div>
        </div>
    </Helmet>
  )
}

export default Profile