import { CaseReducer, PayloadAction, EntityState, Dictionary } from "@reduxjs/toolkit";
import { Aggregator } from "../aggregators/types";
import { LoadingState, OpenState } from "../types";
import { TasksQty, TaskStatus, TaskTypes } from "./constants";

interface TasksState {
	tasks: Task[];
	count: TasksCount;

	allowedTasks: {
		data: EntityState<AllowedTask>;
		status: LoadingState;
		error: string | null;
	};

	schedules: {
		data: EntityState<Schedule>;
		status: LoadingState;
		error: string | null;
	};

	columns: TasksColumn[];

	filters: Record<string, Aggregator[]>;

	selectedType: TaskTypes;
	selectedAggregators: Aggregator[];

	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};

	editDialog: {
		currentRow: Schedule | null;
		editableRow: ScheduleEditableRow;
		error: string | null;
		openState: OpenState;
		loadingState: LoadingState;
	};

	state: LoadingState;
	error: string | null;
}

type TasksCount = Record<TasksQty, number>;

interface TasksColumn {
	name: string;
	width: number;
}

interface DisplayTask {
	_id: string;
	createdAt?: string;
	beginTime?: string;
	endTime?: string;
	duration: string;
	status: string;
	aliasName: string;
}

interface Task {
	_id: string;
	createdAt: string;
	beginTime: string;
	endTime: string;
	durationInSec: number;
	status: TaskStatus;
	taskData: any;
	type: string;
}

type ReducerFunction<T = undefined> = CaseReducer<TasksState, PayloadAction<T>>;

interface UpdateTasksResponse extends TasksCount {
	created: Task[];
	updated: Task[];
	deleted: Task[];
}

interface GetTasksResponse extends TasksCount {
	`classified`,
}

interface GetAllowedTasksResponse {
	`classified`,
}

interface GetSchedulesResponse {
	`classified`,
}

type Tags = Record<string, any>;

type AllowedTask = {
	id: string;
	tags?: Tags;
	aliasName: string;
	description?: string;
	taskData?: any;
	taskName?: string;
	defaultBlockedBy?: string[];
};

type AllowedTasks = Dictionary<AllowedTask>;

interface Schedule {
	_id: string;
	taskType: string; // Тип задачи на выполнение (Например: UploadMongoData. Весь список задач можно получить по запросу GET /task/allowed)
	active?: boolean;
	taskData?: any;
	description?: string;
	blockedByTasks?: string[]; // Список задач(tasks), во время выполнения которых не будет выполнено текущая задача
	runEveryMs?: number; // Количество милисекунд, в интервале которых будет запущена задача. (Если указано данное поле, то не будет учитываться cronSchedule)
	cronSchedule?: string; // Строка cron формата для определения расписания выполнения задачи
	nextRun?: string;
	lastRun?: Date;
	createdAt?: string;
	updatedAt?: string;
	lastExec?: string;
	hasRunningTask?: boolean;
	userLogin?: string;
}

export enum DateType {
	min = "мин",
	hour = "ч",
	day = "дн",
}

type Time = {
	period: number;
	hourAndMinute: Date;
};

type Periodic = {
	period?: number;
	timeUnit?: DateType;
	time?: string;
};

type ScheduleEditableRow = {
	schedule: Partial<Schedule>;
	aggregators: Aggregator[];
	chosenAggregator: Aggregator | null;
	chosenTask: AllowedTask | null;
	periodic?: Periodic | null;
};

interface OperationsToAdd {
	taskTypes: string[];
	cronSchedule?: string;
	runEveryMs?: number;
}

export type {
	TasksState,
	Task,
	UpdateTasksResponse,
	GetTasksResponse,
	GetAllowedTasksResponse,
	GetSchedulesResponse,
	TasksCount,
	ReducerFunction,
	DisplayTask,
	TasksColumn,
	Schedule,
	Time,
	Periodic,
	ScheduleEditableRow,
	OperationsToAdd,
	AllowedTask,
	AllowedTasks,
};
