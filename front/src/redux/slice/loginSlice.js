import { createSlice } from "@reduxjs/toolkit";

const initialState = { logged : false, token : null };

export const loginSlice = createSlice({
    name : 'login',
    initialState,
    reducers : {
        login : ( state, action ) => {
            state.logged = true;
            state.token = action.payload.token;
        },
        logout : ( state) => {
            state.logged = false;
            state.token = null;
        }
    }
});
export default loginSlice.reducer
export const { login , logout } = loginSlice.actions

