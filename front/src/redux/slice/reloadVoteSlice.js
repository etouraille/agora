import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const reloadVoteSlice = createSlice({
    name : 'reloadVote',
    initialState,
    reducers : {
        initReloadVote : (state, action ) => {
            let index = state.findIndex( elem => elem.id === action.payload.id );
            if( index < 0 ) {
                state.push({ id : action.payload.id , reload : false });
            }
        },
        reloadVote : ( state , action ) => {
            let index  = state.findIndex( elem => elem.id === action.payload.id );
            if( index < 0 ) {
                state.push({ id : action.payload.id ,reload : true })
            } else {
                state[index].reload = !state[index].reload;
            }
        }

    }
});
export default reloadVoteSlice.reducer
export const { initReloadVote, reloadVote  } = reloadVoteSlice.actions

