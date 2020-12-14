import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const amendSlice = createSlice({
    name : 'amend',
    initialState,
    reducers : {
        init : ( state, action ) => {
            let index  = state.findIndex( elem => elem.id === action.payload.id );
            let children = action.payload.data.map(id => {return {id : id , submit : false }});

            if( index < 0 ) {
                state.push({ id : action.payload.id , children : children })
            } else {
                state[index].children = action.payload.data;
            }
        },
        add : ( state, action ) => {
            let index = state.findIndex( elem => elem.id === action.payload.id );
            if( index < 0 ) {
                state.push( { id : action.payload.id , children : [ { id : action.payload.child , submit : false }]})
            } else {
                if(-1 === state[index].children.findIndex( elem => action.payload.child === elem.id )) {
                    state[index].children.push( { id : action.payload.child , submit : false });
                }
            }
        },
        remove : ( state , action ) => {
            let index = state.findIndex( elem => elem.id === action.payload.id );
            if( index >= 0 ) {
                let j = state[index].children.findIndex( elem => action.payload.child === elem.id   );
                if( j>=0 ) {
                    state[index].children.splice( j, 1);
                }
            }
        },
        submit : ( state , action ) => {
            let index = state.findIndex( elem => elem.id === action.payload.id );
            if( index < 0 ) {
                state.push( { id : action.payload.id , children : [ { id : action.payload.child , submit : true }]})
            } else {
                let j = state[index].children.findIndex( elem => action.payload.child === elem.id );
                if( j < 0 ) {
                    state[index].children.push( { id : action.payload.child , submit : false });
                } else {
                    state[index].children[j].submit = true;
                }
            }
        }
    }
});
export default amendSlice.reducer
export const { init, add , remove , submit } = amendSlice.actions

