import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const toggleDiffSlice = createSlice({
    name : 'toggleDiff',
    initialState,
    reducers : {
        initToggleDiff : (state, action ) => {
            let index = state.findIndex( elem => elem.id === action.payload.id );
            if( index < 0 ) {
                state.push({ id : action.payload.id , display : true });
            }
        },
        toggleDiff : ( state , action ) => {
            let index  = state.findIndex( elem => elem.id === action.payload.id );
            state[index].display = ! state[index].display;
        }

    }
});
export default toggleDiffSlice.reducer
export const { initToggleDiff, toggleDiff  } = toggleDiffSlice.actions

