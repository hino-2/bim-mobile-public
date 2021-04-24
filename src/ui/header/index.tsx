import React, { memo } from "react";
import { Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import { theme } from "../global";
import { StyleSheet } from "react-native";
import { getAccessabilities } from "../../utils/accessability";
import { RootStackParamList, ScreenId } from "../../store/app/types";
import { DrawerNavigationProp } from "@react-navigation/drawer";

export const styles = StyleSheet.create({
	headerRoot: {
		flexDirection: "row",
		alignItems: "center",
		maxHeight: 60,
		minHeight: 60,
		paddingLeft: 20,
		elevation: 4,
		backgroundColor: theme.colors.primary,
	},
	headerTitle: {
		color: theme.colors.white,
		fontSize: 20,
		lineHeight: 32,
		letterSpacing: 0.15,
		fontWeight: "700",
	},
	headerButton: {
		color: theme.colors.white,
	},
});

interface HeaderProps {
	title: string;
	navigation?: DrawerNavigationProp<RootStackParamList, ScreenId>;
}

const Header = ({ title, navigation }: HeaderProps) => (
	<View style={styles.headerRoot} {...getAccessabilities(title)}>
		{navigation && (
			<IconButton
				icon="menu"
				color={theme.colors.white}
				size={25}
				onPress={navigation.openDrawer}
				{...getAccessabilities(title)}
			/>
		)}
		<Text style={styles.headerTitle}>{title}</Text>
	</View>
);

export default memo(Header);
