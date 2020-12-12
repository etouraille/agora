import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const editMenuSlice = createSlice({
    name : 'editMenu',
    initialState,
    reducers : {
        add : ( state, action ) => {
            state.push({ id : action.payload.id , display : false});
        },
        toggle : ( state, action) => {
            state.forEach((elem, index) => {
                state[index].display = false;
                if(elem.id === action.payload.id ) {
                    state[index].display = true;
                }
            })
        },
        init : ( state , action ) => {
            state = [];
        }
    }
});
export default editMenuSlice.reducer
export const { add , toggle, init } = editMenuSlice.actions

