import { createSlice } from "@reduxjs/toolkit";

const initialState = {data : []};

export const editMenuSlice = createSlice({
    name : 'editMenu',
    initialState,
    reducers : {
        add : ( state, action ) => {
            state.data.push({ id : action.payload.id , display : false});
        },
        toggle : ( state, action) => {
            state.data.forEach((elem, index) => {
                state.data[index].display = false;
                if(elem.id === action.payload.id ) {
                    state.data[index].display = true;
                }
            })
        },
        off : (state, action ) => {
            state.data.forEach((elem, index) => {
                state.data[index].display = false;
            })
        },
        init : ( state , action ) => {
            state.data = [];
        },
        initWith : ( state, action ) => {
            state.data = [];
            action.payload.data.forEach( index => {
                state.data.push({ id : index , display : false });
            })
        }
    }
});
export default editMenuSlice.reducer
export const { add , toggle, init, off , initWith } = editMenuSlice.actions

