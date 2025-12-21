import { createSelector, createSlice } from "@reduxjs/toolkit";


const initialState = {
    user:{
        name:"default"
    },
    isLoading: true
};

const userSlice = createSlice({
    name:'userClise',
    initialState,
    reducers:{
        addUser:(state,action)=>{
            state.user = action.payload;
            state.isLoading = false;
        },
        removeUser:(state,action)=>{
            state.user = action.payload;
            state.isLoading = false;
        }
    }
})

export const {addUser,removeUser} = userSlice.actions;
export const userSelecter = createSelector([(store)=>store.user.user],(user)=>user)
export const isLoadingSelector = createSelector([(store)=>store.user.isLoading],(isLoading)=>isLoading)
export default userSlice.reducer