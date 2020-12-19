import { createSlice } from "@reduxjs/toolkit";

const initialState = { subscribed : []};
//TODO revoir le fonctionnement et le titre
// tout compte fait on n'a besoin que de l'id.
export const subscribedSlice = createSlice({
    name : 'subscribed',
    initialState,
    reducers : {
        init : ( state, action ) => {
            state.subscribed  = action.payload.data;
        },
        sub : ( state, action ) => {
            let index = state.subscribed.indexOf ( action.payload.id );
            if( index < 0 ) {
                state.subscribed.push( action.payload.id );
            }
        },
        unsub : ( state , action ) => {
            let index = state.subscribed.indexOf ( action.payload.id );
            if( index >= 0 ) {
                state.subscribed.splice( index, 1 );
            }
        }
    }
});
export default subscribedSlice.reducer
export const { init, sub, unsub  } = subscribedSlice.actions

