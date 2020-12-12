import {combineReducers, configureStore, createStore} from "@reduxjs/toolkit";
import { loginSlice } from './slice/loginSlice';
import { editMenuSlice} from "./slice/editMenuSlice";
import { readyForVoteSlice } from "./slice/readyForVoteSlice";
import { voteSlice } from "./slice/voteSlice";
import { subscribedDocsSlice } from "./slice/subscribedDocsSlice";

const rootReducer = combineReducers({
    editMenu : editMenuSlice.reducer,
    login : loginSlice.reducer,
    readyForVote : readyForVoteSlice.reducer,
    subscribedDocs : subscribedDocsSlice.reducer,
    vote : voteSlice.reducer,
});

export default configureStore({
    reducer : rootReducer
});