import React, { memo } from "react";
import { SafeAreaView } from "react-native";
import { RootStackParamList } from "../../store/app/types";
import Header from "../../ui/header";
import { StackNavigationProp } from "@react-navigation/stack";
import { safeAreaStyle } from "../../ui/global";
import Buttons from "./buttons";

interface HomePageProps {
	navigation: StackNavigationProp<RootStackParamList, "Home">;
}

const HomePage = ({ navigation }: HomePageProps) => (
	<SafeAreaView style={[safeAreaStyle.shared, safeAreaStyle.android]}>
		<Header title="Главная страница" />
		<Buttons navigation={navigation} />
	</SafeAreaView>
);

export default memo(HomePage);
