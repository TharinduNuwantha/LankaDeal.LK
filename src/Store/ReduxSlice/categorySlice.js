import { createSelector, createSlice } from "@reduxjs/toolkit";


const initialState = [
    {
        dataList:[]
    }
];

const categorySlice = createSlice({
    name:'categorySlice',
    initialState,
    reducers:{
        test:()=>console.log('test'),
        addData:(state,action)=>{
            state.dataList=action.payload
        }
    }
}) 
export const { addData } = categorySlice.actions;
export const categorySelector = createSelector([(store)=>store.category],(category)=>category);
export default categorySlice.reducer;