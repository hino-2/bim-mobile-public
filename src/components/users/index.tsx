import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../../store/app/types";
import usersActions from "../../store/users/actions";
import usersSelectors from "../../store/users/selectors";
import { LoadingState, RenderTemplate } from "../../store/types";
import Loading from "../../ui/loading";
import UsersScreen from "./users-screen";
import ErrorScreen from "../../ui/error-screen";

interface UsersProps {
	navigation: DrawerNavigationProp<RootStackParamList, "Users">;
}

const Users = ({ navigation }: UsersProps) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(usersActions.getUsers());

		return () => {
			dispatch(usersActions.clearUsers());
		};
	}, []);

	const loadingState = useSelector(usersSelectors.loadingState);

	const renderTemplate: RenderTemplate = {
		[LoadingState.Idle]: <Loading />,
		[LoadingState.Loading]: <Loading />,
		[LoadingState.Resolve]: <UsersScreen navigation={navigation} />,
		[LoadingState.Reject]: <ErrorScreen />,
	};

	return renderTemplate[loadingState];
};

export default memo(Users);
