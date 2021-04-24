import { createSlice } from "@reduxjs/toolkit";
import { tasksNamespace, tasksInitialState } from "./constants";
import reducers from "./reducer";

const tasksSlice = createSlice({
	name: tasksNamespace,
	initialState: tasksInitialState,
	reducers,
});

export default tasksSlice;
