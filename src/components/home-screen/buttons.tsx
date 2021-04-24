import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useMemo } from "react";
import { useWindowDimensions, StyleProp, ViewStyle, StyleSheet, ScrollView } from "react-native";
import { Button, Surface, Avatar, Text } from "react-native-paper";
import { screens } from "../../store/app/consts";
import { RootStackParamList, ScreenId } from "../../store/app/types";
import { getAccessabilities } from "../../utils/accessability";

interface IconProps {
	size: number;
	allowFontScaling?: boolean;
	color: string;
}

const renderIcon = (title: string) => (props: IconProps) => (
	<Avatar.Icon
		{...props}
		icon="arrow-right"
		size={50}
		color="black"
		style={styles.buttonIcon}
		{...getAccessabilities(title)}
	/>
);

const styles = StyleSheet.create({
	surface: {
		elevation: 8,
		margin: 8,
	},
	button: {
		alignItems: "flex-start",
		borderWidth: 0,
	},
	text: {
		fontSize: 24,
	},
	buttonIcon: {
		backgroundColor: "transparent",
	},
});

interface ButtonsProps {
	navigation: StackNavigationProp<RootStackParamList, "Home">;
}

const Buttons = ({ navigation }: ButtonsProps) => {
	const { navigate } = navigation;
	const { width } = useWindowDimensions();

	const buttonContentStyle = useMemo<StyleProp<ViewStyle>>(
		() => ({
			width: width - 16,
			height: 80,
			// alignItems: "center",
			justifyContent: "space-between",
			flexDirection: "row-reverse",
		}),
		[width]
	);

	const onPress = useCallback(
		(route: ScreenId) => () => {
			navigate("OtherScreen", {
				screen: route,
			});
		},
		[]
	);

	return (
		<ScrollView>
			{screens.map(({ route, title }) => (
				<Surface key={title} style={styles.surface} {...getAccessabilities(title)}>
					<Button
						style={styles.button}
						mode="outlined"
						icon={renderIcon(title)}
						uppercase={false}
						contentStyle={buttonContentStyle}
						onPress={onPress(route)}
						{...getAccessabilities(title)}>
						<Text
							style={styles.text}
							numberOfLines={1}
							ellipsizeMode="tail"
							{...getAccessabilities(title)}>
							{title}
						</Text>
					</Button>
				</Surface>
			))}
		</ScrollView>
	);
};

export default Buttons;
