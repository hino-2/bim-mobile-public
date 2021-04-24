import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { memo } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { RootStackParamList } from "../../store/app/types";
import usersActions from "../../store/users/actions";
import usersSelectors from "../../store/users/selectors";
import Header from "../../ui/header";
import RemoveDialog from "./dialogs/remove-dialog";
import EditDialog from "./dialogs/edit-dialog";
import { ApplicationState } from "../../store/types";
import { Button } from "react-native-paper";
import { getAccessabilities } from "../../utils/accessability";
import { safeAreaStyle, theme } from "../../ui/global";
import UsersList from "./users-list";
import { useUsersDialogs } from "../../store/users/hooks";

const styles = StyleSheet.create({
	addButton: { borderBottomWidth: 1, borderColor: theme.colors.border, borderRadius: 0 },
});

interface UsersScreenProps {
	navigation: DrawerNavigationProp<RootStackParamList, "Users">;
}

const UsersScreen = ({
	navigation,
	users,
	saveUser,
	removeUser,
	editDialogOpen,
	editDialogClose,
}: UsersScreenProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps) => {
	const {
		selectedUser,
		removeDialogVisible,
		askToConfirmRemoval,
		onConfirmRemoval,
		onCancelRemoval,
		onPressUserListItem,
		onPressAddButton,
		onSaveEditDialog,
		onCloseEditDialog,
	} = useUsersDialogs({ saveUser, removeUser, editDialogOpen, editDialogClose });

	return (
		<SafeAreaView style={[safeAreaStyle.shared, safeAreaStyle.android]}>
			<Header title="Пользователи" navigation={navigation} />
			<Button
				style={styles.addButton}
				onPress={onPressAddButton}
				{...getAccessabilities("Добавить пользователя")}>
				Добавить пользователя
			</Button>
			<UsersList
				users={users}
				onPressUserListItem={onPressUserListItem}
				askToConfirmRemoval={askToConfirmRemoval}
			/>
			<EditDialog onSave={onSaveEditDialog} onCancel={onCloseEditDialog} />
			<RemoveDialog
				visible={removeDialogVisible}
				user={selectedUser}
				onConfirm={onConfirmRemoval}
				onCancel={onCancelRemoval}
			/>
		</SafeAreaView>
	);
};

const mapStateToProps = (state: ApplicationState) => ({
	users: usersSelectors.users(state),
});

const mapDispatchToProps = {
	removeUser: usersActions.removeUser,
	editDialogOpen: usersActions.editDialogOpen,
	saveUser: usersActions.saveUser,
	editDialogClose: usersActions.editDialogClose,
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(UsersScreen));
