import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const reloadDocumentSlice = createSlice({
    name : 'reloadDocument',
    initialState,
    reducers : {
        initReload : (state, action ) => {
            let index = state.findIndex( elem => elem.id === action.payload.id );
            if( index < 0 ) {
                state.push({ id : action.payload.id , reload : false });
            }
        },
        reload : ( state , action ) => {
            let index  = state.findIndex( elem => elem.id === action.payload.id );
            if ( index >= 0 ) {
                state[index].reload = !state[index].reload;
            } else {
                state.push ({id : action.payload.id , reload : true });
            }
        }
    }
});
export default reloadDocumentSlice.reducer
export const { initReload, reload  } = reloadDocumentSlice.actions

