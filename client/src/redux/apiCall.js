import { loginFailure, loginStart, loginSuccess,logout } from "./slices/userSlice";
import { cartActions } from "./slices/cartSlice";
import { behaviorActions } from "./slices/behaviorSlice";

import axios from "axios";

const BASE_URL = "http://localhost:3500/";


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
        quantity:item.quantity,
        totalPrice:item.price*item.quantity,
      }
        return i;
    });
    cart.forEach((item,index)=>{
      let existingItem=products.find(product=>product.productId===item.id);
      if(!existingItem){
        products.push({
          id: item.id,
          productName:item.productName,
          imgUrl:item.imgUrl,
          price:item.price,
          quantity:item.quantity,
          totalPrice:item.price*item.quantity,
        })
      }else{
        cart[index].price=Number(item.price);
        cart[index].imgUrl=item.imgUrl;
        cart[index].productName=item.productName;
        cart[index].quantity=Number(existingItem.quantity)+Number(item.quantity);
        cart[index].totalPrice=Number(existingItem.totalPrice)+Number(item.quantity)*Number(item.price);
      }
    })  
    dispatch(cartActions.updateCart(products));

    const body=products.map((item)=>{
      let i={
        "productId":item.id,
        "quantity":item.quantity,
        "price":item.price,
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
        "productName":item.productName
    }
    return i;
  })
  if(action==="remove"){
    body=body.filter(item=>item.productId!==ele.id);
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
  
  console.log(body);
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
  // console.log(cart);
}
