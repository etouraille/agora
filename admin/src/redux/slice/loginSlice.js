import { createSlice } from "@reduxjs/toolkit";

const initialState = { logged : false, token : null, user : null };

export const loginSlice = createSlice({
    name : 'login',
    initialState,
    reducers : {
        login : ( state, action ) => {
            state.logged = true;
            state.token = action.payload.token;
            state.email = action.payload.email;
            state.userId = action.payload.userId;
        },
        logout : ( state) => {
            state.logged = false;
            state.token = null;
            state.email = null;
            state.userId = null;
        }
    }
});
export default loginSlice.reducer
export const { login , logout } = loginSlice.actions

