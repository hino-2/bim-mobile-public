import { all, put, call, takeEvery, select } from "redux-saga/effects";
// import appActions from 'store/app/actions';
import usersActions from "./actions";
import usersAPI from "./api";
// import { pushUser, usersNavigation } from './navigation';
// import { PageTypes } from 'store/app/types';
// import { getRequestStatus } from 'utils/saga-actions';
import usersSelectors from "./selectors";
import { equals } from "ramda";
import { OpenState, ThenArg } from "../types";
import { getRequestStatus } from "../../utils/saga";

function* initUsersPageWorker() {
	yield put(usersActions.getUsers());
}

function* getUsersWorker() {
	try {
		const response: ThenArg<typeof usersAPI.getList> = yield call(usersAPI.getList);

		yield put(usersActions.getUsersSuccess(response.data.result.users));
	} catch (error) {
		yield put(
			usersActions.getUsersFail({
				message: "Не удалось получить список пользователей",
				status: getRequestStatus(error),
			})
		);
	}
}

function* saveUserWorker() {
	const {
		editableRow: { login, email, password, isAdmin = false },
		openState,
	}: ReturnType<typeof usersSelectors.editDialog> = yield select(usersSelectors.editDialog);

	try {
		const newUser = {
			login: login ? login : email,
			email,
			password: password ? password : undefined,
			isAdmin,
		};

		if (openState === OpenState.Add) {
			const response: ThenArg<typeof usersAPI.add> = yield call(usersAPI.add, newUser);
			yield put(usersActions.addUserSuccess(response.data.result.user));
		} else {
			const response: ThenArg<typeof usersAPI.edit> = yield call(usersAPI.edit, newUser);
			yield put(usersActions.editUserSuccess(response.data.result.user));
		}
		// yield put(
		//   appActions.addNotification({
		//     message: `Учетные данные пользователя успешно ${
		//       openState === OpenDialogState.Add ? 'сохранены' : 'измененены'
		//     }`,
		//     options: {
		//       variant: 'success',
		//     },
		//   }),
		// );
	} catch (error) {
		console.log(error);
		yield put(usersActions.saveUserFail());
		// yield put(
		//   appActions.addNotification({
		//     message: `Ошибка ${
		//       openState === OpenDialogState.Add ? 'добавления' : 'изменения'
		//     } пользователя`,
		//     options: {
		//       variant: 'error',
		//     },
		//   }),
		// );
	}
}

function* removeUserWorker(action: ReturnType<typeof usersActions.removeUser>) {
	try {
		const email = action.payload;

		yield call(usersAPI.remove, email);
		yield put(usersActions.removeUserSuccess(email));
	} catch (error) {
		console.log(error);
		// yield put(
		// appActions.addNotification({
		//   message: 'Ошибка удаления пользователя',
		//   options: {
		//     variant: 'error',
		//   },
		// }),
		// );
	}
}

function* usersSaga() {
	yield all([
		takeEvery(usersActions.initUsersPage, initUsersPageWorker),
		takeEvery(usersActions.getUsers, getUsersWorker),
		takeEvery(usersActions.saveUser, saveUserWorker),
		takeEvery(usersActions.removeUser, removeUserWorker),
	]);
}

export default usersSaga;
