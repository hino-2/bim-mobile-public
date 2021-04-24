import { LoadingState } from "../types";
import { AppState, Screen as Screen } from "./types";

export const appNamespace = "app";

export const appInitialState: AppState = {
	authorization: {
		loadingState: LoadingState.Idle,
		token: null,
		tokenExpiredTime: null,
		login: null,
	},
};

export const screens: Screen[] = [
	{
		route: "Users",
		title: "Пользователи",
	},
	{
		route: "Operations",
		title: "Периодич. операции",
	},
];
