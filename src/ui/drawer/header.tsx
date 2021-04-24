import React, { memo } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import styled from "styled-components/native";
import { Text } from "react-native";
import { getAccessabilities } from "../../utils/accessability";
import { theme } from "../global";
import { ScreenId } from "../../store/app/types";
import { useSelector } from "react-redux";
import { appSelectors } from "../../store/app/selectors";

const HeaderContainer = styled(View)`
	height: 80px;
	background-color: #e1e5eb;
	padding: 16px;
	padding-left: 32px;
	align-items: center;
	justify-content: space-between;
	flex-direction: row;
`;

const HeaderLabel = styled(Text)`
	font-size: 24px;
	font-weight: 400;
	letter-spacing: 0px;
`;

interface DrawerHeaderProps {
	navigateToScreen: (route: ScreenId) => () => void;
}

const DrawerHeader = ({ navigateToScreen }: DrawerHeaderProps) => {
	const userLogin = useSelector(appSelectors.login);

	return (
		<HeaderContainer>
			<HeaderLabel {...getAccessabilities(userLogin)}>{userLogin}</HeaderLabel>
			<IconButton
				icon="logout-variant"
				color={theme.colors.primary}
				onPress={navigateToScreen("Logout")}
				{...getAccessabilities("Выйти")}
			/>
		</HeaderContainer>
	);
};

export default memo(DrawerHeader);
