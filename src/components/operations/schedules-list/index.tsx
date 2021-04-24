import React, { memo, useCallback } from "react";
import { Switch, ScrollView } from "react-native";
import { IconButton } from "react-native-paper";
import { connect } from "react-redux";
import { appSelectors } from "../../../store/app/selectors";
import tasksActions from "../../../store/tasks/actions";
import { isRunnigningTask } from "../../../store/tasks/helpers";
import tasksSelectors from "../../../store/tasks/selectors";
import { Schedule } from "../../../store/tasks/types";
import { ApplicationState } from "../../../store/types";
import { getAccessabilities } from "../../../utils/accessability";
import ScheduleItem from "./schedule-item";
import { StatusSwitchContainer, StatusSwitchLabel } from "./styled";

const SchedulesList = ({
	schedules,
	allowedTasks,
	data,
	userLogin,
	startSchedule,
	setRunningTask,
	editSchedule,
}: ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps) => {
	const onClickStartSchedule = useCallback(
		(taskType: string) => () => {
			startSchedule(taskType);
			setRunningTask({ taskType });
		},
		[]
	);

	const onChangeStatus = useCallback(
		(scheduleID: string) => (checked: boolean) => {
			const schedule = data.find(({ _id }) => scheduleID === _id);

			if (schedule) {
				editSchedule({
					...schedule,
					active: checked,
					userLogin,
				});
			}
		},
		[data, userLogin]
	);

	const renderStatusSwitch = useCallback(
		(schedule: Schedule) => (
			<StatusSwitchContainer>
				<StatusSwitchLabel {...getAccessabilities("Статус")}>Статус</StatusSwitchLabel>
				<Switch
					value={schedule.active}
					onValueChange={onChangeStatus(schedule._id)}
					{...getAccessabilities("Статус")}
				/>
			</StatusSwitchContainer>
		),
		[onChangeStatus]
	);

	const renderRunButton = useCallback(
		(schedule: Schedule) => (props: unknown) => (
			<IconButton
				{...props}
				icon="playlist-play"
				disabled={isRunnigningTask(schedule)}
				onPress={onClickStartSchedule(schedule.taskType)}
				{...getAccessabilities("Запустить")}
			/>
		),
		[]
	);

	return (
		<ScrollView>
			{schedules.map((schedule) => (
				<ScheduleItem
					key={schedule._id}
					schedule={schedule}
					allowedTasks={allowedTasks}
					renderStatusSwitch={renderStatusSwitch}
					renderRunButton={renderRunButton}
				/>
			))}
		</ScrollView>
	);
};

const mapStateToProps = (state: ApplicationState) => ({
	schedules: tasksSelectors.schedulesSelector(state),
	allowedTasks: tasksSelectors.allowedTasksSelectors.selectAll(state),
	data: tasksSelectors.orderedAndFilteredSchedulesSelector(state),
	userLogin: appSelectors.login(state),
});

const mapDispatchToProps = {
	startSchedule: tasksActions.startSchedule,
	setRunningTask: tasksActions.setRunningTask,
	editSchedule: tasksActions.editSchedule,
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(SchedulesList));
