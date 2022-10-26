import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import axios from "axios";

const BASE_URL = "http://localhost:3500/";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(BASE_URL+"auth", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};

export const getProduct = async (status) => {
  try{
    const res=await axios.get(BASE_URL+"products");
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const getProductById = async (id) => {
  try{
    const res=await axios.get(BASE_URL+`products/${id}`);
    return res.data.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const updateProductById= async(id,body,user)=>{
  try{
    const res= await axios({
      method: 'put',
      url: BASE_URL+`products/${id}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
      data:body
      
    });
    return res;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const deleteProductById= async(id,user)=>{
  try{
    const res=await axios({
      method: 'delete',
      url: BASE_URL+`products/${id}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
      data: {
        userId:user.id,
      }
    });
    return res.data.success;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const getUser = async (status,user) => {
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+`users`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
      data: {
        userId:user.id,
      }
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}