import { createSelector, createSlice } from "@reduxjs/toolkit";


const initialState = {
    user:{
        name:"default"
    }
};

const userSlice = createSlice({
    name:'userClise',
    initialState,
    reducers:{
        addUser:(state,action)=>{
            state.user = action.payload;
        },
        removeUser:(state,action)=>{
            state.user = action.payload
        }
    }
})

export const {addUser,removeUser} = userSlice.actions;
export const userSelecter = createSelector([(store)=>store.user.user],(user)=>user)
export default userSlice.reducer