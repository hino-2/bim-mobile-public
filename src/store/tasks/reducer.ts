import {
	ReducerFunction,
	GetTasksResponse,
	TasksColumn,
	UpdateTasksResponse,
	TasksCount,
	GetAllowedTasksResponse,
	GetSchedulesResponse,
	Schedule,
	DateType,
	AllowedTask,
	Periodic,
} from "./types";
import { scheduleInitialState, TaskTypes } from "./constants";
import { getTotalTasksByType, getUpdatedTasks } from "./utils";
import { append, mergeRight, without } from "ramda";
import { allowedTasksAdapter, schedulesAdapter } from "./adapters";
import { Update } from "@reduxjs/toolkit";
import { mapKeyToId } from "../../utils/data";
import { aggregatorCommon } from "../aggregators/constants";
import { Aggregator } from "../aggregators/types";
import { LoadingState, OpenState } from "../types";
import { dateToHourAndMinute, msToNumAndUnit, cronStringToDate } from "../../utils/date";

const getAllowedTasks: ReducerFunction = (state) => {
	state.allowedTasks.status = LoadingState.Loading;
};

const getAllowedTasksSuccess: ReducerFunction<GetAllowedTasksResponse> = (state, { payload }) => {
	const allowedTasksWithId = mapKeyToId(payload.allowedTasks);

	state.allowedTasks.data = allowedTasksAdapter.setAll(
		state.allowedTasks.data,
		allowedTasksWithId
	);
	state.allowedTasks.status = LoadingState.Resolve;
};

const getAllowedTasksFail: ReducerFunction<{
	message: string;
	status: number;
}> = (state, { payload }) => {
	state.allowedTasks.error = payload.message;
	state.allowedTasks.status = LoadingState.Reject;
};

const getSchedules: ReducerFunction = (state) => {
	state.schedules.status = LoadingState.Loading;
};

const getSchedulesSuccess: ReducerFunction<GetSchedulesResponse> = (state, { payload }) => {
	state.schedules.data = schedulesAdapter.setAll(state.schedules.data, payload.schedules);
	state.schedules.status = LoadingState.Resolve;
	state.editDialog.loadingState = LoadingState.Resolve;
};

const getSchedulesFail: ReducerFunction<{
	message: string;
	status: number;
}> = (state, { payload }) => {
	state.schedules.error = payload.message;
	state.schedules.status = LoadingState.Reject;
};

const getTasks: ReducerFunction<{
	taskType: TaskTypes;
	search: string;
}> = (state) => {
	state.state = LoadingState.Loading;
};

const getTasksData: ReducerFunction = (state) => {
	state.allowedTasks.status = LoadingState.Loading;
	state.schedules.status = LoadingState.Loading;
};

const getTasksSuccess: ReducerFunction<{
	data: GetTasksResponse;
	page: number;
	taskType: TaskTypes;
}> = (state, { payload }) => {
	const { tasks, ...count } = payload.data;

	const total = getTotalTasksByType(count, payload.taskType);

	state.pagination.page = payload.page;
	state.pagination.total = total;
	state.pagination.totalPages = Math.ceil(total / state.pagination.limit);

	state.count = count;
	state.tasks = tasks;
	state.selectedType = payload.taskType;

	state.state = LoadingState.Resolve;
	state.allowedTasks.status = LoadingState.Resolve;
	state.schedules.status = LoadingState.Resolve;
};

const getTasksFail: ReducerFunction<{
	message: string;
	status: number;
}> = (state, { payload }) => {
	state.error = payload.message;
	state.state = LoadingState.Reject;
};

const updateTasks: ReducerFunction<UpdateTasksResponse> = (state, { payload }) => {
	const { allQty, activeQty, executedQty, failedQty, ...tasks } = payload;

	state.tasks = getUpdatedTasks(state.tasks, tasks);
	state.count = {
		allQty,
		activeQty,
		executedQty,
		failedQty,
	};
};

const updateCount: ReducerFunction<Partial<TasksCount>> = (state, { payload }) => {
	state.count = {
		...state.count,
		...payload,
	};
};

const setPage: ReducerFunction<number> = (state, { payload }) => {
	state.pagination.page = payload;
};

const removeTaskSuccess: ReducerFunction<string> = (state, { payload }) => {
	state.tasks = state.tasks.filter(({ _id }) => _id !== payload);
};

const setAggregatorsFilter: ReducerFunction<Aggregator[]> = (state, { payload }) => {
	state.selectedAggregators = payload;
};

const setFilters: ReducerFunction<Record<string, Aggregator[]>> = (state, { payload }) => {
	state.filters = payload;
};

const setRunningTask: ReducerFunction<{ taskType: string; run?: boolean }> = (
	state,
	{ payload }
) => {
	const { taskType, run = true } = payload;
	const schedules = schedulesAdapter.getSelectors().selectAll(state.schedules.data);

	const changes = schedules.reduce<Update<Schedule>[]>((result, item) => {
		if (item.taskType === taskType) {
			if (item._id) {
				result.push({
					id: item._id,
					changes: { hasRunningTask: run },
				});
			}
		}
		return result;
	}, []);

	state.schedules.data = schedulesAdapter.updateMany(state.schedules.data, changes);
};

