import { createSlice } from "@reduxjs/toolkit";

const initialState = { click : 0 };

export const clickSlice = createSlice({
    name : 'click',
    initialState,
    reducers : {
        add: ( state , action ) => {
            state.click ++;
        }
    }
});
export default clickSlice.reducer
export const { add } =  clickSlice.actions
