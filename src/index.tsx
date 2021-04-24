import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import Auth from "./components/auth";
import { Stack, stackScreens } from "./utils/navigation";
import { useDispatch, useSelector } from "react-redux";
import appActions from "./store/app/actions";
import { appSelectors } from "./store/app/selectors";
import NavigatorService from "./store/app/navigation";
import { SafeAreaView } from "react-native";

const Root = () => {
	const dispatch = useDispatch();
	const authorized = useSelector(appSelectors.authorized);

	useEffect(() => {
		dispatch(appActions.login({}));
	}, [dispatch]);

	return authorized ? (
		<SafeAreaView style={{ height: "100%" }}>
			<NavigationContainer
				ref={(navigatorRef) => {
					NavigatorService.setContainer(navigatorRef);
				}}>
				<Stack.Navigator screenOptions={{ animationEnabled: true }}>
					{stackScreens}
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaView>
	) : (
		<SafeAreaView style={{ height: "100%" }}>
			<Auth />
		</SafeAreaView>
	);
};

export default Root;
