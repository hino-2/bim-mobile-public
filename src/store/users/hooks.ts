import { ActionCreatorWithOptionalPayload, ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useState, useCallback } from "react";
import { User } from "./types";

interface UseUsersDialogsArgs {
	saveUser: ActionCreatorWithOptionalPayload<undefined, string>;
	removeUser: ActionCreatorWithPayload<string, string>;
	editDialogOpen: ActionCreatorWithPayload<User | null, string>;
	editDialogClose: ActionCreatorWithOptionalPayload<undefined, string>;
}

export const useUsersDialogs = ({
	saveUser,
	removeUser,
	editDialogOpen,
	editDialogClose,
}: UseUsersDialogsArgs) => {
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [removeDialogVisible, setRemoveDialogVisible] = useState(false);

	const showDialog = useCallback(() => setRemoveDialogVisible(true), [setRemoveDialogVisible]);
	const hideDialog = useCallback(() => setRemoveDialogVisible(false), [setRemoveDialogVisible]);

	const askToConfirmRemoval = useCallback(
		(user: User) => () => {
			setSelectedUser(user);
			showDialog();
		},
		[showDialog, setSelectedUser]
	);

	const onConfirmRemoval = useCallback(
		(email: string) => {
			removeUser(email);
			hideDialog();
		},
		[hideDialog]
	);

	const onCancelRemoval = useCallback(() => {
		hideDialog();
	}, [hideDialog]);

	const onPressUserListItem = useCallback((user: User) => {
		editDialogOpen(user);
	}, []);

	const onPressAddButton = useCallback(() => {
		editDialogOpen(null);
	}, []);

	const onSaveEditDialog = useCallback(() => {
		saveUser();
	}, []);

	const onCloseEditDialog = useCallback(() => {
		editDialogClose();
	}, []);

	return {
		selectedUser,
		removeDialogVisible,
		askToConfirmRemoval,
		onConfirmRemoval,
		onCancelRemoval,
		onPressUserListItem,
		onPressAddButton,
		onSaveEditDialog,
		onCloseEditDialog,
	};
};
