import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../../store/app/types";
import tasksActions from "../../store/tasks/actions";
import tasksSelectors from "../../store/tasks/selectors";
import { LoadingState, RenderTemplate } from "../../store/types";
import Loading from "../../ui/loading";
import OperationsScreen from "./operations-screen";
import ErrorScreen from "../../ui/error-screen";

interface OperationsProps {
	navigation: DrawerNavigationProp<RootStackParamList, "Operations">;
}

const Operations = ({ navigation }: OperationsProps) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(tasksActions.getTasksData());

		return () => {
			dispatch(tasksActions.clearTasks());
		};
	}, []);

	const loadingState = useSelector(tasksSelectors.loadingState);

	const renderTemplate: RenderTemplate = {
		[LoadingState.Idle]: <Loading />,
		[LoadingState.Loading]: <Loading />,
		[LoadingState.Resolve]: <OperationsScreen navigation={navigation} />,
		[LoadingState.Reject]: <ErrorScreen />,
	};

	return renderTemplate[loadingState];
};

export default memo(Operations);
