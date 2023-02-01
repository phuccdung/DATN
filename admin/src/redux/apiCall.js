import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import axios from "axios";

// const BASE_URL = "http://api.multi-mart.shop:3500/";
const BASE_URL = "http://localhost:3500/";

export const income = async (user,date) => {
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+`orders/income?date=${date}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const getHistoryWithDate = async (user,fromDate,toDate) => {
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+`links?fromDate=${fromDate}&toDate=${toDate}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const addChipOrder = async (user,body) => {
  try{
    const res=await axios({
      method: 'put',
      url: BASE_URL+`links/order/${body.link}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
      data:body
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const login = async (dispatch, user) => {
  try {
    const res = await axios.post(BASE_URL+"auth", user);
    if(res?.data.role.Admin){
      dispatch(loginSuccess(res.data));
    }else{
      return false
    }
  } catch (err) {
    return false
  }
};

export const updateIsPay = async (user,orderId) => {
  try{
    const res=await axios({
      method: 'put',
      url: BASE_URL+`orders/order/${orderId}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const updateStatusOrderById = async (user,body,orderId) => {
  try{
    const res=await axios({
      method: 'put',
      url: BASE_URL+`orders/vendor/${orderId}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
      data:body
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}
export const getOrderByOrderId = async (user,orderId) => {
  try{
    const res= await axios({
      method: 'get',
      url: BASE_URL+`orders/order/${orderId}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
    });
    return res.data;
    // return true;
  }catch(err){
    console.log(err);
    return null;
  }
}


export const getOrder = async (user,fromDate,toDate,limit) => {
  // console.log(limit);
  try{
    const res= await axios({
      method: 'get',
      url: BASE_URL+`orders/order?fromDate=${fromDate}&toDate=${toDate}&limit=${limit}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
    });
    return res.data;
    // return true;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const getProduct = async (key) => {
  try{
    const res=await axios.get(BASE_URL+`products?key=${key}`);
    return res.data;
    // return key;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const toVendor = async (id,user) => {
  try{
    const res= await axios({
      method: 'put',
      url: BASE_URL+`users/admin/ToVendor/${id}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
    });
    return res;
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
export const getUserById = async (userId,user) => {
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+`users/${userId}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const updateUserById = async (userId,body,user) => {
  try{
    const res=await axios({
      method: 'put',
      url: BASE_URL+`users/${userId}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
      data:body
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const analyticsOrder = async (user,productId)=>{
  try{
    let url=BASE_URL+"orders";
    if(productId) url=BASE_URL+`orders?productId=${productId}`;
    const res=await axios({
      method: 'get',
      url: url,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}
export const countOrderVendor = async (user,id,fromDate,toDate)=>{
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+`orders/analysis/${id}?fromDate=${fromDate}&toDate=${toDate}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const analyticsUser = async (user)=>{
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+"users/countVendorStart",
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const analyticsFind = async (user,day,status)=>{
  try{
    let url;
    if(status){
      url=BASE_URL+`behaviors/${day}?status=${status}`;
    }else{
      url=BASE_URL+`behaviors/${day}`
    }
    const res=await axios({
      method: 'get',
      url: url,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const analyticsKey = async (user,day,type)=>{
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+`behaviors/key/${day}?type=${type}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const analyticsBehaviorByUserId = async (user,userId)=>{
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+`behaviors/user/${userId}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}