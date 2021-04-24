import React from "react";
import { Button, Dialog, Portal } from "react-native-paper";
import { User } from "../../../store/users/types";
import { getAccessabilities } from "../../../utils/accessability";

interface RemoveDialogProps {
	visible: boolean;
	user: User | null;
	onConfirm: (email: string) => void;
	onCancel: () => void;
}

const RemoveDialog = ({ visible, user, onConfirm, onCancel }: RemoveDialogProps) =>
	user ? (
		<Portal>
			<Dialog visible={visible} onDismiss={onCancel}>
				<Dialog.Title
					{...getAccessabilities(
						`Удалить ${user.login}?`
					)}>{`Удалить ${user.login}?`}</Dialog.Title>
				<Dialog.Actions>
					<Button
						onPress={() => onConfirm(user.email)}
						{...getAccessabilities("Удалить")}>
						Удалить
					</Button>
					<Button onPress={onCancel} {...getAccessabilities("Отмена")}>
						Отмена
					</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	) : null;

export default RemoveDialog;
