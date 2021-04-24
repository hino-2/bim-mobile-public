import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { memo, useCallback } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { RootStackParamList } from "../../store/app/types";
import { safeAreaStyle, theme } from "../../ui/global";
import Header from "../../ui/header";
import { getAccessabilities } from "../../utils/accessability";
import SchedulesList from "./schedules-list";

const styles = StyleSheet.create({
	addButton: { borderBottomWidth: 1, borderColor: theme.colors.border, borderRadius: 0 },
});

interface OperationsScreenProps {
	navigation: DrawerNavigationProp<RootStackParamList, "Operations">;
}

const OperationsScreen = ({ navigation }: OperationsScreenProps) => {
	const onPressAddButton = useCallback(() => {
		console.log("add (not implemented yet)");
	}, []);

	return (
		<SafeAreaView style={[safeAreaStyle.shared, safeAreaStyle.android]}>
			<Header title="Периодические операции" navigation={navigation} />
			<Button
				style={styles.addButton}
				onPress={onPressAddButton}
				{...getAccessabilities("Добавить операцию")}>
				Добавить операцию
			</Button>
			<SchedulesList />
		</SafeAreaView>
	);
};

export default memo(OperationsScreen);
