import { createSlice } from "@reduxjs/toolkit";

// Initial state as array of objects
const initialState = [
    {
        id: 'electronics',
        title: 'Electronics'
    },
    {
        id: 'fashion',
        title: 'Fashion'
    }
];

const categorySlice = createSlice({
    name: 'categorySlice',
    initialState,
    reducers: {
        test: () => console.log('test'),
        
        // Add new category
        addData: (state, action) => {
            state.push(action.payload); // ✅ Mutate array directly with Immer
        },
        
        // Remove category by id
        removeData: (state, action) => {
            return state.filter(item => item.id !== action.payload);
        },
        
        // Update category
        updateData: (state, action) => {
            const index = state.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        }
    }
});

export const { addData, removeData, updateData } = categorySlice.actions;
export const categorySelector = (state) => state.category;
export default categorySlice.reducer;