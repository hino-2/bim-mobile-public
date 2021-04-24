import { DefaultTheme } from "react-native-paper";
import { StyleSheet, Platform, StatusBar } from "react-native";

export const kariColor = "#9F1A6E";

export const theme = {
	...DefaultTheme,
	roundness: 4,
	colors: {
		...DefaultTheme.colors,
		primary: kariColor,
		accent: "#f1c40f",
		white: "#fff",
		black: "#000",
		background: "#fff",
		card: "#fff",
		border: "#bdbdbd",
	},
};

export const safeAreaStyle = StyleSheet.create({
	shared: { display: "flex", flexDirection: "column", height: "100%", backgroundColor: "white" },
	android: {
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
	},
});
