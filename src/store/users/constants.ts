import { LoadingState, OpenState } from "../types";
import { usersAdapter } from "./adapters";
import { User, UsersState } from "./types";

const usersNamespase = "users";
const editDialogInitialState: User = {
	_id: undefined,
	email: "",
	password: "",
	login: "",
	isAdmin: false,
};

const usersInitialState: UsersState = {
	data: usersAdapter.getInitialState(),

	error: null,
	loadingState: LoadingState.Idle,

	editDialog: {
		openState: OpenState.Closed,
		loadingState: LoadingState.Idle,
		error: null,

		currentRow: editDialogInitialState,
		editableRow: editDialogInitialState,
	},
};

export { usersNamespase, usersInitialState, editDialogInitialState };
