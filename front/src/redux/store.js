import {combineReducers, configureStore, createStore} from "@reduxjs/toolkit";
import { loginSlice } from './slice/loginSlice';
import { editMenuSlice} from "./slice/editMenuSlice";
import { readyForVoteSlice } from "./slice/readyForVoteSlice";
import { voteSlice } from "./slice/voteSlice";
import { subscribedSlice } from "./slice/subscribedSlice";
import { amendSlice } from "./slice/amendSlice";
import { documentSlice } from "./slice/documentSlice";
import {toggleDiffSlice} from "./slice/toggleDiffSlice";
import {reloadDocumentSlice} from "./slice/reloadDocumentSlice";
import {reloadVoteSlice} from "./slice/reloadVoteSlice";
import {documentChangeSlice} from "./slice/documentChangeSlice";
import {documentSubscribeSlice} from "./slice/documentSubscribeSlice";

const rootReducer = combineReducers({
    amend : amendSlice.reducer,
    document : documentSlice.reducer,
    documentChange : documentChangeSlice.reducer,
    documentSubscribe : documentSubscribeSlice.reducer,
    editMenu : editMenuSlice.reducer,
    login : loginSlice.reducer,
    readyForVote : readyForVoteSlice.reducer,
    reloadDocument : reloadDocumentSlice.reducer,
    reloadVote : reloadVoteSlice.reducer,
    subscribedDocs : subscribedSlice.reducer,
    toggleDiff : toggleDiffSlice.reducer,
    vote : voteSlice.reducer,
});

export default configureStore({
    reducer : rootReducer
});