const clearTasks: ReducerFunction = (state) => {
	state.allowedTasks.data = allowedTasksAdapter.removeAll(state.allowedTasks.data);
	state.tasks = [];
};

const openEditDialog: ReducerFunction<{
	openState: OpenState;
	schedule: Schedule;
	aggregators: Aggregator[];
}> = (state, { payload }) => {
	const { openState, schedule, aggregators } = payload;

	let periodic = null,
		chosenTask: AllowedTask | null = null,
		chosenAggregator: Aggregator | null = aggregatorCommon;

	if (schedule) {
		const { taskType = "", cronSchedule, runEveryMs } = schedule;

		chosenTask =
			allowedTasksAdapter.getSelectors().selectById(state.allowedTasks.data, taskType) ||
			null;

		if (chosenTask?.tags?.agregatorID) {
			chosenAggregator =
				aggregators.find(
					({ aggregatorID }) => aggregatorID === chosenTask?.tags?.agregatorID
				) || null;
		}

		if (cronSchedule || runEveryMs) {
			let period = 1,
				timeUnit = DateType.min,
				time = dateToHourAndMinute();

			if (runEveryMs) {
				[period, timeUnit] = msToNumAndUnit(runEveryMs);
			}

			if (cronSchedule) {
				timeUnit = DateType.day;
				time = dateToHourAndMinute(cronStringToDate(cronSchedule));
			}

			periodic = {
				period,
				timeUnit,
				time,
			};
		}
	}

	if (openState === OpenState.Add) {
		state.editDialog.openState = OpenState.Add;
		state.editDialog.currentRow = null;
	} else {
		state.editDialog.openState = OpenState.Edit;
		state.editDialog.currentRow = payload.schedule;
	}

	state.editDialog.editableRow = {
		schedule: payload.schedule || scheduleInitialState,
		aggregators,
		chosenAggregator,
		chosenTask,
		periodic,
	};
	state.editDialog.loadingState = LoadingState.Idle;
	state.editDialog.error = null;
};

const closeEditDialog: ReducerFunction = (state) => {
	state.editDialog.openState = OpenState.Closed;
	state.editDialog.loadingState = LoadingState.Idle;
};

const selectTask: ReducerFunction<AllowedTask> = (state, { payload }) => {
	if (state.editDialog.editableRow.chosenTask?.id === payload.id) {
		state.editDialog.editableRow.chosenTask = null;
		state.editDialog.editableRow.schedule = { _id: "", taskType: undefined };
	} else {
		state.editDialog.editableRow.chosenTask = payload;
		state.editDialog.editableRow.schedule = { _id: payload.id, taskType: payload.id };
	}
};

const selectBlokingTask: ReducerFunction<AllowedTask> = (state, { payload: { id } }) => {
	if (state.editDialog.editableRow.schedule?.blockedByTasks?.includes(id)) {
		state.editDialog.editableRow.schedule.blockedByTasks = without(
			[id],
			state.editDialog.editableRow.schedule.blockedByTasks
		);
	} else {
		state.editDialog.editableRow.schedule!.blockedByTasks = append(
			id,
			state.editDialog.editableRow.schedule!.blockedByTasks!
		);
	}
};

const setAggregator: ReducerFunction<Aggregator> = (state, { payload }) => {
	state.editDialog.editableRow.chosenAggregator = payload;
	state.editDialog.editableRow.chosenTask = null;
	state.editDialog.editableRow.periodic = null;
};

const setPeriod: ReducerFunction<Periodic | boolean> = (state, { payload }) => {
	if (typeof payload === "boolean") {
		state.editDialog.editableRow.periodic = payload
			? {
					period: 1,
					timeUnit: DateType.min,
					time: dateToHourAndMinute(),
			  }
			: null;
	} else {
		state.editDialog.editableRow.periodic = payload
			? (state.editDialog.editableRow.periodic = mergeRight(
					state.editDialog.editableRow.periodic!,
					payload
			  ))
			: null;
	}
};

const setDescription: ReducerFunction<string> = (state, { payload }) => {
	if (state.editDialog.editableRow.schedule) {
		state.editDialog.editableRow.schedule.description = payload;
	}
};

const saveEditDialog: ReducerFunction = (state) => {
	state.editDialog.loadingState = LoadingState.Loading;
};

const saveEditDialogFail: ReducerFunction = (state) => {
	state.editDialog.loadingState = LoadingState.Reject;
};

const reducers = {
	getTasks,
	getTasksData,
	getTasksSuccess,
	getTasksFail,

	getAllowedTasks,
	getAllowedTasksSuccess,
	getAllowedTasksFail,

	getSchedules,
	getSchedulesSuccess,
	getSchedulesFail,

	setRunningTask,
	updateTasks,
	updateCount,

	setAggregatorsFilter,
	setPage,

	removeTaskSuccess,

	setFilters,

	clearTasks,

	openEditDialog,
	closeEditDialog,
	selectTask,
	selectBlokingTask,
	setAggregator,
	setPeriod,
	setDescription,
	saveEditDialog,
	saveEditDialogFail,
};

export default reducers;
