import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    actions: [],
    keywords:[],
}

const behaviorSlice = createSlice({
  name: 'behavior',
  initialState,
  reducers: {
    resetBehavior:(state)=>{
        state.actions=[];
    },
    reSetKeywords:(state)=>{
      state.keywords=[];
    },
    addAction:(state,action) => {
        const newBehavior =action.payload;
        const existingItem=state.actions.find(item => item.find===newBehavior.find);
        if(!existingItem){
          state.actions.push(newBehavior);
        }else{
          const different=newBehavior.date-existingItem.date;
          if(different>5000){
            existingItem.date=newBehavior.date;
            if(newBehavior.link!==""){
              existingItem.link=newBehavior.link;
            }
          }
        }
    },
    addKeyWords:(state,action)=>{
      const newKeyWords =action.payload;
      state.keywords.push(newKeyWords);
    }
  }
});

export const behaviorActions = behaviorSlice.actions

export default behaviorSlice.reducer