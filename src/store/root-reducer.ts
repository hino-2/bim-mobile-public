import { combineReducers } from "@reduxjs/toolkit";
import aggregatorsSlice from "./aggregators";
import appSlice from "./app";
import attributesSlice from "./attributes";
import ruleAttributesSlice from "./rule-attributes";
import tasksSlice from "./tasks";
import { ApplicationState } from "./types";
import usersSlice from "./users";

const reducers = combineReducers<ApplicationState>({
	app: appSlice.reducer,
	users: usersSlice.reducer,
	attributes: attributesSlice.reducer,
	ruleAttributes: ruleAttributesSlice.reducer,
	aggregators: aggregatorsSlice.reducer,
	tasks: tasksSlice.reducer,
});

export default reducers;
