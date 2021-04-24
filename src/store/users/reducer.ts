import { ReducerFunction, User } from "./types";
import { usersAdapter } from "./adapters";
import { getFilterValues } from "./utils";
import { editDialogInitialState, usersInitialState } from "./constants";
import { ErrorState, LoadingState, OpenState } from "../types";
import { isNil, mergeRight } from "ramda";

const getUsers: ReducerFunction = (state) => {
	state.loadingState = LoadingState.Loading;
};

const getUsersSuccess: ReducerFunction<User[]> = (state, { payload }) => {
	usersAdapter.setAll(state.data, payload);
	// state.filterValues = getFilterValues(payload);
	state.loadingState = LoadingState.Resolve;
};

const getUsersFail: ReducerFunction<ErrorState> = (state, action) => {
	state.error = action.payload;
	state.loadingState = LoadingState.Reject;
};

// const setFilters: ReducerFunction<Record<string, string[]>> = (state, action) => {
// 	state.filters = action.payload;
// };

// const select: ReducerFunction<User> = (state, { payload }) => {
// 	state.selected = payload;
// };

const saveUser: ReducerFunction = (state) => {
	state.editDialog.loadingState = LoadingState.Loading;
};

const saveUserFail: ReducerFunction = (state) => {
	state.editDialog.loadingState = LoadingState.Reject;
};

const addUserSuccess: ReducerFunction<User> = (state, { payload }) => {
	// const { login, email } = payload;

	state.data = usersAdapter.addOne(state.data, payload);
	// state.filterValues.logins.push(login);
	// state.filterValues.emails.push(email);
	state.editDialog.editableRow.password = "";
	state.editDialog.loadingState = LoadingState.Resolve;
	state.editDialog.openState = OpenState.Closed;
};

const editUserSuccess: ReducerFunction<User> = (state, { payload: { login, ...changes } }) => {
	state.data = usersAdapter.updateOne(state.data, {
		id: login,
		changes,
	});
	state.editDialog.editableRow.password = "";
	state.editDialog.loadingState = LoadingState.Resolve;
	state.editDialog.openState = OpenState.Closed;
};

const removeUserSuccess: ReducerFunction<string> = (state, { payload }) => {
	usersAdapter.removeOne(state.data, payload);
};

const clearUsers: ReducerFunction = (state) => {
	usersAdapter.removeAll(state.data);
	// state.filters = usersInitialState.filters;
	// state.filterValues = usersInitialState.filterValues;
	state.loadingState = usersInitialState.loadingState;
};

const editDialogOpen: ReducerFunction<User | null> = (state, { payload }) => {
	if (isNil(payload)) {
		state.editDialog.openState = OpenState.Add;
		state.editDialog.editableRow = editDialogInitialState;
		state.editDialog.currentRow = editDialogInitialState;
		// state.selected = null;
	} else {
		state.editDialog.openState = OpenState.Edit;
		state.editDialog.editableRow = mergeRight({ password: "" }, payload);
		state.editDialog.currentRow = payload;
	}

	state.editDialog.error = null;
	state.editDialog.loadingState = LoadingState.Idle;
};

const editDialogClose: ReducerFunction = (state) => {
	state.editDialog.openState = OpenState.Closed;
	state.editDialog.error = null;
	state.editDialog.loadingState = LoadingState.Idle;
	// state.selected = null;
};

const editDialogSetCredentials: ReducerFunction<{
	email?: string;
	password?: string;
	login?: string;
	isAdmin?: boolean;
}> = (state, { payload }) => {
	state.editDialog.editableRow = mergeRight(state.editDialog.editableRow, payload);
};

const reducers = {
	getUsers,
	getUsersSuccess,
	getUsersFail,
	saveUser,
	saveUserFail,

	// setFilters,
	// select,

	addUserSuccess,
	editUserSuccess,
	removeUserSuccess,

	editDialogOpen,
	editDialogClose,
	editDialogSetCredentials,

	clearUsers,
};

export default reducers;
