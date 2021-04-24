import React, { useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { TextInput, Switch } from "react-native-paper";
import { useDispatch } from "react-redux";
import { OpenState } from "../../../../store/types";
import usersActions from "../../../../store/users/actions";
import { User } from "../../../../store/users/types";
import { theme } from "../../../../ui/global";
import { getAccessabilities } from "../../../../utils/accessability";

const styles = StyleSheet.create({
	input: {
		marginBottom: 10,
	},
	isAdminContainer: {
		flexDirection: "row",
	},
});

interface EditDialogFormProps {
	editableRow: User;
	openState: OpenState;
}

const EditDialogForm = ({ editableRow, openState }: EditDialogFormProps) => {
	const dispatch = useDispatch();

	const { login, email, password, isAdmin } = editableRow;

	const onChangeEmail = useCallback(
		(text: string) => {
			dispatch(
				usersActions.editDialogSetCredentials({
					email: text.replace(/[^@\w\-.]/gi, ""),
				})
			);
		},
		[dispatch]
	);

	const onChangePassword = useCallback(
		(text: string) => {
			dispatch(
				usersActions.editDialogSetCredentials({
					password: text,
				})
			);
		},
		[dispatch]
	);

	const onChangeLogin = useCallback(
		(text: string) => {
			dispatch(
				usersActions.editDialogSetCredentials({
					login: text.replace(/[^\w\-.]/gi, ""),
				})
			);
		},
		[dispatch]
	);

	const onChangeIsAdmin = useCallback(
		(checked: boolean) => {
			dispatch(
				usersActions.editDialogSetCredentials({
					isAdmin: checked,
				})
			);
		},
		[dispatch]
	);

	// const onClickPasswordVisibility = useCallback(() => {
	//   setPasswordIsVisible(prev => !prev);
	// }, []);

	return (
		<>
			<TextInput
				disabled={openState === OpenState.Edit}
				label="Email"
				value={email}
				mode="outlined"
				autoCapitalize="none"
				style={styles.input}
				autoCompleteType="email"
				keyboardType="email-address"
				onChangeText={onChangeEmail}
				{...getAccessabilities("Email")}
			/>
			<TextInput
				secureTextEntry
				label="Пароль"
				value={password}
				mode="outlined"
				autoCapitalize="none"
				style={styles.input}
				autoCompleteType="password"
				onChangeText={onChangePassword}
				{...getAccessabilities("Пароль")}
			/>
			<TextInput
				label="Логин"
				value={login}
				mode="outlined"
				autoCapitalize="none"
				style={styles.input}
				autoCompleteType="username"
				onChangeText={onChangeLogin}
				{...getAccessabilities("Логин")}
			/>
			<View style={styles.isAdminContainer}>
				<Text>Дать права админа </Text>
				<Switch
					value={isAdmin}
					color={theme.colors.primary}
					onValueChange={onChangeIsAdmin}
					{...getAccessabilities("Админ")}
				/>
			</View>
		</>
	);
};

export default EditDialogForm;
