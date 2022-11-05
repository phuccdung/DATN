import { loginFailure, loginStart, loginSuccess,logout } from "./slices/userSlice";
import { cartActions } from "./slices/cartSlice";
import { behaviorActions } from "./slices/behaviorSlice";

import axios from "axios";

const BASE_URL = "http://localhost:3500/";


export const getMyOrderByUserId = async (user,status) => {
  try{
    let url;
    if(status){
      url=BASE_URL+`orders/${user.id}?status=${status}`;
    }else{
      url=BASE_URL+`orders/${user.id}`;
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
export const getOrderByNameOrderItem = async (user,search) => {
  try{
    let body
    const res=await axios({
      method: 'get',
      url: BASE_URL+`orders/searchKey/${user.id}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      },
      data:{
        key:search
      }
    });
    return res;
  }catch(err){
    console.log(err);
    return null;
  }
}
export const updateUserById = async (body,user) => {
  try{
    const res=await axios({
      method: 'put',
      url: BASE_URL+`users/${user.id}`,
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
export const getUserById = async (user) => {
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+`users/${user.id}`,
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
export const createOrder=async (body)=>{
  try{
    const res = await axios({
      method: 'post',
      url: BASE_URL+`orders`, 
      data:body
    }); 
    return res.data
  }catch(err){
    console.log(err);
    return false;
  }
}
export const getProductById=async (id)=>{
  try{
    const res = await axios.get(BASE_URL+`products/${id}?limit=4`);
    return res.data
  }catch(err){
    console.log(err);
    return false;
  }
}
export const getProduct=async (key)=>{
  try{
    let url;
    if(key){
      url=BASE_URL+`products?key=${key}`
    }else{
      url=BASE_URL+"products"
    }
    const res = await axios.get(url);
    return res.data
  }catch(err){
    console.log(err);
    return false;
  }
}

export const login = async (dispatch, user,cart,behavior) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(BASE_URL+"auth", user);
    if(res.data){
      // await axios.get(BASE_URL+"refresh");
      loginUpdateCart(dispatch,cart,res.data);
      addBehaviorArrActions(dispatch,behavior,res.data)
    }
    dispatch(loginSuccess(res.data));
    return true;
  } catch (err) {
    dispatch(loginFailure());
    return false;
  }
};

export const addBehaviorArrActions = async (dispatch,behavior,user) => {
  await axios({
    method: 'put',
    url: BASE_URL+`behaviors/addArr/${user.id}`,
    headers: { 
      Authorization: "Bearer " + user.accessToken,
    }, 
    data:{
      userId:user.id,
      arr:behavior.actions
    }
  }); 
  addBehaviorArrKey(behavior.keywords,user)
  dispatch(behaviorActions.resetBehavior());
}

export const addBehaviorArrKey = async (keywords,user) => {
  await axios({
    method: 'put',
    url: BASE_URL+`behaviors/addArrKeyWords/${user.id}`,
    headers: { 
      Authorization: "Bearer " + user.accessToken,
    }, 
    data:{
      userId:user.id,
      arr:keywords
    }
  }); 
}
export const addBehavior = async (behavior,user) => {
  await axios({
    method: 'put',
    url: BASE_URL+`behaviors/${user.id}`,
    headers: { 
      Authorization: "Bearer " + user.accessToken,
    }, 
    data:{
      userId:user.id,
      action:behavior
    }
  }); 
}

export const Register=async(user)=>{
  try{
    const res = await axios.post(BASE_URL+"register", user);
    return res.data.message
  }catch(err){
    console.log(err);
    return false;
  }
}

export const createCartAndBehavior=async(body)=>{
  try{
    await axios.post(BASE_URL+"carts", body);
    await axios.post(BASE_URL+"behaviors", body);
  }catch(err){
    console.log(err);
  }
}


export const Logout=async(dispatch)=>{
  dispatch(logout());
  dispatch(behaviorActions.reSetKeywords());
  dispatch(behaviorActions.resetBehavior());
}

export const loginUpdateCart=async(dispatch,cart,user)=>{
  const cartApi=await axios({
    method: 'get',
    url: BASE_URL+`carts/${user.id}`,
    headers: { 
      Authorization: "Bearer " + user.accessToken,
    }, 
  });
  if(cartApi.data.message){        
    let products =cartApi.data.data.products.map((item)=>{
      let i={
        id: item.productId,
        productName:item.productName,
        imgUrl:item.imgUrl,
        price:item.price,
        vendorId:item.vendorId,
        quantity:item.quantity,
        totalPrice:item.price*item.quantity,
      }
        return i;
    });
     cart.forEach((item,index)=>{
      let existingItem=products.find(product=>product.id===item.id);
      if(!existingItem){
        products.push({
          id: item.id,
          productName:item.productName,
          imgUrl:item.imgUrl,
          price:item.price,
          vendorId:item.vendorId,
          quantity:item.quantity,
          totalPrice:item.price*item.quantity,
        })
      }else{
        products[index].price=Number(item.price);
        products[index].imgUrl=item.imgUrl;
        products[index].productName=item.productName;
        products[index].quantity=Number(existingItem.quantity)+Number(item.quantity);
        products[index].totalPrice=Number(existingItem.totalPrice)+Number(item.quantity)*Number(item.price);
      }
    })  
    dispatch(cartActions.updateCart(products));

    const body=products.map((item)=>{
      let i={
        "productId":item.id,
        "quantity":item.quantity,
        "price":item.price,
        "vendorId":item.vendorId,
        "imgUrl":item.imgUrl,
        "productName":item.productName
      }
      return i;
    })
    await axios({
      method: 'put',
      url: BASE_URL+`carts/${user.id}`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
      data:{
        userId:user.id,
        products:body
      }
    });   
  }
}

export const updateCart=async(cart,user,ele,action)=>{
   let body=cart.map((item)=>{
    let i={
       "productId":item.id,
        "quantity":item.quantity,
        "price":item.price,
        "imgUrl":item.imgUrl,
        "productName":item.productName,
        "vendorId":item.vendorId,
    }
    return i;
  })
  if(action==="remove"){
    if(typeof ele=== "Object"){
      body=body.filter(item=>item.productId!==ele.id)
    }else{
      ele.forEach(it=>{
        body=body.filter(item=>item.productId!==it.productId);
      })
    }
    
  }else{
    let existingItem=body.find((product)=>product.productId===ele.productId);
    if(!existingItem){
      body.push(ele);
    }else{
      body.forEach((item,index)=>{
        if(item.productId===ele.productId){
          body[index].quantity=item.quantity+ele.quantity;
        }
      })
    }
  }
  axios({
    method: 'put',
    url: BASE_URL+`carts/${user.id}`,
    headers: { 
      Authorization: "Bearer " + user.accessToken,
    }, 
    data:{
      userId:user.id,
      products:body
    }
  });  
}
