import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const readyForVoteSlice = createSlice({
    name : 'readyForVote',
    initialState,
    reducers : {
        init : ( state, action ) => {
            let edited = false;
            state.forEach((elem, index ) => {
                if(elem.id === action.payload.id ) {
                    state[index].data = action.payload.data;
                    edited = true;
                }
            })
            if( ! edited ) {
                state.push({ id : action.payload.id , data : action.payload.data });
            }
        },
        set : ( state, action ) => {
            state.forEach((elem, i ) => {
                if(elem.id === action.payload.id ) {
                    elem.data.forEach( (r, j ) => {
                        if( r.user === action.payload.user ) {
                            state[i].data[j].readyForVote = action.payload.readyForVote;
                            if(action.payload.round) state[i].data[j].round = action.payload.round;
                        }
                    })
                }
            })
        },
        setNullReadyForVote: ( state, action ) => {
            state.forEach((elem, i ) => {
                if(elem.id === action.payload.id ) {
                    elem.data.forEach( (r, j ) => {
                        state[i].data[j].readyForVote = null;
                    })
                }
            })
        },
        addUser : ( state , action ) => {
            let elemExists = false;
            let userExists = false;
            state.forEach( (elem, i) => {
                if( elem.id === action.payload.id ) {
                    elemExists = true;
                    state[i].data.forEach( (r , j ) => {
                        if( r.user === action.payload.user ) {
                            userExists = true;
                        }
                    })
                }
            })
            if( ! elemExists ) {
                state.push({id : action.payload.id , data : []});
            }
            if( !userExists ) {
                state.forEach( (elem, i) => {
                    if( elem.id === action.payload.id ) {
                        state[i].data.push({
                            readyForVote : false,
                            user : action.payload.user ,
                            invitedBy : action.payload.invitedBy,
                            round: action.payload.round,
                        })
                    }
                })
            }
        },
        removeUser : ( state, action ) => {
            state.forEach((elem, i ) =>{
                if( elem.id === action.payload.id ) {
                    state[i].data.forEach((r, j ) => {
                        if(r.user === action.payload.user ) {
                            state[i].data.splice(j,1);
                        }
                    })
                }
            })
        }
    }
});
export default readyForVoteSlice.reducer
export const { init , set , addUser, removeUser, setNullReadyForVote } = readyForVoteSlice.actions

