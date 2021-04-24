import { createAction } from "@reduxjs/toolkit";
import { usersNamespase } from "./constants";
import usersSlice from "./index";

const initUsersPage = createAction(usersNamespase + "/initUsersPage");

const removeUser = createAction<string>(usersNamespase + "/removeUser");

const usersActions = {
	initUsersPage,
	removeUser,
	...usersSlice.actions,
};

export default usersActions;
