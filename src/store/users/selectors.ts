import { createSelector } from "@reduxjs/toolkit";
import { isNilOrIsEmpty } from "../../utils/data";
import { ApplicationState } from "../types";
import { usersAdapter } from "./adapters";

const usersAdapterSelectors = usersAdapter.getSelectors<ApplicationState>(
	(state) => state.users.data
);

// const filters = (state: ApplicationState) => state.users.filters;
// const filterValues = (state: ApplicationState) => state.users.filterValues;

const users = usersAdapterSelectors.selectAll;

// const filteredUsers = createSelector(usersAdapterSelectors.selectAll, filters, filterUsers);

const error = (state: ApplicationState) => state.users.error?.message;
const loadingState = (state: ApplicationState) => state.users.loadingState;
// const selected = (state: ApplicationState) => state.users.selected;

// const selectedIndex = createSelector(
//   usersAdapterSelectors.selectAll,
//   selected,
//   getIndex('email'),
// );

const editDialog = (state: ApplicationState) => state.users.editDialog;

const editDialogRequiredNotFilled = createSelector(
	editDialog,
	({ editableRow: { email, password } }) => [email, password].some(isNilOrIsEmpty)
);

const usersSelectors = {
	users,
	error,
	loadingState,
	// selected,
	// selectedIndex,
	// filters,
	// filterValues,
	editDialog,
	editDialogRequiredNotFilled,
	// filteredUsers,
	usersAdapterSelectors,
};

export default usersSelectors;
