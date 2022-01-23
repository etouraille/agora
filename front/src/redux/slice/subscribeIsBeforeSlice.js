import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
export const subscribeIsBeforeSlice = createSlice({
    name : 'subscribeIsBefore',
    initialState,
    reducers : {
        addSubscribeIsBefore : ( state, action ) => {
            let index = state.findIndex( elem => elem.id === action.payload.id);
            if( index >= 0 ) {
                state[index].subscribeIsBefore = action.payload.subscribeIsBefore;
            } else {
                state.push({ id: action.payload.id , subscribeIsBefore: action.payload.subscribeIsBefore})
            }
        }

    }
});
export default subscribeIsBeforeSlice.reducer
export const { addSubscribeIsBefore } = subscribeIsBeforeSlice.actions

