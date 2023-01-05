import { useState } from "react";
import { useDispatch } from "react-redux";
import {login} from "../../redux/apiCall.js";
import {Redirect} from "react-router-dom";
import "./login.css";
import {selectCurrentUser}from "../../redux/userRedux"
import { useSelector } from "react-redux";

const Login=()=>{
    const [user,setUsername]=useState("");
    const [pwd,setPassword]=useState("");
    const admin=useSelector(selectCurrentUser);
    const dispatch=useDispatch();
    const handleClick=(e)=>{
        e.preventDefault();
        login(dispatch,{user,pwd});
    }
    
    return(
        <div className="form_login">
            {admin?.role.Admin&&(<Redirect to="/" ></Redirect>)}
            <form onSubmit={handleClick} className="login">
                <h1>Enter Your Account</h1>
            <input type="text" className="input" placeholder="username" required onChange={e=>setUsername(e.target.value)}/>
            <input type="password"className="input" placeholder="password" required onChange={e=>setPassword(e.target.value)}/>
            <button type="submit" className="login-btn">Login</button>
            </form>
           
        </div>
    );
};

export default Login;