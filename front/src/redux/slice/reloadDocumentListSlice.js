import { createSlice } from "@reduxjs/toolkit";

const initialState = { reload : false };

export const reloadDocumentListSlice = createSlice({
    name : 'reloadDocumentList',
    initialState,
    reducers : {
        reloadList : ( state , action ) => {
            state.reload = !state.reload;
        }
    }
});
export default reloadDocumentListSlice.reducer
export const {  reloadList  } = reloadDocumentListSlice.actions

