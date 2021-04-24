import { DrawerContentComponentProps, DrawerContentOptions } from "@react-navigation/drawer";
import React, { memo, useCallback } from "react";
import { SafeAreaView } from "react-native";
import { ScreenId } from "../../store/app/types";
import { safeAreaStyle } from "../global";
import DrawerHeader from "./header";
import DrawerItemsList from "./drawer-items-list";

const CustomDrawer = (props: DrawerContentComponentProps<DrawerContentOptions>) => {
	const navigateToScreen = useCallback(
		(route: ScreenId) => () => {
			props.navigation.navigate(route);
		},
		[]
	);

	return (
		<SafeAreaView style={[safeAreaStyle.shared, safeAreaStyle.android]}>
			<DrawerHeader navigateToScreen={navigateToScreen} />
			<DrawerItemsList {...props} navigateToScreen={navigateToScreen} />
		</SafeAreaView>
	);
};

export default memo(CustomDrawer);
