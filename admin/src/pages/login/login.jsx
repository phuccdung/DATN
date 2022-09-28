import { useState } from "react";
import { useDispatch } from "react-redux";
import {login} from "../../redux/apiCall.js";
import "./login.css";

const Login=()=>{
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const dispatch=useDispatch();
    const handleClick=(e)=>{
        e.preventDefault();
        login(dispatch,{username,password});
    }
    return(
        <div>
            <form onSubmit={handleClick} className="login">
            <input type="text" className="input" placeholder="username" required onChange={e=>setUsername(e.target.value)}/>
            <input type="password"className="input" placeholder="password" required onChange={e=>setPassword(e.target.value)}/>
            <button type="submit" className="login-btn">Login</button>
            </form>
           
        </div>
    );
};

export default Login;