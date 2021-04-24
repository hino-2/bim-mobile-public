import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { List, IconButton } from "react-native-paper";
import { User } from "../../../store/users/types";
import { theme } from "../../../ui/global";
import { getAccessabilities } from "../../../utils/accessability";

const styles = StyleSheet.create({
	icon: {
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderColor: theme.colors.border,
		alignSelf: "center",
		justifyContent: "center",
		height: "100%",
	},
	item: {
		height: 54,
		padding: 0,
		borderBottomWidth: 1,
		borderRightWidth: 1,
		borderColor: "#bdbdbd",
	},
	title: {
		marginBottom: 4,
	},
});

interface UserListItemProps {
	user: User;
	backgroundColor: string;
	onPress: (user: User) => void;
	askToConfirmRemoval: (user: User) => () => void;
}

const UserListItem = ({
	user,
	backgroundColor,
	onPress,
	askToConfirmRemoval,
}: UserListItemProps) => {
	const { login, email } = user;

	const renderRemoveButton = useCallback(
		() => (
			<View style={styles.icon}>
				<IconButton
					icon="delete"
					color={theme.colors.primary}
					onPress={askToConfirmRemoval(user)}
					{...getAccessabilities(email)}
				/>
			</View>
		),
		[user, askToConfirmRemoval]
	);

	const onPressListItem = useCallback(() => {
		onPress(user);
	}, [user, onPress]);

	return (
		<List.Item
			key={email}
			title={login}
			description={email}
			style={[styles.item, { backgroundColor }]}
			titleStyle={styles.title}
			left={renderRemoveButton}
			onPress={onPressListItem}
			{...getAccessabilities(email)}
		/>
	);
};

export default UserListItem;
