import { createSlice } from "@reduxjs/toolkit";

const initialState = { barreToggle : []};

export const barreToggleSlice = createSlice({
    name : 'barreToggle',
    initialState,
    reducers : {
        initBarreToggle : ( state, action ) => {
            state.barreToggle = state.barreToggle.map(elem => {
                return { ...elem, display: false }
            })
             /* else {
                state.barreToggle = [];
                state.barreToggle = action.payload.data.map(elem => {
                    return {id: elem, display: false}
                });

            }
            */
        },
        initOne : (state , action ) => {
            let index = state.barreToggle.findIndex(elem => elem.id === action.payload.id );
            if( index < 0 ) {
                state.barreToggle.push( { id : action.payload.id , display : false });
            }
        },
        toggle: ( state , action ) => {
            state.barreToggle.forEach( (elem, index ) => {
                if( elem.id !== action.payload.id ) {
                    state.barreToggle[index].display = false;
                } else {
                    state.barreToggle[index].display = ! state.barreToggle[index].display;

                }
            })
        }
    }
});
export default barreToggleSlice.reducer
export const { initBarreToggle, toggle, initOne } =  barreToggleSlice.actions

