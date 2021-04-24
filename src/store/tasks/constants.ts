import { Schedule, TasksState } from "./types";
import { allowedTasksAdapter, schedulesAdapter } from "./adapters";
import { LoadingState, OpenState } from "../types";
import { aggregatorCommon } from "../aggregators/constants";

const tasksNamespace = "tasks";
const operationsNamespace = "operations";

enum TaskStatus {
	Executed = "executed",
	Pending = "pending",
	Failed = "failed",
	Queue = "queue",
}

const StatusTypeNames = {
	[TaskStatus.Queue]: "ожидает выполнения",
	[TaskStatus.Pending]: "выполняется",
	[TaskStatus.Executed]: "выполнена",
	[TaskStatus.Failed]: "не выполнена",
};

enum TaskTypes {
	Active = "active",
	Executed = "executed",
	Failed = "failed",
	Total = "",
}

enum TasksQty {
	All = "allQty",
	Active = "activeQty",
	Executed = "executedQty",
	Failed = "failedQty",
}

const scheduleInitialState: Partial<Schedule> = { blockedByTasks: [] };

const tasksInitialState: TasksState = {
	tasks: [],
	count: {
		allQty: 0,
		activeQty: 0,
		executedQty: 0,
		failedQty: 0,
	},

	filters: {},

	allowedTasks: {
		data: allowedTasksAdapter.getInitialState(),
		status: LoadingState.Loading,
		error: null,
	},

	schedules: {
		data: schedulesAdapter.getInitialState(),
		status: LoadingState.Loading,
		error: null,
	},

	columns: [],

	selectedType: TaskTypes.Active,
	selectedAggregators: [],

	pagination: {
		page: 1,
		limit: 50,
		total: 0,
		totalPages: 1,
	},

	editDialog: {
		currentRow: null,
		editableRow: {
			schedule: scheduleInitialState,
			aggregators: [],
			chosenTask: null,
			chosenAggregator: aggregatorCommon,
			periodic: null,
		},
		error: null,
		openState: OpenState.Closed,
		loadingState: LoadingState.Idle,
	},

	state: LoadingState.Loading,
	error: null,
};

export {
	TaskStatus,
	TaskTypes,
	TasksQty,
	StatusTypeNames,
	tasksNamespace,
	scheduleInitialState,
	operationsNamespace,
	tasksInitialState,
};
