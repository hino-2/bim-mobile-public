import React from "react";
import { Button } from "react-native-paper";
import { getAccessabilities } from "../../../../utils/accessability";

interface EditDialogFooterProps {
	isLoading: boolean;
	onSave: () => void;
	onCancel: () => void;
}

const EditDialogFooter = ({ isLoading, onSave, onCancel }: EditDialogFooterProps) => {
	return (
		<>
			<Button loading={isLoading} onPress={onSave} {...getAccessabilities("Сохранить")}>
				Сохранить
			</Button>
			<Button onPress={onCancel} {...getAccessabilities("Отмена")}>
				Отмена
			</Button>
		</>
	);
};

export default EditDialogFooter;
