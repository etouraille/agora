import { createSlice } from "@reduxjs/toolkit";

const initialState = { docs: []};

export const subscribedDocsSlice = createSlice({
    name : 'subscribedDocs',
    initialState,
    reducers : {
        init : ( state, action ) => {
            state.docs  = state.docs.concat(action.payload.data);
        },
        sub : ( state, action ) => {
            let index = state.docs .indexOf( action.payload.id );
            if( index < 0 ) {
                state.docs.push( action.payload.id );
            }
        },
        unsub : ( state , action ) => {
            let index = state.docs.indexOf( action.payload.id );
            if( index >= 0 ) {
                state.docs.splice( index, 1 );
            }
        }
    }
});
export default subscribedDocsSlice.reducer
export const { init, sub, unsub  } = subscribedDocsSlice.actions

