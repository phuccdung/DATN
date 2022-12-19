import { loginFailure, loginStart, loginSuccess,logout } from "./slices/userSlice";
import { cartActions } from "./slices/cartSlice";
import { behaviorActions } from "./slices/behaviorSlice";

import axios from "axios";

const BASE_URL = "http://localhost:3500/";

export const addChipView= async(id)=>{
    await axios({
      method: 'post',
      url: BASE_URL+`links/view/${id}`,
    });
}
export const getLinkById= async(user,isVendor)=>{
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+`links/${user.id}?isVendor=${isVendor}`,
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
export const incomeIdVendor= async(user,date)=>{
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+`orders/income/${user.id}?date=${date}`,
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
export const countOrderVendor = async (user,fromDate,toDate)=>{
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+`orders/analysis/${user.id}?fromDate=${fromDate}&toDate=${toDate}`,
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

export const checkBehaviorLink= async(userId,productId,user)=>{
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+`behaviors?userId=${userId}&productId=${productId}`,
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

export const getProductHome= async(user)=>{
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+`products/home`, 
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const createLinks= async(body,user)=>{
  try{
    const res=await axios({
      method: 'post',
      url: BASE_URL+`links`,
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

export const getComment= async(id)=>{
  try{
    const res=await axios({
      method: 'get',
      url: BASE_URL+`comments/${id}`
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}
export const addComment= async(body,user)=>{
  try{
    const res=await axios({
      method: 'post',
      url: BASE_URL+`comments`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
      data: body
    });
    return res.data;
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
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const createProduct = async (user,body) => {
  try{
    const res= await axios({
      method: 'post',
      url: BASE_URL+`products`,
      headers: { 
        Authorization: "Bearer " + user.accessToken,
      }, 
      data: 
        body
      
    });
    return res.data;
  }catch(err){
    console.log(err);
    return null;
  }
}

export const updateProductById = async (user,body,productId) => {
  try{
    const res=await axios({
      method: 'put',
      url: BASE_URL+`products/${productId}`,
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

export const getProductsByUserId = async (user,status,category,key) => {
  try{
    let url=BASE_URL+`products/vendor/${user.id}?status=${status}&category=${category}`;
    if(key){
      url=BASE_URL+`products/vendor/${user.id}?key=${key}`
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
export const getOrderByNameOrderItem = async (user,status,search) => {
  try{
    let url=BASE_URL+`orders/searchKey/${user.id}?key=${search}`;
    if(status){
      url=BASE_URL+`orders/searchKey/${user.id}?key=${search}&status=${status}`;
    }else{
      url=BASE_URL+`orders/searchKey/${user.id}?key=${search}`;
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
export const getOrderByVendor = async (user,fromDate,toDate,status) => {
  try{
    let url=BASE_URL+`orders/vendor/${user.id}?fromDate=${fromDate}&toDate=${toDate}`;
    if(status){
      url=BASE_URL+`orders/vendor/${user.id}?fromDate=${fromDate}&toDate=${toDate}&status=${status}`;
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
export const getOrderByVendorWithKey = async (user,key) => {
  try{
    let url=BASE_URL+`orders/vendor/searchKey/${user.id}?key=${key}`;
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
export const getProductById=async (id,limit)=>{
  try{
    let url=BASE_URL+`products/${id}`;
    if(limit){
      url=BASE_URL+`products/${id}?limit=${limit}`
    }
    const res = await axios.get(url);
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
      // addBehaviorArrActions(dispatch,behavior,res.data)
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
  // dispatch(behaviorActions.resetBehavior());
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
  // dispatch(behaviorActions.resetBehavior());
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
        link:item?.link
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
          link:item?.link
        })
      }else{
        products[index].link=item?.link;
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
        "productName":item.productName,
        "link":item?.link
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

export const updateCart=async(cart,user,ele,action,obj)=>{
   let body=cart.map((item)=>{
    let i={
       "productId":item.id,
        "quantity":item.quantity,
        "price":item.price,
        "imgUrl":item.imgUrl,
        "productName":item.productName,
        "vendorId":item.vendorId,
        "link":item.link,
    }
    return i;
  })
  if(action==="remove"){
    if(obj){
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
