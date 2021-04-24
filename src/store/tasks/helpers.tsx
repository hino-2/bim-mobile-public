import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Chip, Text } from "react-native-paper";
import { theme } from "../../ui/global";
import { getAccessabilities } from "../../utils/accessability";
import { getHexfromString } from "../../utils/colors";
import { getLocalDateTime, periodToHumanString } from "../../utils/date";
import { OpenState } from "../types";
import { Schedule, AllowedTask } from "./types";

export const getDialogTitle = (state: OpenState, aliasName: string) => {
	if (state === OpenState.Add) {
		return "Добавление операции";
	}

	if (state === OpenState.Edit) {
		return (
			<>
				Редактирование операции <b>"{aliasName}"</b>
			</>
		);
	}
};

export const getChipColor = (aliasName: string, chosen: boolean): React.CSSProperties => {
	const color = getHexfromString(aliasName);

	return {
		color: chosen ? "#ffffff" : color,
		background: chosen ? color : "#ffffff",
		borderColor: color,
	};
};

export const isRunnigningTask = ({ hasRunningTask, taskType }: Schedule) =>
	hasRunningTask || taskType === "RuleExport";

export const getAllowedTaskByID = (taskID: string, allowedTasks: AllowedTask[]) =>
	allowedTasks.find(({ id }) => id === taskID);

export const getAliasName = (schedule: Schedule, allowedTasks: AllowedTask[]) =>
	getAllowedTaskByID(schedule.taskType, allowedTasks)?.aliasName || schedule.taskType;

export const dateToHumanView = (date: Date) => (
	<Text {...getAccessabilities(getLocalDateTime(date))}>{getLocalDateTime(date)}</Text>
);

export const renderPeriod = (period?: string | number) =>
	period ? (
		<Text {...getAccessabilities(periodToHumanString(period))}>
			{periodToHumanString(period)}
		</Text>
	) : (
		<Text {...getAccessabilities("Без повторения")}>Без повторения</Text>
	);

export const renderTaskChip = (aliasName: string, screenWidth: number) => (
	<Chip
		mode="flat"
		ellipsizeMode="tail"
		style={{ backgroundColor: getHexfromString(aliasName), maxWidth: screenWidth - 100 }}
		{...getAccessabilities(aliasName)}>
		<Text numberOfLines={1} {...getAccessabilities(aliasName)}>
			{aliasName}
		</Text>
	</Chip>
);

export const renderActivityIndicator = (schedule: Schedule) => () =>
	isRunnigningTask(schedule) ? (
		<ActivityIndicator color={theme.colors.primary} />
	) : (
		<View style={{ width: 20 }} />
	);

export const renderLastExec = (schedule: Schedule) => (
	<View>
		<Text {...getAccessabilities("Прошлый запуск")}>Прошлый запуск</Text>
		<Text {...getAccessabilities(new Date(schedule.lastExec!).toLocaleDateString())}>
			{dateToHumanView(new Date(schedule.lastExec!))}
		</Text>
	</View>
);

export const renderNextRun = (schedule: Schedule) => (
	<View>
		<Text {...getAccessabilities("Следующий запуск")}>Следующий запуск</Text>
		<Text {...getAccessabilities(new Date(schedule.nextRun!).toLocaleDateString())}>
			{dateToHumanView(new Date(schedule.nextRun!))}
		</Text>
	</View>
);

export const renderUpdatedAt = (schedule: Schedule) => (
	<Text {...getAccessabilities(schedule.userLogin || "")}>
		{schedule.userLogin} {dateToHumanView(new Date(schedule.updatedAt!))}
	</Text>
);
