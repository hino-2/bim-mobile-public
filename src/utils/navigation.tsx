import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../store/app/types";
import Users from "../components/users";
import Operations from "../components/operations";
import Logout from "../components/logout";
import HomeScreen from "../components/home-screen";
import OtherScreen from "../components/other-screen";

export const Stack = createStackNavigator<RootStackParamList>();

export const Drawer = createDrawerNavigator<RootStackParamList>();

export const otherScreens = [
	<Drawer.Screen
		name="Users"
		component={Users}
		options={{ title: "Пользователи" }}
		key="Users"
	/>,
	<Drawer.Screen
		name="Operations"
		component={Operations}
		options={{ title: "Периодические операции" }}
		key="Operations"
	/>,
	<Drawer.Screen name="Logout" component={Logout} options={{ title: "Выйти" }} key="Logout" />,
];

export const stackScreens = [
	<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} key="Home" />,
	<Stack.Screen
		name="OtherScreen"
		component={OtherScreen}
		options={{ headerShown: false }}
		key="OtherScreen"
	/>,
];
