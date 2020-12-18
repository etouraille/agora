import {combineReducers, configureStore, createStore} from "@reduxjs/toolkit";
import { loginSlice } from './slice/loginSlice';
import { editMenuSlice} from "./slice/editMenuSlice";
import { readyForVoteSlice } from "./slice/readyForVoteSlice";
import { voteSlice } from "./slice/voteSlice";
import { subscribedDocsSlice } from "./slice/subscribedDocsSlice";
import { amendSlice } from "./slice/amendSlice";
import { documentSlice } from "./slice/documentSlice";
import {toggleDiffSlice} from "./slice/toggleDiffSlice";
import {reloadDocumentSlice} from "./slice/reloadDocumentSlice";
import {reloadVoteSlice} from "./slice/reloadVoteSlice";
import {documentChangeSlice} from "./slice/documentChangeSlice";

const rootReducer = combineReducers({
    amend : amendSlice.reducer,
    document : documentSlice.reducer,
    documentChange : documentChangeSlice.reducer,
    editMenu : editMenuSlice.reducer,
    login : loginSlice.reducer,
    readyForVote : readyForVoteSlice.reducer,
    reloadDocument : reloadDocumentSlice.reducer,
    reloadVote : reloadVoteSlice.reducer,
    subscribedDocs : subscribedDocsSlice.reducer,
    toggleDiff : toggleDiffSlice.reducer,
    vote : voteSlice.reducer,
});

export default configureStore({
    reducer : rootReducer
});