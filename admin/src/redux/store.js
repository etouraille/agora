import {combineReducers, configureStore, createStore} from "@reduxjs/toolkit";
import { loginSlice } from './slice/loginSlice';


const rootReducer = combineReducers({
    login : loginSlice.reducer,
});

export default configureStore({
    reducer : rootReducer
});
