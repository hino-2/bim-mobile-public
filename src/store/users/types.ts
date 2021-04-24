import { CaseReducer, PayloadAction, EntityState } from "@reduxjs/toolkit";
import { ErrorState, LoadingState, OpenState } from "../types";

interface UsersState {
	data: EntityState<User>;
	// selected: User | null;

	// filters: Record<string, string[]>;
	// filterValues: Record<string, string[]>;

	error: ErrorState | null;
	loadingState: LoadingState;

	editDialog: {
		openState: OpenState;
		loadingState: LoadingState;
		error: ErrorState | null;

		currentRow: User;
		editableRow: User;
	};
}

interface User {
	_id?: string;
	login: string;
	email: string;
	password?: string;
	isAdmin?: boolean;
}

type ReducerFunction<T = undefined> = CaseReducer<UsersState, PayloadAction<T>>;

interface GetUsersResponse {
	`classified`,
}

interface GetUserResponse {
	`classified`,
}

export type { User, UsersState, ReducerFunction, GetUsersResponse, GetUserResponse };
