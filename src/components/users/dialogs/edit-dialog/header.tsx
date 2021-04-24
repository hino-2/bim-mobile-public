import React from "react";
import { Text } from "react-native-paper";
import { getAccessabilities } from "../../../../utils/accessability";

interface EditDialogHeaderProps {
	email?: string;
}

const EditDialogHeader = ({ email }: EditDialogHeaderProps) =>
	email ? (
		<>
			<Text key="title1" {...getAccessabilities(email)}>
				Редактирование{" "}
			</Text>
			<Text key="title2" style={{ fontWeight: "bold" }} {...getAccessabilities(email)}>
				{email}
			</Text>
		</>
	) : (
		<Text key="title1" {...getAccessabilities("Создание")}>
			Создание
		</Text>
	);

export default EditDialogHeader;
