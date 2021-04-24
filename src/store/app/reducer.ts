import { LoadingState } from "../types";
import { ReducerFunction } from "./types";
import { assoc } from "ramda";
import { appInitialState } from "./consts";

const login: ReducerFunction<{ login?: string; password?: string }> = (state) => {
	state.authorization.loadingState = LoadingState.Loading;
};

const loginSuccess: ReducerFunction<{
	token: string;
	tokenExpiredTime: string;
	login: string;
}> = (state, { payload }) => {
	state.authorization = assoc("loadingState", LoadingState.Resolve, payload);
};

const loginFail: ReducerFunction = (state) => {
	state.authorization.loadingState = LoadingState.Reject;
};

const logout: ReducerFunction = (state) => {
	state.authorization = appInitialState.authorization;
};

const reducers = {
	login,
	loginSuccess,
	loginFail,
	logout,
};

export default reducers;
