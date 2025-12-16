import { createSelector, createSlice } from "@reduxjs/toolkit";


const initialState = [
    {
        id:'electronics',
        title:'Title electronics'
    },
    {
        id:'fashion',
        title:'Title fashion'
    },
    {
        id:'home-living',
        title:'Title home-living'
    },
    {
        id:'groceries',
        title:'Title groceries'
    },
    {
        id:'beauty',
        title:'Title beauty'
    },
    {
        id:'Sports',
        title:'Title Sports'
    },
];

const categorySlice = createSlice({
    name:'categorySlice',
    initialState,
    reducers:{
        test:()=>console.log('test')
    }
}) 

export const categorySelector = createSelector([(store)=>store.category],(category)=>category);
export default categorySlice.reducer;