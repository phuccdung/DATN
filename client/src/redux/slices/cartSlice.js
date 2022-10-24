import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cartItems: [],
    totalAmount: 0,
    totalQuantity:0
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart:(state)=>{
        state.totalAmount=0;
        state.totalQuantity=0;
        state.cartItems=[];
    },
    addItem:(state,action) => {
        const newItem=action.payload.item;
        const addQty=action.payload.qty;
        const existingItem=state.cartItems.find(item => item.id===newItem.id);
        state.totalQuantity=Number(state.totalQuantity)+Number(addQty);
        if(!existingItem){
            state.cartItems.push({
                id: newItem.id,
                productName:newItem.productName,
                imgUrl:newItem.imgUrl,
                price:newItem.price,
                quantity:addQty,
                totalPrice:newItem.price,
            })  
        }else{
            existingItem.quantity=Number(existingItem.quantity)+Number(addQty);
            existingItem.totalPrice=Number(existingItem.totalPrice)+Number(newItem.price)*Number(addQty);
        }
        state.totalAmount=state.cartItems.reduce((total,item)=>total+Number(item.price)*Number(item.quantity),0)

    },

    deleteItem:(state,action)=>{
        const id=action.payload;
        const existingItem=state.cartItems.find(item=> item.id===id);

        if(existingItem){
            state.cartItems=state.cartItems.filter(item=>item.id !==id);
            state.totalQuantity=state.totalQuantity-existingItem.quantity;
        }
        state.totalAmount=state.cartItems.reduce((total,item)=>total+Number(item.price)*Number(item.quantity),0)

    },
    updateCart:(state,action)=>{
        state.cartItems=action.payload;
        state.totalAmount=action.payload.reduce((total,item)=>total+Number(item.price)*Number(item.quantity),0)
        state.totalQuantity=action.payload.reduce((total,item)=>total+Number(item.quantity),0)
    }

  }
});

export const cartActions = cartSlice.actions

export default cartSlice.reducer