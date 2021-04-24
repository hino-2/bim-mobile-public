import { createSelector } from "@reduxjs/toolkit";
import { ApplicationState, LoadingState } from "../types";

const loadingState = (state: ApplicationState) => state.app.authorization.loadingState;
const token = (state: ApplicationState) => state.app.authorization.token;
const login = (state: ApplicationState) => state.app.authorization.login || "";

const authorized = createSelector(
	loadingState,
	token,
	(loadingState, token) => loadingState === LoadingState.Resolve && token !== null
);

export const appSelectors = {
	loadingState,
	authorized,
	login,
};
