import { loginFailure, loginStart, loginSuccess,logout } from "./slices/userSlice";
import axios from "axios";

const BASE_URL = "http://localhost:3500/";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(BASE_URL+"auth", user);
    dispatch(loginSuccess(res.data));
    return true;
  } catch (err) {
    dispatch(loginFailure());
    return false;
  }
};

export const Register=async(user)=>{
  try{
    const res = await axios.post(BASE_URL+"register", user);
    return res.data
  }catch(err){
    console.log(err);
    return false;
  }
}

export const Logout=async(dispatch)=>{
  dispatch(logout());
}