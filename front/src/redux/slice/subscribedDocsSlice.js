import { createSlice } from "@reduxjs/toolkit";

const initialState = { docs : []};
//TODO revoir le fonctionnement et le titre
// tout compte fait on n'a besoin que de l'id.
export const subscribedDocsSlice = createSlice({
    name : 'subscribedDocs',
    initialState,
    reducers : {
        init : ( state, action ) => {
            state.docs  = action.payload.data;
        },
        sub : ( state, action ) => {
            let index = state.docs.findIndex ( elem => elem.id === action.payload.id );
            if( index < 0 ) {
                state.docs.push( {id : action.payload.id , users : [action.payload.user ]});
            }
        },
        unsub : ( state , action ) => {
            let index = state.docs.findIndex ( elem => elem.id === action.payload.id );
            if( index >= 0 ) {
                state.docs.splice( index, 1 );
            }
        }
    }
});
export default subscribedDocsSlice.reducer
export const { init, sub, unsub  } = subscribedDocsSlice.actions

