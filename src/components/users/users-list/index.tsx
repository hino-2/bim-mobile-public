import React from "react";
import { ScrollView } from "react-native";
import { User } from "../../../store/users/types";
import { getBackgroundColor } from "../../../store/users/utils";
import UserListItem from "./user-list-item";

interface UsersListProps {
	users: User[];
	onPressUserListItem: (user: User) => void;
	askToConfirmRemoval: (user: User) => () => void;
}

const UsersList = ({ users, onPressUserListItem, askToConfirmRemoval }: UsersListProps) => (
	<ScrollView>
		{users.map((user, index) => (
			<UserListItem
				key={index}
				user={user}
				onPress={onPressUserListItem}
				backgroundColor={getBackgroundColor(index)}
				askToConfirmRemoval={askToConfirmRemoval}
			/>
		))}
	</ScrollView>
);

export default UsersList;
