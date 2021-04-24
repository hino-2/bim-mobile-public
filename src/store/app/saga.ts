import axios from "axios";
import Cookies from "universal-cookie";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { requestTimeout } from "../../utils/consts";
import appActions from "./actions";
import appAPI from "./api";
import { AnyAction } from "@reduxjs/toolkit";
import { path } from "ramda";

const cookies = new Cookies();

function* loginWorker({ payload }: ReturnType<typeof appActions.login>) {
	try {
		axiosInit(null);

		const { login, password } = payload;

		if (login && password) {
			const { data } = yield call(appAPI.auth, login, password);

			const { token, tokenExpiredTime } = data.result;

			axiosInit(token);

			cookies.set("login", login, { path: "/" });
			cookies.set("token", token, { path: "/" });
			cookies.set("tokenExpiredTime", tokenExpiredTime, { path: "/" });

			yield put(appActions.loginSuccess({ token, tokenExpiredTime, login }));
		} else {
			const tokenExpiredTime = cookies.get("tokenExpiredTime");
			const login = cookies.get("login");
			const token = cookies.get("token");

			try {
				if (token && tokenExpiredTime && new Date(tokenExpiredTime) > new Date()) {
					axiosInit(token);

					yield put(appActions.loginSuccess({ token, tokenExpiredTime, login }));
				} else {
					yield put(appActions.loginFail());
				}
			} catch (error) {
				console.log("Ошибка авторизации!");
				console.log(error);
			}
		}
		// yield initialization();
	} catch (error) {
		console.log("error", error);
		yield put(appActions.loginFail());
	}
}

function logoutWorker() {
	cookies.remove("login");
	cookies.remove("token");
	cookies.remove("tokenExpiredTime");
}

function* errorsWorker(action: AnyAction) {
	if (action.type && action.type.toLowerCase().includes("fail")) {
		if (path(["payload", "status"], action) === 403) {
			const cookies = new Cookies();
			cookies.remove(`login`);
			cookies.remove(`token`);
			cookies.remove(`tokenExpiredTime`);

			yield put(appActions.loginFail());
		}
	}
}

function* appSaga() {
	yield all([
		takeLatest(appActions.login, loginWorker),
		takeLatest(appActions.logout, logoutWorker),
		takeLatest("*", errorsWorker),
	]);
}

export default appSaga;

const axiosInit = (token: string | null) => {
	axios.defaults.baseURL = `classified`;
	axios.defaults.headers.common.token = token;
	axios.defaults.timeout = requestTimeout;
};
