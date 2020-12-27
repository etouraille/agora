import { createSlice } from "@reduxjs/toolkit";

const initialState = { notification : [] };

export const notificationSlice = createSlice({
    name : 'notification',
    initialState,
    reducers : {
        addNotification : ( state, action ) => {
            state.notification.push({
                id : action.payload.id ,
                user : action.payload.user ,
                notification : action.payload.notification,
            })
        },
        initNotification : (state , action ) => {
            state.notification = action.payload.data;

        },
        removeNotification : ( state , action ) => {
            let index = state.notification.findIndex ( elem => elem.notification.id === action.payload.id );
            if( index >= 0 ) {
                state.notification.splice(index, 1 );
            }
        }
    }
});
export default notificationSlice.reducer
export const { addNotification, initNotification, removeNotification } = notificationSlice.actions

