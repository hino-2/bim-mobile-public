import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { getAccessabilities } from "../../utils/accessability";

const Loading = () => (
	<View style={{ justifyContent: "center", height: "100%" }}>
		<ActivityIndicator {...getAccessabilities("Загрузка")} />
	</View>
);

export default Loading;
