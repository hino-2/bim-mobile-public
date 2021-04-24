import {
	DrawerContentComponentProps,
	DrawerContentOptions,
	DrawerContentScrollView,
} from "@react-navigation/drawer";
import React, { memo } from "react";
import { Text } from "react-native";
import { DrawerItem } from "@react-navigation/drawer";
import styled from "styled-components/native";
import { screens } from "../../../store/app/consts";
import { ScreenId } from "../../../store/app/types";
import { getAccessabilities } from "../../../utils/accessability";
import { theme } from "../../global";

interface DrawerLabelProps {
	focused: boolean;
	color: string;
}

const DrawerItemLabel = styled(Text)`
	color: ${theme.colors.black};
	font-size: 14px;
	font-weight: 400;
	line-height: 20px;
	letter-spacing: 0.15008px;
`;

const renderLabel = (label: string) => (props: DrawerLabelProps) => (
	<DrawerItemLabel {...props} {...getAccessabilities(label)}>
		{label}
	</DrawerItemLabel>
);

interface DrawerItemListProps {
	navigateToScreen: (route: ScreenId) => () => void;
}

const DrawerItemsList = ({
	navigateToScreen,
	...props
}: DrawerContentComponentProps<DrawerContentOptions> & DrawerItemListProps) => {
	const focusedIndex = props.navigation.dangerouslyGetState()?.index || 0;

	return (
		<DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
			{screens.map(({ route, title }, index) => (
				<DrawerItem
					key={route}
					focused={focusedIndex == index}
					style={{ height: 50, justifyContent: "center" }}
					label={renderLabel(title)}
					onPress={navigateToScreen(route)}
				/>
			))}
		</DrawerContentScrollView>
	);
};

export default memo(DrawerItemsList);
