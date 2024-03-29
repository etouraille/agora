import { createSlice } from "@reduxjs/toolkit";

const initialState = { documents : []};

export const documentSubscribeSlice = createSlice({
    name : 'documentSubscribe',
    initialState,
    reducers : {
        initDocumentsSubscribe : ( state, action ) => {
            state.documents = action.payload.data;
        },
        initForOneDocument : (state, action ) => {
            let index = state.documents.findIndex( elem => elem.id === action.payload.id );
            if( index < 0 ) {
                state.documents.push( action.payload.data );
            }
        },
        unsubscribeDoc : (state , action ) => {
            let index = state.documents.findIndex( elem => elem.id === action.payload.id );
            if( index >= 0 ) {
                let i = state.documents[index].users.indexOf( action.payload.user);
                if( i >=  0 ) {
                    state.documents[index].users.splice( i, 1 );
                }
            }
        },
        subscribeDoc : (state , action ) => {
            let index = state.documents.findIndex( elem => elem.id === action.payload.id );
            if( index >= 0 ) {
                let i = state.documents[index].users.indexOf( action.payload.user);
                if( i < 0 ) state.documents[index].users.push( action.payload.user );
            } else {
                console.log( 'user addedd ', action.payload.user);
                state.documents.push({ id: action.payload.id , users : [action.payload.user]});
            }
        },
        deleteDoc : ( state , action ) => {
            let index = state.documents.findIndex( elem => elem.id === action.payload.id );
            state.documents.splice(index, 1 );
        }
    }
});
export default documentSubscribeSlice.reducer
export const { initDocumentsSubscribe , subscribeDoc, unsubscribeDoc , deleteDoc , initForOneDocument} = documentSubscribeSlice.actions

