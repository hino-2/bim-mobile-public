import { createSelector } from "@reduxjs/toolkit";
import { filterSchedules, mapTasks } from "./utils";
import { allowedTasksAdapter, schedulesAdapter } from "./adapters";
import { not, sort } from "ramda";
import { ApplicationState, LoadingState } from "../types";
import { componentLoadingState } from "../../utils/helpers";

const tasks = (state: ApplicationState) => state.tasks.tasks;
const selectedType = (state: ApplicationState) => state.tasks.selectedType;
const selectedAggregators = (state: ApplicationState) => state.tasks.selectedAggregators;
const count = (state: ApplicationState) => state.tasks.count;

const allowedTasksSelectors = allowedTasksAdapter.getSelectors<ApplicationState>(
	(state) => state.tasks.allowedTasks.data
);

const schedulesSelectors = schedulesAdapter.getSelectors<ApplicationState>(
	(state) => state.tasks.schedules.data
);

const allowedTasksSelector = (state: ApplicationState) => allowedTasksSelectors.selectAll(state);

const schedulesSelector = schedulesSelectors.selectAll;

const filters = (state: ApplicationState) => state.tasks.filters;

const allowedTasksStatusSelector = (state: ApplicationState) => state.tasks.allowedTasks.status;

const schedulesStatusSelector = (state: ApplicationState) => state.tasks.schedules.status;

const loadingState = createSelector(
	allowedTasksStatusSelector,
	schedulesStatusSelector,
	componentLoadingState
);

const filteredSchedules = createSelector(
	schedulesSelector,
	allowedTasksSelector,
	filters,
	filterSchedules
);

const orderedAndFilteredSchedulesSelector = createSelector(filteredSchedules, (schedules) =>
	sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(), schedules)
);

const hasScheduleByType = (taskType: string) =>
	createSelector(schedulesSelector, (schedules) =>
		Boolean(schedules.find((schedule) => schedule.taskType === taskType))
	);

const disabledScheduleByType = (taskType: string) =>
	createSelector(schedulesSelector, schedulesStatusSelector, (schedules, status) => {
		if (status === LoadingState.Resolve) {
			const schedule = schedules.find((schedule) => schedule.taskType === taskType);

			return schedule && schedule.hasRunningTask !== undefined
				? schedule.hasRunningTask
				: true;
		}
		return true;
	});

const editDialog = (state: ApplicationState) => state.tasks.editDialog;
const editDialogRequiredNotFilled = (state: ApplicationState) =>
	not(Boolean(state.tasks.editDialog.editableRow?.chosenTask));

const tasksSelectors = {
	loadingState,
	allowedTasksSelector,
	schedulesSelector,
	filteredSchedules,
	schedulesStatusSelector,
	orderedAndFilteredSchedulesSelector,
	hasScheduleByType,
	disabledScheduleByType,
	count,
	filters,
	selectedType,
	selectedAggregators,
	tasks: createSelector(
		tasks,
		allowedTasksSelectors.selectEntities,
		selectedAggregators,
		selectedType,
		mapTasks
	),
	allowedTasksSelectors,
	schedulesSelectors,
	state: (state: ApplicationState) => state.tasks.state,
	pagination: (state: ApplicationState) => state.tasks.pagination,
	error: (state: ApplicationState) => state.tasks.error,
	columns: (state: ApplicationState) => state.tasks.columns,
	activeTasks: createSelector(count, ({ activeQty }) => activeQty),
	editDialog,
	editDialogRequiredNotFilled,
};

export default tasksSelectors;
