import React, { memo } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import styled from "styled-components/native";
import { getAccessabilities } from "../../utils/accessability";

const ErrorMessageContainer = styled(View)`
	align-items: center;
	justify-content: center;
	height: 100%;
`;

const ErrorScreen = () => (
	<ErrorMessageContainer>
		<Text {...getAccessabilities("Не удалось загрузить данные")}>
			Не удалось загрузить данные
		</Text>
	</ErrorMessageContainer>
);

export default memo(ErrorScreen);
