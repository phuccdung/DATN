import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    actions: [],
}

const behaviorSlice = createSlice({
  name: 'behavior',
  initialState,
  reducers: {
    resetBehavior:(state)=>{
        state.actions=[];
    },
    addAction:(state,action) => {
        const newBehavior =action.payload;
        console.log("vao");
        const existingItem=state.actions.find(item => item.find===newBehavior.find);
        if(!existingItem){
          state.actions.push(newBehavior);
          console.log("duoc1");
        }else{
          const different=newBehavior.date-existingItem.date;
          if(different>6000){
            existingItem.count++;
            existingItem.date=newBehavior.date;
            console.log("duoc+");
          }
        }
    },
  }
});

export const behaviorActions = behaviorSlice.actions

export default behaviorSlice.reducer