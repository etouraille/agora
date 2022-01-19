import { createSlice } from "@reduxjs/toolkit";

const initialState = { toggle : false };

export const toggleAmendSlice = createSlice({
    name : 'toggleAmend',
    initialState,
    reducers : {
        toggleAmend : ( state , action ) => {
            if(action.payload.from  === 'context-menu') state.toggle = !state.toggle;
        }
    }
});
export default toggleAmendSlice.reducer
export const { toggleAmend  } = toggleAmendSlice.actions

