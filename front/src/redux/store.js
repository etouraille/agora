import {combineReducers, configureStore, createStore} from "@reduxjs/toolkit";
import { loginSlice } from './slice/loginSlice';
import { editMenuSlice} from "./slice/editMenuSlice";
import { readyForVoteSlice } from "./slice/readyForVoteSlice";
import { voteSlice } from "./slice/voteSlice";
import { subscribedSlice } from "./slice/subscribedSlice";
import { amendSlice } from "./slice/amendSlice";
import { documentSlice } from "./slice/documentSlice";
import { toggleDiffSlice } from "./slice/toggleDiffSlice";
import { reloadDocumentSlice } from "./slice/reloadDocumentSlice";
import { reloadVoteSlice } from "./slice/reloadVoteSlice";
import { documentChangeSlice } from "./slice/documentChangeSlice";
import { documentSubscribeSlice } from "./slice/documentSubscribeSlice";
import { barreToggleSlice } from "./slice/barreToggleSlice";
import { notificationSlice } from "./slice/notificationSlice";
import { reloadDocumentListSlice } from "./slice/reloadDocumentListSlice";
import { clickSlice } from "./slice/clickSlice";
import { toggleAmendSlice } from "./slice/toggleAmend";
import {subscribeIsBeforeSlice} from "./slice/subscribeIsBeforeSlice";


const rootReducer = combineReducers({
    amend : amendSlice.reducer,
    barreToggle : barreToggleSlice.reducer,
    click : clickSlice.reducer,
    document : documentSlice.reducer,
    documentChange : documentChangeSlice.reducer,
    documentSubscribe : documentSubscribeSlice.reducer,
    editMenu : editMenuSlice.reducer,
    login : loginSlice.reducer,
    notification : notificationSlice.reducer,
    readyForVote : readyForVoteSlice.reducer,
    reloadDocument : reloadDocumentSlice.reducer,
    reloadDocumentList : reloadDocumentListSlice.reducer,
    reloadVote : reloadVoteSlice.reducer,
    subscribed : subscribedSlice.reducer,
    subscribeIsBefore: subscribeIsBeforeSlice.reducer,
    toggleAmend : toggleAmendSlice.reducer,
    toggleDiff : toggleDiffSlice.reducer,
    vote : voteSlice.reducer,
});

export default configureStore({
    reducer : rootReducer
});
