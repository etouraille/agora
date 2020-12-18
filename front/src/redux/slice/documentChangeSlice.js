import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const documentChangeSlice = createSlice({
    name : 'toggleDiff',
    initialState,
    reducers : {
        initDocumentChange : (state, action ) => {
            let index = state.findIndex( elem => elem.id === action.payload.id );
            if( index < 0 ) {
                state.push({ id : action.payload.id , forSave : false , changed : false });
            }
        },
        changed : ( state , action ) => {
            let index  = state.findIndex( elem => elem.id === action.payload.id );
            state[index].changed = true;
        },
        forSave : ( state , action ) => {
            let index  = state.findIndex( elem => elem.id === action.payload.id );
            state[index].forSave = true;
        },
        afterSave : ( state , action ) => {
            let index  = state.findIndex( elem => elem.id === action.payload.id );
            state[index].forSave = false;
            state[index].changed = false;
        }

    }
});
export default documentChangeSlice.reducer
export const { initDocumentChange, changed, forSave, afterSave  } = documentChangeSlice.actions

