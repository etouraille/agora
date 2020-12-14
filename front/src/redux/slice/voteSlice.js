import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const voteSlice = createSlice({
    name : 'vote',
    initialState,
    reducers : {
        init : (state, action ) => {
            let index = -1;
            state.forEach((elem, i ) => {
                if( elem.id === action.payload.id ) {
                    index = i;
                }
            })
            if(index < 0 ) {
                state.push({ id : action.payload.id , votes : action.payload.data });
            } else {
                state[index].votes = action.payload.data;
            }
        },
        addVoter : (state, action ) => {
            let index = -1;
            state.forEach((elem, i ) => {
                if( elem.id === action.payload.id ) {
                    index = i;
                }
            })
            if( index < 0 ) {
                state.push({ id : action.payload.id , votes : [{ user: action.payload.user , against : null }]});
            } else {
                if(!state[index].votes.find(vote => vote.user === action.payload.user )) {
                    state[index].votes.push({user : action.payload.user , against : null })
                }
            }
        },
        removeVoter : ( state , action ) => {
            let index = -1;
            state.forEach((elem, i ) => {
                if( elem.id === action.payload.id ) {
                    index = i;
                }
            })
            if( index >= 0 ) {
                let p = state[index].votes.findIndex(vote => vote.user === action.payload.user );
                state[index].votes.splice(p, 1 );
            }
        },
        forIt : ( state, action ) => {
            let index = state.findIndex(elem => elem.id === action.payload.id );
            if( index < 0 ) {
                state.push({ id : action.payload.id , votes : []});
                index = state.length - 1;
            }
            let j = state[index].votes.findIndex(elem => elem.user === action.payload.user );
            if( j < 0 ) {
                state[index].votes.push({ user : action.payload.user , against : false });
            } else {
                state[index].votes[j].against = false;
            }
        },
        againstIt : ( state, action ) => {
            let index = state.findIndex(elem => elem.id === action.payload.id );
            if( index < 0 ) {
                state.push({ id : action.payload.id , votes : []});
                index = state.length - 1;
            }
            let j = state[index].votes.findIndex(elem => elem.user === action.payload.user );
            if( j < 0 ) {
                state[index].votes.push({ user : action.payload.user , against : true });
            } else {
                state[index].votes[j].against = true;
            }
        },
        reset : ( state , action ) => {
            let index = state.findIndex(elem => elem.id === action.payload.id );
            if( index >= 0 ) {
                state[index].votes = state[index].votes.map(elem => {
                    elem['against'] = null;
                    return elem;
                })
            }
        }
    }
});
export default voteSlice.reducer
export const { forIt, againstIt, init, addVoter, removeVoter, reset  } = voteSlice.actions

