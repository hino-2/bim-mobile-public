import React from "react";
import { useWindowDimensions } from "react-native";
import { List } from "react-native-paper";
import {
	renderTaskChip,
	getAliasName,
	renderActivityIndicator,
	renderPeriod,
	renderLastExec,
	renderNextRun,
	renderUpdatedAt,
} from "../../../store/tasks/helpers";
import { AllowedTask, Schedule } from "../../../store/tasks/types";
import { getAccessabilities } from "../../../utils/accessability";

interface ScheduleItemProps {
	schedule: Schedule;
	allowedTasks: AllowedTask[];
	renderRunButton: (schedule: Schedule) => (props: unknown) => JSX.Element;
	renderStatusSwitch: (schedule: Schedule) => JSX.Element;
}

const ScheduleItem = ({
	schedule,
	allowedTasks,
	renderRunButton,
	renderStatusSwitch,
}: ScheduleItemProps) => {
	const { width } = useWindowDimensions();

	return (
		<List.Accordion
			title={renderTaskChip(getAliasName(schedule, allowedTasks), width)}
			left={renderActivityIndicator(schedule)}
			style={{ paddingTop: 0, paddingBottom: 0 }}
			{...getAccessabilities(schedule.description || "Без названия")}>
			<List.Item
				title={schedule.description}
				left={renderRunButton(schedule)}
				{...getAccessabilities(schedule.taskType || "Без названия")}
			/>
			<List.Item
				title={renderPeriod(schedule.runEveryMs || schedule.cronSchedule)}
				{...getAccessabilities("Период")}
			/>
			{schedule.lastExec && (
				<List.Item
					title={renderLastExec(schedule)}
					{...getAccessabilities("Прошлый запуск")}
				/>
			)}
			{schedule.nextRun && (
				<List.Item
					title={renderNextRun(schedule)}
					{...getAccessabilities("Следующий запуск")}
				/>
			)}
			<List.Item title={renderStatusSwitch(schedule)} {...getAccessabilities("Статус")} />
			{schedule.updatedAt && (
				<List.Item
					title={renderUpdatedAt(schedule)}
					{...getAccessabilities("Последнее изменение")}
				/>
			)}
		</List.Accordion>
	);
};

export default ScheduleItem;
