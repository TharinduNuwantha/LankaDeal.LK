import { createSelector, createSlice } from "@reduxjs/toolkit";


const initialState = {
    user:{
        name:"default",
        cart:[]
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
        },
        addToCart: (state, action) => {
            if (state.user && state.user.cart) {
                const existingIndex = state.user.cart.findIndex(
                    item => item.id === action.payload.id
                );
                
                if (existingIndex > -1) {
                    // Update quantity if item exists
                    state.user.cart[existingIndex].quantity += 1;
                } else {
                    // Add new item
                    state.user.cart.push(action.payload);
                }
            }
        }
 
    }
})

export const {addUser,removeUser,addToCart} = userSlice.actions;
export const userSelecter = createSelector([(store)=>store.user.user],(user)=>user)
export const isLoadingSelector = createSelector([(store)=>store.user.isLoading],(isLoading)=>isLoading)
export default userSlice.reducer