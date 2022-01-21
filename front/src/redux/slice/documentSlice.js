import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
/*
    {id , data : {

    }}
*/
export const documentSlice = createSlice({
    name : 'document',
    initialState,
    reducers : {
        init : ( state, action ) => {
            let index = state.findIndex( elem => elem.id === action.payload.id );
            if( index < 0 ) {
                state.push({ id: action.payload.id , doc : action.payload.data });
            } else {
                state[index].doc = action.payload.data;
            }
        },
        removeChild : (state , action ) => {
            let index = state.findIndex( elem => elem.id === action.payload.id );
            if ( index >= 0 ) {
                let j = state[index].doc.children.findIndex( elem => elem.child.id === action.payload.child )
                if( j>= 0 ) state[index].doc.children.splice( j, 1 );
            }
        },
        setTouched : (state, action ) => {
            let index = state.findIndex( elem => elem.id === action.payload.id );
            if ( index >= 0 ) {
                state[index].doc.document.touched = action.payload.touched;
            }
        }
    }
});
export default documentSlice.reducer
export const { init, removeChild, setTouched } = documentSlice.actions

