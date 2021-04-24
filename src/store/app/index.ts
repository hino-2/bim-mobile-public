import { createSlice } from "@reduxjs/toolkit";
import { appNamespace, appInitialState } from "./consts";
import reducers from "./reducer";

const appSlice = createSlice({
	name: appNamespace,
	initialState: appInitialState,
	reducers,
});

export default appSlice;
