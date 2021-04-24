import React from "react";
import { Portal, Dialog } from "react-native-paper";
import { useSelector } from "react-redux";
import usersSelectors from "../../../../store/users/selectors";
import { getAccessabilities } from "../../../../utils/accessability";
import EditDialogForm from "./form";
import EditDialogFooter from "./footer";
import EditDialogHeader from "./header";
import { LoadingState, OpenState } from "../../../../store/types";

interface EditDialogProps {
	onSave: () => void;
	onCancel: () => void;
}

const EditDialog = ({ onSave, onCancel }: EditDialogProps) => {
	const {
		editableRow,
		currentRow: { email: currentEmail },
		loadingState,
		openState,
	} = useSelector(usersSelectors.editDialog);

	const visible = openState !== OpenState.Closed;

	return (
		<Portal>
			<Dialog visible={visible} onDismiss={onCancel}>
				<Dialog.Title {...getAccessabilities("Диалог")}>
					<EditDialogHeader email={currentEmail} />
				</Dialog.Title>
				<Dialog.Content>
					<EditDialogForm editableRow={editableRow} openState={openState} />
				</Dialog.Content>
				<Dialog.Actions>
					<EditDialogFooter
						isLoading={loadingState === LoadingState.Loading}
						onSave={onSave}
						onCancel={onCancel}
					/>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
};

export default EditDialog;
