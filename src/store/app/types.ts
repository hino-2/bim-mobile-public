import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { LoadingState } from "../types";

export interface AppState {
	authorization: {
		loadingState: LoadingState;
		token: string | null;
		tokenExpiredTime: string | null;
		login: string | null;
	};
}

export type ReducerFunction<T = undefined> = CaseReducer<AppState, PayloadAction<T>>;

export type RootStackParamList = {
	Home: undefined;
	Users: undefined;
	Operations: undefined;
	Empty: undefined;
	Logout: undefined;
	OtherScreen: Record<string, unknown>;
};

export type ScreenId = keyof RootStackParamList;

export interface Screen {
	route: ScreenId;
	title: string;
}
